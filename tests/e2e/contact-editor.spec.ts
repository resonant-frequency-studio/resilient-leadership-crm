import { test, expect } from "./fixtures/auth";
import { Page } from "@playwright/test";
import {
  createTestContact,
  createTestContactWithTouchpoint,
  deleteTestContact,
} from "./helpers/test-data";
import {
  expectTouchpointOnDashboard,
  expectTouchpointNotOnDashboard,
  expectTouchpointStatus,
} from "./helpers/assertions";
import { validateTestUserId } from "./helpers/validation";

/**
 * E2E Integration Tests for Contact Editor
 * 
 * These tests focus on integration scenarios that unit tests cannot cover:
 * - Cross-page data consistency (changes on one page reflect on another)
 * - Cache invalidation and optimistic updates across pages
 * - Multi-step user workflows spanning multiple pages
 * 
 * Component-level functionality (form fields, buttons, modals) is tested
 * in unit tests and not duplicated here.
 * 
 * Note: Contact forms use autosave - fields save on blur or after debounce.
 */

/**
 * Helper to edit and save a field using autosave (blur triggers immediate save)
 */
async function editFieldAndSave(page: Page, selector: string, newValue: string) {
  const input = page.locator(selector).first();
  await input.waitFor({ state: "visible" });
  
  // Clear existing value
  await input.clear();
  await page.waitForTimeout(100); // Small delay after clear
  
  // Fill new value
  await input.fill(newValue);
  await page.waitForTimeout(200); // Small delay after fill to ensure value is set
  
  // Blur the field to trigger immediate autosave flush
  await input.blur();
  
  // Wait a bit for the debounce/flush to trigger
  await page.waitForTimeout(300);
}

