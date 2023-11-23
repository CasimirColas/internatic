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
  firstName: string;
  lastName: string;
  type: string;
  profilePictureUrl: string;
  birthday: Date;
  displayName: string;
  bio: string;
  tags: string[];
}

function ProfileCard({
  firstName,
  lastName,
  type,
  profilePictureUrl,
  birthday,
  displayName,
  bio,
  tags,
}: ProfileCardProps) {
  const contentStyle = "p-6 pt-0";

  return (
    <div className="rounded-lg border text-card-foreground shadow-sm bg-white w-full">
      <div className="space-y-1.5 p-6 flex items-center flex-row justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={profilePictureUrl} />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              {firstName} {lastName},{" "}
              {differenceInCalendarYears(new Date(), birthday)}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              {type === "company" ? (
                <Building2 size={16} />
              ) : (
                <User size={16} />
              )}
              @{displayName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Star size={24} />
          <span>4.5</span>
        </div>
      </div>
      <div className={contentStyle}>
        <p>Bio</p>

        <p className="text-sm text-muted-foreground">{bio}</p>
      </div>
      <div className={twMerge(contentStyle, "flex items-center")}>
        <p>Tags:</p>
        <div>
          {tags.map((tag, i) => (
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
