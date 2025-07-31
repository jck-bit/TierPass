-- Create tier enum type
CREATE TYPE tier_type AS ENUM ('free', 'silver', 'gold', 'platinum');

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    image_url TEXT NOT NULL,
    tier tier_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Public can read events" ON events
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Seed the table with sample events (2 per tier)
INSERT INTO events (title, description, event_date, image_url, tier) VALUES
    -- Free tier events
    ('Community Meetup', 'Join us for our monthly community gathering to network and share ideas with fellow enthusiasts.', '2025-08-15 18:00:00+00', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 'free'),
    ('Introduction to Web Development', 'A beginner-friendly workshop covering the basics of HTML, CSS, and JavaScript.', '2025-08-20 14:00:00+00', 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800', 'free'),
    
    -- Silver tier events
    ('Advanced React Patterns', 'Deep dive into advanced React patterns including custom hooks, context optimization, and performance techniques.', '2025-08-10 16:00:00+00', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800', 'silver'),
    ('Database Design Masterclass', 'Learn professional database design principles, normalization, and optimization strategies.', '2025-08-25 15:00:00+00', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800', 'silver'),
    
    -- Gold tier events
    ('AI & Machine Learning Summit', 'Exclusive summit featuring industry leaders discussing the latest in AI and ML technologies.', '2025-08-05 09:00:00+00', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800', 'gold'),
    ('Cloud Architecture Workshop', 'Hands-on workshop on designing scalable cloud solutions with AWS, Azure, and GCP experts.', '2025-08-18 10:00:00+00', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800', 'gold'),
    
    -- Platinum tier events
    ('Executive Tech Leadership Forum', 'Invitation-only forum for C-level executives to discuss digital transformation strategies.', '2025-08-08 13:00:00+00', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800', 'platinum'),
    ('VIP Startup Accelerator Pitch Day', 'Exclusive access to top startup pitches with networking opportunities with venture capitalists.', '2025-08-22 11:00:00+00', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800', 'platinum');
