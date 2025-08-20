import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { ClickProject } from "@/types";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";

export default function UpdateProjectDetails({ id, oldData, open, setOpen }: {
    id: string,
    oldData: ClickProject,
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
}) {
    const [data, setData] = useState({
        name: oldData?.name,
        status: oldData?.status,
        client: oldData?.client,
        description: oldData?.description
    });
    const handleUpdateField = async (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault()
        console.log(e.target.value);

        setData({ ...data, [e.target.name]: e.target.value })
    }
    const [loading, setLoading] = useState(false);
    const updateProject = async () => {
        setLoading(true);
        if (data.name === "" || data.client === "") {
            toast.error("Enter Name and client field required");
            return;
        }
        else if (data.description === "") {
            data.description = "Here We Starting A New Project YOO!!"
        }
        else {
            const request = await fetch(`/api/project/patchById/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...data, id: id })
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
    }
    
    
    return (<Dialog open={open} onOpenChange={setOpen} >
        <DialogContent>
            <DialogTitle>Update Project</DialogTitle>
            <div className="flex justify-around items-center">
                <Label className="w-25">Name</Label>
                <Input value={data?.name} placeholder="name" name="name" onChange={(e: ChangeEvent<HTMLInputElement>) => handleUpdateField(e)} />
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
                <Input value={data?.client} placeholder="client" name="client" onChange={(e: ChangeEvent<HTMLInputElement>) => handleUpdateField(e)} />
            </div>
            <div className="flex justify-around items-center">
                <Label className="w-25">Description</Label>
                <Textarea value={data?.description} placeholder="description" name="description" onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleUpdateField(e)} />
            </div>
            <Button className="bg-black text-white" onClick={async () => {
                await updateProject();
            }}>
                {
                    loading ? <Loader  className="animate-spin"  /> : "Update Project"
                }
            </Button>
        </DialogContent>
    </Dialog>)
}