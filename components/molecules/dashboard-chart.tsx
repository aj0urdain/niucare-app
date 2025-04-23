"use client";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
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
const chartData = [
  { date: "2024-04-01", accepted: 222, rejected: 50 },
  { date: "2024-04-02", accepted: 197, rejected: 80 },
  { date: "2024-04-03", accepted: 167, rejected: 20 },
  { date: "2024-04-04", accepted: 242, rejected: 60 },
  { date: "2024-04-05", accepted: 373, rejected: 90 },
  { date: "2024-04-06", accepted: 301, rejected: 40 },
  { date: "2024-04-07", accepted: 245, rejected: 80 },
  { date: "2024-04-08", accepted: 409, rejected: 20 },
  { date: "2024-04-09", accepted: 159, rejected: 10 },
  { date: "2024-04-10", accepted: 261, rejected: 90 },
  { date: "2024-04-11", accepted: 327, rejected: 50 },
  { date: "2024-04-12", accepted: 292, rejected: 10 },
  { date: "2024-04-13", accepted: 342, rejected: 80 },
  { date: "2024-04-14", accepted: 137, rejected: 20 },
  { date: "2024-04-15", accepted: 120, rejected: 70 },
  { date: "2024-04-16", accepted: 138, rejected: 90 },
  { date: "2024-04-17", accepted: 446, rejected: 40 },
  { date: "2024-04-18", accepted: 364, rejected: 10 },
  { date: "2024-04-19", accepted: 243, rejected: 80 },
  { date: "2024-04-20", accepted: 189, rejected: 20 },
  { date: "2024-04-21", accepted: 137, rejected: 70 },
  { date: "2024-04-22", accepted: 224, rejected: 90 },
  { date: "2024-04-23", accepted: 138, rejected: 30 },
  { date: "2024-04-24", accepted: 387, rejected: 90 },
  { date: "2024-04-25", accepted: 215, rejected: 50 },
  { date: "2024-04-26", accepted: 175, rejected: 10 },
  { date: "2024-04-27", accepted: 383, rejected: 20 },
  { date: "2024-04-28", accepted: 122, rejected: 80 },
  { date: "2024-04-29", accepted: 315, rejected: 40 },
  { date: "2024-04-30", accepted: 454, rejected: 90 },
  { date: "2024-05-01", accepted: 165, rejected: 20 },
  { date: "2024-05-02", accepted: 293, rejected: 10 },
  { date: "2024-05-03", accepted: 247, rejected: 80 },
  { date: "2024-05-04", accepted: 385, rejected: 20 },
  { date: "2024-05-05", accepted: 481, rejected: 90 },
  { date: "2024-05-06", accepted: 498, rejected: 20 },
  { date: "2024-05-07", accepted: 388, rejected: 80 },
  { date: "2024-05-08", accepted: 149, rejected: 10 },
  { date: "2024-05-09", accepted: 227, rejected: 80 },
  { date: "2024-05-10", accepted: 293, rejected: 30 },
  { date: "2024-05-11", accepted: 335, rejected: 70 },
  { date: "2024-05-12", accepted: 197, rejected: 40 },
  { date: "2024-05-13", accepted: 197, rejected: 60 },
  { date: "2024-05-14", accepted: 448, rejected: 90 },
  { date: "2024-05-15", accepted: 473, rejected: 20 },
  { date: "2024-05-16", accepted: 338, rejected: 80 },
  { date: "2024-05-17", accepted: 499, rejected: 20 },
  { date: "2024-05-18", accepted: 315, rejected: 50 },
  { date: "2024-05-19", accepted: 235, rejected: 80 },
  { date: "2024-05-20", accepted: 177, rejected: 30 },
  { date: "2024-05-21", accepted: 182, rejected: 10 },
  { date: "2024-05-22", accepted: 181, rejected: 20 },
  { date: "2024-05-23", accepted: 252, rejected: 90 },
  { date: "2024-05-24", accepted: 294, rejected: 20 },
  { date: "2024-05-25", accepted: 201, rejected: 50 },
  { date: "2024-05-26", accepted: 213, rejected: 70 },
  { date: "2024-05-27", accepted: 420, rejected: 40 },
  { date: "2024-05-28", accepted: 233, rejected: 80 },
  { date: "2024-05-29", accepted: 178, rejected: 30 },
  { date: "2024-05-30", accepted: 340, rejected: 80 },
  { date: "2024-05-31", accepted: 178, rejected: 30 },
  { date: "2024-06-01", accepted: 178, rejected: 80 },
  { date: "2024-06-02", accepted: 470, rejected: 10 },
  { date: "2024-06-03", accepted: 103, rejected: 60 },
  { date: "2024-06-04", accepted: 439, rejected: 90 },
  { date: "2024-06-05", accepted: 188, rejected: 20 },
  { date: "2024-06-06", accepted: 294, rejected: 50 },
  { date: "2024-06-07", accepted: 323, rejected: 70 },
  { date: "2024-06-08", accepted: 385, rejected: 20 },
  { date: "2024-06-09", accepted: 438, rejected: 80 },
  { date: "2024-06-10", accepted: 155, rejected: 30 },
  { date: "2024-06-11", accepted: 192, rejected: 10 },
  { date: "2024-06-12", accepted: 492, rejected: 80 },
  { date: "2024-06-13", accepted: 181, rejected: 20 },
  { date: "2024-06-14", accepted: 426, rejected: 90 },
  { date: "2024-06-15", accepted: 307, rejected: 50 },
  { date: "2024-06-16", accepted: 371, rejected: 10 },
  { date: "2024-06-17", accepted: 475, rejected: 20 },
  { date: "2024-06-18", accepted: 107, rejected: 80 },
  { date: "2024-06-19", accepted: 341, rejected: 90 },
  { date: "2024-06-20", accepted: 408, rejected: 20 },
  { date: "2024-06-21", accepted: 169, rejected: 10 },
  { date: "2024-06-22", accepted: 317, rejected: 70 },
  { date: "2024-06-23", accepted: 480, rejected: 30 },
  { date: "2024-06-24", accepted: 132, rejected: 80 },
  { date: "2024-06-25", accepted: 141, rejected: 90 },
  { date: "2024-06-26", accepted: 434, rejected: 20 },
  { date: "2024-06-27", accepted: 448, rejected: 10 },
  { date: "2024-06-28", accepted: 149, rejected: 80 },
  { date: "2024-06-29", accepted: 103, rejected: 60 },
  { date: "2024-06-30", accepted: 446, rejected: 90 },
];
const chartConfig = {
  claims: {
    label: "Claims",
  },
  accepted: {
    label: "Accepted",
    color: "hsl(142 76% 36%)",
  },
  rejected: {
    label: "Rejected",
    color: "hsl(0 84% 60%)",
  },
} satisfies ChartConfig;
export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");
  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);
  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Insurance Claims</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Total claims processed in the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
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
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="@[767px]/card:hidden flex w-40"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
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
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(142 76% 36%)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(142 76% 36%)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(0 84% 60%)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(0 84% 60%)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="rejected"
              type="natural"
              fill="url(#fillMobile)"
              stroke="hsl(0 84% 60%)"
              stackId="a"
            />
            <Area
              dataKey="accepted"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="hsl(142 76% 36%)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
