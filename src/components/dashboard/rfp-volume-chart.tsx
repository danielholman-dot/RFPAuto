'use client';

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: "RFPs",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function RfpVolumeChart() {
    return (
        <ChartContainer config={chartConfig}>
            <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
                top: 20,
            }}
            >
            <CartesianGrid vertical={false} />
            <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
            </BarChart>
        </ChartContainer>
    )
}
