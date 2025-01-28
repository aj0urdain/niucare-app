"use client";

import * as React from "react";
import { Check, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Label } from "@/components/ui/label";

type Option = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

interface ComboBoxResponsiveProps {
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder?: string;
  className?: string;
  triggerClassName?: string;
  label?: string;
  icon?: React.ReactNode;
  id?: string;
}

export function ComboBoxResponsive({
  options,
  value,
  onValueChange,
  placeholder,
  searchPlaceholder = "Search...",
  className,
  triggerClassName,
  label,
  icon,
  id,
}: ComboBoxResponsiveProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const selectedOption = options.find((option) => option.value === value);

  const OptionList = React.useCallback(
    function OptionList() {
      return (
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(selectedValue) => {
                    onValueChange(selectedValue === "all" ? "" : selectedValue);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {option.icon}
                    {option.label}
                    {option.value === value && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      );
    },
    [options, value, onValueChange, searchPlaceholder]
  );

  const trigger = (
    <Button variant="outline" className={cn("justify-start", triggerClassName)}>
      {selectedOption ? (
        <div className="flex items-center gap-2">
          {selectedOption.icon}
          {selectedOption.label}
        </div>
      ) : (
        placeholder
      )}
    </Button>
  );

  const content = (
    <div className="grid w-fit min-w-40 gap-1.5">
      {label && (
        <Label
          htmlFor={id}
          className="flex items-center gap-1 text-xs font-semibold text-muted-foreground/75"
        >
          {icon}
          {label}
        </Label>
      )}
      {isDesktop ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>{trigger}</PopoverTrigger>
          <PopoverContent
            className={className}
            align="start"
            style={{
              width: "var(--radix-popover-trigger-width)",
            }}
          >
            <OptionList />
          </PopoverContent>
        </Popover>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>{trigger}</DrawerTrigger>
          <DrawerContent>
            <div className="mt-4 border-t">
              <OptionList />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );

  return content;
}
