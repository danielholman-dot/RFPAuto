
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
    const rfpStart = data.rfpStart ? format(new Date(data.rfpStart), 'MMM d, yyyy') : 'N/A';
    const rfpEnd = data.rfpEnd ? format(new Date(data.rfpEnd), 'MMM d, yyyy') : 'N/A';
    const projectStart = data.projectStart ? format(new Date(data.projectStart), 'MMM d, yyyy') : 'N/A';
    const projectEnd = data.projectEnd ? format(new Date(data.projectEnd), 'MMM d, yyyy') : 'N/A';
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
    return <p className="text-center text-muted-foreground py-8">No RFP data to display.</p>;
  }

  const toDate = (date: any): Date | null => {
    if (!date) return null;
    const d = date.toDate ? date.toDate() : new Date(date);
    return d instanceof Date && !isNaN(d.getTime()) ? d : null;
  };

  const validRfps = rfps.map(rfp => ({
    ...rfp,
    rfpStartDate: toDate(rfp.rfpStartDate),
    rfpEndDate: toDate(rfp.rfpEndDate),
    projectStartDate: toDate(rfp.projectStartDate),
    projectEndDate: toDate(rfp.projectEndDate),
  })).filter(r => r.rfpStartDate && r.rfpEndDate && r.projectStartDate && r.projectEndDate);

  if (validRfps.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No RFP data with complete timelines.</p>;
  }

  const allDates = validRfps.flatMap(rfp => [
    rfp.rfpStartDate,
    rfp.rfpEndDate,
    rfp.projectStartDate,
    rfp.projectEndDate
  ]).filter(Boolean) as Date[];

  const overallMinDate = min(allDates);
  const overallMaxDate = max(allDates);

  const data = validRfps.map(rfp => {
    const rfpStartOffset = differenceInDays(rfp.rfpStartDate!, overallMinDate);
    const rfpDuration = differenceInDays(rfp.rfpEndDate!, rfp.rfpStartDate!);

    const projectStartOffset = differenceInDays(rfp.projectStartDate!, overallMinDate);
    const projectDuration = differenceInDays(rfp.projectEndDate!, rfp.projectStartDate!);
    
    // We render two separate stacked bars, one for RFP, one for Project
    // So the padding/offset is what pushes the bar to the right place
    return {
      name: rfp.projectName,
      
      // Bar 1: RFP Phase
      rfpStartPadding: rfpStartOffset,
      rfpDuration: rfpDuration > 0 ? rfpDuration : 0,

      // Bar 2: Project Phase
      projectStartPadding: projectStartOffset,
      projectDuration: projectDuration > 0 ? projectDuration : 0,

      // For the tooltip
      rfpStart: rfp.rfpStartDate,
      rfpEnd: rfp.rfpEndDate,
      projectStart: rfp.projectStartDate,
      projectEnd: rfp.projectEndDate,
    };
  }).reverse(); // Reverse to show latest projects on top


  const domain = [0, differenceInDays(overallMaxDate, overallMinDate)];
  
  return (
    <ResponsiveContainer width="100%" height={data.length * 60 + 60}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 150, bottom: 5 }}
        barCategoryGap="40%"
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
        <Bar dataKey="rfpStartPadding" stackId="timeline" fill="transparent" />
        <Bar dataKey="rfpDuration" stackId="timeline" fill="hsl(var(--chart-1))" name="RFP Phase" />
        <Bar dataKey="projectStartPadding" stackId="timeline" fill="transparent" />
        <Bar dataKey="projectDuration" stackId="timeline" fill="hsl(var(--chart-2))" name="Project Phase" />
      </BarChart>
    </ResponsiveContainer>
  );
}