test.describe("Cross-Page Data Consistency", () => {
  test("touchpoint status changes sync with Dashboard", async ({
    authenticatedPage,
    testUserId,
  }) => {
    const testEmail = `test_crosspage_${Date.now()}@test.example.com`;
    // Create touchpoint with date in the past so it appears in "Overdue Touchpoints"
    const contactId = await createTestContactWithTouchpoint(testUserId, testEmail, -1);

    try {
      // Step 1: Navigate to contact detail page
      await authenticatedPage.goto(`/contacts/${contactId}`);
      await authenticatedPage.waitForURL(/\/contacts\/.+/);

      // Wait for page to fully load - wait for contact name heading
      await authenticatedPage.waitForSelector('h1', { timeout: 15000 });

      // Step 2: Mark touchpoint as contacted
      const markContactedButton = authenticatedPage.locator('button:has-text("Mark as Contacted")').first();
      await markContactedButton.waitFor({ state: "visible", timeout: 15000 });
      
      // Click button and wait for modal to appear (it's rendered via portal)
      await markContactedButton.click();
      
      // Wait for modal to appear - it's rendered via createPortal so may take a moment
      const modal = authenticatedPage.locator('[role="dialog"]').filter({ 
        hasText: /Mark as Contacted|Mark the touchpoint/ 
      });
      await modal.waitFor({ state: "visible" });
      
      // Find the confirm button inside the modal
      const confirmButton = modal.locator('button:has-text("Mark as Contacted"), button:has-text("Mark Completed")')
        .filter({ hasNotText: "Cancel" })
        .first();
      
      // Wait for the confirm button to be visible and enabled
      await confirmButton.waitFor({ state: "visible" });
      
      await Promise.all([
        authenticatedPage.waitForResponse(
          (resp) => resp.url().includes('/api/contacts/') && resp.url().includes('/touchpoint-status') && resp.status() === 200,
          { timeout: 10000 }
        ).catch(() => null),
        confirmButton.click(),
      ]);
      
      await modal.waitFor({ state: "hidden" }).catch(() => {});
      await authenticatedPage.waitForTimeout(500);
      await expectTouchpointStatus(authenticatedPage, "completed");

      // Step 3: Navigate to Dashboard - verify touchpoint removed
      // Note: Touchpoint sections may not exist in DOM if all touchpoints are completed
      // The assertion helper will check if email appears in touchpoint sections (if they exist)
      await authenticatedPage.getByRole('link', { name: 'Dashboard' }).click();
      // Wait for dashboard to load (Recent Contacts or other sections)
      await authenticatedPage.waitForURL(/\/$/);
      await expect(authenticatedPage.getByText("Overdue")).not.toBeVisible();
      await expect(authenticatedPage.getByText("Upcoming Touchpoints")).not.toBeVisible();

      // Step 4: Navigate back to contact and restore
      await authenticatedPage.getByRole('link', { name: 'Test Contact' }).click();
      await authenticatedPage.waitForURL(/\/contacts\/.+/);
      
      const restoreButton = authenticatedPage.locator('button:has-text("Restore to Pending")').first();
      await restoreButton.waitFor({ state: "visible" });
      
      await Promise.all([
        authenticatedPage.waitForResponse(
          (resp) => resp.url().includes('/api/contacts/') && resp.url().includes('/touchpoint-status') && resp.status() === 200,
          { timeout: 10000 }
        ).catch(() => null),
        restoreButton.click(),
      ]);
      
      await authenticatedPage.waitForTimeout(500);
      await expectTouchpointStatus(authenticatedPage, "pending");

      // Step 5: Navigate to Dashboard again - verify touchpoint reappears
      // After restoring, the touchpoint should appear in touchpoint sections
      await authenticatedPage.getByRole('link', { name: 'Dashboard' }).click();
      // Wait for dashboard to load
      await authenticatedPage.waitForURL(/\/$/);
      await expect(authenticatedPage.getByText("Today's Priorities")).toBeVisible();
      await expect(authenticatedPage.getByText("Overdue").first()).toBeVisible();
    } finally {
      await deleteTestContact(testUserId, contactId);
    }
  });

  test("contact changes reflect on Contacts list", async ({
    authenticatedPage,
    testUserId,
  }) => {
    const testEmail = `test_list_${Date.now()}@test.example.com`;
    const contactId = await createTestContact(testUserId, {
      primaryEmail: testEmail,
      firstName: "Original",
      lastName: "Name",
    });

    try {
      // Step 1: Edit contact on detail page (saves via autosave on blur)
      await authenticatedPage.goto(`/contacts/${contactId}`);
      await authenticatedPage.waitForURL(/\/contacts\/.+/);

      // Edit first name - will save automatically on blur
      // Start waiting for response BEFORE triggering the save
      const responsePromise = authenticatedPage.waitForResponse(
        (resp) => {
          const url = resp.url();
          return url.includes('/api/contacts/') && !url.includes('/touchpoint-status') && !url.includes('/archive') && resp.status() === 200;
        },
        { timeout: 10000 }
      ).catch(() => null);
      
      // Trigger the edit and blur (which triggers autosave)
      await editFieldAndSave(authenticatedPage, 'input#contact-first-name, input[id*="contact-first"], input[placeholder="First Name"]', "Updated");
      
      // Wait for the API response
      await responsePromise;
      
      await authenticatedPage.waitForTimeout(500);

      // Step 2: Navigate to Contacts list - verify updated name appears
      await authenticatedPage.getByRole('link', { name: 'Contacts' }).first().click();
      await authenticatedPage.waitForURL(/\/contacts/);
      
      await expect(authenticatedPage.locator('text="Updated Name"')).toBeVisible();
    } finally {
      await deleteTestContact(testUserId, contactId);
    }
  });

  test("archived contacts are filtered from Contacts list", async ({
    authenticatedPage,
    testUserId,
  }) => {
    const testEmail = `test_archive_${Date.now()}@test.example.com`;
    const contactId = await createTestContact(testUserId, {
      primaryEmail: testEmail,
      firstName: "Original",
      lastName: "Name",
      archived: false,
    });

    try {
      // Step 1: Archive contact on detail page (via three-dot menu)
      await authenticatedPage.goto(`/contacts/${contactId}`);
      await authenticatedPage.waitForURL(/\/contacts\/.+/);

      // Wait for page to fully load - wait for contact name heading and email
      await authenticatedPage.waitForSelector('h1', { timeout: 15000 });
      // Wait for contact email to appear (indicates contact data loaded)
      await authenticatedPage.waitForSelector('text=/.*@.*/', { timeout: 15000 });
      // Wait for the menu button (only renders when contact is loaded)
      const menuButton = authenticatedPage.locator('button[aria-label="Contact options"]');
      await menuButton.waitFor({ state: "visible", timeout: 15000 });
      await menuButton.click();
      await authenticatedPage.waitForTimeout(500); // Wait for menu to open
      
      // Click Archive in the dropdown menu
      const archiveMenuItem = authenticatedPage.getByRole('menuitem', { name: 'Archive' });
      await archiveMenuItem.waitFor({ state: "visible", timeout: 5000 });
      await archiveMenuItem.click();
      
      // Wait for archive modal to appear
      const archiveModal = authenticatedPage.locator('[role="dialog"]').filter({ 
        hasText: /Archive Contact|Archive the contact/ 
      });
      await archiveModal.waitFor({ state: "visible" });
      
      // Confirm archive in modal
      const confirmArchiveButton = archiveModal.getByRole('button', { name: 'Archive' });
      await Promise.all([
        authenticatedPage.waitForResponse(
          (resp) => resp.url().includes('/api/contacts/') && resp.url().includes('/archive') && resp.status() === 200,
          { timeout: 10000 }
        ).catch(() => null),
        confirmArchiveButton.click(),
      ]);
      
      await archiveModal.waitFor({ state: "hidden" }).catch(() => {});

      await authenticatedPage.getByRole('link', { name: 'Contacts' }).first().click();
      await authenticatedPage.waitForURL(/\/contacts/);
      await expect(authenticatedPage.locator('text="No contacts match your filters"')).toBeVisible();
      await authenticatedPage.getByLabel("Show archived contacts").click();
      await expect(authenticatedPage.locator('text="Original Name"')).toBeVisible();
      // Step 3: Go back and unarchive (via three-dot menu)
      await authenticatedPage.getByRole('link', { name: 'Original Name' }).click();
      await authenticatedPage.waitForURL(/\/contacts\/.+/);
      
      // Wait for page to fully load - wait for contact name heading and email
      await authenticatedPage.waitForSelector('h1', { timeout: 15000 });
      // Wait for contact email to appear (indicates contact data loaded)
      await authenticatedPage.waitForSelector('text=/.*@.*/', { timeout: 15000 });
      // Wait for the menu button (only renders when contact is loaded)
      const menuButton2 = authenticatedPage.locator('button[aria-label="Contact options"]');
      await menuButton2.waitFor({ state: "visible", timeout: 15000 });
      await menuButton2.click();
      await authenticatedPage.waitForTimeout(500); // Wait for menu to open
      
      // Click Unarchive in the dropdown menu
      const unarchiveMenuItem = authenticatedPage.getByRole('menuitem', { name: 'Unarchive' });
      await unarchiveMenuItem.waitFor({ state: "visible", timeout: 5000 });
      await unarchiveMenuItem.click();
      
      // Wait for unarchive modal to appear
      const unarchiveModal = authenticatedPage.locator('[role="dialog"]').filter({ 
        hasText: /Unarchive Contact|Unarchive the contact/ 
      });
      await unarchiveModal.waitFor({ state: "visible" });
      
      // Confirm unarchive in modal
      const confirmUnarchiveButton = unarchiveModal.getByRole('button', { name: 'Unarchive' });
      await Promise.all([
        authenticatedPage.waitForResponse(
          (resp) => resp.url().includes('/api/contacts/') && resp.url().includes('/archive') && resp.status() === 200,
          { timeout: 10000 }
        ).catch(() => null),
        confirmUnarchiveButton.click(),
      ]);
      
      await unarchiveModal.waitFor({ state: "hidden" }).catch(() => {});
      await expect(authenticatedPage.locator('text="Original Name"')).toBeVisible();
    } finally {
      await deleteTestContact(testUserId, contactId);
    }
  });
});

