'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { RFP } from '@/lib/types';
import { useMemo } from 'react';

type BudgetVsWonChartProps = {
  rfps: RFP[];
};

export function BudgetVsWonChart({ rfps }: BudgetVsWonChartProps) {
  const awardedData = useMemo(() => {
    return rfps
      .filter(rfp => rfp.status === 'Awarded' || rfp.status === 'Completed')
      .map(rfp => {
        const awardedProposal = rfp.proposals?.find(p => p.status === 'Awarded');
        return {
          name: rfp.projectName,
          budget: rfp.estimatedBudget,
          won: awardedProposal?.bidAmount || 0,
        };
      })
      .filter(data => data.won > 0);
  }, [rfps]);

  const budgetOnlyData = useMemo(() => {
    return rfps.map(rfp => ({
      name: rfp.projectName,
      budget: rfp.estimatedBudget,
    }));
  }, [rfps]);

  const hasAwardedData = awardedData.length > 0;
  const chartData = hasAwardedData ? awardedData : budgetOnlyData;

  if (!chartData || chartData.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No project data to display for this chart.</p>;
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart 
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-15} textAnchor="end" height={60} interval={0} />
        <YAxis tickFormatter={formatCurrency} />
        <Tooltip formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)} />
        <Legend />
        <Bar dataKey="budget" fill="hsl(var(--muted-foreground))" name="Budget" />
        {hasAwardedData && <Bar dataKey="won" fill="hsl(var(--primary))" name="Won Amount" />}
      </BarChart>
    </ResponsiveContainer>
  );
}
