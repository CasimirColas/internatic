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
import { Input } from "@/components/shadcn/ui/input";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Github, Linkedin } from "lucide-react";
import { useRouter } from "next/navigation";

function LoginForm() {
  const [errorMessage, seterrorMessage] = useState("");
  const router = useRouter();

  const FormSchema = z.object({
    email: z.string().min(2, {
      message: "Email must be at least 2 characters.",
    }),
    password: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSignIn(values: z.infer<typeof FormSchema>) {
    const req = await signIn("credentials", {
      ...values,
      redirect: false,
    });
    if (req?.error) {
      seterrorMessage(req.error);
    }
    if (req?.ok) {
      seterrorMessage("");
      console.log(req);
      router.push("/");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((e) => {
          handleSignIn(e);
        })}
        className="space-y-6 sm:w-1/2 w-10/12"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@mail.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
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
        {errorMessage !== "" ? (
          <p className="text-red-500 text-center border border-red-500 rounded-md p-2">
            {errorMessage}
          </p>
        ) : null}
        <Button type="submit" className="w-full">
          Log in
        </Button>
        <span className="flex w-full justify-center items-center gap-4">
          <span className="border-t border-gray-500 w-full" />
          <p className="whitespace-nowrap text-gray-500">or continue with</p>
          <span className="border-t border-gray-500 w-full" />
        </span>
        <div className="flex flex-col gap-2">
          <Button type="button" className="w-full flex items-center gap-2">
            <Github size={16} />
            <span>Github</span>
          </Button>
          <Button type="button" className="w-full flex items-center gap-2">
            <Linkedin size={16} />
            <span>LinkedIn</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default LoginForm;
