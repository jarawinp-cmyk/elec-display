// Supabase Client Configuration
import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase URL or Anon Key not found. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper function to subscribe to real-time updates
export const subscribeToElectionResults = (callback) => {
  const channel = supabase
    .channel('election-results-changes')
    .on(
      'postgres_changes',
      {
        event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'election_results',
      },
      (payload) => {
        console.log('Real-time update:', payload);
        callback(payload);
      }
    )
    .subscribe((status) => {
      console.log('Subscription status:', status);
    });

  return channel;
};

// Helper function to fetch all results
export const fetchAllResults = async () => {
  const { data, error } = await supabase
    .from('election_results')
    .select('*')
    .order('village_number', { ascending: true })
    .order('ballot_type', { ascending: true })
    .order('candidate_number', { ascending: true });

  if (error) {
    console.error('Error fetching results:', error);
    return [];
  }

  return data;
};

// Helper function to increment votes
export const incrementVote = async (villageNumber, ballotType, candidateNumber, increment = 1) => {
  // First, fetch current vote count
  const { data: currentData, error: fetchError } = await supabase
    .from('election_results')
    .select('votes')
    .eq('village_number', villageNumber)
    .eq('ballot_type', ballotType)
    .eq('candidate_number', candidateNumber)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    // PGRST116 = no rows returned (which is ok, we'll insert)
    console.error('Error fetching current votes:', fetchError);
    throw fetchError;
  }

  const currentVotes = currentData?.votes || 0;
  const newVotes = currentVotes + increment;

  // Upsert the new vote count
  const { data, error } = await supabase
    .from('election_results')
    .upsert(
      {
        village_number: villageNumber,
        ballot_type: ballotType,
        candidate_number: candidateNumber,
        votes: newVotes,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'village_number,ballot_type,candidate_number',
      }
    )
    .select();

  if (error) {
    console.error('Error incrementing votes:', error);
    throw error;
  }

  return data;
};

// Helper function to update votes directly
export const updateVotes = async (villageNumber, ballotType, candidateNumber, newVoteCount) => {
  const { data, error } = await supabase
    .from('election_results')
    .update({ votes: newVoteCount, updated_at: new Date().toISOString() })
    .eq('village_number', villageNumber)
    .eq('ballot_type', ballotType)
    .eq('candidate_number', candidateNumber)
    .select();

  if (error) {
    console.error('Error updating votes:', error);
    throw error;
  }

  return data;
};

// Helper function to reset all votes (for testing)
export const resetAllVotes = async () => {
  const { error } = await supabase.rpc('reset_all_votes');

  if (error) {
    console.error('Error resetting votes:', error);
    throw error;
  }

  return true;
};
