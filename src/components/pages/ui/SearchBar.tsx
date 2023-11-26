"use client";
import { useDebouncedCallback } from "use-debounce";
import { Search } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/shadcn/ui/input";
import { twMerge } from "tailwind-merge";

export default function SearchBar({
  placeholder,
  className,
}: {
  placeholder: string;
  className?: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams ?? "");
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className={twMerge("relative flex items-center", className)}>
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <Input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams?.get("search")?.toString()}
      />
      <Search className="absolute p-1 left-2" />
    </div>
  );
}
