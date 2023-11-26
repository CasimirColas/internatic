import HomePage from "@/components/pages/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
};

export default async function Page() {
  return (
    <main className="flex flex-col gap-4 bg-gray-50 w-full h-full justify-between items-center pt-14 overflow-auto">
      <HomePage />
    </main>
  );
}
