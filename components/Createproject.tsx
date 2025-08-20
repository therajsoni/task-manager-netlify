import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import Select, { SingleValue } from "react-select";

export default function CreateProjectDialog({ open, setOpen,
    //  setRefreshAppSidebarProject 
}: {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
}) {

    const [allLoginUsers, setAllLoginUsers] = useState<{ label: string; value: string }[] | null>(null);
    const [selectedManager, setSelectedManager] = useState<{ label: string, value: string } | null>(null);

    function handleChange(option: SingleValue<{ label: string; value: string; }>) {
        setSelectedManager(option);
    }

    const [loading, setLoading] = useState<boolean>(false);
    // const router = useRouter();

    const [data, setData] = useState({
        name: "",
        client: "",
        description: "",
    });
    const createProject = async (submitData: { name: string, client: string, description: string }) => {
        setLoading(true);
        if (selectedManager?.value === "") {
            toast.error("Please select project manager");
            return;
        }
        console.log(submitData, "client side 27");
        const request = await fetch("/api/project/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...submitData, projectManager: selectedManager?.value })
        });
        const response = await request.json();
        if (response?.success) {
            toast.success("Project Created Successfully");
            setData({
                name: "",
                client: "",
                description: ""
            });
            setSelectedManager({
                label: "Select Manager", value: ""
            })
        } else {
            console.log(response);

            toast.error(response?.message, {
                duration: 3000
            });
            setData({
                name: "",
                client: "",
                description: ""
            });
        }
        setLoading(false);
        window.location.reload();
        // setRefreshAppSidebarProject(true)
    }
    async function submitForm() {

        if (data.name === "" || data.client === "") {
            toast.error("Enter Name and client field required");
            return;
        }
        // if (data.status === "") {
        //     data.status = "Pending"
        // }
        if (data.description === "") {
            data.description = "Here We Starting A New Project YOO!!"
        }
        if (selectedManager?.value === "") {
            toast.error("Enter project manager");
            return;
        }
        createProject(data);
    }
    async function allLoginUser() {
        const request = await fetch("/api/getAllUser", {
            method: "GET"
        });
        const response = await request.json();
        console.log(response , "Response");
        
        const responseFilter = response?.data?.filter((item: {
            username: string,
            _id: string,
            password: string,
            role: string
        }) => {
            return item.role === "project-manager"
        })
        const dataUserName = responseFilter?.map((item: {
            username: string,
            _id: string,
            password: string,
            role: string
        }) => {
            return {
                label: item?.username,
                value: item?._id,
            }
        });
        setAllLoginUsers(dataUserName)
    }
    useEffect(() => {
        allLoginUser();
    }, []);
    return (<Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogTitle>Create Project</DialogTitle>
            <div className="flex justify-around items-center">
                <Label className="w-24">Name</Label>
                <Input
                    value={data?.name}
                    placeholder="name" name="name"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setData({
                        ...data,
                        [e.target.name]: e.target.value
                    })}
                />
            </div>
            {/* <div className="flex justify-around items-center">
                <Label className="w-24">Status</Label>
                <Select value={data?.status}
                    onValueChange={value => setData({
                        ...data,
                        status: value
                    })}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="select status">
                            {data?.status || "Select Status"}
                        </SelectValue>
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
                <Label className="w-24">Client</Label>
                <Input
                    value={data?.client}
                    placeholder="client" name="client"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setData({
                        ...data,
                        [e.target.name]: e.target.value
                    })} />
            </div>
            <div className="flex justify-around items-center">
                <Label className="w-24">Manager</Label>
                <div className="w-full">
                    <Select
                        options={allLoginUsers || []}
                        onChange={handleChange}
                        isSearchable
                        placeholder="Select Manager"
                        value={selectedManager}
                    />
                </div>
            </div>
            <div className="flex justify-around items-center">
                <Label className="w-24">Description</Label>
                <Textarea
                    value={data?.description}
                    placeholder="description"
                    name="description"
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setData({
                        ...data,
                        [e.target.name]: e.target.value
                    })}
                />
            </div>
            <Button className="bg-black text-white" onClick={async () => {
                await submitForm();
            }}>
                {
                    loading ? <Loader className="animate-spin" /> : "Create New"
                }
            </Button>
        </DialogContent>
    </Dialog>)
}
// projectManager