import UserOffersPage from "@/components/pages/user/UserOffers";
import { getUserOffers } from "@/db/queries/getUserOffers";

async function Page({ params }: { params: { id: string } }) {
  const offers = await getUserOffers(params.id);
  if (!offers.data) return <div>Something went wrong</div>;
  return <UserOffersPage data={offers.data} id={params.id} />;
}

export default Page;
