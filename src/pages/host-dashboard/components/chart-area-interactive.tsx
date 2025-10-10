import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useMemo, useState } from "react";
import type { Booking } from "@/features/booking/bookingTypes";

const chartConfig = {
  totalRevenue: {
    label: "Total Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
  bookings: Booking[];
}

export function ChartAreaInteractive({ bookings }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    if (isMobile) setTimeRange("7d");
  }, [isMobile]);

  const groupedData = useMemo(() => {
    const map: Record<string, { date: string; totalRevenue: number; bookingCount: number }> = {};

    bookings.forEach((booking) => {
      const date = new Date(booking.created_at).toISOString().split("T")[0];
      if (!map[date]) map[date] = { date, totalRevenue: 0, bookingCount: 0 };
      map[date].totalRevenue += booking.total_price || 0;
      map[date].bookingCount += 1;
    });

    return Object.values(map).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [bookings]);

  const filteredData = React.useMemo(() => {
    const now = new Date();
    const days = timeRange === "90d" ? 90 : timeRange === "30d" ? 30 : 7;
    const start = new Date();
    start.setDate(now.getDate() - days);
    return groupedData.filter((item) => new Date(item.date) >= start);
  }, [groupedData, timeRange]);

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Daily Revenue Overview</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">Total revenue per day</span>
          <span className="@[540px]/card:hidden">Daily revenue</span>
        </CardDescription>

        {/* Time range selector */}
        <div className="absolute right-4 top-4">
          <ToggleGroup type="single" value={timeRange} onValueChange={setTimeRange} variant="outline" className="@[767px]/card:flex hidden">
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              Last 3 months
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              Last 30 days
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              Last 7 days
            </ToggleGroupItem>
          </ToggleGroup>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="@[767px]/card:hidden flex w-40" aria-label="Select range">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="10%" stopColor="teal" stopOpacity={0.8} />
                <stop offset="95%" stopColor="teal" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis tickFormatter={(v) => `Rs.${v}`} tickLine={false} axisLine={false} width={70} />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  formatter={(value, _name, props) => {
                    const bookingCount = props.payload.bookingCount || 0;
                    return [`Revenue: LKR ${value.toLocaleString()}`, ` (${bookingCount} Bookings)`];
                  }}
                />
              }
            />

            <Area type="monotone" dataKey="totalRevenue" name="Total Revenue (Rs.)" stroke="teal" fill="url(#fillRevenue)" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
