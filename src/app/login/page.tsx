import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

function Page() {
  return (
    <div className="flex h-full bg-login bg-cover justify-end">
      <div className="flex flex-col items-center w-1/2 justify-center bg-white gap-4">
        <h2 className="text-lg font-bold p-4">Log into your Account</h2>
        <LoginForm />
      </div>
    </div>
  );
}

export default Page;
