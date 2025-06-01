/**
 * File: components/molecules/combobox-responsive-phone.tsx
 * Description: Responsive combobox component for phone input with mobile and desktop support.
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This component provides a responsive combobox for selecting options, supporting:
 * - Mobile drawer and desktop popover
 * - Searchable options
 * - Custom icons and labels
 * - Accessibility and keyboard navigation
 * - Optional label and icon
 */

"use client";

import * as React from "react";
import { Check, ChevronsDown } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * Option type for ComboBoxResponsive
 */
type Option = {
  id: string;
  value: string;
  label: string;
  displayLabel?: React.ReactNode;
  icon?: React.ReactNode;
  searchValue?: string;
  code?: string;
};

/**
 * Props for ComboBoxResponsive
 */
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

/**
 * ComboBoxResponsive Component
 *
 * Responsive combobox for selecting options, supporting mobile drawer and desktop popover.
 *
 * Features:
 * - Mobile and desktop support
 * - Searchable options
 * - Custom icons and labels
 * - Accessibility and keyboard navigation
 * - Optional label and icon
 *
 * @param options - Array of selectable options
 * @param value - Currently selected value
 * @param onValueChange - Callback when value changes
 * @param placeholder - Placeholder text
 * @param searchPlaceholder - Search input placeholder
 * @param className - Custom class for content
 * @param triggerClassName - Custom class for trigger button
 * @param label - Optional label
 * @param icon - Optional icon
 * @param id - Optional id for label
 * @returns {JSX.Element} Responsive combobox
 *
 * @example
 * ```tsx
 * <ComboBoxResponsive
 *   options={options}
 *   value={value}
 *   onValueChange={setValue}
 *   placeholder="Select..."
 * />
 * ```
 */
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
            <ScrollArea className="h-[200px]">
              <CommandGroup key="options-group">
                {options.map((option) => (
                  <CommandItem
                    key={option.id + option.value}
                    value={option.searchValue || option.value}
                    onSelect={() => {
                      onValueChange(option.value);
                      setOpen(false);
                    }}
                  >
                    {option.displayLabel || (
                      <div className="flex items-center gap-2">
                        {option.label}
                        {option.label}
                      </div>
                    )}
                    {option.value === value && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      );
    },
    [options, value, onValueChange, searchPlaceholder]
  );

  const trigger = (
    <Button
      variant="outline"
      className={cn("justify-between", "group/trigger", triggerClassName)}
    >
      {selectedOption ? (
        <div className="flex items-center gap-1">
          {selectedOption.icon}
          <div className="flex gap-1">
            <span className="group-hover/trigger:opacity-100 flex mt-0.5 items-center font-semibold text-foreground text-[0.7rem] transition-opacity duration-200">
              {selectedOption.label}
            </span>
            <span className="group-hover/trigger:opacity-100 flex items-center text-foreground transition-opacity duration-200">
              ({selectedOption.value})
            </span>
          </div>
        </div>
      ) : (
        placeholder
      )}
      <ChevronsDown className="ml-2 h-3 w-3 shrink-0 opacity-50 group-hover/trigger:opacity-100 transition-opacity duration-200" />
    </Button>
  );

  const content = (
    <div className="grid w-fit max-w-full min-w-40 gap-1.5">
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
            className={cn("p-0", className)}
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
