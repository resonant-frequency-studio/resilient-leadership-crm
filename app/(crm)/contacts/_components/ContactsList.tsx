import { getUserId } from "@/lib/auth-utils";
import { getAllContactsForUser } from "@/lib/contacts-server";
import { getInitials, getDisplayName } from "@/util/contact-utils";
import { Contact } from "@/types/firestore";
import ContactsPageClient from "../ContactsPageClient";

interface ContactWithId extends Contact {
  id: string;
  displayName: string;
  initials: string;
}

export default async function ContactsList() {
  const userId = await getUserId();

  // Fetch contacts on server
  const contacts = await getAllContactsForUser(userId);

  // Pre-compute displayName and initials for each contact
  const contactsWithComputed: ContactWithId[] = contacts.map((contact) => {
    const contactForUtils: Contact = {
      ...contact,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return {
      ...contact,
      id: contact.contactId,
      displayName: getDisplayName(contactForUtils),
      initials: getInitials(contactForUtils),
    };
  });

  return <ContactsPageClient initialContacts={contactsWithComputed} />;
}

