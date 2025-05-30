
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

export const useAdminAnalytics = (dateFilter: string = "7d") => {
  return useQuery({
    queryKey: ['admin-analytics', dateFilter],
    queryFn: async (): Promise<AnalyticsMetrics> => {
      const now = new Date();
      const getDateFilter = (days: number) => {
        const date = new Date(now);
        date.setDate(date.getDate() - days);
        return date.toISOString();
      };

      // Get date ranges based on filter
      const dateRanges = {
        "1d": getDateFilter(1),
        "7d": getDateFilter(7),
        "30d": getDateFilter(30),
        "90d": getDateFilter(90)
      };

      const filterDate = dateRanges[dateFilter as keyof typeof dateRanges] || dateRanges["7d"];

      // Total Users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // New Signups
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = getDateFilter(7).split('T')[0];
      const monthAgo = getDateFilter(30).split('T')[0];

      const [dailySignups, weeklySignups, monthlySignups] = await Promise.all([
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today),
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', weekAgo),
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', monthAgo)
      ]);

      // Daily Active Users (users with events today)
      const { count: dau } = await supabase
        .from('events')
        .select('user_id', { count: 'exact', head: true })
        .gte('timestamp', today);

      // Weekly Active Users
      const { count: wau } = await supabase
        .from('events')
        .select('user_id', { count: 'exact', head: true })
        .gte('timestamp', weekAgo);

      // Activation Rate (users who created a project)
      const { count: activatedUsers } = await supabase
        .from('events')
        .select('user_id', { count: 'exact', head: true })
        .eq('event_type', 'project_created');

      const activationRate = totalUsers ? (activatedUsers || 0) / totalUsers * 100 : 0;

      // Top Features Used
      const { data: featureData } = await supabase
        .from('events')
        .select('event_type')
        .gte('timestamp', filterDate);

      const featureCounts = featureData?.reduce((acc, event) => {
        acc[event.event_type] = (acc[event.event_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const topFeatures = Object.entries(featureCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([feature, count]) => ({ feature, count }));

      // Retention Rates (simplified calculation)
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('id, created_at')
        .gte('created_at', getDateFilter(30));

      let day1Retention = 0, day7Retention = 0, day30Retention = 0;

      if (recentUsers && recentUsers.length > 0) {
        for (const user of recentUsers) {
          const userCreated = new Date(user.created_at);
          const day1After = new Date(userCreated);
          day1After.setDate(day1After.getDate() + 1);
          
          const day7After = new Date(userCreated);
          day7After.setDate(day7After.getDate() + 7);
          
          const day30After = new Date(userCreated);
          day30After.setDate(day30After.getDate() + 30);

          // Check if user was active on these dates
          const { count: day1Activity } = await supabase
            .from('events')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('timestamp', day1After.toISOString())
            .lt('timestamp', new Date(day1After.getTime() + 24 * 60 * 60 * 1000).toISOString());

          const { count: day7Activity } = await supabase
            .from('events')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('timestamp', day7After.toISOString());

          const { count: day30Activity } = await supabase
            .from('events')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('timestamp', day30After.toISOString());

          if (day1Activity && day1Activity > 0) day1Retention++;
          if (day7Activity && day7Activity > 0) day7Retention++;
          if (day30Activity && day30Activity > 0) day30Retention++;
        }

        day1Retention = (day1Retention / recentUsers.length) * 100;
        day7Retention = (day7Retention / recentUsers.length) * 100;
        day30Retention = (day30Retention / recentUsers.length) * 100;
      }

      // Session Frequency
      const { data: sessionsData } = await supabase
        .from('sessions')
        .select('user_id')
        .gte('started_at', getDateFilter(7));

      const userSessionCounts = sessionsData?.reduce((acc, session) => {
        acc[session.user_id] = (acc[session.user_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const sessionFrequency = Object.keys(userSessionCounts).length > 0 
        ? Object.values(userSessionCounts).reduce((a, b) => a + b, 0) / Object.keys(userSessionCounts).length 
        : 0;

      // Most Active Users
      const { data: activeUsersData } = await supabase
        .from('events')
        .select('user_id, profiles!inner(email)')
        .gte('timestamp', getDateFilter(7));

      const userActivityCounts = activeUsersData?.reduce((acc, event) => {
        const userId = event.user_id;
        if (!acc[userId]) {
          acc[userId] = {
            id: userId,
            email: (event.profiles as any)?.email || 'Unknown',
            actionCount: 0
          };
        }
        acc[userId].actionCount++;
        return acc;
      }, {} as Record<string, { id: string; email: string; actionCount: number }>) || {};

      const mostActiveUsers = Object.values(userActivityCounts)
        .sort((a, b) => b.actionCount - a.actionCount)
        .slice(0, 10);

      // Signups Over Time
      const { data: signupData } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', filterDate)
        .order('created_at');

      const signupsByDate = signupData?.reduce((acc, profile) => {
        const date = new Date(profile.created_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const signupsOverTime = Object.entries(signupsByDate)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date, count }));

      return {
        totalUsers: totalUsers || 0,
        newSignups: {
          daily: dailySignups.count || 0,
          weekly: weeklySignups.count || 0,
          monthly: monthlySignups.count || 0
        },
        activeUsers: {
          dau: dau || 0,
          wau: wau || 0
        },
        activationRate,
        topFeatures,
        retentionRates: {
          day1: day1Retention,
          day7: day7Retention,
          day30: day30Retention
        },
        sessionFrequency,
        mostActiveUsers,
        signupsOverTime
      };
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};
