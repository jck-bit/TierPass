# TierPass

A responsive web application that showcases events based on user membership tiers. Built with Next.js 14 (App Router), Clerk.dev for authentication, Supabase for database, and Tailwind CSS for styling.

## Features

- 🔐 **Secure Authentication** - User authentication powered by Clerk.dev
- 🎫 **Tier-Based Access** - Four membership tiers (Free, Silver, Gold, Platinum)
- 📅 **Event Management** - Browse events filtered by your membership tier
- 📱 **Responsive Design** - mobile-friendly UI with Tailwind CSS
- 🚀 **Modern Stack** - Built with Next.js 14, TypeScript, and React Server Components
- 🔄 **Tier Simulation** - Test different tiers without payment integration
- ⚡ **Real-time Updates** - Instant UI updates when tier changes

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: Clerk.dev
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel (recommended)

## Prerequisites

Before you begin, ensure you have:

- Node.js 18.17 or later
- npm or yarn package manager
- A Clerk.dev account
- A Supabase account

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/jck-bit/TierPass.git
```

### 2. Navigate to the Project Directory

```bash
cd TierPass
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Set Up Clerk.dev

1. Create a new application in [Clerk Dashboard](https://dashboard.clerk.dev/)
2. Copy your API keys from the Clerk dashboard
3. Configure the following environment variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 5. Set Up Supabase

1. Create a new project in [Supabase Dashboard](https://app.supabase.com/)
2. Copy your project URL and anon key
3. Add to environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 6. Set up Supabase Database
   
   Run the database setup helper:
   ```bash
   Please run the sql in the database-setup.sql file in your supabase project. 
   ```
   This project is limited to 4 technologies, so we can only use SQL to initialize the database.

   The database-setup.sql file will:
   - Show you the SQL scripts you need to run
   - Provide a direct link to your Supabase SQL editor
   - Guide you through running both the table setup and RLS policies

### 7. Configure Clerk JWT Template for Supabase RLS

**Important:** Be sure to follow the steps in the Clerk JWT Template Setup Guide carefully.

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **JWT Templates** in the sidebar
3. Click **New template**
4. Configure the template:
   - **Name**: `supabase` (must match exactly)
   - **Signing algorithm**: `HS256`
   - **Claims**: Add the following JSON:
   ```json
   {
     "aud": "authenticated",
     "role": "authenticated",
     "email": "{{user.primary_email_address}}",
     "user_id": "{{user.id}}",
     "tier": "{{user.public_metadata.tier}}"
   }
   ```
   - **Signing key**: Your Supabase JWT secret (found in Supabase Settings → API)
5. Save the template
6. Add to environment variables:
   ```env
   NEXT_PUBLIC_CLERK_JWT_TEMPLATE_NAME=supabase
   ```

For detailed instructions, see [docs/clerk-jwt-setup.md](docs/clerk-jwt-setup.md)

### 8. Environment Variables

Create a `.env.local` file in the root directory and add all the environment variables from `.env.example`:

```bash
cp .env.example .env.local
```

Then fill in your actual values.

### 9. Run the Development Server

```bash
npm run dev

```

Open [http://localhost:3050](http://localhost:3050) to see the application.

## Demo Credentials & Testing

### Testing Different Tiers

1. **Sign up** for a new account (you'll start with the Free tier)
2. Navigate to the **Dashboard**
3. Use the **"Simulate Tier Upgrade"** feature to test different tiers
4. Visit the **Events** page to see how accessible events change based on your tier

### Tier Access Levels

- **Free**: Access to 2 community events
- **Silver**: Access to 4 events (Free + Silver events)
- **Gold**: Access to 6 events (Free + Silver + Gold events)
- **Platinum**: Access to all 8 events

## Project Structure

```
Tierpass/
├── app/                    # Next.js app router
│   ├── _components/       # App-specific components
│   │   ├── EventCard.tsx
│   │   ├── EventCardSkeleton.tsx
│   │   └── TierUpgradeSimulator.tsx
│   ├── api/               # API routes
│   │   └── update-tier/   # Tier update endpoint
│   ├── dashboard/         # Dashboard page
│   ├── events/            # Events listing page
│   ├── fonts/             # Local font files
│   ├── sign-in/           # Sign in page
│   ├── sign-up/           # Sign up page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with Lexend font
│   └── page.tsx           # Home page
├── docs/                  # Documentation
│   └── clerk-jwt-setup.md # JWT configuration guide
├── lib/                   # Utility functions and services
│   ├── services/          # Business logic
│   │   └── events.ts      # Event service functions
│   └── supabase/          # Supabase client configuration
│       ├── client.ts      # Browser client
│       ├── server.ts      # Server client
│       └── types.ts       # TypeScript types
├── scripts/               # Helper scripts
│   └── setup-database.js  # Database setup helper
├── supabase/              # Database SQL files
│   ├── database-setup.sql # Combined setup (schema + RLS)
│   └── setup.sql          # Legacy setup file
├── public/                # Static assets
├── middleware.ts          # Clerk auth middleware
├── tailwind.config.js     # Tailwind configuration
├── package.json           # Dependencies
└── .env.example           # Environment variables template
```

## Key Features Implementation

### Authentication Flow
- Clerk handles all authentication
- Protected routes redirect to sign-in if not authenticated
- User metadata stores the tier information

### Tier-Based Filtering
- Events are filtered server-side based on user tier
- Each tier includes access to all lower tiers
- Visual indicators show locked/unlocked events

### Database Schema
```sql
CREATE TYPE tier_type AS ENUM ('free', 'silver', 'gold', 'platinum');

CREATE TABLE events (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  event_date TIMESTAMP,
  image_url VARCHAR(255),
  tier tier_type,
  created_at TIMESTAMP
);
```

## License
MIT License


