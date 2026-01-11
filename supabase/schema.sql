-- Schema for Tambon Tham-nop Election Dashboard
-- Real-time election results tracking for 7 villages

-- Enable real-time functionality
-- Run this in Supabase SQL Editor after creating the table:
-- alter publication supabase_realtime add table election_results;

-- Main table to store vote counts
CREATE TABLE IF NOT EXISTS election_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  village_number INT NOT NULL CHECK (village_number BETWEEN 1 AND 7),
  ballot_type VARCHAR(10) NOT NULL CHECK (ballot_type IN ('mayor', 'member')),
  candidate_number INT NOT NULL,
  votes INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Unique constraint: one record per village-ballot-candidate combination
  UNIQUE(village_number, ballot_type, candidate_number)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_village_ballot ON election_results(village_number, ballot_type);
CREATE INDEX IF NOT EXISTS idx_ballot_type ON election_results(ballot_type);

-- Enable Row Level Security (RLS)
ALTER TABLE election_results ENABLE ROW LEVEL SECURITY;

-- Policy: Allow everyone to read results (for dashboard)
CREATE POLICY "Allow public read access"
  ON election_results
  FOR SELECT
  TO public
  USING (true);

-- Policy: Allow authenticated users to insert/update votes (for observers)
-- If you want to allow public updates (for demo), use this:
CREATE POLICY "Allow public insert/update"
  ON election_results
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Function to increment votes (safer than direct updates)
CREATE OR REPLACE FUNCTION increment_votes(
  p_village_number INT,
  p_ballot_type VARCHAR,
  p_candidate_number INT,
  p_increment INT DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO election_results (village_number, ballot_type, candidate_number, votes, updated_at)
  VALUES (p_village_number, p_ballot_type, p_candidate_number, p_increment, NOW())
  ON CONFLICT (village_number, ballot_type, candidate_number)
  DO UPDATE SET
    votes = election_results.votes + p_increment,
    updated_at = NOW();
END;
$$;

-- Function to reset all votes (for testing)
CREATE OR REPLACE FUNCTION reset_all_votes()
RETURNS void
LANGUAGE sql
AS $$
  DELETE FROM election_results;
$$;

-- Seed initial data (all candidates start with 0 votes)
-- Mayor candidates (Pink Ballot) - 2 candidates across all 7 villages
INSERT INTO election_results (village_number, ballot_type, candidate_number, votes) VALUES
  -- Village 1
  (1, 'mayor', 1, 0), -- ABC
  (1, 'mayor', 2, 0), -- DEF
  (1, 'mayor', 98, 0), -- Invalid ballots
  (1, 'mayor', 99, 0), -- No vote
  -- Village 2
  (2, 'mayor', 1, 0),
  (2, 'mayor', 2, 0),
  (2, 'mayor', 98, 0),
  (2, 'mayor', 99, 0),
  -- Village 3
  (3, 'mayor', 1, 0),
  (3, 'mayor', 2, 0),
  (3, 'mayor', 98, 0),
  (3, 'mayor', 99, 0),
  -- Village 4
  (4, 'mayor', 1, 0),
  (4, 'mayor', 2, 0),
  (4, 'mayor', 98, 0),
  (4, 'mayor', 99, 0),
  -- Village 5
  (5, 'mayor', 1, 0),
  (5, 'mayor', 2, 0),
  (5, 'mayor', 98, 0),
  (5, 'mayor', 99, 0),
  -- Village 6
  (6, 'mayor', 1, 0),
  (6, 'mayor', 2, 0),
  (6, 'mayor', 98, 0),
  (6, 'mayor', 99, 0),
  -- Village 7
  (7, 'mayor', 1, 0),
  (7, 'mayor', 2, 0),
  (7, 'mayor', 98, 0),
  (7, 'mayor', 99, 0)
ON CONFLICT (village_number, ballot_type, candidate_number) DO NOTHING;

-- Member candidates (Green Ballot) - 2 candidates per village
INSERT INTO election_results (village_number, ballot_type, candidate_number, votes) VALUES
  -- Village 1
  (1, 'member', 1, 0),
  (1, 'member', 2, 0),
  (1, 'member', 98, 0),
  (1, 'member', 99, 0),
  -- Village 2
  (2, 'member', 1, 0),
  (2, 'member', 2, 0),
  (2, 'member', 98, 0),
  (2, 'member', 99, 0),
  -- Village 3
  (3, 'member', 1, 0),
  (3, 'member', 2, 0),
  (3, 'member', 98, 0),
  (3, 'member', 99, 0),
  -- Village 4
  (4, 'member', 1, 0),
  (4, 'member', 2, 0),
  (4, 'member', 98, 0),
  (4, 'member', 99, 0),
  -- Village 5
  (5, 'member', 1, 0),
  (5, 'member', 2, 0),
  (5, 'member', 98, 0),
  (5, 'member', 99, 0),
  -- Village 6
  (6, 'member', 1, 0),
  (6, 'member', 2, 0),
  (6, 'member', 98, 0),
  (6, 'member', 99, 0),
  -- Village 7
  (7, 'member', 1, 0),
  (7, 'member', 2, 0),
  (7, 'member', 98, 0),
  (7, 'member', 99, 0)
ON CONFLICT (village_number, ballot_type, candidate_number) DO NOTHING;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION increment_votes TO public;
GRANT EXECUTE ON FUNCTION reset_all_votes TO public;

-- IMPORTANT: After running this schema, enable real-time in Supabase Dashboard:
-- 1. Go to Database > Replication
-- 2. Add 'election_results' table to the publication
-- Or run: alter publication supabase_realtime add table election_results;
