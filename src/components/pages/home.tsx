"use client";

import { MainPageFilter } from "@/db/queries/getOffersFiltered";
import { useState } from "react";
import HomeFilters from "./home/HomeFilters";
import { Suspense } from "react";
import OfferWrapper from "./home/OffersWrapper";
import { OfferWrapperSkeleton } from "./ui/Skeletons";

function HomePage() {
  const [filters, setfilters] = useState<MainPageFilter>({
    isOffering: true,
  });
  return (
    <div className="flex justify-end relative flex-col lg:flex-row w-full">
      <div className="lg:w-[40%] p-4 lg:fixed z-20 lg:left-10 relative lg:top-14 w-full">
        <HomeFilters filters={filters} onChange={setfilters} />
      </div>
      <div className="lg:w-[58%] p-4 w-full">
        <Suspense fallback={<OfferWrapperSkeleton />}>
          <OfferWrapper filter={filters} />
        </Suspense>
      </div>
    </div>
  );
}

export default HomePage;
