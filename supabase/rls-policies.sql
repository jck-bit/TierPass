-- Enable Row Level Security on the events table
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Function to get user tier from JWT claims
CREATE OR REPLACE FUNCTION public.get_user_tier()
RETURNS tier_enum AS $$
DECLARE
  user_tier text;
BEGIN
  -- Extract tier from JWT claims
  user_tier := current_setting('request.jwt.claims', true)::json->>'tier';
  
  -- Default to 'free' if no tier is found
  IF user_tier IS NULL THEN
    RETURN 'free'::tier_enum;
  END IF;
  
  -- Return the tier as enum
  RETURN user_tier::tier_enum;
EXCEPTION
  WHEN OTHERS THEN
    -- Default to 'free' on any error
    RETURN 'free'::tier_enum;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if a user can access an event based on tier
CREATE OR REPLACE FUNCTION can_access_event(event_tier tier_type, user_tier tier_type)
RETURNS BOOLEAN AS $$
BEGIN
  -- Define tier hierarchy: free < silver < gold < platinum
  CASE user_tier
    WHEN 'platinum' THEN RETURN true; -- Platinum can access all events
    WHEN 'gold' THEN RETURN event_tier IN ('free', 'silver', 'gold');
    WHEN 'silver' THEN RETURN event_tier IN ('free', 'silver');
    WHEN 'free' THEN RETURN event_tier = 'free';
    ELSE RETURN false;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Policy for SELECT: Users can only see events at or below their tier
CREATE POLICY "Users can view events based on tier"
  ON events
  FOR SELECT
  TO authenticated
  USING (
    -- Check if the user is authenticated and has a valid JWT
    auth.role() = 'authenticated' AND
    -- Check if the event tier is at or below user's tier
    tier <= get_user_tier()
  );

-- Policy for INSERT: Only allow admins to insert events (optional)
CREATE POLICY "Only admins can insert events" ON events
  FOR INSERT
  WITH CHECK (false); -- Disable inserts through client for now

-- Policy for UPDATE: Only allow admins to update events (optional)
CREATE POLICY "Only admins can update events" ON events
  FOR UPDATE
  USING (false); -- Disable updates through client for now

-- Policy for DELETE: Only allow admins to delete events (optional)
CREATE POLICY "Only admins can delete events" ON events
  FOR DELETE
  USING (false); -- Disable deletes through client for now

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON events TO anon, authenticated;

-- Create an index for better performance on tier-based queries
CREATE INDEX IF NOT EXISTS idx_events_tier ON events(tier);

-- Note: For production use with Clerk, you would need to:
-- 1. Set up a Clerk webhook to sync user metadata to Supabase
-- 2. Create a users table in Supabase to store user tier information
-- 3. Modify the RLS policies to join with the users table
-- 4. Or pass the user's tier in the JWT claims from your backend
