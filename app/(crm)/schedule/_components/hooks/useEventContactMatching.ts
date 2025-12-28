import { useMemo, useEffect } from "react";
import { CalendarEvent, Contact } from "@/types/firestore";
import { useLinkEventToContact } from "@/hooks/useCalendarEvents";

interface ContactSuggestion {
  contact: Contact;
  reason: string;
}

interface UseEventContactMatchingParams {
  event: CalendarEvent;
  contacts: Contact[];
  userEmail: string | null | undefined;
}

interface UseEventContactMatchingReturn {
  exactEmailMatchContact: Contact | null;
  contactSuggestions: ContactSuggestion[];
  linkedContact: Contact | null;
}

export function useEventContactMatching({
  event,
  contacts,
  userEmail,
}: UseEventContactMatchingParams): UseEventContactMatchingReturn {
  const linkMutation = useLinkEventToContact();

  // Find exact email match contact (for auto-linking)
  const exactEmailMatchContact = useMemo(() => {
    if (!contacts.length || event.matchedContactId) return null;
    
    const userEmailLower = userEmail?.toLowerCase().trim() || null;
    const eventEmails = new Set<string>();
    
    // Collect emails from attendees (excluding user's email)
    if (event.attendees) {
      for (const attendee of event.attendees) {
        const email = attendee.email?.toLowerCase().trim();
        if (email && (!userEmailLower || email !== userEmailLower)) {
          eventEmails.add(email);
        }
      }
    }
    
    // Check for exact email match (primary or secondary)
    for (const contact of contacts) {
      // Skip if this contact's email matches the user's email
      if (userEmailLower && contact.primaryEmail?.toLowerCase().trim() === userEmailLower) {
        continue;
      }
      
      // Check primary email
      if (contact.primaryEmail && eventEmails.has(contact.primaryEmail.toLowerCase().trim())) {
        return contact;
      }
      
      // Check secondary emails
      if (contact.secondaryEmails) {
        for (const secondaryEmail of contact.secondaryEmails) {
          if (eventEmails.has(secondaryEmail.toLowerCase().trim())) {
            return contact;
          }
        }
      }
    }
    
    return null;
  }, [contacts, event, userEmail]);

  // Auto-link exact email matches
  useEffect(() => {
    if (exactEmailMatchContact && !event.matchedContactId && !linkMutation.isPending) {
      linkMutation.mutate({ 
        eventId: event.eventId, 
        contactId: exactEmailMatchContact.contactId 
      });
    }
  }, [exactEmailMatchContact, event.matchedContactId, event.eventId, linkMutation]);

  // Find contact suggestions based on attendees (excluding user's email and exact matches)
  const contactSuggestions = useMemo(() => {
    if (!contacts.length || event.matchedContactId) return [];
    
    const userEmailLower = userEmail?.toLowerCase().trim() || null;
    const suggestions: ContactSuggestion[] = [];
    const eventEmails = new Set<string>();
    let extractedFirstName: string | null = null;
    let extractedLastName: string | null = null;
    
    // Collect emails from attendees (excluding user's email)
    if (event.attendees) {
      for (const attendee of event.attendees) {
        const email = attendee.email?.toLowerCase().trim();
        if (email && (!userEmailLower || email !== userEmailLower)) {
          eventEmails.add(email);
          
          // Try to extract name from attendee displayName (excluding user)
          if (attendee.displayName && !extractedFirstName && !extractedLastName) {
            const nameParts = attendee.displayName.trim().split(/\s+/);
            if (nameParts.length >= 2) {
              extractedFirstName = nameParts[0];
              extractedLastName = nameParts[nameParts.length - 1];
            }
          }
        }
      }
    }
    
    // Fallback: Extract names from title (only capitalized first+last name pattern)
    if (!extractedFirstName || !extractedLastName) {
      const title = event.title || "";
      const namePattern = /([A-Z][a-z]+)\s+([A-Z][a-z]+)/g;
      const matches = Array.from(title.matchAll(namePattern));
      
      // Try to get user's name to exclude it
      let userLastName: string | null = null;
      if (userEmailLower && event.attendees) {
        const userAttendee = event.attendees.find(
          (a) => a.email?.toLowerCase().trim() === userEmailLower
        );
        if (userAttendee?.displayName) {
          const userNameParts = userAttendee.displayName.trim().split(/\s+/);
          if (userNameParts.length >= 2) {
            userLastName = userNameParts[userNameParts.length - 1];
          }
        }
      }
      
      // Use first name that doesn't match user's last name
      for (const match of matches) {
        const firstName = match[1];
        const lastName = match[2];
        
        // Skip if this matches the user's last name
        if (userLastName && lastName.toLowerCase() === userLastName.toLowerCase()) {
          continue;
        }
        
        if (!extractedFirstName) extractedFirstName = firstName;
        if (!extractedLastName) extractedLastName = lastName;
        break;
      }
    }
    
    // Note: Exact email matches are handled separately and auto-linked, so we skip them here
    // We only show name-based suggestions (last name, first name) - not email matches
    
    // Second pass: Exact last name matches (only if not already suggested and not exact email match)
    if (extractedLastName) {
      const lastNameLower = extractedLastName.toLowerCase().trim();
      for (const contact of contacts) {
        // Skip if already suggested
        if (suggestions.some((s) => s.contact.contactId === contact.contactId)) continue;
        
        // Skip if this is the exact email match contact (it will be auto-linked)
        if (exactEmailMatchContact && contact.contactId === exactEmailMatchContact.contactId) continue;
        
        // Skip if this contact's email matches the user's email
        if (userEmailLower && contact.primaryEmail?.toLowerCase().trim() === userEmailLower) {
          continue;
        }
        
        // Only match exact last name
        if (contact.lastName && contact.lastName.toLowerCase().trim() === lastNameLower) {
          suggestions.push({ contact, reason: "Last name match" });
        }
      }
    }
    
    // Third pass: Exact first name matches (only if not already suggested)
    if (extractedFirstName) {
      const firstNameLower = extractedFirstName.toLowerCase().trim();
      for (const contact of contacts) {
        // Skip if already suggested
        if (suggestions.some((s) => s.contact.contactId === contact.contactId)) continue;
        
        // Skip if this is the exact email match contact (it will be auto-linked)
        if (exactEmailMatchContact && contact.contactId === exactEmailMatchContact.contactId) continue;
        
        // Skip if this contact's email matches the user's email
        if (userEmailLower && contact.primaryEmail?.toLowerCase().trim() === userEmailLower) {
          continue;
        }
        
        // Only match exact first name
        if (contact.firstName && contact.firstName.toLowerCase().trim() === firstNameLower) {
          suggestions.push({ contact, reason: "First name match" });
        }
      }
    }
    
    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }, [contacts, event, userEmail, exactEmailMatchContact]);

  // Get linked contact
  const linkedContact = useMemo(() => {
    if (!event.matchedContactId) return null;
    return contacts.find((c) => c.contactId === event.matchedContactId) || null;
  }, [contacts, event.matchedContactId]);

  return {
    exactEmailMatchContact,
    contactSuggestions,
    linkedContact,
  };
}

