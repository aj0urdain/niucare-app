"use client";

import * as React from "react";
import { format, subDays, subMonths, subYears } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DateRange = {
  from: Date;
  to: Date;
};

type PresetRange = "7days" | "1month" | "6months" | "1year" | "custom";

export function DateRangeSelector({
  onRangeChange,
}: {
  onRangeChange: (range: DateRange) => void;
}) {
  const [selectedRange, setSelectedRange] =
    React.useState<PresetRange>("7days");
  const [customRange, setCustomRange] = React.useState<DateRange>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const handlePresetChange = (value: PresetRange) => {
    setSelectedRange(value);
    const today = new Date();
    let range: DateRange;

    switch (value) {
      case "7days":
        range = {
          from: subDays(today, 7),
          to: today,
        };
        break;
      case "1month":
        range = {
          from: subMonths(today, 1),
          to: today,
        };
        break;
      case "6months":
        range = {
          from: subMonths(today, 6),
          to: today,
        };
        break;
      case "1year":
        range = {
          from: subYears(today, 1),
          to: today,
        };
        break;
      case "custom":
        range = customRange;
        break;
    }

    onRangeChange(range);
  };

  const handleCustomRangeChange = (range: DateRange) => {
    setCustomRange(range);
    onRangeChange(range);
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedRange} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7days">Last 7 days</SelectItem>
          <SelectItem value="1month">Last month</SelectItem>
          <SelectItem value="6months">Last 6 months</SelectItem>
          <SelectItem value="1year">Last year</SelectItem>
          <SelectItem value="custom">Custom range</SelectItem>
        </SelectContent>
      </Select>

      {selectedRange === "custom" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !customRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {customRange?.from ? (
                customRange.to ? (
                  <>
                    {format(customRange.from, "LLL dd, y")} -{" "}
                    {format(customRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(customRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={customRange?.from}
              selected={customRange}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  handleCustomRangeChange({
                    from: range.from,
                    to: range.to,
                  });
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
