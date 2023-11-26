"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu";

import { LogOut, Settings, MessageCircle, Euro } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn/ui/avatar";
import { SessionUser } from "@/pages/api/auth/[...nextauth]";
import { Button } from "@/components/shadcn/ui/button";
import Link from "next/link";
import { signOut } from "next-auth/react";

const iconStyle = "m-2";
const itemStyle = "p-2 cursor-pointer";

function ProfileButton({ user }: { user: SessionUser }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex gap-2 items-center">
          <Avatar className="w-6 h-6">
            <AvatarImage src={user.profilePictureUrl} />
            <AvatarFallback>
              {user.firstName.slice(0, 1)}
              {user.lastName.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <span>
            {user.firstName} {user.lastName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuLabel className="text-center">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Settings size={16} className={iconStyle} />
          <Link href={`/user/${user.id}`} className={itemStyle}>
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Euro size={16} className={iconStyle} />
          <Link href={`/user/${user.id}/offers`} className={itemStyle}>
            Offers
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MessageCircle size={16} className={iconStyle} />
          <Link href={`/user/${user.id}/messages`} className={itemStyle}>
            Messages
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            signOut({ callbackUrl: "/" });
          }}
        >
          <LogOut size={16} className={iconStyle} />
          <span className={itemStyle}>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileButton;
