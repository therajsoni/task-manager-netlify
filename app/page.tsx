"use client";
import Page from "./dashboard/page";
import { checkIsUserHavaToken } from "@/actions";
import { useCallback, useEffect, useMemo, useState } from "react";
import LoginComponent from "@/components/Login";
import Loading from "../utils/loading";
import UseProjectStore from "@/utils/store";
import toast from "react-hot-toast";
import { getSocket } from "@/config-socket/socket";
import { useRoleProvider } from "@/utils/roleProviderContext";
// import { useSocketIOProvider } from "@/utils/socket/socketIoProvider";
export default function Home() {
  const setIdentifier = UseProjectStore((state) => state.setIdentifier);
  const [check, setCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const checkToken = useCallback(async () => {
    setLoading(true);
    const req = await checkIsUserHavaToken();
    const statusCheck = JSON.parse(JSON.stringify(req));
    setCheck(statusCheck?.status);
    setIdentifier(statusCheck?.identifier);
    toast.success(<>
      <div className="font-bold p-2 mt-0 z-2">Hi {statusCheck?.username} !!</div>
    </>, {
      position: "top-right",
      duration: 3000,
    })
    setLoading(false);
  }, [setIdentifier]);
  useEffect(() => {
    checkToken();
  }, [checkToken]);
  const socket = useMemo(() => {
    const socket = getSocket();
    return socket.connect();
  }, []);
  const { data } = useRoleProvider();
  useEffect(() => {
    socket.on("connect", () => {
      console.log("I am connected and admin i am")
    })
    console.log("Registered");
    socket.emit("register-user", data?._id);
    return () => { socket.disconnect(); }
  }, [])
  useEffect(() => {
    socket.on("alert-for-you", (data) => {
      // setNewAlert(true);
      // setAlertData(data)
      console.log(data, "data");
      toast.success(data?.description);
    })
    // const {
    //               setAppearMessage
    // } = useSocketIOProvider();

    // socket.on("message-container-from-new-message", ({ by, key }) => {
    //   // setAppearMessage();
    //   toast.success("A new message " + "on task " + key?.project + " project " + key?.task + " task" + " by " + by);
    // });
  })
  if (loading) {
    return <Loading />
  }
  return (
    <>
      {
        !check ?
          <div className="flex justify-center items-center h-screen w-screen">
            <LoginComponent />
          </div>
          : <>
            <Page />
          </>
      }
    </>
  );
}
