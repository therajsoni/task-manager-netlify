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
import toast from "react-hot-toast";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Delete } from "lucide-react";
export default function AddTaskModal(
  { type, open, setOpen, onSave, projectId }: {
    type: string,
    open: boolean,
    projectId: string,
    setOpen: Dispatch<SetStateAction<boolean>>
    onSave: (data: { name: string; description: string; status: string, responsibility: string }) => void;

  }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [responsiblePerson, setResponsiblePerson] = useState<string[]>();
  const [listOfResponsive, setListOfResponsive] = useState<string[]>([]);



  const fetchAllResponsiblePerson = useCallback(async () => {
    const request = await fetch(`/api/project/getId/${projectId}`, {
      method: "POST",
      body: JSON.stringify({
        id: projectId
      }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    console.log(request, "45", projectId);

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
  }, [projectId])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name && listOfResponsive.length > 0 && status) {
      onSave({
        name,
        responsibility: listOfResponsive?.map(name => name.trim()).join(', '),
        status, description
      });
      setName("");
      setStatus("Pending");
      setDescription("");
      setListOfResponsive([])
    }
  };

  useEffect(() => {
    fetchAllResponsiblePerson();
  }, [fetchAllResponsiblePerson])

  if (type === "show" || type === "edit" || type === "delete") {
    return <></>
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Task Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Select
            onValueChange={(value) => {
              setListOfResponsive((prev) => (prev.includes(value) ? prev : [...prev, value]));
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Responsible person">
                Select Responsible person
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Responsible Person</SelectLabel>
                {
                  responsiblePerson
                    ?.filter((item) => !listOfResponsive.includes(item))
                    .map((item: string, index: number) => (
                      <SelectItem key={index} value={item}>
                        {item}
                      </SelectItem>
                    ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
    <div className={`flex flex-wrap justify-start items-center ${listOfResponsive.length > 0 && "gap-4 p-2"}`}>
            {listOfResponsive.map((name) => (
              <div key={name} className="relative inline-block border p-2 rounded border-black">
                <span className="text-base font-medium">{name}</span>
                <span
                  className="absolute -top-2 -right-2 cursor-pointer"
                  onClick={() =>
                    setListOfResponsive((prev) => prev.filter((n) => n !== name))
                  }
                >
                  <Delete size={16} />
                </span>
              </div>
            ))}
          </div>
          <Textarea placeholder="Description of task" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Select disabled={type === "show"} value={status}
            onValueChange={value => setStatus(value)}>
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
          <div className="text-right">
            <Button type="submit" onClick={async () => {
              toast.success("Added & click the Refresh Btn ", {
                duration: 3000,
                position: "top-right"
              })
            }}>Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
