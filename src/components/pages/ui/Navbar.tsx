"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/shadcn/ui/button";
import { useSession } from "next-auth/react";
import ProfileButton from "./ProfileButton";

function Navbar() {
  const session = useSession();
  return (
    <nav className="p-2 flex justify-between items-center border-b">
      <div className=" flex justify-center gap-2">
        {session.data?.user?.type === "admin" ? (
          <Button asChild variant={"destructive"}>
            <Link href={"/dashboard"}>Dashboard</Link>
          </Button>
        ) : null}
        <Button asChild variant={"destructive"}>
          <Link href={"/"} className="flex gap-2 items-center">
            <Search size={16} />
            <span>Browse opportunities</span>
          </Link>
        </Button>
        {session.status === "authenticated" ? (
          <Button variant={"ghost"}>
            <span>Create an offer</span>
          </Button>
        ) : null}
      </div>
      <div className="flex items-center gap-4">
        <h1 className="font-extrabold text-xl">Internatic</h1>
        <p className="text-xs font-light">powered by Casimir Colas</p>
      </div>
      {session.data?.user ? (
        <ProfileButton user={session.data?.user} />
      ) : (
        <div className="flex justify-center gap-2">
          <Button asChild variant={"link"}>
            <Link href={"/login"}>Login</Link>
          </Button>
          <Button asChild>
            <Link href={"/register"}>Register</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
