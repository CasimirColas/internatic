import RegisterPage from "@/components/pages/Register";
import { getTags } from "@/db/queries/getTags";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
};

async function Page() {
  const tags = await getTags();
  return <RegisterPage tags={tags} />;
}

export default Page;
