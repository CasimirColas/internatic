import { twMerge } from "tailwind-merge";
import { Disc } from "lucide-react";

interface StatusLightProps {
  status: "on" | "off" | "full" | "fulfilled";
  size: number;
  className?: string;
}

function StatusLight({ status, className, size }: StatusLightProps) {
  const statusColors = () => {
    switch (status) {
      case "on":
        return `text-green-500 rounded-full stroke-[3px]`;
      case "off":
        return `text-red-500 rounded-full stroke-[3px]`;
      case "full":
        return `text-blue-500 rounded-full stroke-[3px]`;
      case "fulfilled":
        return `text-black-500 rounded-full stroke-[3px]`;
      default:
        return `text-gray-500 rounded-full stroke-[3px]`;
    }
  };

  return <Disc className={twMerge(statusColors(), className)} size={size} />;
}

export default StatusLight;
