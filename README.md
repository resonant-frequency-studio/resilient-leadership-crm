# Insight Loop CRM

A modern, elegant Customer Relationship Management (CRM) application built with Next.js and Firebase, designed to help you manage contacts and relationships effectively.

## Features

### Contact Management
- **View All Contacts** - Browse and manage your contact list with real-time updates
- **Create New Contacts** - Manually add contacts with comprehensive information
- **Edit Contacts** - Update contact details, tags, segments, and more
- **Import Contacts** - Bulk import contacts from CSV files with flexible overwrite options
- **Delete Contacts** - Remove contacts with confirmation modal

### Contact Information
- Identity fields (email, first name, last name)
- CRM fields (tags, segments, lead source, engagement score, notes)
- Next touchpoint tracking
- AI-generated summaries and insights
- Sentiment analysis
- Email thread tracking

### Dashboard & Analytics
- **Interactive Charts** - Visualize your contact data with elegant charts:
  - Segment distribution (pie chart)
  - Lead source breakdown (pie chart)
  - Engagement levels (bar chart)
  - Sentiment analysis (pie chart)
  - Top tags (horizontal bar chart)
- **Real-time Statistics** - View key metrics at a glance:
  - Total contacts
  - Active email threads
  - Average engagement score
  - Upcoming touchpoints

### Data Visualization
- Modern, clean chart designs using Recharts
- Responsive layouts that work on all devices
- Interactive tooltips and legends
- Automatic grouping of small segments

### Authentication
- Google Sign-In integration
- Secure Firebase Authentication
- Protected routes and automatic redirects

### Search & Filtering
- Search by email, first name, or last name
- Filter by segment
- Filter by tags (multiple selection)
- Clear filters option

### Gmail Integration
- **Automatic Email Sync** - Sync email threads from your Gmail account
- **Incremental Sync** - Only syncs new messages since last sync
- **Contact Matching** - Automatically matches emails to existing contacts
- **Thread Tracking** - Tracks conversation threads per contact
- **Scheduled Sync** - Automatic background synchronization

### Action Items
- **AI-Generated Action Items** - Extract action items from email conversations
- **Manage Tasks** - Track and manage follow-up tasks for each contact
- **Import from Text** - Create action items from plain text

### White-Labeling
- **Customizable CRM Name** - Configure the application name via environment variables
- **Brand Identity** - Easy to rebrand for different organizations

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Firebase (Firestore, Authentication)
- **Charts**: Recharts
- **CSV Parsing**: PapaParse

## Project Structure

```
├── app/
│   ├── (crm)/              # Protected CRM routes
│   │   ├── contacts/       # Contact management pages
│   │   └── page.tsx        # Dashboard
│   ├── login/              # Authentication page
│   └── layout.tsx          # Root layout
├── components/
│   ├── charts/             # Data visualization components
│   └── ...                 # UI components
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts
│   ├── useDashboardStats.ts
│   ├── useContactImportPage.ts
│   ├── useContactDetailPage.ts
│   ├── useNewContactPage.ts
│   └── useFilterContacts.ts
├── lib/                    # Library utilities
│   ├── app-config.ts       # Application configuration (white-labeling)
│   ├── firebase-client.ts
│   ├── firebase-admin.ts
│   ├── firestore-crud.ts
│   ├── firestore-paths.ts
│   └── contact-import.ts
├── types/                  # TypeScript type definitions
│   └── firestore.ts
└── util/                   # Utility functions
    ├── contact-utils.ts
    └── csv-utils.ts
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project with Firestore and Authentication enabled
- Google Cloud Console project with:
  - OAuth 2.0 credentials configured for Gmail access
  - Google API Key with Gemini API enabled (for AI features)
  - Gmail API enabled

### Installation

1. Clone the repository:
```bash
git clone https://github.com/resonant-frequency-studio/insight-loop-crm.git
cd insight-loop-crm
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment configuration:
   - Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```
   - Edit `.env.local` and fill in your configuration values:
     - **Required**: Firebase client configuration (for authentication and database)
     - **Required**: Firebase Admin configuration (for server-side operations)
     - **Required**: Google OAuth credentials (for Gmail sync)
     - **Required**: Google API Key (for AI/Gemini features)
     - **Optional**: CRM name customization (defaults to "Insight Loop CRM")
     - **Optional**: Cron secret and logging settings
   - See `env.example` for detailed comments on each variable

4. Configure Firestore security rules:
   - Ensure users can only read/write their own contacts
   - Rule should be: `match /users/{userId}/contacts/{contactId} { allow read, write: if request.auth != null && request.auth.uid == userId; }`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Adding Contacts
- Click "Add Contact" from the contacts page or dashboard
- Fill in contact information (email is required)
- Save to create the contact

### Importing Contacts
- Navigate to "Import Contacts" from the dashboard or contacts page
- Upload a CSV file with contact data
- Choose to overwrite existing contacts or skip them
- Monitor import progress in real-time

### Viewing Analytics
- Visit the dashboard to see visualizations of your contact data
- Charts update automatically as you add or modify contacts
- Hover over chart elements for detailed information

### Gmail Sync
- Navigate to "Sync Status" to view sync progress and history
- Click "Sync Now" to manually trigger a sync
- Gmail sync automatically runs in the background on a schedule
- First sync may take longer depending on your email volume

### Managing Action Items
- Action items are automatically extracted from email conversations using AI
- View all action items on the "Action Items" page
- Filter and manage tasks across all contacts

## CSV Import Format

### Required Columns
- `Email` - Contact email address

### Optional Columns
- `FirstName`, `LastName` - Contact names
- `Summary`, `Notes` - Text fields
- `Tags` - Comma-separated tags
- `Segment`, `LeadSource` - Classification fields
- `EngagementScore` - Number (0-100)
- `NextTouchpointDate`, `NextTouchpointMessage` - Future actions
- Other CRM fields as needed

## White-Labeling & Customization

The CRM name can be easily customized for your organization:

1. Open your `.env.local` file
2. Set the `NEXT_PUBLIC_CRM_NAME` variable:
   ```
   NEXT_PUBLIC_CRM_NAME=Your Company CRM
   ```
3. Restart your development server

The custom name will appear in:
- Page titles and metadata
- Login page heading
- Sidebar navigation
- FAQ page descriptions
- All other UI locations

**Note**: If `NEXT_PUBLIC_CRM_NAME` is not set, it defaults to "Insight Loop CRM".

## Architecture Highlights

### Separation of Concerns
- **UI Components** - Pure presentation components
- **Custom Hooks** - Business logic and state management
- **Utility Functions** - Reusable data transformations
- **Library Functions** - Firestore operations and data access

### Code Organization
- Modular hook-based architecture
- Type-safe throughout with TypeScript
- Reusable utility functions
- Clean separation between UI and business logic

## Environment Variables

### Required Variables

**Firebase Client** (Public, exposed to browser):
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

**Firebase Admin** (Server-side only):
- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`

**Google OAuth** (Server-side only):
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `GOOGLE_OAUTH_SCOPES`

**Google API**:
- `GOOGLE_API_KEY` (for Gemini/AI features)

### Optional Variables

- `NEXT_PUBLIC_CRM_NAME` - Customize the application name (default: "Insight Loop CRM")
- `CRON_SECRET` - Secret for securing scheduled sync endpoints
- `ENABLE_FIRESTORE_LOGGING` - Enable/disable Firestore operation logging (default: false)

See `env.example` for a complete template with all variables.

## License

Private project - All rights reserved
