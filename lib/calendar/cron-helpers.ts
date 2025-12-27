import { Firestore } from "firebase-admin/firestore";
import { reportException } from "@/lib/error-reporting";

/**
 * Get all user IDs that have Google Calendar access
 * This is used by cron jobs to sync events for all users
 */
export async function getAllUsersWithCalendarAccess(
  db: Firestore
): Promise<string[]> {
  try {
    // Get all users who have Google accounts linked (which implies calendar access if scope includes calendar)
    const googleAccountsSnapshot = await db.collection("googleAccounts").get();
    
    const userIds: string[] = [];
    
    for (const doc of googleAccountsSnapshot.docs) {
      const data = doc.data();
      const scope = data.scope || "";
      
      // Check if user has calendar scope
      const hasCalendarScope = scope.includes("calendar.readonly") || scope.includes("calendar");
      
      if (hasCalendarScope) {
        userIds.push(doc.id);
      }
    }
    
    return userIds;
  } catch (error) {
    reportException(error, {
      context: "Getting users with calendar access",
      tags: { component: "cron-helpers" },
    });
    return [];
  }
}

/**
 * Get all user IDs that have Gmail access
 * This is used by cron jobs to sync Gmail threads for all users
 */
export async function getAllUsersWithGmailAccess(
  db: Firestore
): Promise<string[]> {
  try {
    const googleAccountsSnapshot = await db.collection("googleAccounts").get();
    
    const userIds: string[] = [];
    
    for (const doc of googleAccountsSnapshot.docs) {
      const data = doc.data();
      const scope = data.scope || "";
      
      // Check if user has Gmail scope
      const hasGmailScope = scope.includes("gmail.readonly") || scope.includes("gmail");
      
      if (hasGmailScope) {
        userIds.push(doc.id);
      }
    }
    
    return userIds;
  } catch (error) {
    reportException(error, {
      context: "Getting users with Gmail access",
      tags: { component: "cron-helpers" },
    });
    return [];
  }
}

/**
 * Get all user IDs that have Google Contacts access
 * This is used by cron jobs to sync contacts for all users
 */
export async function getAllUsersWithContactsAccess(
  db: Firestore
): Promise<string[]> {
  try {
    const googleAccountsSnapshot = await db.collection("googleAccounts").get();
    
    const userIds: string[] = [];
    
    for (const doc of googleAccountsSnapshot.docs) {
      const data = doc.data();
      const scope = data.scope || "";
      
      // Check if user has Contacts scope
      const hasContactsScope = scope.includes("contacts.readonly") || scope.includes("contacts");
      
      if (hasContactsScope) {
        userIds.push(doc.id);
      }
    }
    
    return userIds;
  } catch (error) {
    reportException(error, {
      context: "Getting users with Contacts access",
      tags: { component: "cron-helpers" },
    });
    return [];
  }
}

