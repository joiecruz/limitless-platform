
import { useState } from "react";
import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";
import { MetricCard } from "@/components/admin/analytics/MetricCard";
import { SignupsChart } from "@/components/admin/analytics/SignupsChart";
import { FeatureUsageChart } from "@/components/admin/analytics/FeatureUsageChart";
import { RetentionChart } from "@/components/admin/analytics/RetentionChart";
import { ActiveUsersTable } from "@/components/admin/analytics/ActiveUsersTable";
import { DateFilter } from "@/components/admin/analytics/DateFilter";
import { Loader2, Users, UserPlus, Activity, TrendingUp, Target, Clock } from "lucide-react";

export default function AdminDashboard() {
  const [dateFilter, setDateFilter] = useState("7d");
  const { data: analytics, isLoading } = useAdminAnalytics(dateFilter);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">Failed to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <DateFilter value={dateFilter} onChange={setDateFilter} />
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={analytics.totalUsers.toLocaleString()}
          subtitle="Registered accounts"
          icon={<Users className="h-5 w-5" />}
        />

        <MetricCard
          title="Daily Active Users"
          value={analytics.activeUsers.dau.toLocaleString()}
          subtitle={`WAU: ${analytics.activeUsers.wau.toLocaleString()}`}
          icon={<Activity className="h-5 w-5" />}
        />

        <MetricCard
          title="Activation Rate"
          value={`${analytics.activationRate.toFixed(1)}%`}
          subtitle="Users who created projects"
          icon={<Target className="h-5 w-5" />}
        />

        <MetricCard
          title="Avg Sessions/User"
          value={analytics.sessionFrequency.toFixed(1)}
          subtitle="Last 7 days"
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      {/* New Signups Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="New Signups Today"
          value={analytics.newSignups.daily.toLocaleString()}
          icon={<UserPlus className="h-5 w-5" />}
        />

        <MetricCard
          title="New Signups This Week"
          value={analytics.newSignups.weekly.toLocaleString()}
          icon={<UserPlus className="h-5 w-5" />}
        />

        <MetricCard
          title="New Signups This Month"
          value={analytics.newSignups.monthly.toLocaleString()}
          icon={<UserPlus className="h-5 w-5" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SignupsChart data={analytics.signupsOverTime} />
        <FeatureUsageChart data={analytics.topFeatures} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RetentionChart data={analytics.retentionRates} />
        <ActiveUsersTable users={analytics.mostActiveUsers} />
      </div>
    </div>
  );
}
