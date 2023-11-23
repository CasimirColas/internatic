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

export type MultiSelectItem = { value: string; label: string; id: string };

interface MultiSelectProps {
  options: MultiSelectItem[];
  set: (value: any) => void;
  value: MultiSelectItem[];
  placeholder?: string;
}

function MultiSelect({ options, set, placeholder, value }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<MultiSelectItem[]>(value);
  const handleUnselect = useCallback((framework: MultiSelectItem) => {
    setSelected((prev) => prev.filter((s) => s.value !== framework.value));
  }, []);

  useEffect(() => {
    set(selected);
  }, [selected]);

  const selectables = options.filter(
    (framework) => !selected.map((e) => e.id).includes(framework.id)
  );

  return (
    <Command className="overflow-visible bg-transparent">
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap relative min-h-[22px]">
          {selected.map((framework) => {
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
            placeholder={selected.length < 1 ? placeholder : undefined}
            className="bg-transparent outline-none placeholder:text-muted-foreground absolute top-0 left-0 w-full h-full caret-transparent"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
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
                      setSelected((prev) => [...prev, framework]);
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
      </div>
    </Command>
  );
}

export default MultiSelect;
