import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useGetListingCountByDateQuery } from "@/features/audit/auditSlice";

// chart color config
const chartConfig = {
  listingCount: {
    label: "Review Count",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ChartReviewOverview() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState("30d");

  // fetch data using RTK Query
  const { data = [], error, isLoading } = useGetListingCountByDateQuery();

  // auto switch range based on device size
  useEffect(() => {
    setTimeRange(isMobile ? "7d" : "30d");
  }, [isMobile]);

  // sort & prepare data
  const groupedData = useMemo(() => {
    return data
      .map((item) => ({
        date: item.date,
        listingCount: item.listingCount || 0,
      }))
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
  }, [data]);

  // filter by date range
  const filteredData = useMemo(() => {
    const now = new Date();
    const days = timeRange === "90d" ? 90 : timeRange === "30d" ? 30 : 7;
    const start = new Date();
    start.setDate(now.getDate() - days);
    return groupedData.filter((item) => new Date(item.date) >= start);
  }, [groupedData, timeRange]);

  if (isLoading) return <p>Loading review chart...</p>;
  if (error) return <p>Failed to load review data.</p>;

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Daily Listing Overview</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Total listing per day
          </span>
          <span className="@[540px]/card:hidden">Daily listings</span>
        </CardDescription>

        {/* time range toggle */}
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
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

          {/* mobile dropdown */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="@[767px]/card:hidden flex w-40"
              aria-label="Select range"
            >
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
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillReview" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="10%"
                  stopColor="hsl(var(--chart-2))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-2))"
                  stopOpacity={0.1}
                />
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
            <YAxis
              tickFormatter={(v) => `${v}`}
              tickLine={false}
              axisLine={false}
              width={40}
            />

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
                  formatter={(value) => [`Listings: ${value}`]}
                />
              }
            />

            <Area
              type="monotone"
              dataKey="listingCount"
              name="Listing Count"
              stroke="hsl(var(--chart-2))"
              fill="url(#fillReview)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
