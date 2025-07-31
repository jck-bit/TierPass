# Tier-Based Event Showcase

A responsive web application that showcases events based on user membership tiers. Built with Next.js 14 (App Router), Clerk.dev for authentication, Supabase for database, and Tailwind CSS for styling.

## Features

- 🔐 **Secure Authentication** - User authentication powered by Clerk.dev
- 🎫 **Tier-Based Access** - Four membership tiers (Free, Silver, Gold, Platinum)
- 📅 **Event Management** - Browse events filtered by your membership tier
- 📱 **Responsive Design** - Beautiful, mobile-friendly UI with Tailwind CSS
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
git clone <repository-url>
cd my-clerk-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Clerk.dev

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

### 4. Set Up Supabase

1. Create a new project in [Supabase Dashboard](https://app.supabase.com/)
2. Copy your project URL and anon key
3. Add to environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. **Set up Supabase Database**
   
   Run the database setup helper:
   ```bash
   npm run setup:db
   ```
   
   This will:
   - Show you the SQL scripts you need to run
   - Provide a direct link to your Supabase SQL editor
   - Guide you through running both the table setup and RLS policies

### 6. Configure Clerk JWT Template

**Important:** This step is required for Supabase RLS integration.

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

### 6. Environment Variables

Create a `.env.local` file in the root directory and add all the environment variables from `.env.example`:

```bash
cp .env.example .env.local
```

Then fill in your actual values.

### 7. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

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
my-clerk-app/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── events/            # Events listing page
│   ├── sign-in/           # Sign in page
│   ├── sign-up/           # Sign up page
│   └── layout.tsx         # Root layout with Clerk provider
├── components/            # Reusable React components
│   ├── EventCard.tsx      # Event card component
│   └── TierUpgradeSimulator.tsx  # Tier simulation component
├── lib/                   # Utility functions and services
│   ├── services/          # Business logic
│   └── supabase/          # Supabase client configuration
├── supabase/              # Database setup
│   └── setup.sql          # SQL schema and seed data
└── public/                # Static assets
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

## Deployment

### Prerequisites for Deployment

1. Complete all local setup steps
2. Ensure Clerk JWT template is configured (see [JWT Setup Guide](docs/clerk-jwt-setup.md))
3. Verify Supabase RLS policies are applied
4. Test locally with different user tiers

### Deploy to Vercel

1. **Prepare your repository**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository containing your project

3. **Configure Environment Variables**
   
   Add ALL the following environment variables in Vercel project settings:

   **Clerk Variables:**
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
   CLERK_SECRET_KEY=<your_clerk_secret_key>
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
   NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/dashboard
   NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
   ```

   **Supabase Variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=<your_supabase_project_url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
   ```

   **JWT Template Variable:**
   ```
   NEXT_PUBLIC_CLERK_JWT_TEMPLATE_NAME=supabase
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Post-Deployment Checklist

1. **Update Clerk Settings**
   - Add your production URL to Clerk allowed origins
   - Update redirect URLs if needed

2. **Test Production**
   - Sign up with a new account
   - Test tier upgrade simulation
   - Verify events are filtered correctly
   - Check that RLS policies are working

3. **Monitor**
   - Check Vercel logs for any errors
   - Monitor Supabase dashboard for RLS policy violations
   - Review Clerk dashboard for authentication issues

### Troubleshooting Deployment

**JWT Token Issues:**
- Ensure JWT template name matches exactly in Clerk Dashboard and env vars
- Verify Supabase JWT secret is correctly set in Clerk JWT template
- Check browser console for JWT-related errors

**RLS Policy Issues:**
- Verify RLS policies are enabled in Supabase
- Check that JWT claims include user tier
- Test with Supabase SQL editor to debug policies

**Build Errors:**
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors with `npm run build` locally
- Verify all environment variables are set in Vercel

## Development Tips

1. **Testing Tiers**: Use the dashboard's tier simulator to quickly test different access levels
2. **Adding Events**: Add new events via Supabase dashboard or SQL editor
3. **Customizing Tiers**: Modify tier definitions in `lib/services/events.ts`
4. **Styling**: All components use Tailwind CSS classes for easy customization

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**: 
   - Ensure all dependencies are installed
   - Check import paths use correct aliases (@/...)

2. **Supabase connection issues**:
   - Verify environment variables are set correctly
   - Check if the database tables were created

3. **Clerk authentication issues**:
   - Ensure Clerk API keys are correct
   - Check redirect URLs match your configuration

## Future Enhancements

- [ ] Payment integration for real tier upgrades
- [ ] Event registration system
- [ ] Email notifications for new events
- [ ] Admin panel for event management
- [ ] Advanced filtering and search
- [ ] User profiles and event history

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the [troubleshooting](#troubleshooting) section
- Create an issue in the repository
- Contact support for Clerk or Supabase specific issues
