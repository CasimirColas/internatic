import { UserInfoReturn } from "@/db/queries/getUserInfo";
import { Card } from "@/components/shadcn/ui/card";
import { Star, User, Building2 } from "lucide-react";
import { Badge } from "@/components/shadcn/ui/badge";
import {
  AvatarFallback,
  Avatar,
  AvatarImage,
} from "@/components/shadcn/ui/avatar";
import differenceInCalendarYears from "date-fns/differenceInCalendarYears";

interface DetailedUserProfileProps {
  data: UserInfoReturn["data"];
}

function DetailedUserProfile({ data }: DetailedUserProfileProps) {
  return (
    <Card className="w-full  p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
        <Avatar className="w-28 h-28  border-gray-100 border-2">
          <AvatarImage src={data?.profilePictureUrl ?? ""} />
          <AvatarFallback>
            {data?.firstName.slice(0, 1)}
            {data?.lastName.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
        <div className="w-full flex flex-col gap-2">
          <h3 className="text-xl font-semibold leading-none tracking-tight">
            {data?.firstName} {data?.lastName},{" "}
            {data?.birthday
              ? differenceInCalendarYears(new Date(), data.birthday)
              : null}
          </h3>
          <p className="text-base text-muted-foreground flex items-center gap-1">
            {data?.type === "company" ? (
              <Building2 size={20} />
            ) : (
              <User size={20} />
            )}
            @{data?.displayName}
          </p>
          <p>
            <b>Contact email:</b> {data?.email}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h4 className="text-lg font-semibold">Statistics:</h4>
        {data?.rating ? (
          <div className="flex">
            <p>Average rating: {data?.rating}</p>
            <Star size={16} />
          </div>
        ) : (
          <i>This user has not been rated yet</i>
        )}

        <p>
          Has applied to {data?.interestedInIds.length} offers on Internatic
        </p>
        <p>Currently working on {data?.workingOnIds.length ?? 0} projects</p>
        <p>Has posted {data?.myOfferIds.length} offers on Internatic</p>
      </div>
      <div className="flex flex-col">
        <h4 className="text-lg font-semibold">Bio:</h4>
        <p className="text-base text-muted-foreground">{data?.bio}</p>
      </div>
      <div className="flex flex-col gap-1">
        <h4 className="text-lg font-semibold">Tags:</h4>
        <div className="flex flex-wrap gap-2">
          {data?.tags.map((tag) => (
            <Badge key={tag.id}>{tag.name}</Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default DetailedUserProfile;
