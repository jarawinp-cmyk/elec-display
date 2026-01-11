-- Quick Setup Script for Election Dashboard
-- Run this in Supabase SQL Editor

-- 1. Create table
CREATE TABLE IF NOT EXISTS election_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  village_number INT NOT NULL CHECK (village_number BETWEEN 1 AND 7),
  ballot_type VARCHAR(10) NOT NULL CHECK (ballot_type IN ('mayor', 'member')),
  candidate_number INT NOT NULL,
  votes INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(village_number, ballot_type, candidate_number)
);

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_village_ballot ON election_results(village_number, ballot_type);
CREATE INDEX IF NOT EXISTS idx_ballot_type ON election_results(ballot_type);

-- 3. Enable RLS
ALTER TABLE election_results ENABLE ROW LEVEL SECURITY;

-- 4. Create policies for public access (demo purposes)
DROP POLICY IF EXISTS "Allow public read access" ON election_results;
DROP POLICY IF EXISTS "Allow public insert/update" ON election_results;

CREATE POLICY "Allow public read access"
  ON election_results
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert/update"
  ON election_results
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- 5. Seed data - Mayor (Pink Ballot)
INSERT INTO election_results (village_number, ballot_type, candidate_number, votes) VALUES
  (1, 'mayor', 1, 0), (1, 'mayor', 2, 0), (1, 'mayor', 98, 0), (1, 'mayor', 99, 0),
  (2, 'mayor', 1, 0), (2, 'mayor', 2, 0), (2, 'mayor', 98, 0), (2, 'mayor', 99, 0),
  (3, 'mayor', 1, 0), (3, 'mayor', 2, 0), (3, 'mayor', 98, 0), (3, 'mayor', 99, 0),
  (4, 'mayor', 1, 0), (4, 'mayor', 2, 0), (4, 'mayor', 98, 0), (4, 'mayor', 99, 0),
  (5, 'mayor', 1, 0), (5, 'mayor', 2, 0), (5, 'mayor', 98, 0), (5, 'mayor', 99, 0),
  (6, 'mayor', 1, 0), (6, 'mayor', 2, 0), (6, 'mayor', 98, 0), (6, 'mayor', 99, 0),
  (7, 'mayor', 1, 0), (7, 'mayor', 2, 0), (7, 'mayor', 98, 0), (7, 'mayor', 99, 0)
ON CONFLICT (village_number, ballot_type, candidate_number) DO NOTHING;

-- 6. Seed data - Member (Green Ballot)
INSERT INTO election_results (village_number, ballot_type, candidate_number, votes) VALUES
  (1, 'member', 1, 0), (1, 'member', 2, 0), (1, 'member', 98, 0), (1, 'member', 99, 0),
  (2, 'member', 1, 0), (2, 'member', 2, 0), (2, 'member', 98, 0), (2, 'member', 99, 0),
  (3, 'member', 1, 0), (3, 'member', 2, 0), (3, 'member', 98, 0), (3, 'member', 99, 0),
  (4, 'member', 1, 0), (4, 'member', 2, 0), (4, 'member', 98, 0), (4, 'member', 99, 0),
  (5, 'member', 1, 0), (5, 'member', 2, 0), (5, 'member', 98, 0), (5, 'member', 99, 0),
  (6, 'member', 1, 0), (6, 'member', 2, 0), (6, 'member', 98, 0), (6, 'member', 99, 0),
  (7, 'member', 1, 0), (7, 'member', 2, 0), (7, 'member', 98, 0), (7, 'member', 99, 0)
ON CONFLICT (village_number, ballot_type, candidate_number) DO NOTHING;

-- 7. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE election_results;

-- Done! You should now have 56 rows in the election_results table.
