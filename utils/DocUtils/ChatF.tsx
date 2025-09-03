"use client";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal, Upload, UploadCloudIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { singleProjectType, TaskList } from "@/types";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

import { Label } from "@/components/ui/label";
// import { getSocket } from "@/config-socket/socket";
import { useRoleProvider } from "../roleProviderContext";
dayjs.extend(relativeTime);
type UserType = "me" | "other";
interface Message {
  id: number;
  user: UserType;
  text: string;
  by: string;
  createdAt: Date;
}
export default function ChatF({
  open,
  setOpen,
  clickProjectData,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  clickProjectData: singleProjectType | undefined;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const scrollViewArea = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    scrollViewArea?.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);
  const { data } = useRoleProvider();
  const sendMsg = () => {
    // const socket = getSocket();
    // socket.emit("new-msg-i-send-to-some-one", {
    //   msg: input,
    //   key: clickProjectData?._id,
    //   senderId: data?._id,
    //   attachments: [],
    //   senderName: data?.username,
    //   projectId: clickProjectData?._id,
    //   taskName: "",
    // });
    setInput("");
  };
  const handleMsg = (key: string) => {
    // const socket = getSocket();
    // socket.emit("any-new-message-for-me", { key });
    // socket.on("yes-new-messages-for-you", (data) => {
    //   // setMessages(data);
    //   console.log(data);
    // });
  };
  useEffect(() => {
    if (clickProjectData?._id != undefined) {
      handleMsg(clickProjectData?._id);
    }
  }, [open, input]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogTitle>{clickProjectData?.name}</DialogTitle>
        <Card className="w-full h-[500px] flex flex-col">
          <CardContent className="p-4 flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-2">
              <div className="flex flex-col gap-4 p-2">
                {messages?.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.user === "me" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 text-sm max-w-[70%]}`}
                    >
                      <p>{msg.text}</p>
                      <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                        <span>
                          {dayjs(msg?.createdAt).format("DD MMM YYYY, hh:mm A")}
                        </span>
                        <span className="ml-2">by— {msg?.by}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={scrollViewArea}></div>
              </div>
            </ScrollArea>
          </CardContent>
          <div className="p-4 border-t flex items-center gap-2">
            <Textarea
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="resize-none min-h-[40px] max-h-[80px] flex-1 hide-scrollbar"
              onKeyUp={(e: KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  sendMsg();
                }
              }}
            />
            <Label className="bg-black text-white p-1.5 rounded-lg">
              <SendHorizonal
                size={26}
                onClick={() => {
                  sendMsg();
                }}
              />
            </Label>
            <Label className="bg-black text-white p-1.5 rounded-lg">
              <UploadCloudIcon size={26} />
              <input className="hidden" type="file" />
            </Label>
          </div>
        </Card>{" "}
      </DialogContent>
    </Dialog>
  );
}
