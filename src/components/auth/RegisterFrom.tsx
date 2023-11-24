"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/shadcn/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn/ui/form";
import { Input } from "../shadcn/ui/input";
import { useForm } from "react-hook-form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn/ui/tabs";
import { Textarea } from "../shadcn/ui/textarea";
import { useState } from "react";
import { ArrowBigRight, Check, ArrowBigLeft } from "lucide-react";
import MultiSelect, { MultiSelectItem } from "../pages/user/ui/MultiSelect";
import { registerUser } from "@/db/mutations/create/registerUser";
import { RegisterFormClientInput } from "@/db/mutations/create/registerUser";
import { useRouter } from "next/navigation";

interface RegisterFormProps {
  change: (entry: string, value: any) => void;
  tags: { name: string; id: string }[];
}

function RegisterForm({ change, tags }: RegisterFormProps) {
  const router = useRouter();
  const [currentTab, setcurrentTab] = useState("information");
  const [errorMessage, seterrorMessage] = useState("");
  const [createUserData, setcreateUserData] = useState<RegisterFormClientInput>(
    {
      type: "user",
      firstName: "",
      lastName: "",
      email: "",
      birthday: new Date(),
      displayName: "",
      profilePictureUrl: "",
      bio: "",
      tags: tags.slice(0, 2).map((tag) => {
        return { label: tag.name, value: tag.name, id: tag.id };
      }),
      password: "",
    }
  );

  const tabStyle = "h-[450px]";
  const innerTabStyle = "h-full flex flex-col gap-1";

  async function handleRegister(data: RegisterFormClientInput) {
    const res = await registerUser(data);
    if (res.success) {
      router.push("/login");
    } else {
      seterrorMessage(res.message);
      console.error(res.errorCode);
    }
  }

  const FormSchema1 = z.object({
    type: z.enum(["user", "company"]),
    firstName: z.string().min(2, {
      message: "Your first name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "Your last name must be at least 2 characters.",
    }),
    email: z
      .string()
      .min(1, { message: "This field has to be filled." })
      .email("This is not a valid email."),
    birthday: z.date().refine(
      (date) => {
        return new Date().getFullYear() - date.getFullYear() > 18;
      },
      {
        message: "You must be at least 18 years old.",
      }
    ),
  });
  const form1 = useForm<z.infer<typeof FormSchema1>>({
    resolver: zodResolver(FormSchema1),
    defaultValues: {
      type: "user",
      firstName: "",
      lastName: "",
      email: "",
      birthday: new Date(),
    },
  });
  const tab1 = (
    <div className={innerTabStyle}>
      <Form {...form1}>
        <form
          onSubmit={form1.handleSubmit((e) => {
            setcreateUserData({ ...createUserData, ...e });
            setcurrentTab("profile");
          })}
          className="w-full h-full flex flex-col justify-between gap-2"
        >
          <FormField
            control={form1.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormMessage />
                <FormControl>
                  <Tabs defaultValue={createUserData.type}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger
                        value="user"
                        onClick={() => {
                          form1.setValue("type", "user");
                          change("type", "user");
                        }}
                      >
                        Developper
                      </TabsTrigger>
                      <TabsTrigger
                        value="company"
                        onClick={() => {
                          form1.setValue("type", "company");
                          change("type", "company");
                        }}
                      >
                        Company
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form1.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormMessage />
                <FormControl>
                  <Input
                    placeholder="John"
                    onChange={(e) => {
                      form1.setValue("firstName", e.target.value);
                      change("firstName", e.target.value);
                    }}
                    value={field.value}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form1.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormMessage />
                <FormControl>
                  <Input
                    placeholder="Doe"
                    onChange={(e) => {
                      form1.setValue("lastName", e.target.value);
                      change("lastName", e.target.value);
                    }}
                    value={field.value}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form1.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormMessage />
                <FormControl>
                  <Input
                    placeholder="john.doe@mailbox.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form1.control}
            name="birthday"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birthday</FormLabel>
                <FormMessage />
                <FormControl>
                  <Input
                    type="date"
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      form1.setValue("birthday", date);
                      change("birthday", date);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full mt-auto flex items-center justify-center gap-2"
          >
            Next
            <ArrowBigRight size={16} />
          </Button>
        </form>
      </Form>
    </div>
  );
  const FormSchema2 = z.object({
    displayName: z.string().min(2, {
      message: "Your username must be at least 2 characters.",
    }),
    profilePictureUrl: z
      .string()
      .min(10, {
        message: "An image url is usually longer.",
      })
      .url("This is not a valid url."),
    bio: z
      .string()
      .min(20, { message: "Your bio must be at least 20 characters." }),
  });

  const form2 = useForm<z.infer<typeof FormSchema2>>({
    resolver: zodResolver(FormSchema2),
    defaultValues: {
      displayName: "",
      profilePictureUrl: "http://placekitten.com/g/400/400",
      bio: "",
    },
  });
  const tab2 = (
    <div className={innerTabStyle}>
      <Form {...form2}>
        <form
          onSubmit={form2.handleSubmit((e) => {
            setcreateUserData({ ...createUserData, ...e });
            setcurrentTab("confirmation");
          })}
          className="w-full h-full flex flex-col justify-between gap-2"
        >
          <FormField
            control={form2.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormMessage />
                <FormControl>
                  <Input
                    placeholder="johndoe99"
                    onChange={(e) => {
                      form2.setValue("displayName", e.target.value);
                      change("displayName", e.target.value);
                    }}
                    value={field.value}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form2.control}
            name="profilePictureUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Picture</FormLabel>
                <FormMessage />
                <FormControl>
                  <Input
                    placeholder="http://placekitten.com/g/400/400"
                    onChange={(e) => {
                      form2.setValue("profilePictureUrl", e.target.value);
                      change("profilePictureUrl", e.target.value);
                    }}
                    value={field.value}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form2.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biography</FormLabel>
                <FormMessage />
                <FormControl>
                  <Textarea
                    placeholder="The greatest glory in living lies not in never falling, but in rising every time we fall. -Nelson Mandela"
                    onChange={(e) => {
                      form2.setValue("bio", e.target.value);
                      change("bio", e.target.value);
                    }}
                    value={field.value}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 my-2">
              Tags
            </label>
            <MultiSelect
              placeholder="Select your tags"
              options={tags.map((tag) => {
                return { label: tag.name, value: tag.name, id: tag.id };
              })}
              value={createUserData.tags}
              set={(value: MultiSelectItem[]) => {
                setcreateUserData({ ...createUserData, tags: value });
                change(
                  "tags",
                  value.map((t) => t.value)
                );
              }}
            />
          </div>
          <div className="mt-auto flex gap-4">
            <Button
              type="button"
              onClick={() => setcurrentTab("information")}
              variant={"outline"}
              className="bg-gray-200"
            >
              <ArrowBigLeft size={16} />
            </Button>
            <Button type="submit" className="w-full">
              Next
              <ArrowBigRight size={16} />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
  const FormSchema3 = z
    .object({
      password: z.string().min(6, {
        message: "Your password must be at least 6 characters.",
      }),
      confirmPassword: z.string().min(6, {
        message: "Your password must be at least 6 characters.",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Your passwords must match.",
      path: ["confirmPassword"],
    });
  const form3 = useForm<z.infer<typeof FormSchema3>>({
    resolver: zodResolver(FormSchema3),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const tab3 = (
    <div className={innerTabStyle}>
      <Form {...form3}>
        <form
          onSubmit={form3.handleSubmit((e) => {
            handleRegister({ ...createUserData, password: e.password });
          })}
          className="w-full h-full flex flex-col justify-between gap-2"
        >
          <FormField
            control={form3.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="**********" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form3.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm your password</FormLabel>
                <FormControl>
                  <Input placeholder="**********" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {errorMessage === "" ? null : (
            <p className="text-red-500 text-center border border-red-500 rounded-md p-2">
              {errorMessage}
            </p>
          )}
          <div className="mt-auto flex gap-4">
            <Button
              type="button"
              onClick={() => setcurrentTab("profile")}
              variant={"outline"}
              className="bg-gray-200"
            >
              <ArrowBigLeft size={16} />
            </Button>
            <Button
              type="submit"
              className="w-full mt-auto flex items-center justify-center gap-2"
            >
              Create account
              <Check size={16} />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
  return (
    <Tabs defaultValue="information" value={currentTab} className="p-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="information">Informations</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="confirmation">Confirmation</TabsTrigger>
      </TabsList>
      <TabsContent value="information" className={tabStyle}>
        {tab1}
      </TabsContent>
      <TabsContent value="profile" className={tabStyle}>
        {tab2}
      </TabsContent>
      <TabsContent value="confirmation" className={tabStyle}>
        {tab3}
      </TabsContent>
    </Tabs>
  );
}

export default RegisterForm;
