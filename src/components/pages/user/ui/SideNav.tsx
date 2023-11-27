"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { UserCircleIcon, Layers, MessageCircle } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function SideUserNav({
  className,
  userId,
}: {
  className?: string;
  userId: string;
}) {
  const pathname = usePathname();
  const links = [
    { name: "Profile", href: `/user/${userId}`, icon: <UserCircleIcon /> },
    {
      name: "Offers",
      href: `/user/${userId}/offers`,
      icon: <Layers />,
    },
    {
      name: "Messages",
      href: `/user/${userId}/messages`,
      icon: <MessageCircle />,
    },
  ];
  return (
    <div
      className={twMerge(
        "flex flex-col justify-around gap-8 px-4 py-2  w-full",
        className
      )}
    >
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 text-sm font-medium hover:bg-red-100 hover:text-destructive flex-none mjustify-start p-2 px-3",
              {
                "bg-red-100 text-destructive border-destructive border":
                  pathname === link.href,
              }
            )}
          >
            {LinkIcon}
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </div>
  );
}
