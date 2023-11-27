import MultiSelect from "../user/ui/MultiSelect";
import { TagsReturn, getTags } from "@/db/queries/getTags";
import { useState, useEffect } from "react";

interface TagsMultiSelectProps {
  value?: string[];
  onChange: (value: string[]) => void;
  className?: string;
  id?: string;
}

function TagsMultiSelect({
  value,
  onChange,
  className,
  id,
}: TagsMultiSelectProps) {
  const [options, setoptions] = useState<TagsReturn>([]);

  useEffect(() => {
    getTags().then((e) => setoptions(e));
  }, []);

  return (
    <MultiSelect
      options={options.map((e) => ({
        label: e.name,
        value: e.name,
        id: e.id,
      }))}
      value={
        value
          ? options
              .filter((e) => value.includes(e.name))
              .map((e) => ({ label: e.name, value: e.name, id: e.id }))
          : []
      }
      onChange={(e) => onChange(e.map((e) => e.value))}
      className={className}
      htmlFor={id}
    />
  );
}

export default TagsMultiSelect;