test.describe("Complete User Workflows", () => {
  test("full contact lifecycle: create → edit → archive → delete", async ({
    authenticatedPage,
    testUserId,
  }) => {
    // Validate test user ID for safety (since we're not using createTestContact which validates it)
    validateTestUserId(testUserId);
    
    const testEmail = `test_lifecycle_${Date.now()}@test.example.com`;
    // let contactId: string | null = null;

    // Step 1: Create contact via form
    await authenticatedPage.getByRole('button', { name: 'Add Contact' }).first().click();
    await authenticatedPage.waitForURL(/\/contacts\/new/, { waitUntil: 'domcontentloaded' });

    // Wait for the form to load - this will only appear if auth resolved successfully
    const emailInput = authenticatedPage.locator('input#new-contact-email');
    await emailInput.waitFor({ state: "visible", timeout: 15000 });

    // Fill in the form fields
    await emailInput.fill(testEmail);
    await authenticatedPage.locator('input#new-contact-first-name').fill("Lifecycle");
    await authenticatedPage.locator('input#new-contact-last-name').fill("Test");

    // Save the contact and wait for redirect to contacts list page
    await Promise.all([
      authenticatedPage.waitForResponse(
        (resp) => {
          const url = resp.url();
          return url.includes('/api/contacts') && !url.includes('/touchpoint-status') && !url.includes('/archive') && resp.status() === 200;
        },
        { timeout: 10000 }
      ).catch(() => null),
      authenticatedPage.waitForURL(/\/contacts/, { timeout: 10000 }),
      authenticatedPage.getByRole('button', { name: 'Save Contact' }).click(),
    ]);

    await expect(authenticatedPage.getByRole('heading', { name: 'Contacts' })).toBeVisible();
    // Wait a bit for the list to update
    await authenticatedPage.waitForTimeout(500);
    // Check for contact in list using link (more specific than getByText)
    await expect(authenticatedPage.getByRole('link', { name: 'Lifecycle Test' })).toBeVisible({ timeout: 10000 });

    // Go to the contact detail page
    await authenticatedPage.getByRole('link', { name: 'Lifecycle Test' }).click();
    await authenticatedPage.waitForURL(/\/contacts\/.+/);

    // Verify the contact details (use heading to avoid route announcer)
    await expect(authenticatedPage.getByRole('heading', { name: 'Lifecycle Test' })).toBeVisible();
    
    // Wait for page to fully load - wait for contact name heading and email
    await authenticatedPage.waitForSelector('h1', { timeout: 15000 });
    // Wait for contact email to appear (indicates contact data loaded)
    await authenticatedPage.waitForSelector('text=/.*@.*/', { timeout: 15000 });
    // Wait for the menu button (only renders when contact is loaded)
    const menuButton = authenticatedPage.locator('button[aria-label="Contact options"]');
    await menuButton.waitFor({ state: "visible", timeout: 15000 });
    await menuButton.click();
    await authenticatedPage.waitForTimeout(500); // Wait for menu to open
    
    // Click Archive in the dropdown menu
    const archiveMenuItem = authenticatedPage.getByRole('menuitem', { name: 'Archive' });
    await archiveMenuItem.waitFor({ state: "visible", timeout: 5000 });
    await archiveMenuItem.click();
    
    // Wait for archive modal to appear
    const archiveModal = authenticatedPage.locator('[role="dialog"]').filter({ 
      hasText: /Archive Contact|Archive the contact/ 
    });
    await archiveModal.waitFor({ state: "visible" });
    
    // Confirm archive in modal
    const confirmArchiveButton = archiveModal.getByRole('button', { name: 'Archive' });
    await Promise.all([
      authenticatedPage.waitForResponse(
        (resp) => resp.url().includes('/api/contacts/') && resp.url().includes('/archive') && resp.status() === 200,
        { timeout: 10000 }
      ).catch(() => null),
      confirmArchiveButton.click(),
    ]);
    
    await archiveModal.waitFor({ state: "hidden" }).catch(() => {});

    await authenticatedPage.getByRole('link', { name: 'Contacts' }).first().click();
    await authenticatedPage.waitForURL(/\/contacts/);
    await expect(authenticatedPage.locator('text="No contacts match your filters"')).toBeVisible();
    await authenticatedPage.getByLabel("Show archived contacts").click();
    // Check for contact in list using link (more specific than getByText)
    await expect(authenticatedPage.getByRole('link', { name: 'Lifecycle Test' })).toBeVisible();

    // Go to the contact detail page
    await authenticatedPage.getByRole('link', { name: 'Lifecycle Test' }).click();
    await authenticatedPage.waitForURL(/\/contacts\/.+/);

    // Verify the contact details (use heading to avoid route announcer)
    await expect(authenticatedPage.getByRole('heading', { name: 'Lifecycle Test' })).toBeVisible();

     // Wait for page to fully load - wait for contact name heading and email
     await authenticatedPage.waitForSelector('h1', { timeout: 15000 });
     // Wait for contact email to appear (indicates contact data loaded)
     await authenticatedPage.waitForSelector('text=/.*@.*/', { timeout: 15000 });
     // Wait for the menu button (only renders when contact is loaded)
     const menuButton2 = authenticatedPage.locator('button[aria-label="Contact options"]');
     await menuButton2.waitFor({ state: "visible", timeout: 15000 });
     await menuButton2.click();
     await authenticatedPage.waitForTimeout(500); // Wait for menu to open
     
     // Click Delete in the dropdown menu
     const deleteMenuItem = authenticatedPage.getByRole('menuitem', { name: 'Delete' });
     await deleteMenuItem.waitFor({ state: "visible", timeout: 5000 });
     await deleteMenuItem.click();

     // confirm deletion in modal
     const deleteModal = authenticatedPage.locator('[role="dialog"]').filter({ 
       hasText: /Delete Contact|Delete the contact/ 
     });
     await deleteModal.waitFor({ state: "visible" });
     
     // Click delete button and wait for redirect
     // Note: After DELETE succeeds, there may be a GET 404 for the deleted contact (expected)
     // We just need to wait for the redirect to /contacts to complete
     const confirmDeleteButton = deleteModal.getByRole('button', { name: 'Delete' });
     
     // Wait for DELETE request to succeed, then click
     const deleteResponsePromise = authenticatedPage.waitForResponse(
       (resp) => {
         const url = resp.url();
         const method = resp.request().method();
         return method === 'DELETE' && url.includes('/api/contacts/') && !url.includes('/touchpoint-status') && !url.includes('/archive') && resp.status() === 200;
       },
       { timeout: 10000 }
     ).catch(() => null);
     
     // Click the delete button
     await confirmDeleteButton.click();
     
     // Wait for DELETE to complete
     await deleteResponsePromise;
     
     // Wait for redirect to contacts page (happens in onSuccess callback)
     // Also wait for modal to close (it should close on redirect/navigation)
     await Promise.all([
       authenticatedPage.waitForURL(/\/contacts\/?$/, { timeout: 10000 }),
       deleteModal.waitFor({ state: "hidden" }).catch(() => {
         // Modal might close via navigation, so ignore if it disappears
       }),
     ]);
     
     // Wait for navigation to complete
     await authenticatedPage.waitForLoadState('domcontentloaded');
     
     // Small delay to ensure the contacts list has updated
     await authenticatedPage.waitForTimeout(500);
     
     await expect(authenticatedPage.locator('text="No contacts yet"').first()).toBeVisible();
  });

  test("touchpoint workflow: create → mark completed → restore → verify Dashboard sync", async ({
    authenticatedPage,
    testUserId,
  }) => {
    const testEmail = `test_touchpoint_workflow_${Date.now()}@test.example.com`;
    // Create touchpoint with date in the past so it appears in "Overdue Touchpoints"
    const contactId = await createTestContactWithTouchpoint(testUserId, testEmail, -1);

    try {
      // Step 1: Navigate to contact and mark as contacted
      await authenticatedPage.goto(`/contacts/${contactId}`);
      await authenticatedPage.waitForURL(/\/contacts\/.+/);

      const markContactedButton2 = authenticatedPage.locator('button:has-text("Mark as Contacted")').first();
      await markContactedButton2.waitFor({ state: "visible" });
      await markContactedButton2.click();
      
      // Wait for modal to appear - it's rendered via createPortal so may take a moment
      const modal2 = authenticatedPage.locator('[role="dialog"]').filter({ 
        hasText: /Mark as Contacted|Mark the touchpoint/ 
      });
      await modal2.waitFor({ state: "visible" });
      
      // Find the confirm button inside the modal (can be "Mark as Contacted" or "Mark Completed")
      const confirmButton2 = modal2.locator('button:has-text("Mark as Contacted"), button:has-text("Mark Completed")')
        .filter({ hasNotText: "Cancel" })
        .first();
      
      // Wait for the confirm button to be visible and enabled
      await confirmButton2.waitFor({ state: "visible" });
      
      await Promise.all([
        authenticatedPage.waitForResponse(
          (resp) => resp.url().includes('/api/contacts/') && resp.url().includes('/touchpoint-status') && resp.status() === 200,
          { timeout: 10000 }
        ).catch(() => null),
        confirmButton2.click(),
      ]);
      
      await modal2.waitFor({ state: "hidden" }).catch(() => {});

      // Wait for status update
      await authenticatedPage.waitForTimeout(500);
      await expectTouchpointStatus(authenticatedPage, "completed");

      // Step 2: Verify removed from Dashboard
      await expectTouchpointNotOnDashboard(authenticatedPage, testEmail);

      // Step 2: Restore to pending
      await authenticatedPage.goto(`/contacts/${contactId}`);
      await authenticatedPage.waitForURL(/\/contacts\/.+/);

      const restoreButton5 = authenticatedPage.locator('button:has-text("Restore to Pending")').first();
      await restoreButton5.waitFor({ state: "visible" });
      
      await Promise.all([
        authenticatedPage.waitForResponse(
          (resp) => resp.url().includes('/api/contacts/') && resp.url().includes('/touchpoint-status') && resp.status() === 200,
          { timeout: 10000 }
        ).catch(() => null),
        restoreButton5.click(),
      ]);
      
      //Navigate to Contacts list - verify updated touchpoint status appears
      await expectTouchpointOnDashboard(authenticatedPage);
    } finally {
      await deleteTestContact(testUserId, contactId);
    }
  });
});
