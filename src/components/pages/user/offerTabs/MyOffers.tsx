"use client";

import { UserOffersReturn } from "@/db/queries/getUserOffers";
import { Card } from "@/components/shadcn/ui/card";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/ui/table";
import { Button } from "@/components/shadcn/ui/button";
import { Plus, Cog, Trash } from "lucide-react";
import StatusLight from "../ui/StatusLight";
import { refreshPath } from "@/server/refrechPath";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/shadcn/ui/popover";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/shadcn/ui/alert-dialog";

import functionalPopup from "../../ui/functionalPopup";
import {
  CreateOfferArgs,
  createOffer,
} from "@/db/mutations/create/createOffer";
import { Input } from "@/components/shadcn/ui/input";
import { Tabs, TabsTrigger, TabsList } from "@/components/shadcn/ui/tabs";
import TagsMultiSelect from "../../ui/TagsMultiSelect";
import { deleteOffer } from "@/db/mutations/delete/deleteOffer";
import {
  UpdateOfferArgs,
  updateOffer,
} from "@/db/mutations/update/updateOffer";
import { Offer } from "@prisma/client";
import { set } from "date-fns";

type myOffersData = Exclude<UserOffersReturn["data"], null | undefined>;

interface MyOffersProps {
  data: myOffersData["myOffers"];
  id: string;
}

