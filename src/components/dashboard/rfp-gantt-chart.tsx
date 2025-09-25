
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { RFP } from '@/lib/types';
import { differenceInDays, format, min, max } from 'date-fns';

type GanttChartProps = {
  rfps: RFP[];
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const rfpStart = format(new Date(data.rfpStart), 'MMM d, yyyy');
    const rfpEnd = format(new Date(data.rfpEnd), 'MMM d, yyyy');
    const projectStart = format(new Date(data.projectStart), 'MMM d, yyyy');
    const projectEnd = format(new Date(data.projectEnd), 'MMM d, yyyy');
    return (
      <div className="p-2 border bg-background rounded-md shadow-lg text-sm">
        <p className="font-bold">{label}</p>
        <p className="text-blue-500">RFP: {rfpStart} - {rfpEnd} ({data.rfpDuration} days)</p>
        <p className="text-green-500">Project: {projectStart} - {projectEnd} ({data.projectDuration} days)</p>
      </div>
    );
  }

  return null;
};

export function RfpGanttChart({ rfps }: GanttChartProps) {
  if (!rfps || rfps.length === 0) {
    return <p>No RFP data to display.</p>;
  }

  const toDate = (date: any) => {
    if (!date) return null;
    return date.toDate ? date.toDate() : new Date(date);
  }

  const allDates = rfps.flatMap(rfp => [
    toDate(rfp.rfpStartDate),
    toDate(rfp.rfpEndDate),
    toDate(rfp.projectStartDate),
    toDate(rfp.projectEndDate)
  ]).filter(d => d instanceof Date && !isNaN(d.getTime())) as Date[];

  if (allDates.length === 0) {
    return <p>No valid dates found in RFP data.</p>;
  }

  const overallMinDate = min(allDates);
  const overallMaxDate = max(allDates);

  const data = rfps.map(rfp => {
    const rfpStart = toDate(rfp.rfpStartDate);
    const rfpEnd = toDate(rfp.rfpEndDate);
    const projectStart = toDate(rfp.projectStartDate);
    const projectEnd = toDate(rfp.projectEndDate);

    const rfpStartOffset = rfpStart ? differenceInDays(rfpStart, overallMinDate) : 0;
    const rfpDuration = rfpStart && rfpEnd ? differenceInDays(rfpEnd, rfpStart) : 0;
    
    const projectStartOffset = projectStart ? differenceInDays(projectStart, overallMinDate) : 0;
    const projectDuration = projectStart && projectEnd ? differenceInDays(projectEnd, projectStart) : 0;
    
    const rfpPadding = projectStart && rfpEnd ? differenceInDays(projectStart, rfpEnd) : 0;

    return {
      name: rfp.projectName,
      // For the chart
      rfpStartOffset,
      rfpDuration,
      rfpPadding: rfpPadding > 0 ? rfpPadding : 0,
      projectDuration,
      projectStartOffset,
      // For the tooltip
      rfpStart,
      rfpEnd,
      projectStart,
      projectEnd,
    };
  }).reverse(); // Reverse to show latest projects on top


  const domain = [0, differenceInDays(overallMaxDate, overallMinDate)];
  const ticks = [];
  let currentDate = new Date(overallMinDate);
  while(currentDate <= overallMaxDate) {
    ticks.push(currentDate.getTime());
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return (
    <ResponsiveContainer width="100%" height={data.length * 60 + 60}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 150, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          type="number" 
          domain={domain}
          tickFormatter={(tick) => format(new Date(overallMinDate).setDate(overallMinDate.getDate() + tick), 'MMM yyyy')}
        />
        <YAxis 
          type="category" 
          dataKey="name" 
          width={150} 
          tick={{ fontSize: 12 }} 
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value, entry, index) => {
            if (value === 'rfpDuration') return 'RFP Phase';
            if (value === 'projectDuration') return 'Project Phase';
            return value;
          }}
        />
        <Bar dataKey="rfpStartOffset" stackId="a" fill="transparent" />
        <Bar dataKey="rfpDuration" stackId="a" fill="#8884d8" name="RFP Phase" />
        <Bar dataKey="rfpPadding" stackId="a" fill="transparent" />
        <Bar dataKey="projectStartOffset" stackId="b" fill="transparent" />
        <Bar dataKey="projectDuration" stackId="b" fill="#82ca9d" name="Project Phase" />
      </BarChart>
    </ResponsiveContainer>
  );
}

