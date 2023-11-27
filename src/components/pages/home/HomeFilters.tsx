"use client";

import { useState, useEffect } from "react";
import { getTags } from "@/db/queries/getTags";
import MultiSelect from "../user/ui/MultiSelect";
import { MainPageFilter } from "@/db/queries/getOffersFiltered";
import { useSession } from "next-auth/react";
import functionalPopup from "../ui/functionalPopup";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { Button } from "@/components/shadcn/ui/button";
import { Search } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/ui/popover";
import { Switch } from "@/components/shadcn/ui/switch";
import { ca } from "date-fns/locale";

function HomeFilters({
  filters,
  onChange,
}: {
  filters: MainPageFilter;
  onChange: (e: MainPageFilter) => void;
}) {
  const session = useSession();

  const [tags, settags] = useState<
    { label: string; id: string; value: string }[]
  >([]);
  const [filterData, setfilterData] = useState<MainPageFilter>(filters);

  useEffect(() => {
    getTags().then((e) => {
      const tags = e.map((e) => {
        return { label: e.name, id: e.id, value: e.name };
      });
      settags(tags);
    });
  }, []);

  useEffect(() => {
    onChange(filterData);
  }, [filterData]);

  function checkForAuth(func: () => void) {
    if (session.status === "authenticated") {
      func();
    } else {
      functionalPopup(
        <div className="flex w-full items-center justify-center gap-6">
          <AlertTriangle size={48} className="text-red-500" />
          <div className="flex flex-col gap-1 justify-center">
            <b>You must login to use this filter</b>
            <p>
              If you do not have an account yet you can <b>register</b> by
              clicking{" "}
              <Link href={"/register"} className="underline">
                here
              </Link>{" "}
              or <b>login</b> by clicking{" "}
              <Link href={"/login"} className="underline">
                here
              </Link>
            </p>
          </div>
        </div>
      );
    }
  }

  function isValidDate(d: Date) {
    return d instanceof Date && !isNaN(d.getTime());
  }

  const offerTypeText = () => {
    switch (filterData.isOffering) {
      case true:
        return <p>Job</p>;
      case false:
        return <p>Developper</p>;
      default:
        return <p>All</p>;
    }
  };

  const canUse = session.status === "authenticated";

  return (
    <div className="flex flex-col w-full gap-2 items-center">
      {session.status === "authenticated" ? null : (
        <h2 className="text-destructive">
          Login or Register to have acces to more filters
        </h2>
      )}
      <div className="relative flex items-center w-10/12">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <Input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          placeholder="Search"
          onChange={(e) => {
            setfilterData({ ...filterData, title: e.target.value });
          }}
          defaultValue={filterData.title}
        />
        <Search className="absolute p-1 left-2" />
      </div>
      <div className="flex gap-4 justify-around items-center w-10/12 flex-wrap">
        <div className="flex flex-col gap-1">
          <Label htmlFor="team">Team:</Label>
          <Switch
            disabled={!canUse}
            id="team"
            checked={filterData.team ?? false}
            onCheckedChange={(e) => {
              checkForAuth(() =>
                setfilterData({ ...filterData, team: e.valueOf() })
              );
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Label>Type of offer:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">{offerTypeText()}</Button>
              </PopoverTrigger>
              <PopoverContent className="flex flex-col w-46 gap-2 bg-slate-100">
                <Button
                  variant="outline"
                  onClick={() => {
                    setfilterData({ ...filterData, isOffering: true });
                  }}
                >
                  Job
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setfilterData({ ...filterData, isOffering: false });
                  }}
                >
                  Developper
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setfilterData({ ...filterData, isOffering: undefined });
                  }}
                >
                  All
                </Button>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="type">Type of contract:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  {filterData.type ? filterData.type : "Select type"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex flex-col w-46 gap-2 bg-slate-100">
                <Button
                  variant="outline"
                  onClick={() => {
                    setfilterData({ ...filterData, type: "internship" });
                  }}
                >
                  Internship
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setfilterData({ ...filterData, type: "fixed" });
                  }}
                >
                  Fixed
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setfilterData({ ...filterData, type: "open" });
                  }}
                >
                  Open ended
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setfilterData({ ...filterData, type: undefined });
                  }}
                >
                  All
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="min-salay">Mininum salary:</Label>
            <Input
              disabled={!canUse}
              type="number"
              id="min-salary"
              min={0}
              value={filterData.salaryDown}
              onChange={(e) => {
                let value = e.target.valueAsNumber;
                if (value < 0) value = 0;
                checkForAuth(() =>
                  setfilterData({
                    ...filterData,
                    salaryDown: isNaN(value) ? undefined : value,
                  })
                );
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="max-salay">Maximum salary:</Label>
            <Input
              disabled={!canUse}
              type="number"
              id="max-salary"
              min={0}
              value={filterData.salaryUp}
              onChange={(e) => {
                let value = e.target.valueAsNumber;
                if (value < 0) value = 0;
                checkForAuth(() =>
                  setfilterData({
                    ...filterData,
                    salaryUp: isNaN(value) ? undefined : value,
                  })
                );
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="from">From:</Label>
            <Input
              disabled={!canUse}
              type="date"
              id="from"
              value={
                filterData.from && isValidDate(filterData.from)
                  ? filterData.from.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => {
                checkForAuth(() =>
                  setfilterData({
                    ...filterData,
                    from:
                      e.target.value === ""
                        ? undefined
                        : new Date(e.target.value),
                  })
                );
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="to">To:</Label>
            <Input
              disabled={!canUse}
              type="date"
              id="to"
              value={
                filterData.to && isValidDate(filterData.to)
                  ? filterData.to.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => {
                checkForAuth(() =>
                  setfilterData({
                    ...filterData,
                    to:
                      e.target.value === ""
                        ? undefined
                        : new Date(e.target.value),
                  })
                );
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="rating">Rating:</Label>
          <Input
            disabled={!canUse}
            type="number"
            id="rating"
            min={0}
            max={5}
            value={filterData.rating}
            onChange={(e) => {
              let value = e.target.valueAsNumber;
              if (value > 5) value = 5;
              if (value < 0) value = 0;
              checkForAuth(() =>
                setfilterData({
                  ...filterData,
                  rating: isNaN(value) ? undefined : value,
                })
              );
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="tags">Tags:</Label>
          <MultiSelect
            className="w-64"
            options={tags}
            value={
              filterData.tags
                ? tags.filter((e) => filterData?.tags?.includes(e.value))
                : []
            }
            set={(e) => {
              setfilterData({ ...filterData, tags: e.map((e) => e.value) });
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default HomeFilters;
