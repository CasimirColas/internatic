"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn/ui/avatar";
import { Badge } from "@/components/shadcn/ui/badge";
import { Star, User, Building2 } from "lucide-react";
import differenceInCalendarYears from "date-fns/differenceInCalendarYears";
import { twMerge } from "tailwind-merge";

interface ProfileCardProps {
  className?: string;
  data: {
    firstName: string;
    lastName: string;
    type: string;
    profilePictureUrl: string | null;
    birthday?: Date;
    displayName: string;
    bio: string | null;
    tags: string[];
    rating?: number | null;
  };
}

function ProfileCard({ data, className }: ProfileCardProps) {
  const contentStyle = "p-6 pt-0";

  return (
    <div className="rounded-lg border text-card-foreground shadow-sm bg-white w-full">
      <div className="space-y-1.5 p-6 flex items-center flex-row justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            {data.profilePictureUrl ? (
              <AvatarImage src={data.profilePictureUrl} />
            ) : null}
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              {data.firstName} {data.lastName},{" "}
              {data.birthday
                ? differenceInCalendarYears(new Date(), data.birthday)
                : null}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              {data.type === "company" ? (
                <Building2 size={16} />
              ) : (
                <User size={16} />
              )}
              @{data.displayName}
            </p>
          </div>
        </div>

        {data.rating ? (
          <div className="flex items-center gap-2">
            <Star size={24} />
            <span>{data.rating}</span>
          </div>
        ) : null}
      </div>
      <div className={contentStyle}>
        <p>Bio</p>

        <p className="text-sm text-muted-foreground">{data.bio}</p>
      </div>
      <div className={twMerge(contentStyle, "flex items-center")}>
        <p>Tags:</p>
        <div>
          {data.tags.map((tag, i) => (
            <Badge key={i} className="m-1">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
