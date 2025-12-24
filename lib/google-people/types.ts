/**
 * TypeScript interfaces for Google People API responses
 */

/**
 * Google People API Name object
 */
export interface PeopleApiName {
  givenName?: string | null;
  familyName?: string | null;
  displayName?: string | null;
  displayNameLastFirst?: string | null;
}

/**
 * Google People API EmailAddress object
 */
export interface PeopleApiEmailAddress {
  value?: string | null;
  type?: string | null;
}

/**
 * Google People API Organization object
 */
export interface PeopleApiOrganization {
  name?: string | null;
  title?: string | null;
  department?: string | null;
  domain?: string | null;
}

/**
 * Google People API Photo object
 */
export interface PeopleApiPhoto {
  url?: string | null;
  default?: boolean | null;
  metadata?: {
    primary?: boolean | null;
    source?: {
      type?: string | null;
      id?: string | null;
    } | null;
  } | null;
}

/**
 * Google People API Person resource
 */
export interface PeopleApiPerson {
  resourceName?: string;
  names?: PeopleApiName[];
  emailAddresses?: PeopleApiEmailAddress[];
  organizations?: PeopleApiOrganization[];
  photos?: PeopleApiPhoto[];
}

/**
 * Google People API searchContacts response
 */
export interface PeopleApiSearchContactsResponse {
  results?: Array<{
    person?: PeopleApiPerson;
  }>;
}

/**
 * Google People API otherContacts.search response
 */
export interface PeopleApiOtherContactsSearchResponse {
  results?: Array<{
    person?: PeopleApiPerson;
  }>;
  nextPageToken?: string;
}

/**
 * Enriched contact data returned from People API enrichment
 */
export interface EnrichedContactData {
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  photoUrl: string | null;
  source: "people_api" | "email_extraction" | null;
}

