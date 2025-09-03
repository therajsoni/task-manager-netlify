import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import toast from "react-hot-toast";
import { Loader, Loader2 } from "lucide-react";
import { ClickProject } from "@/types";

import Select, { SingleValue } from "react-select";

export default function UpdateProjectDetails({
  id,
  oldData,
  open,
  setOpen,
}: {
  id: string;
  oldData: ClickProject;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [features, setFeatures] = useState({
    document: false,
  });
  const [data, setData] = useState({
    name: oldData?.name,
    status: oldData?.status,
    client: oldData?.client,
    description: oldData?.description,
    features: {
      document: false,
    },
    projectManager: oldData?.projectManager,
  });
  const [selectedManager, setSelectedManager] = useState<{
    label: string;
    value: string;
  } | null>({
    label: oldData?.projectManager?.username || "",
    value: oldData?.projectManager?._id || "",
  });
  console.log(oldData, "OLDADAT");
  const [loadingLoginUser, setLoadingLoginUser] = useState(false);
  const [allLoginUsers, setAllLoginUsers] = useState<
    { label: string; value: string }[] | null
  >(null);
  async function allLoginUser() {
    setLoadingLoginUser(true);
    const request = await fetch("/api/getAllUser", {
      method: "GET",
    });
    const response = await request.json();
    const responseFilter = response?.data?.filter(
      (item: {
        username: string;
        _id: string;
        password: string;
        role: string;
      }) => {
        return item.role === "project-manager";
      }
    );
    const dataUserName = responseFilter?.map(
      (item: {
        username: string;
        _id: string;
        password: string;
        role: string;
      }) => {
        return {
          label: item?.username,
          value: item?._id,
        };
      }
    );
    setAllLoginUsers(dataUserName);
    setLoadingLoginUser(false);
  }
  const handleUpdateField = async (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    console.log(e.target.value);

    setData({ ...data, [e.target.name]: e.target.value });
  };
  const [loading, setLoading] = useState(false);
  const updateProject = async () => {
    setLoading(true);
    if (data.name === "" || data.client === "") {
      toast.error("Enter Name and client field required");
      return;
    } else if (data.description === "") {
      data.description = "Here We Starting A New Project YOO!!";
    } else {
      const request = await fetch(`/api/project/patchById/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          id: id,
          projectManager: selectedManager?.value,
        }),
      });
      const response = await request.json();
      if (response?.success) {
        toast.success(response.message);
      } else {
        toast.error(response?.message);
      }
      window.location.reload();
      setLoading(false);
    }
  };
  function handleChange(option: SingleValue<{ label: string; value: string }>) {
    setSelectedManager(option);
  }
  useEffect(() => {
    allLoginUser();
  }, []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>Update Project</DialogTitle>
        <div className="flex justify-around items-center">
          <Label className="w-25">Name</Label>
          <Input
            value={data?.name}
            placeholder="name"
            name="name"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleUpdateField(e)
            }
          />
        </div>
        {/* <div className="flex justify-around items-center"> */}
        {/* <Label className="">Status</Label> */}
        {/* <Input value={data?.status} placeholder="status" name="status" onChange={(e:ChangeEvent<HTMLInputElement>) => handleUpdateField(e)} />
                <datalist>
                    <option value={"Pending"}>Pending</option>
                    <option value={"completed"}>Completed</option>
                    </datalist>     */}
        {/* <Select value={data?.status}
                    onValueChange={value => setData({
                        ...data,
                        status: value
                    })}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="select status"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem value={'completed'}>Completed</SelectItem>
                            <SelectItem value={'Pending'}>Pending</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div> */}
        <div className="flex justify-around items-center">
          <Label className="w-25">Client</Label>
          <Input
            value={data?.client}
            placeholder="client"
            name="client"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleUpdateField(e)
            }
          />
        </div>
        <div className="flex justify-around items-center">
          <Label className="w-25">Description</Label>
          <Textarea
            value={data?.description}
            placeholder="description"
            name="description"
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              handleUpdateField(e)
            }
          />
        </div>

        <div className="flex justify-around items-center">
          <Label className="w-24">Manager</Label>
          <div className="w-full">
            {/* {loadingLoginUser && <Loader className="animate-spin" />} */}
            <Select
              options={allLoginUsers || []}
              onChange={handleChange}
              isSearchable
              placeholder="Select Manager"
              value={selectedManager}
              isLoading={loadingLoginUser}
              loadingMessage={() => (
                <div className="text-lg text-black font-medium flex justify-center items-center">
                  <Loader2 className="animate-spin ml-1" />
                  <span className="text-lg text-black font-medium ">
                    Please Wait Getted Users
                  </span>
                </div>
              )}
            />
          </div>
        </div>

        {/* <div className="flex justify-around items-center">
          <Label className="w-24">Features</Label>
          <div className="w-[93%] border-1 rounded-[4px] p-2 border-gray-300">
            <div className="flex gap-2 flex-row">
              <div>Document</div>
              <input
                onChange={(e) => {
                  e.preventDefault();
                  setFeatures({
                    ...features,
                    document: e.target.checked,
                  });
                }}
                className="h-6 w-6"
                type="checkbox"
              />
            </div>
          </div>
        </div> */}
        <Button
          className="bg-black text-white"
          onClick={async () => {
            await updateProject();
          }}
        >
          {loading ? <Loader className="animate-spin" /> : "Update Project"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
