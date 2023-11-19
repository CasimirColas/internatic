"use client";

import LoginForm from "@/components/auth/LoginForm";
import { useSession } from "next-auth/react";

function Page() {
  const session = useSession();
  console.log(session.data?.user);

  return (
    <div className="flex flex-col items-center">
      <LoginForm />
    </div>
  );
}

export default Page;
