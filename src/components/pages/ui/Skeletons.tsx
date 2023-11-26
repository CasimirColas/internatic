import { Card } from "@/components/shadcn/ui/card";

export function OfferCardSkeleton() {
  return (
    <Card className="w-[350px] flex justify-between items-center h-[500px]">
      <div className=" animate-pulse flex flex-col w-full h-full justify-between">
        <div className="bg-gray-200 rounded-t-lg h-[200px]" />
        <div className="flex flex-col gap-4 justify-around py-4">
          <div className="bg-gray-200 h-[50px] rounded-lg mx-4" />
          <div className="bg-gray-200 h-[50px] rounded-lg mx-4" />
          <div className="bg-gray-200 h-[50px] rounded-lg mx-4" />
          <div className="bg-gray-200 h-[50px] rounded-lg mx-4" />
        </div>
      </div>
    </Card>
  );
}

export function OfferWrapperSkeleton() {
  return (
    <div className="flex  gap-4 flex-wrap w-full justify-center h-full">
      <OfferCardSkeleton />
      <OfferCardSkeleton />
      <OfferCardSkeleton />
      <OfferCardSkeleton />
      <OfferCardSkeleton />
      <OfferCardSkeleton />
      <OfferCardSkeleton />
      <OfferCardSkeleton />
    </div>
  );
}

export function OfferDetailedCardSkeleton() {
  return (
    <div className="animate-pulse flex justify-center">
      <div className=" rounded-t-lg w-full  h-[80vh]" />
    </div>
  );
}
