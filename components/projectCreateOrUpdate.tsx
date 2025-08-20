"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
// import { useRouter } from "next/navigation";
import {  ChangeEvent, Dispatch, SetStateAction, useLayoutEffect, useState } from "react";
import toast from "react-hot-toast";
import { Textarea } from "./ui/textarea";
import { ProjectOne } from "@/types";
import { 
    // DoorClosed,
     Loader } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";

export default function ProjectCreateAndUpdate({ action, id, actionUpdateData, setUpdatedFieldDialogOpen, actionCreateUpdate, setActionCreateUpdate, setAddDialog, addDialog }: {
    action: string,
    id?: string,
    actionUpdateData?: ProjectOne,
    setUpdatedFieldDialogOpen?: Dispatch<SetStateAction<boolean>>, // 
    actionCreateUpdate?: {
        open : boolean , 
        action : string,
    }, //
    setActionCreateUpdate?: Dispatch<SetStateAction<{
        open : boolean , 
        action : string
    }>>,//
    setAddDialog?: Dispatch<SetStateAction<boolean>>,//
    addDialog?: boolean//
}) {

    console.log(addDialog , actionCreateUpdate);
    console.log(setUpdatedFieldDialogOpen);
    console.log(setActionCreateUpdate,setAddDialog);
    
    const [loading, setLoading] = useState<boolean>(false);
    // const router = useRouter();

    const createProject = async (submitData: { name: string, client: string, description: string }) => {
        setLoading(true);
        console.log(submitData, "client side 27");

        const request = await fetch("/api/project/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(submitData)
        });
        const response = await request.json();
        if (response?.success) {
            toast.success("Project Created Successfully");
            setData({
                name: "",
                client: "",
                description: "",
                status: "",
            });
        } else {
            toast.error(response?.message);
            setData({
                name: "",
                client: "",
                description: "",
                status: "",
            });
        }
        setLoading(false);
        window.location.reload();
    }
    const updateProject = async (id: string, submitData: { name: string, client: string, description: string, status: string }) => {
        setLoading(false);
        console.log(submitData, "client side 58 update");

        const request = await fetch(`/api/project/patchById/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({...submitData,id : id})
        });
        const response = await request.json();
        if (response?.success) {
            toast.success(response?.message);
        } else {
            toast.error(response?.message);
        }
        setLoading(false);
        window.location.reload();
    }

    const [data, setData] = useState({
        name: "",
        client: "",
        description: "",
        status: "pending",
    });

    async function submitForm() {

        if (data.name === "" || data.client === "") {
            toast.error("Enter Name and client field required");
            return;
        }
        if (data.description === "") {
            data.description = "Here We Starting A New Project YOO!!"
        }
        // call the api
        if (action === "createProject") {
            createProject(data);
        } else if (action === "updateProject" && id !== undefined) {
            updateProject(id, data);
        }
    }
    useLayoutEffect(() => {
        if (action === "updateProject") {
            setData({
                name: actionUpdateData?.name ?? "",
                client: actionUpdateData?.client ?? "",
                description: actionUpdateData?.description ?? "",
                status: actionUpdateData?.status ?? "",
            });
        }
    }, [action , actionUpdateData ]);
    console.log(addDialog,"126");
    

    return (
        <Dialog open={addDialog} onOpenChange={setAddDialog}>
            <DialogContent>
                    <DialogTitle></DialogTitle>
        <div className="flex w-full mt-[120px] items-center justify-center pt-6 pb-6 md:pt-10 md:pb-10 h-[500px]">
            <div className="w-full max-w-sm">
                <Card className="w-[500px]">
                    <CardHeader>
                        <CardTitle style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }} ><h1 className="font-extrabold text-lg">
                                {action === "createProject" ? "Create " : "Edit "} Your Project
                            </h1>
                            {/* <><DoorClosed onClick={() => {
                                if (setUpdatedFieldDialogOpen !== undefined) {
                                    setUpdatedFieldDialogOpen((prev: boolean) => !prev) // 
                                }
                                if (setAddDialog !== undefined) {
                                    setAddDialog(false);
                                }
                                if (setActionCreateUpdate !== undefined) {
                                    setActionCreateUpdate({
                                        open: false,
                                        action: ""
                                    })
                                }
                            }} /></> */}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="name">Name Of Project</Label>
                                    <Input
                                        value={data?.name}
                                        id="name"
                                        type="name"
                                        placeholder="Amazon"
                                        required
                                        name="name"
                                        onChange={(e:ChangeEvent<HTMLInputElement>) => {
                                            e.preventDefault();
                                            setData({ ...data, name: e.target.value });
                                        }}
                                        disabled={action === "updateProject"}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <div className="flex items-center">
                                        <Label htmlFor="client">Client</Label>
                                    </div>
                                    <Input value={data?.client} id="client" type="text" name="client" placeholder="Joef Beoz" required onChange={(e:ChangeEvent<HTMLInputElement>) => {
                                        e.preventDefault();
                                        setData({ ...data, client: e.target.value });
                                    }} />
                                </div>
                                {
                                    action === "updateProject" && <>
                                        <div className="grid gap-3">
                                            <div className="flex items-center">
                                                <Label htmlFor="status">Status</Label>
                                            </div>
                                            <Input value={data?.status} id="status" className="p-2 font-bold font-lg" name="status" placeholder="Enter Status" required onChange={(e:ChangeEvent<HTMLInputElement>) => {
                                                e.preventDefault();
                                                setData({ ...data, status: e.target.value });
                                            }} />
                                        </div>
                                    </>
                                }
                                <div className="grid gap-3">
                                    <div className="flex items-center">
                                        <Label htmlFor="description">Description</Label>
                                    </div>
                                    <Textarea value={data?.description} id="description" className="p-14 font-medium font-lg" name="description" placeholder="Here we starting a new project!!" required onChange={(e:ChangeEvent<HTMLTextAreaElement>) => {
                                        e.preventDefault();
                                        setData({ ...data, description: e.target.value });
                                    }} />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Button onClick={() => {
                                        submitForm();
                                    }} className="w-full">
                                        {loading ? <Loader  className="animate-spin"  /> : "Create Project"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
        </DialogContent>
        </Dialog>
    )
}
