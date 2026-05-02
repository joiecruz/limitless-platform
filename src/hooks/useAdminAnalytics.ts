import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsMetrics {
  totalUsers: number;
  newSignups: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  activeUsers: {
    dau: number;
    wau: number;
  };
  activationRate: number;
  topFeatures: Array<{ feature: string; count: number }>;
  retentionRates: {
    day1: number;
    day7: number;
    day30: number;
  };
  sessionFrequency: number;
  mostActiveUsers: Array<{
    id: string;
    email: string;
    actionCount: number;
  }>;
  signupsOverTime: Array<{
    date: string;
    count: number;
  }>;
}

const FILTER_TO_DAYS: Record<string, number> = {
  "1d": 1,
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

/**
 * Fetches the admin analytics dashboard via a single SECURITY DEFINER RPC.
 *
 * This previously pulled entire `sessions`, `messages`, and `profiles`
 * tables into the browser to compute counts. The aggregation is now done
 * in Postgres and returned as one small JSON payload.
 */
export const useAdminAnalytics = (dateFilter: string = "7d") => {
  const days = FILTER_TO_DAYS[dateFilter] ?? 7;

  return useQuery<AnalyticsMetrics>({
    queryKey: ["admin-analytics", days],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_admin_analytics", {
        days_back: days,
      });

      if (error) throw error;
      return data as unknown as AnalyticsMetrics;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
