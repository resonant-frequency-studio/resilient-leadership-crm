import { getUserId } from "@/lib/auth-utils";
import { getAllActionItemsForUser } from "@/lib/action-items";
import { getContactsMapForUser } from "@/lib/contacts-server";
import { getInitials, getDisplayName } from "@/util/contact-utils";
import { computeIsOverdue, getDateCategory } from "@/util/date-utils-server";
import { ActionItem, Contact } from "@/types/firestore";
import ActionItemsPageClient from "../ActionItemsPageClient";

interface EnrichedActionItem extends ActionItem {
  contactId: string;
  contactName: string;
  contactEmail?: string;
  contactFirstName?: string;
  contactLastName?: string;
  displayName: string;
  initials: string;
  isOverdue: boolean;
  dateCategory: "overdue" | "today" | "thisWeek" | "upcoming";
}

export default async function ActionItemsList() {
  const userId = await getUserId();

  // Fetch data on server
  const [actionItems, contacts] = await Promise.all([
    getAllActionItemsForUser(userId),
    getContactsMapForUser(userId),
  ]);

  // Use consistent server time for all calculations
  const serverTime = new Date();

  // Pre-compute all derived values
  const enrichedItems: EnrichedActionItem[] = actionItems.map((item) => {
    const contact = contacts.get(item.contactId);
    
    // Create contact object for utility functions
    const contactForUtils: Contact = {
      contactId: item.contactId,
      firstName: contact?.firstName,
      lastName: contact?.lastName,
      primaryEmail: contact?.primaryEmail || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const contactName = contact
      ? [contact.firstName, contact.lastName].filter(Boolean).join(" ") ||
        contact.primaryEmail
      : "Unknown Contact";

    const displayName = getDisplayName(contactForUtils);
    const initials = getInitials(contactForUtils);
    const isOverdue = computeIsOverdue(item, serverTime);
    const dateCategory = getDateCategory(item.dueDate, serverTime);

    return {
      ...item,
      contactName,
      contactEmail: contact?.primaryEmail,
      contactFirstName: contact?.firstName || undefined,
      contactLastName: contact?.lastName || undefined,
      displayName,
      initials,
      isOverdue,
      dateCategory,
    };
  });

  // Convert contacts Map to array for serialization
  const contactsArray: Array<[string, Contact]> = Array.from(contacts.entries());

  return (
    <ActionItemsPageClient
      initialActionItems={enrichedItems}
      contacts={contactsArray}
    />
  );
}

