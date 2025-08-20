"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dispatch, FormEvent, SetStateAction, useCallback, useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Task } from "./Tabs";
import toast from "react-hot-toast";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
export default function EditTaskModal({ open, setOpen, onSave, initialTasks, type, selectedTask
    , handleSave,
}: {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: string,
    onSave: (args: Task) => void,
    initialTasks: Task[],
    selectedTask: Task | undefined,
    handleSave: (args: Task) => void
}) {
    const hasAnyChild = (task: Task) => {
        return task?.children && task?.children?.length > 0;
    };
    const [name, setName] = useState(selectedTask?.name);
    const [responsibility, setResponsibility] = useState(selectedTask?.responsibility);
    const [status, setStatus] = useState(selectedTask?.status);
    const [description, setDescription] = useState(selectedTask?.description || "");
    const [listOfResponsive, setListOfResponsive] = useState<string[]>([]);
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedTask) return;
        const updatedTask = {
            ...selectedTask,
            name: name ?? selectedTask.name,
            responsibility: listOfResponsive.join(', '),
            status: status ?? selectedTask.status,
            description: description ?? selectedTask.description,
        };
        onSave(updatedTask);
        setOpen(false);
    };
    useEffect(() => {
        if (selectedTask) {
            setName(selectedTask.name);
            setStatus(selectedTask.status);
            setListOfResponsive(selectedTask?.responsibility?.split(", ").filter(Boolean) || []);
        }
    }, [selectedTask]);
    const [responsiblePerson, setResponsiblePerson] = useState<string[]>([]);
    const fetchAllResponsiblePerson = useCallback(async () => {
        const request = await fetch(`/api/project/getId/${initialTasks[0]?.id}`, {
            method: "POST",
            body: JSON.stringify({
                id: initialTasks[0]?.id
            }),
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (request.ok) {
            const response = await request.json();
            if (response?.success) {
                const owner = response?.data?.by?.username;
                const groupMembers = response?.data?.group?.map((item: {
                    member: string,
                    time: Date
                }) => item?.member) || [];
                const unique = Array.from(new Set([owner, ...groupMembers].filter(Boolean)));
                setResponsiblePerson(unique);
            } else {
                toast.error("json Error occuring while fetching members")
            }
        } else {
            toast.error("Error occuring while fetching members")
        }
    }, [initialTasks]);
    useEffect(() => {
        fetchAllResponsiblePerson();
    }, [fetchAllResponsiblePerson])
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{type == "edit" ? "Edit" : "Show"} Subtask</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)} className="space-y-4">
                    <Label>Task Name</Label>
                    <Input name="name" className={`${type === "show" ? "cursor-not-allowed" : ""} border-black border-1`} disabled={type !== "edit"} placeholder="Task Name" value={name ?? selectedTask?.name} onChange={(e) => setName(e.target.value)} />
                    <Label>{type === "show" ? "Show Responsible Person" : "Select Responsible Persons"}</Label>
                    <Select disabled={type !== "edit"} value={responsibility}
                        onValueChange={value => {
                            if (!listOfResponsive.includes(value)) {
                                setListOfResponsive(prev => [...prev, value]);
                            }
                        }}
                    >
                        <SelectTrigger className="w-full  border-black border-1">
                            <SelectValue placeholder="Select responsibile person">Select responsibile person</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Responsible person</SelectLabel>
                                {
                                    responsiblePerson
                                        ?.filter(item => !listOfResponsive.includes(item))
                                        .map((item, index) => (
                                            <SelectItem key={index} value={item}>{item}</SelectItem>
                                        ))
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Label>Responsible persons</Label>
                    <div className={`flex flex-wrap justify-start items-center gap-4 p-2 ${type === "show" ? "cursor-not-allowed" : "cursor-pointer"}`}>
                        {listOfResponsive.map(name => (
                            <div key={name} className="relative inline-block border py-1 px-1 rounded border-black">
                                <span className="text-base font-medium">{name}</span>
                                <span className="bg-black ml-3 py-.5 py-1 px-2 text-white" onClick={() =>
                                    setListOfResponsive(prev => prev.filter(n => n !== name))
                                }>
                                    Remove
                                </span>
                            </div>
                        ))}
                    </div>
                    <Label>Status</Label>
                    <Select disabled={type === "show" || selectedTask !== undefined && hasAnyChild(selectedTask)} value={status}
                        onValueChange={value => setStatus(value)}>
                        <SelectTrigger className="w-full  border-black border-1">
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
                    <Label>Description</Label>
                    <Textarea name="description" className={`${type === "show" ? "cursor-not-allowed" : ""} hide-scrollbar overflow-y-scroll max-h-40  border-black border-1`} placeholder="description" value={description ?? selectedTask?.description} disabled={type === "show"} onChange={(e) => {
                        e.preventDefault()
                        setDescription(e.target.value)
                    }} />
                    {
                        type !== "edit" && <Label>Task Created Date</Label>
                    }
                    {
                        type !== "edit" && <Input className={`${type === "show" ? "cursor-not-allowed" : ""}  border-black border-1`} placeholder="CreatedAt" value={new Date().toLocaleDateString() ?? initialTasks[0]?.createdAt} onChange={() => { }} disabled={type !== "edit"} />
                    }
                    {
                        type === "edit" && <div className="text-right">
                            <Button type="submit" onClick={async () => {
                                toast.success("edited & click the Refresh btn", {
                                    position: "top-right"
                                })
                            }} >Edit</Button>
                        </div>
                    }
                </form>
            </DialogContent>
        </Dialog>
    );
}
