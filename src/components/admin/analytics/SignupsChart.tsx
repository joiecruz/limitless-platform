
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SignupsChartProps {
  data: Array<{ date: string; count: number }>;
}

export function SignupsChart({ data }: SignupsChartProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Signups Over Time</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              labelFormatter={(value) => {
                const date = new Date(value as string);
                return date.toLocaleDateString();
              }}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#8884d8" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
