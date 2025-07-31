# Clerk JWT Template Setup Guide

## Step 1: Create JWT Template in Clerk Dashboard

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **JWT Templates** in the sidebar
3. Click **New template**
4. Configure the template:
   - **Name**: `supabase` (important: use this exact name)
   - **Signing algorithm**: `HS256` (required for Supabase)
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

5. **Signing key**: Copy your Supabase JWT secret from:
   - Go to your Supabase Dashboard
   - Navigate to Settings → API
   - Copy the JWT Secret
   - Paste it in the Clerk JWT template signing key field

6. Save the template

## Step 2: Update Environment Variables

Add the following to your `.env.local`:

```bash
# Clerk JWT Template Name
NEXT_PUBLIC_CLERK_JWT_TEMPLATE_NAME=supabase
```

## Step 3: Verify JWT Claims

After setup, your JWT will include:
- `email`: User's email address
- `user_id`: Clerk user ID
- `tier`: User's tier from public metadata (free, silver, gold, platinum)

## Important Notes

- The JWT template name must match exactly when requesting tokens
- The signing key must be your Supabase JWT secret
- The algorithm MUST be HS256 for Supabase compatibility
- Make sure users have `tier` in their public metadata

## Testing

1. Sign in to your app
2. Check browser DevTools → Application → Cookies
3. Decode the session JWT to verify claims
4. Test RLS policies with different tier users
