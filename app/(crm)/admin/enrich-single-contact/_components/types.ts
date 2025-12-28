export interface ProcessResult {
  success: boolean;
  message: string;
  dryRun: boolean;
  contact: {
    email: string;
    contactId: string;
  };
  enriched?: {
    firstName: string | null;
    lastName: string | null;
    company: string | null;
    photoUrl: string | null;
    source?: string;
  };
  current?: {
    firstName?: string | null;
    lastName?: string | null;
    company?: string | null;
    photoUrl?: string | null;
  };
  new?: {
    firstName?: string | null;
    lastName?: string | null;
    company?: string | null;
    photoUrl?: string | null;
  };
  action: "updated" | "skipped";
  reason?: string;
  updates?: string[];
  error?: string;
}

