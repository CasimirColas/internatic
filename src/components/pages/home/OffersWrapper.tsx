"use client";

import {
  FilteredOfferArrayReturn,
  MainPageFilter,
  getOffersFiltered,
} from "@/db/queries/getOffersFiltered";
import OfferCard from "../ui/OfferCard";

import { useState, useEffect } from "react";

function OfferWrapper({ filter }: { filter: MainPageFilter }) {
  const [offers, setoffers] = useState<FilteredOfferArrayReturn>([]);

  useEffect(() => {
    getOffersFiltered(filter).then((e) => {
      setoffers(e);
    });
  }, [filter]);

  return (
    <div className="flex gap-4 lg:flex-wrap lg:justify-center w-full max-w-[95vw] overflow-x-auto">
      {offers.map((e) => (
        <OfferCard
          key={e.id}
          detailsType="fetch"
          data={e}
          className="min-w-[350px] w-[350px] max-h-[570px]"
        />
      ))}
    </div>
  );
}

export default OfferWrapper;
