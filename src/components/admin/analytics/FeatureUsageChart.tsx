
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface FeatureUsageChartProps {
  data: Array<{ feature: string; count: number }>;
}

export function FeatureUsageChart({ data }: FeatureUsageChartProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Top Features Used</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis 
              type="category" 
              dataKey="feature" 
              tick={{ fontSize: 12 }}
              width={100}
            />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
