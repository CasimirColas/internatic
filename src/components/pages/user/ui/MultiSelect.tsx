"use client";

import { Command as CommandPrimitive } from "cmdk";
import { X } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { Badge } from "@/components/shadcn/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
} from "@/components/shadcn/ui/command";
import { twMerge } from "tailwind-merge";

export type MultiSelectItem = { value: string; label: string; id: string };

interface MultiSelectProps {
  className?: string;
  options: MultiSelectItem[];
  set: (value: MultiSelectItem[]) => void;
  value: MultiSelectItem[];
  placeholder?: string;
  htmlFor?: string;
}

function MultiSelect({
  options,
  set,
  placeholder,
  value,
  htmlFor,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [selectedOptions, setselectedOptions] = useState<MultiSelectItem[]>([]);
  const handleUnselect = useCallback((framework: MultiSelectItem) => {
    setselectedOptions((prev) =>
      prev.filter((s) => s.value !== framework.value)
    );
  }, []);

  useEffect(() => {
    set(selectedOptions);
  }, [selectedOptions]);

  const selectables = options.filter(
    (framework) => !value.map((e) => e.id).includes(framework.id)
  );

  return (
    <Command
      className={twMerge("overflow-visible bg-white relative", className)}
      id={htmlFor}
    >
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap relative min-h-[22px]">
          {value.map((framework) => {
            return (
              <Badge key={framework.id} variant="secondary" className="z-10">
                {framework.label}
                <button
                  type="button"
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(framework);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(framework)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            value={""}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={value.length < 1 ? placeholder : undefined}
            className="bg-transparent outline-none placeholder:text-muted-foreground absolute top-0 left-0 w-full h-full caret-transparent"
          />
        </div>
      </div>

      {open && selectables.length > 0 ? (
        <div className="absolute w-full z-10 top-12 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
          <CommandGroup className="h-full overflow-auto">
            {selectables.map((framework) => {
              return (
                <CommandItem
                  key={framework.value}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onSelect={(value) => {
                    setselectedOptions((prev) => [...prev, framework]);
                  }}
                  className={"cursor-pointer"}
                >
                  {framework.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </div>
      ) : null}
    </Command>
  );
}

export default MultiSelect;
