import UserPage from "@/components/pages/User";
import { getUserInfo } from "@/db/queries/getUserInfo";

async function Page({ params }: { params: { id: string } }) {
  const user = await getUserInfo(params.id);
  if (!user.success) return <div>Something went wrong</div>;
  return <UserPage user={user.data} id={params.id} />;
}

export default Page;
