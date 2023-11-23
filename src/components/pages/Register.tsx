"use client";

import RegisterForm from "@/components/auth/RegisterFrom";
import ProfileCard from "@/components/pages/user/ui/ProfileCard";
import { useState } from "react";

interface RegisterPageProps {
  tags: { name: string; id: string }[];
}

function RegisterPage({ tags }: RegisterPageProps) {
  const [accountData, setaccountData] = useState({
    firstName: "John",
    lastName: "Doe",
    bio: "The greatest glory in living lies not in never falling, but in rising every time we fall. -Nelson Mandela",
    birthday: new Date(2001, 1, 1),
    displayName: "johndoe22",
    type: "user",
    profilePictureUrl: "http://placekitten.com/g/400/400",
    tags: ["back", "front"],
  });

  function changeAccountData(entry: string, value: any) {
    setaccountData({ ...accountData, [entry]: value });
  }

  return (
    <div className="flex h-full bg-login bg-cover justify-center">
      <div className="w-1/2 items-center justify-center lg:flex hidden">
        <div className="w-10/12 flex justify-center ">
          <ProfileCard {...accountData} />
        </div>
      </div>
      <div className="flex flex-col items-center lg:w-1/2 w-full justify-center bg-white ">
        <h2 className="text-lg font-bold p-4">Create an Account</h2>
        <RegisterForm change={changeAccountData} tags={tags} />
      </div>
    </div>
  );
}

export default RegisterPage;
