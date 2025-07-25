import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { WandSparkles } from 'lucide-react';
import BudgetDonutChart from './BudgetDonutChart';
import BudgetBarChart from './BudgetBarChart';

interface BudgetCategory {
  category: string;
  amount: string;
  description: string;
  percentage: number;
}

interface BudgetPlan {
  totalBudget: string;
  categories: BudgetCategory[];
}

interface BudgetTabProps {
  budget: BudgetPlan | null;
  isLoading: boolean;
  isBudgetGenerating: boolean;
  budgetError: string | null;
  onGenerateBudget: () => void;
}

export default function BudgetTab({
  budget,
  isLoading,
  isBudgetGenerating,
  budgetError,
  onGenerateBudget,
}: BudgetTabProps) {
  const [budgetChartType, setBudgetChartType] = useState<'donut' | 'bar'>('donut');

  // Instructional box for Budget tab
  const instructionBox = (
    <div className="flex items-center bg-white border rounded-lg p-6 mb-6 shadow-sm">
      <div className="flex-1">
        <h2 className="text-md font-semibold mb-1">Budget Plan</h2>
        <p className="text-gray-600 text-sm">
          <span className="font-medium text-gray-800">Plan and visualize your project's finances.</span> <br />
          Click <span className="font-semibold">Generate</span> to automatically create a detailed budget breakdown for your project. You can regenerate as needed to update your plan.
        </p>
      </div>
      <Button
        className="ml-6 bg-[#393CA0] hover:bg-[#393CA0]/90 text-white shadow-sm"
        onClick={onGenerateBudget}
        disabled={isBudgetGenerating || isLoading}
      >
        <WandSparkles className="mr-2 h-4 w-4" />
        {isBudgetGenerating ? 'Generating...' : (budget ? 'Regenerate' : 'Generate')}
      </Button>
    </div>
  );

  // Error state
  if (budgetError) {
    return (
      <>
        {instructionBox}
        <div className="bg-white rounded-lg border shadow-sm p-6 flex items-center justify-center min-h-[160px]">
          <div className="text-center p-6">
            <h3 className="text-lg font-medium mb-2 text-red-600">Error</h3>
            <p className="text-gray-500 mb-2">{budgetError}</p>
          </div>
        </div>
      </>
    );
  }

  // Loading state
  if (isLoading || isBudgetGenerating) {
    return <>{instructionBox}</>;
  }

  // Empty state
  if (!budget) {
    return (
      <>
        {instructionBox}
        <div className="bg-white rounded-lg border shadow-sm p-6 flex items-center justify-center min-h-[160px]">
          <div className="text-center p-6">
            <h3 className="text-lg font-medium mb-2">No budget plan yet</h3>
            <p className="text-gray-500 mb-2">Generate a budget plan to see it here.</p>
          </div>
        </div>
      </>
    );
  }

  // --- Budget Summary Widgets ---
  const topCategory = budget.categories && budget.categories.length > 0
    ? [...budget.categories].sort((a, b) => {
        const parseAmount = (amount) => Number(String(amount).replace(/[^\d.]/g, '')) || 0;
        return parseAmount(b.amount) - parseAmount(a.amount);
      })[0]
    : null;
  const totalBudget = budget.totalBudget || '';
  const numCategories = budget.categories ? budget.categories.length : 0;

  return (
    <>
      {instructionBox}
      <div className="space-y-6">
        {/* Budget Summary Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border shadow-sm p-5 flex flex-col items-center justify-center text-center">
            <div className="text-xs text-gray-500 mb-1">Total Budget</div>
            <div className="text-2xl font-bold text-[#393CA0]">{totalBudget}</div>
          </div>
          <div className="bg-white rounded-lg border shadow-sm p-5 flex flex-col items-center justify-center text-center">
            <div className="text-xs text-gray-500 mb-1">Top Category</div>
            <div className="text-lg font-semibold">{topCategory ? topCategory.category : '-'}</div>
            <div className="text-sm text-gray-700">{topCategory ? topCategory.amount : '-'}</div>
          </div>
          <div className="bg-white rounded-lg border shadow-sm p-5 flex flex-col items-center justify-center text-center">
            <div className="text-xs text-gray-500 mb-1"># of Categories</div>
            <div className="text-2xl font-bold">{numCategories}</div>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Overview</h3>
            <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
              <button
                className={`px-4 py-1 rounded-md text-sm font-medium transition-colors ${budgetChartType === 'donut' ? 'bg-[#393CA0] text-white' : 'text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setBudgetChartType('donut')}
                type="button"
              >
                Donut Chart
              </button>
              <button
                className={`px-4 py-1 rounded-md text-sm font-medium transition-colors ${budgetChartType === 'bar' ? 'bg-[#393CA0] text-white' : 'text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setBudgetChartType('bar')}
                type="button"
              >
                Bar Chart
              </button>
            </div>
          </div>
          
          <div className="w-full flex items-center justify-center min-h-[220px]">
            {budgetChartType === 'donut' ? (
              <div className="w-full flex justify-center">
                <div className="w-full h-72 flex items-center justify-center bg-white rounded-lg border border-dashed border-gray-200 mx-auto p-4 shadow-sm">
                  <BudgetDonutChart categories={budget.categories || []} />
                </div>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <div className="w-full h-72 flex items-center justify-center bg-white rounded-lg border border-dashed border-gray-200 mx-auto p-4 shadow-sm overflow-x-auto">
                  <BudgetBarChart categories={budget.categories || []} />
                </div>
              </div>
            )}
          </div>
          
          <hr className="border-gray-200" />
          
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-lg mb-2">Budget Categories</h4>
            {budget.categories.map((category, index) => (
              <div key={index} className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <h5 className="font-medium">{category.category}</h5>
                  <span className="font-bold">{category.amount}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{category.description}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${category.percentage || 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{category.percentage || 0}% of total budget</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
} 