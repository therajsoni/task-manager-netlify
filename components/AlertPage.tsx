"use client";

import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader, Send } from "lucide-react";
import dayjs from "dayjs";
// import { getSocket } from "@/config-socket/socket";
import { singleProjectType } from "@/types";
import { useRoleProvider } from "@/utils/roleProviderContext";
import toast from "react-hot-toast";
import { Label } from "./ui/label";

export default function AlertPage({
  stateAlert,
  setStateAlert,
  projectDeatils,
}: {
  stateAlert: boolean;
  setStateAlert: Dispatch<SetStateAction<boolean>>;
  projectDeatils: singleProjectType | undefined;
}) {
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState<
    {
      text: {
        title: string;
        description: string;
      };
      createdAt: Date;
      sender: {
        username: string | null;
      };
    }[]
  >();

  const truncate = (str: string, len: number) =>
    str.length > len ? str.substring(0, len) + "..." : str;

  //   const socket = useMemo(() => {
  //     // const socket = getSocket();
  //     const socket = undefined;
  //     // return socket?.connect();
  //   }, []);

  //   useEffect(() => {
  //     socket.on("connect", () => {
  //       console.log("I am connected");
  //     });
  //     return () => {
  //       socket.disconnect();
  //     };
  //   }, []);

  const [alertDetails, setAlertDetails] = useState({
    title: "",
    description: "",
  });

  const { data } = useRoleProvider();

  const handleAlert = async () => {
    if (alertDetails.title === "" || alertDetails?.description === "") {
      toast.error("Both fields enter");
      setLoading(false);
    }
    // socket.emit("register-user", data?._id);
    console.log("Register user with", data?._id);
    setLoading(true);
    // socket.emit("alert", {
    //   title: alertDetails.title,
    //   description: alertDetails.description,
    //   project: {
    //     id: projectDeatils?._id,
    //     name: projectDeatils?.name,
    //   },
    //   createdBy: {
    //     id: data?._id,
    //     username: data?.username,
    //   },
    // });
    setAlertDetails({
      title: "",
      description: "",
    });
    await handleFetchAlerts();
    setLoading(false);
  };

  const handleFetchAlerts = async () => {
    const request = await fetch(`/api/chats/alert`, {
      method: "POST",
      body: JSON.stringify({
        project: {
          id: projectDeatils?._id,
          name: projectDeatils?.name,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (request.ok) {
      const response = await request.json();
      if (response?.success === false) {
        toast.error(response.message);
      } else {
        setAlerts(response?.data);
      }
    } else {
      toast.error("Fetching error for alerts");
    }
  };

  useEffect(() => {
    // if (stateAlert)
    handleFetchAlerts();
  }, []);
  console.log("alert", alerts);

  return (
    <>
      {/* Main Alert Dialog */}
      <Dialog open={stateAlert} onOpenChange={setStateAlert}>
        <DialogContent className="sm:max-w-lg">
          <DialogTitle>Create Alert's & Review</DialogTitle>

          {/* Form */}
          <div className="flex flex-col gap-4 w-full max-w-md">
            <Input
              value={alertDetails.title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                e.preventDefault();
                setAlertDetails({
                  ...alertDetails,
                  title: e.target.value,
                });
              }}
              placeholder="Title"
              className="w-full"
            />
            <Textarea
              value={alertDetails.description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                e.preventDefault();
                setAlertDetails({
                  ...alertDetails,
                  description: e.target.value,
                });
              }}
              placeholder="Alert description"
              className="w-full  overflow-y-scroll max-h-30 hide-scrollbar"
            />
            <button
              type="button"
              className="flex items-center justify-center bg-black text-white rounded-md p-2 hover:bg-gray-800 transition-colors"
              onClick={handleAlert}
            >
              {loading ? (
                <Loader size={24} className="animate-spin" />
              ) : (
                <Send size={24} />
              )}
            </button>
          </div>

          {/* Alerts List Header */}
          <div className="flex items-center justify-between gap-4 mt-6">
            <p className="text-lg font-bold">List of Alert's</p>
          </div>

          {/* Alerts List */}
          <div className="mt-6 space-y-4 overflow-y-scroll h-60 hide-scrollbar">
            {alerts?.map((alert, index) => (
              <div
                key={index}
                className="flex items-center justify-between border p-3 rounded-md"
              >
                <div>
                  <p className="font-semibold">
                    {truncate(alert?.text?.title, 10)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {truncate(alert?.text?.description, 10)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {alert?.sender?.username} •{" "}
                    {dayjs(alert?.createdAt).format("DD/MM/YYYY HH:mm")}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedAlert(alert)}
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      {/* View Alert Detail Dialog */}
      <Dialog
        open={!!selectedAlert}
        onOpenChange={() => setSelectedAlert(null)}
      >
        <DialogContent className="sm:max-w-lg">
          {selectedAlert && (
            <>
              <DialogTitle>{selectedAlert?.text?.title}</DialogTitle>
              <Label>
                <p className="mt-2 text-gray-700">
                  {selectedAlert?.text?.description}
                </p>
              </Label>
              <p className="mt-4 text-sm text-gray-500">
                Created by: {selectedAlert?.sender}
              </p>
              <p className="text-xs text-gray-400">
                {dayjs(selectedAlert?.createdAt).format("DD/MM/YYYY HH:mm")}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
