import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Category {
  category: string;
  amount: string;
  percentage: number;
}

interface BudgetDonutChartProps {
  categories: Category[];
}

const COLORS = [
  '#393CA0', '#F59E42', '#4ADE80', '#F472B6', '#60A5FA', '#F87171', '#A78BFA', '#FBBF24', '#34D399', '#818CF8'
];

export default function BudgetDonutChart({ categories }: BudgetDonutChartProps) {
  // Convert amount to number for value
  const parseAmount = (amount: string | number) => Number(String(amount).replace(/[^\d.]/g, '')) || 0;
  // Sort categories by value descending
  const sorted = [...categories].sort((a, b) => parseAmount(b.amount) - parseAmount(a.amount));
  // Show top 5, group rest as 'Other'
  const top = sorted.slice(0, 5);
  const rest = sorted.slice(5);
  const otherValue = rest.reduce((sum, cat) => sum + parseAmount(cat.amount), 0);
  const otherPercent = rest.reduce((sum, cat) => sum + (cat.percentage || 0), 0);
  const data = [
    ...top.map((cat) => ({
      name: cat.category,
      value: parseAmount(cat.amount),
      percentage: cat.percentage,
      amount: cat.amount,
    })),
    ...(rest.length > 0 ? [{ name: 'Other', value: otherValue, percentage: otherPercent, amount: otherValue }] : [])
  ];
  const COLORS_EXT = [...COLORS, '#A3A3A3'];

  return (
    <div className="w-full h-full min-h-[300px] min-w-[300px] flex items-center justify-center overflow-visible">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#393CA0"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.name === 'Other' ? '#A3A3A3' : COLORS_EXT[index % COLORS_EXT.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number, name: string, props) => {
              const entry = data.find(d => d.name === name);
              return [`$${parseAmount(entry?.amount).toLocaleString()} (${(entry?.percentage || 0).toFixed(1)}%)`, name];
            }} />
          </PieChart>
        </ResponsiveContainer>
    </div>
  );
} 