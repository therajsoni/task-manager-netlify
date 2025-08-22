"use client"

import { KeyboardEvent, SetStateAction, useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { SendHorizonal, Upload } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Task } from "@/components/DataList/Tabs"
import { getSocket } from "@/config-socket/socket"
import { useRoleProvider } from "./roleProviderContext"
import { singleProjectType, TaskList } from "@/types"
import toast from "react-hot-toast"
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs"
// import { useSocketIOProvider } from "./socket/socketIoProvider"

dayjs.extend(relativeTime);

type UserType = "me" | "other"

interface Message {
  id: number
  user: UserType
  text: string,
  by: string,
  createdAt: Date
}

export default function ChatBox({ open, setOpen,
  selectedTask,
  tasks,
  type,
  projectDeatail,
}: {
  open: boolean; setOpen: (open: boolean) => void; type?: string,
  selectedTask?: Task | TaskList, tasks?: Task[], projectDeatail?: singleProjectType,
}) {
  const [messages, setMessages] = useState<Message[]>([
  ]);

  const [input, setInput] = useState<string>("");

  const [newMessageByOther, setNewMessageByOther]
    = useState(false);
  // socket & messages

  const socket = useMemo(() => {
    const socket = getSocket();
    return socket.connect();
  }, []);

  const { data } = useRoleProvider();
  const key = (tasks !== undefined && tasks !== null) ? tasks[0]?.id + "#$#" + selectedTask?.id : (projectDeatail !== undefined && projectDeatail !== null) ? projectDeatail?._id + "#$#" + selectedTask?.id : "";

  useEffect(() => {
    socket.on("connect", () => {
      console.log("I am connected and admin i am")
    })
    socket.emit("register", data?._id)
    console.log("Registered");
    socket.on("message-container-from-new-message", ({ by, kay }: any) => {
      setNewMessageByOther(true)
    })

    // socket.on("alert-for-you",(payload:any)=>{
    //    setMessages([...messages,{
    //     id: Number(Math.random),
    //       user: payload?.createdBy === data?.username ? "me" : "other",
    //       text: payload?.description,
    //       by: payload.createdBy,
    //       createdAt: payload?.time
    //    }])
    // })

    return () => { socket.disconnect(); }
  }, []);

  // const {
    
  //   appearMessage,
  //   setDisappearMessage
  // } = useSocketIOProvider();
  const handleSend = () => {

    const trimmed = input.trim()
    if (!trimmed) return

    const newMessage: Message = {
      id: Date.now(),
      user: "me",
      text: trimmed,
      by: "me",
      createdAt: new Date()
    }

    // if (key === "" || trimmed === "" || data?._id === "") {
    //   toast.success("sending message for all fields neccessary");
    //   return;
    // }


console.log({key,
      message: trimmed,
      senderId: data?._id,
      usernameSender: data?.username
    }, "details");

    
    socket.emit("message-container-in-send-message", {
      key,
      message: trimmed,
      senderId: data?._id,
      usernameSender: data?.username
    });
    
    setMessages((prev) => [...prev, newMessage])
    setInput("")
  }

  const scrollViewArea = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    scrollViewArea?.current?.scrollIntoView({
      behavior: "smooth"
    })
  }, [messages]);


  const fetchMessages = async () => {
    setMessages([])
    const request = await fetch("/api/message-container/message", {
      method: "POST",
      body: JSON.stringify({
        key
      }),
      headers: {
        "Content-Type": "Application/json"
      }
    });
    if (!request.ok) {
      toast.error("Error occured while fetching the message of this task");
    }
    const response = await request.json();
    console.log(response, "Response");
    
    if (!response?.success) {
      toast.error(response?.message);
    }
    // filter message
    const dataMessages = response?.data;
    dataMessages?.map((item: any, index: any) => {
      if (item?.senderId?._id === data?._id) {
        setMessages((prev) => [...prev, {
          id: index,
          user: "me",
          text: item?.messageText,
          by: item?.senderId?.username,
          createdAt: item?.createdAt
        }])
      }
      else {
        setMessages((prev) => [...prev, {
          id: index,
          user: "other",
          text: item?.messageText,
          by: item?.senderId?.username,
          createdAt: item?.createdAt
        }])
      }
    })
  }

  // useEffect(()=>{
  //  if (socket) {
  //      socket.on("message-container-from-new-message",(data)=>{
  //       if (key === data.key) {
  //         fetchMessages();
  //       }
  //      })  
  //  }
  // },[socket, key]);




  // useEffect(() => {
  //   fetchMessages();
  //   if (appearMessage === true) {
  //     setDisappearMessage();
  //   }
  // }, [appearMessage]);

  useEffect(()=>{
    fetchMessages();
  },[]);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogTitle>MyChat</DialogTitle>
        {/* CHAT TAB */}
        <Card className="w-full h-[500px] flex flex-col">
          <CardContent className="p-4 flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-2" >

              <div className="flex flex-col gap-4 p-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.user === "me" ? "justify-end" : "justify-start"}`}
                  >
                    {/* {msg.user === "other" && (
      <Avatar className="mr-2">
        <AvatarImage src="/avatars/01.png" />
        <AvatarFallback>{msg?.by?.trim()?.substring(2)}</AvatarFallback>
      </Avatar>
 )} */}


                    <div
                      className={`rounded-lg px-4 py-2 text-sm max-w-[70%] 
        // ${
                        // msg.user === "me"
                        // ? 
                        "bg-primary text-primary-foreground"
                        // : "bg-cyan-400 text-black"
                        }`}
                    >
                      <p>{msg.text}</p>
                      <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                        <span>{dayjs(msg?.createdAt).format("DD MMM YYYY, hh:mm A")}</span>
                        <span className="ml-2">by— {msg?.by}</span>
                      </div>
                    </div>

                    {/* {msg.user === "me" && (
      <Avatar className="mr-2">
        <AvatarImage src="/avatars/01.png" />
        <AvatarFallback>{msg?.by?.trim()?.substring(2)}</AvatarFallback>
      </Avatar>
 )} */}
                  </div>
                ))}
                <div /// <reference path="" />
                  ref={scrollViewArea}
                >

                </div>
              </div>

            </ScrollArea>
          </CardContent>

          <div className="p-4 border-t flex items-center gap-2">
            <Textarea
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="resize-none min-h-[40px] max-h-[80px] flex-1"
              onKeyUp={(e: KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleSend()
                }
              }}
            />
            {/* <Label>
              <Upload className="bg-black text-white p-2 rounded-sm cursor-pointer" size={34} />
              <Input type="file" className="hidden" />
            </Label> */}
            <Button onClick={handleSend} size="icon">
              <SendHorizonal className="w-4 h-4" />
            </Button>
          </div>
        </Card>      </DialogContent>
    </Dialog>
  )
}
