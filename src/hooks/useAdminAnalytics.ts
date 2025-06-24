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

      // Daily Active Users (users with messages today)
      const { count: dau } = await supabase
        .from('messages')
        .select('user_id', { count: 'exact', head: true })
        .gte('created_at', today);

      // Weekly Active Users
      const { count: wau } = await supabase
        .from('messages')
        .select('user_id', { count: 'exact', head: true })
        .gte('created_at', weekAgo);

      // Activation Rate (users who created a workspace)
      const { count: activatedUsers } = await supabase
        .from('workspace_members')
        .select('user_id', { count: 'exact', head: true });

      const activationRate = totalUsers ? (activatedUsers || 0) / totalUsers * 100 : 0;

      // Top Features Used (based on message reactions)
      const { data: featureData } = await supabase
        .from('message_reactions')
        .select('emoji')
        .gte('created_at', filterDate);

      const featureCounts = featureData?.reduce((acc, event) => {
        acc[event.emoji] = (acc[event.emoji] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const topFeatures = Object.entries(featureCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([feature, count]) => ({ feature, count }));

      // Retention Rates (optimized calculation)
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('id, created_at')
        .gte('created_at', getDateFilter(30));

      let day1Retention = 0, day7Retention = 0, day30Retention = 0;

      if (recentUsers && recentUsers.length > 0) {
        // Get all user activities in a single query
        const { data: userActivities } = await supabase
          .from('messages')
          .select('user_id, created_at')
          .in('user_id', recentUsers.map(user => user.id))
          .gte('created_at', getDateFilter(30));

        // Process activities in memory
        const userActivityMap = new Map<string, Set<string>>();

        userActivities?.forEach(activity => {
          const date = new Date(activity.created_at).toISOString().split('T')[0];
          if (!userActivityMap.has(activity.user_id)) {
            userActivityMap.set(activity.user_id, new Set());
          }
          userActivityMap.get(activity.user_id)?.add(date);
        });

        // Calculate retention rates
        for (const user of recentUsers) {
          const userCreated = new Date(user.created_at);
          const userCreatedDate = userCreated.toISOString().split('T')[0];

          const day1After = new Date(userCreated);
          day1After.setDate(day1After.getDate() + 1);
          const day1AfterDate = day1After.toISOString().split('T')[0];

          const day7After = new Date(userCreated);
          day7After.setDate(day7After.getDate() + 7);
          const day7AfterDate = day7After.toISOString().split('T')[0];

          const day30After = new Date(userCreated);
          day30After.setDate(day30After.getDate() + 30);
          const day30AfterDate = day30After.toISOString().split('T')[0];

          const userDates = userActivityMap.get(user.id) || new Set();

          // Check if user was active on these dates
          if (userDates.has(day1AfterDate)) day1Retention++;
          if (userDates.has(day7AfterDate)) day7Retention++;
          if (userDates.has(day30AfterDate)) day30Retention++;
        }

        // Calculate percentages
        day1Retention = (day1Retention / recentUsers.length) * 100;
        day7Retention = (day7Retention / recentUsers.length) * 100;
        day30Retention = (day30Retention / recentUsers.length) * 100;
      }

      // Session Frequency (based on message frequency)
      const { data: messagesData } = await supabase
        .from('messages')
        .select('user_id')
        .gte('created_at', getDateFilter(7));

      const userMessageCounts = messagesData?.reduce((acc, message) => {
        acc[message.user_id] = (acc[message.user_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const sessionFrequency = Object.keys(userMessageCounts).length > 0
        ? Object.values(userMessageCounts).reduce((a, b) => a + b, 0) / Object.keys(userMessageCounts).length
        : 0;

      // Most Active Users
      const { data: activeUsersData } = await supabase
        .from('messages')
        .select('user_id, profiles!inner(email)')
        .gte('created_at', getDateFilter(7));

      const userActivityCounts = activeUsersData?.reduce((acc, message) => {
        const userId = message.user_id;
        if (!acc[userId]) {
          acc[userId] = {
            id: userId,
            email: (message.profiles as any)?.email || 'Unknown',
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
