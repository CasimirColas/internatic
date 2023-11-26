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

  console.log("filters", filters);

  return (
    <>
      <HomeFilters filters={filters} onChange={setfilters} />
      <Suspense fallback={<OfferWrapperSkeleton />}>
        <OfferWrapper filter={filters} />
      </Suspense>
    </>
  );
}

export default HomePage;
