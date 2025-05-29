
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface RetentionChartProps {
  data: {
    day1: number;
    day7: number;
    day30: number;
  };
}

export function RetentionChart({ data }: RetentionChartProps) {
  const chartData = [
    { period: "Day 1", rate: data.day1 },
    { period: "Day 7", rate: data.day7 },
    { period: "Day 30", rate: data.day30 },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">User Retention</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
            <Tooltip formatter={(value) => [`${value}%`, "Retention Rate"]} />
            <Bar dataKey="rate" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
