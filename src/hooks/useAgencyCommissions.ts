import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Client Supabase pour les tables externes (agency_commissions)
const EXTERNAL_SUPABASE_URL = 'https://xpxbxfuckljqdvkajlmx.supabase.co';
const EXTERNAL_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhweGJ4ZnVja2xqcWR2a2FqbG14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyODc4MDMsImV4cCI6MjA2MTg2MzgwM30.7NKWDfbBdCzvH39BrZBUopr12V_bKUqnNI-OdR-MdIs';

const externalSupabase = createClient(EXTERNAL_SUPABASE_URL, EXTERNAL_SUPABASE_ANON_KEY);

interface AgencyCommission {
  id: string;
  power_kwc: number;
  commission_commercial: number;
  commission_super_regie: number;
}

export function useAgencyCommissions() {
  const [commissions, setCommissions] = useState<AgencyCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCommissions() {
      try {
        const { data, error } = await externalSupabase
          .from('agency_commissions')
          .select('*')
          .order('power_kwc');

        if (error) throw error;

        setCommissions(data);
      } catch (err) {
        console.error('Error fetching commissions:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch commissions');
      } finally {
        setLoading(false);
      }
    }

    fetchCommissions();
  }, []);

  return { commissions, loading, error };
}