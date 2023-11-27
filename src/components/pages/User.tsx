"use client";

import { UserInfoReturn } from "@/db/queries/getUserInfo";
import { useState } from "react";
import { UpdateUserArgs } from "@/db/mutations/update/updateUser";
import DetailedUserProfile from "./user/ui/DetailedUserProfile";
import { Settings } from "lucide-react";
import { Button } from "../shadcn/ui/button";
import { Dialog, DialogContent } from "../shadcn/ui/dialog";
import { Input } from "../shadcn/ui/input";
import { Textarea } from "../shadcn/ui/textarea";
import { updateUser } from "@/db/mutations/update/updateUser";
import { deleteUser } from "@/db/mutations/delete/deleteUser";
import { signOut } from "next-auth/react";
import TagsMultiSelect from "./ui/TagsMultiSelect";
import { useToast } from "../shadcn/ui/use-toast";
import { refreshPath } from "@/server/refrechPath";
import { Card } from "../shadcn/ui/card";

interface UserPageProps {
  user: UserInfoReturn["data"];
  id: string;
}

function UserPage({ user, id }: UserPageProps) {
  const { toast } = useToast();

  const [updateUserData, setupdateUserData] = useState<UpdateUserArgs>({
    tags: user?.tags.map((e) => e.name),
  });

  const [changePass, setchangePass] = useState<boolean>(false);

  const defaultPasswords = {
    password: "",
    newPassword: "",
    confirm: "",
  };

  const [passwords, setpasswords] = useState(defaultPasswords);

  async function handleChangePassword() {
    if (passwords.password === user?.password) {
      if (passwords.newPassword === passwords.confirm) {
        const res = await updateUser(user.id, {
          password: passwords.newPassword,
        });
        if (res.success) {
          toast({
            description: "Password changed successfully",
            className: "bg-green-500 text-white",
          });
          setchangePass(false);
        } else {
          toast({
            description: "Something went wrong",
            variant: "destructive",
          });
        }
      } else {
        toast({
          description: "Passwords do not match",
          variant: "destructive",
        });
      }
      return;
    }
    toast({ description: "Wrong password", variant: "destructive" });
  }

  function handleDelete() {
    if (!user?.id) return;
    if (confirm("Are you sure you want to delete your account?")) {
      deleteUser(user.id);
      signOut();
      alert("Account deleted successfully");
    }
  }

  async function handleChangeProfile() {
    const res = await updateUser(id, updateUserData);
    if (!res.success) {
      toast({
        description: "Something went wrong",
        variant: "destructive",
      });
    } else {
      toast({
        description: "Profile updated successfully",
        className: "bg-green-500 text-white",
      });
    }
  }

  function isValidDate(d: Date) {
    return d instanceof Date && !isNaN(d.getTime());
  }

  return (
    <>
      <div className="w-full h-full p-4 flex gap-4 items-center justify-start flex-col ">
        <div className="lg:w-10/12 w-full h-10/12">
          <DetailedUserProfile data={user} />
        </div>
        <Card className="lg:w-10/12 w-full flex flex-col items-center p-4 gap-4 h-10/12">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold leading-none tracking-tight">
              Profile seetings
            </h3>
            <Settings size={24} />
          </div>

          <div className="flex flex-col w-full px-2 ">
            <div className="flex gap-4 items-center  justify-center w-full mb-2">
              <Button
                className="bg-green-500 hover:bg-green-200 hover:text-green-500 w-1/2"
                onClick={async () => {
                  await handleChangeProfile();
                  refreshPath(`/user/${id}`);
                }}
              >
                Update my informations
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-200 hover:text-red-500 w-1/2"
                onClick={handleDelete}
              >
                Delete my account
              </Button>
            </div>
            <Button
              onClick={() => setchangePass(true)}
              variant={"secondary"}
              className="w-full mb-2"
            >
              Change password
            </Button>
            <label htmlFor="profilePictureUrl">Profile picture</label>
            <Input
              type="url"
              className="mb-4"
              id="profilePictureUrl"
              value={
                updateUserData?.profilePictureUrl ??
                user?.profilePictureUrl ??
                ""
              }
              onChange={(e) =>
                setupdateUserData({
                  ...updateUserData,
                  profilePictureUrl: e.target.value,
                })
              }
            />
            <label htmlFor="firstName">First name</label>
            <Input
              className="mb-4"
              type="text"
              id="firstName"
              value={updateUserData?.firstName ?? user?.firstName}
              onChange={(e) =>
                setupdateUserData({
                  ...updateUserData,
                  firstName: e.target.value,
                })
              }
            />
            <label htmlFor="email">Email</label>
            <Input
              className="mb-4"
              type="email"
              id="email"
              value={updateUserData?.email ?? user?.email}
              onChange={(e) =>
                setupdateUserData({
                  ...updateUserData,
                  email: e.target.value,
                })
              }
            />

            <label htmlFor="lastName">Last name</label>
            <Input
              className="mb-4"
              type="text"
              id="lastName"
              value={updateUserData?.lastName ?? user?.lastName}
              onChange={(e) =>
                setupdateUserData({
                  ...updateUserData,
                  lastName: e.target.value,
                })
              }
            />
            <label htmlFor="displayName">Username</label>
            <Input
              className="mb-4"
              type="text"
              id="displayName"
              value={updateUserData?.displayName ?? user?.displayName}
              onChange={(e) =>
                setupdateUserData({
                  ...updateUserData,
                  displayName: e.target.value,
                })
              }
            />
            <label htmlFor="birthday">Birthday</label>
            <Input
              className="mb-4"
              type="date"
              id="birthday"
              value={
                updateUserData?.birthday &&
                isValidDate(updateUserData?.birthday)
                  ? updateUserData?.birthday.toISOString().split("T")[0]
                  : user?.birthday.toISOString().split("T")[0]
              }
              onChange={(e) =>
                setupdateUserData({
                  ...updateUserData,
                  birthday: new Date(e.target.value),
                })
              }
            />
            <label htmlFor="tags">Tags</label>

            <TagsMultiSelect
              value={updateUserData?.tags}
              onChange={(e) =>
                setupdateUserData({ ...updateUserData, tags: e })
              }
            />
            <label htmlFor="bio">Bio</label>
            <Textarea
              className="mb-4"
              id="bio"
              value={updateUserData?.bio ?? user?.bio ?? ""}
              onChange={(e) =>
                setupdateUserData({ ...updateUserData, bio: e.target.value })
              }
            />
          </div>
        </Card>
      </div>
      <Dialog
        open={changePass}
        onOpenChange={() => {
          setpasswords(defaultPasswords);
          setchangePass(false);
        }}
      >
        <DialogContent>
          <label htmlFor="password">Current password</label>
          <Input
            type="password"
            id="password"
            value={passwords.password}
            onChange={(e) =>
              setpasswords({ ...passwords, password: e.target.value })
            }
          />
          <label htmlFor="newPassowrd">New password</label>
          <Input
            type="password"
            id="newPassowrd"
            value={passwords.newPassword}
            onChange={(e) =>
              setpasswords({ ...passwords, newPassword: e.target.value })
            }
          />
          <label htmlFor="confirm">Confirm</label>
          <Input
            type="password"
            id="confirm"
            value={passwords.confirm}
            onChange={(e) =>
              setpasswords({ ...passwords, confirm: e.target.value })
            }
          />
          <Button onClick={handleChangePassword}>Change password</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default UserPage;