function MyOffers({ data, id }: MyOffersProps) {
  const path = `/user/${id}/offers/`;

  const defaultOffer: CreateOfferArgs = {
    title: "",
    description: "",
    pictureUrl: "https://placekitten.com/500/500",
    type: "internship",
    positions: 1,
    salary: 1000,
    startsAt: new Date(),
    status: "on",
    tags: [],
  };

  const [createOfferData, setcreateOfferData] =
    useState<CreateOfferArgs>(defaultOffer);

  const [updateModalOpen, setupdateModalOpen] = useState(false);
  const [createModalOpen, setcreateModalOpen] = useState(false);

  const [updateUserData, setupdateUserData] = useState<UpdateOfferArgs>({});

  async function handleDeleteOffer(id: string) {
    const res = await deleteOffer(id);
    refreshPath(path);
  }

  async function handleUpdateOffer(id: string) {
    const res = await updateOffer(id, updateUserData);
    setupdateUserData({});
    refreshPath(path);
  }

  async function handleCreateOffer() {
    const res = createOffer(createOfferData);
    setcreateOfferData(defaultOffer);
    refreshPath(path);
  }

  const DeleteButton = (id: string) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} className="flex gap-1">
          Delete
          <Trash size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            offer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={"destructive"}
              className="flex gap-1"
              onClick={async () => {
                await handleDeleteOffer(id);
                await refreshPath(path);
              }}
            >
              Delete
              <Trash size={16} />
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const CreateButton = () => (
    <Dialog
      open={createModalOpen}
      onOpenChange={() => {
        setcreateOfferData(defaultOffer);
        setcreateModalOpen(true);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={"default"}
          className="flex items-center gap-4"
          onClick={() => setcreateModalOpen(true)}
        >
          Create a new offer <Plus size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="p-4 flex flex-col">
          <h2 className="text-2xl font-semibold tracking-tight text-center">
            Create a new offer
          </h2>
          <label htmlFor="status">Status</label>
          <Tabs value={createOfferData.status}>
            <TabsList>
              <TabsTrigger
                value="on"
                onClick={() =>
                  setcreateOfferData({ ...createOfferData, status: "on" })
                }
              >
                On
              </TabsTrigger>
              <TabsTrigger
                value="off"
                onClick={() =>
                  setcreateOfferData({ ...createOfferData, status: "off" })
                }
              >
                Off
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <label htmlFor="title">Title</label>
          <Input
            type="text"
            id="title"
            value={createOfferData.title}
            onChange={(e) =>
              setcreateOfferData({ ...createOfferData, title: e.target.value })
            }
          />
          <label htmlFor="description">Description</label>
          <Input
            type="text"
            id="description"
            value={createOfferData.description}
            onChange={(e) =>
              setcreateOfferData({
                ...createOfferData,
                description: e.target.value,
              })
            }
          />
          <label htmlFor="pictureUrl">Picture url</label>
          <Input
            type="url"
            id="pictureUrl"
            value={createOfferData.pictureUrl}
            onChange={(e) =>
              setcreateOfferData({
                ...createOfferData,
                pictureUrl: e.target.value,
              })
            }
          />
          <label htmlFor="type">Type of contract:</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button id="type" variant="outline">
                {createOfferData.type}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col w-46 gap-2 bg-slate-100">
              <Button
                variant="outline"
                onClick={() => {
                  setcreateOfferData({
                    ...createOfferData,
                    type: "internship",
                  });
                }}
              >
                Internship
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setcreateOfferData({ ...createOfferData, type: "fixed" });
                }}
              >
                Fixed
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setcreateOfferData({ ...createOfferData, type: "open" });
                }}
              >
                Open ended
              </Button>
            </PopoverContent>
          </Popover>
          <label htmlFor="positions">Number of positions</label>
          <Input
            type="number"
            id="positions"
            value={createOfferData.positions}
            onChange={(e) =>
              setcreateOfferData({
                ...createOfferData,
                positions: parseInt(e.target.value),
              })
            }
          />
          <label htmlFor="salary">Salary</label>
          <Input
            type="number"
            id="salary"
            value={createOfferData.salary}
            onChange={(e) =>
              setcreateOfferData({
                ...createOfferData,
                salary: parseInt(e.target.value),
              })
            }
          />
          <label htmlFor="startsAt">Start date</label>
          <Input
            type="date"
            id="startsAt"
            value={createOfferData.startsAt.toISOString().split("T")[0]}
            onChange={(e) =>
              setcreateOfferData({
                ...createOfferData,
                startsAt: new Date(e.target.value),
              })
            }
          />
          <label htmlFor="endsAt">Start date</label>
          <Input
            type="date"
            id="endsAt"
            value={
              createOfferData.endsAt
                ? createOfferData.endsAt.toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              setcreateOfferData({
                ...createOfferData,
                startsAt: new Date(e.target.value),
              })
            }
          />
          <label htmlFor="tags">Tags</label>
          <TagsMultiSelect
            id="tags"
            value={createOfferData.tags}
            onChange={(e) =>
              setcreateOfferData({ ...createOfferData, tags: e })
            }
            className="mb-4"
          />
          <Button
            variant="default"
            onClick={async () => {
              await handleCreateOffer();
              setcreateModalOpen(false);
              await refreshPath(path);
            }}
          >
            Create Offer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const EditButton = (offer: Offer, id: string) => (
    <Dialog
      open={updateModalOpen}
      onOpenChange={() => setupdateModalOpen(false)}
    >
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="flex gap-1"
          onClick={async () => {
            await setupdateUserData({
              ...offer,
              id: undefined,
              //@ts-expect-error tags are not strings
              tags: offer.tags.map((e) => e.name),
            } as UpdateOfferArgs);
            setupdateModalOpen(true);
          }}
        >
          Edit
          <Cog size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="p-4 flex flex-col">
          <h2 className="text-2xl font-semibold tracking-tight text-center">
            Update the offer
          </h2>
          <label htmlFor="status">Status</label>
          <Tabs value={updateUserData.status}>
            <TabsList>
              <TabsTrigger
                value="on"
                onClick={() =>
                  setupdateUserData({ ...updateUserData, status: "on" })
                }
              >
                On
              </TabsTrigger>
              <TabsTrigger
                value="off"
                onClick={() =>
                  setupdateUserData({ ...updateUserData, status: "off" })
                }
              >
                Off
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <label htmlFor="title">Title</label>
          <Input
            type="text"
            id="title"
            value={updateUserData.title}
            onChange={(e) =>
              setupdateUserData({ ...updateUserData, title: e.target.value })
            }
          />
          <label htmlFor="description">Description</label>
          <Input
            type="text"
            id="description"
            value={updateUserData.description}
            onChange={(e) =>
              setupdateUserData({
                ...updateUserData,
                description: e.target.value,
              })
            }
          />
          <label htmlFor="pictureUrl">Picture url</label>
          <Input
            type="url"
            id="pictureUrl"
            value={updateUserData.pictureUrl}
            onChange={(e) =>
              setupdateUserData({
                ...updateUserData,
                pictureUrl: e.target.value,
              })
            }
          />
          <label htmlFor="type">Type of contract:</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button id="type" variant="outline">
                {updateUserData.type}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col w-46 gap-2 bg-slate-100">
              <Button
                variant="outline"
                onClick={() => {
                  setupdateUserData({
                    ...updateUserData,
                    type: "internship",
                  });
                }}
              >
                Internship
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setupdateUserData({ ...updateUserData, type: "fixed" });
                }}
              >
                Fixed
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setupdateUserData({ ...updateUserData, type: "open" });
                }}
              >
                Open ended
              </Button>
            </PopoverContent>
          </Popover>
          <label htmlFor="positions">Number of positions</label>
          <Input
            type="number"
            id="positions"
            value={updateUserData.positions}
            onChange={(e) =>
              setupdateUserData({
                ...updateUserData,
                positions: parseInt(e.target.value),
              })
            }
          />
          <label htmlFor="salary">Salary</label>
          <Input
            type="number"
            id="salary"
            value={updateUserData.salary}
            onChange={(e) =>
              setupdateUserData({
                ...updateUserData,
                salary: parseInt(e.target.value),
              })
            }
          />
          <label htmlFor="startsAt">Start date</label>
          <Input
            type="date"
            id="startsAt"
            value={updateUserData.startsAt?.toISOString().split("T")[0]}
            onChange={(e) =>
              setupdateUserData({
                ...updateUserData,
                startsAt: new Date(e.target.value),
              })
            }
          />
          <label htmlFor="endsAt">Start date</label>
          <Input
            type="date"
            id="endsAt"
            value={
              updateUserData.endsAt
                ? updateUserData.endsAt.toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              setupdateUserData({
                ...updateUserData,
                startsAt: new Date(e.target.value),
              })
            }
          />
          <label htmlFor="tags">Tags</label>
          <TagsMultiSelect
            id="tags"
            value={updateUserData.tags}
            onChange={(e) => setupdateUserData({ ...updateUserData, tags: e })}
            className="mb-4"
          />
          <Button
            variant="default"
            onClick={async () => {
              await handleUpdateOffer(offer.id);
              setupdateModalOpen(false);
              await refreshPath(path);
            }}
          >
            Update Offer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <Card className="p-4 flex flex-col gap-4">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        My offers:
      </h2>
      <div className="flex gap-4 items-center">
        {CreateButton()}
        <p>Offer statuses:</p>
        <div className="flex border rounded-lg border-gray-200 p-2 items-center gap-4">
          <p>On:</p>
          <StatusLight status="on" size={16} />
          <p>Off</p>
          <StatusLight status="off" size={16} />
          <p>Full</p>
          <StatusLight status="full" size={16} />
          <p>Fulfilled</p>
          <StatusLight status="fulfilled" size={16} />
        </div>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Starting</TableHead>
              <TableHead>Ending</TableHead>
              <TableHead>Interested</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((e) => (
              <TableRow key={e.id}>
                <TableCell>{e.title}</TableCell>
                <TableCell>
                  <StatusLight status={e.status} size={20} />
                </TableCell>
                <TableCell>{e.type}</TableCell>
                <TableCell>{e.salary} $</TableCell>
                <TableCell>{e.startsAt.toDateString()}</TableCell>
                <TableCell>
                  {e.endsAt ? e.endsAt.toDateString() : "to be determined"}
                </TableCell>
                <TableCell>{e.interestedInIds.length}</TableCell>
                <TableCell className="flex justify-center gap-2">
                  {EditButton(e, e.id)}
                  {DeleteButton(e.id)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Card>
  );
}

export default MyOffers;
