import { Card } from "@/components/shadcn/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn/ui/tabs";
import { UserOffersReturn } from "@/db/queries/getUserOffers";
import MyOffers from "./offerTabs/MyOffers";

interface UserOffersPageProps {
  data: UserOffersReturn["data"];
  id: string;
}

function UserOffersPage({ data, id }: UserOffersPageProps) {
  return (
    <div>
      <Tabs defaultValue="mine">
        <TabsList>
          <TabsTrigger value="mine">Mine</TabsTrigger>
          <TabsTrigger value="interested">Applied</TabsTrigger>
          <TabsTrigger value="accepted">Hired</TabsTrigger>
        </TabsList>
        <TabsContent value="mine">
          <MyOffers data={data?.myOffers ?? []} id={id} />
        </TabsContent>
        <TabsContent value="interested"></TabsContent>
        <TabsContent value="accepted"></TabsContent>
      </Tabs>
    </div>
  );
}

export default UserOffersPage;
