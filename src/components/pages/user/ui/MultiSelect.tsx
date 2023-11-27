"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/shadcn/ui/popover";
import { Button } from "@/components/shadcn/ui/button";
import { Input } from "@/components/shadcn/ui/input";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/shadcn/ui/command";
import { Badge } from "@/components/shadcn/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";

import { twMerge } from "tailwind-merge";

export type MultiSelectItem = { value: string; label: string; id: string };

interface MultiSelectProps {
  className?: string;
  options: MultiSelectItem[];
  onChange: (value: MultiSelectItem[]) => void;
  value: MultiSelectItem[];
  placeholder?: string;
  htmlFor?: string;
}

function MultiSelect({
  options,
  onChange,
  placeholder,
  value,
  htmlFor,
  className,
}: MultiSelectProps) {
  const [open, setopen] = useState(false);

  const availableOptions = options.filter(
    (e) => !value.find((f) => f.id === e.id)
  );

  function addItems(e: MultiSelectItem) {
    onChange([...value, e]);
  }

  function removeItem(id: string) {
    onChange(value.filter((e) => e.id !== id));
  }

  return (
    <Popover open={open} onOpenChange={setopen}>
      <PopoverTrigger asChild className={twMerge("hover:bg-white", className)}>
        <Button
          id={htmlFor}
          variant={"outline"}
          className="flex flex-wrap gap-1 items-center justify-start"
          onClick={(e) => {
            setopen(true);
          }}
        >
          {value.map((e) => (
            <Badge
              key={e.id}
              className="mr-1 flex gap-1 items-center justify-between hover:bg-black"
            >
              {e.label}
              <X size={12} onClick={() => removeItem(e.id)} />
            </Badge>
          ))}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>Item no found</CommandEmpty>
          <CommandGroup>
            {availableOptions.map((e) => (
              <CommandItem
                key={e.id}
                value={e.value}
                onSelect={(value) => {
                  addItems(e);
                }}
              >
                {e.value}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default MultiSelect;
