"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TaskList } from "@/types";
// import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";

export default function UpdateTask({ type, open, setOpen, onSave , data }: {
  type: string,
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
  onSave: () => void,
  data : TaskList | undefined
}) {
  console.log(type);
  console.log(onSave);



  const [name, setName] = useState(data?.name || "");
  const [responsibility, setResponsibility] = useState(data?.responsibility || "");
  const [status, setStatus] = useState(data?.status || "");

  console.log(setStatus);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name && responsibility && status) {
      // onSave({ name, responsibility, status });
      //   setName("");
      //   setResponsibility("");
      //   setStatus("Pending");
    }
    setOpen(false)
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Label>Task Name</Label>
          <Input  placeholder="Task Name" className={`border-black border-1`} disabled value={name} onChange={(e) => setName(e.target.value)} />
          <Label>Resposiables</Label>
          <Input placeholder="Responsibility" className={`border-black border-1`} disabled value={responsibility} onChange={(e) => setResponsibility(e.target.value)} />
          <Label>Description</Label>
          <Textarea placeholder="Description"  className="overflow-y-scroll max-h-60 hide-scrollbar border-black border-1"  disabled value={data?.description}>{data?.description}</Textarea>
          <Label>Status</Label>
          <Input placeholder="Status" className={`border-black border-1`} value={status}
            // onChange={(e) => setStatus(e.target.value)}
            onClick={() => {
              toast.success(`For change show his task assigner ${data?.by} `)
            }}
          />
          {/* <div className="text-right">
            <Button type="submit">Save</Button>
          </div> */}
        </form>
      </DialogContent>
    </Dialog>
  );
}
