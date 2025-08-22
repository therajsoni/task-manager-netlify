"use client";
import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "jodit/es2021/jodit.min.css";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { singleProjectType, TaskList } from "@/types";
import { Task } from "@/components/DataList/Tabs";


const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
/**
* Props
*/
interface RTEProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function JoditEditorClient({ value, onChange, placeholder }: RTEProps) {
  const editorRef = useRef<any>(null);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder ?? "Start typing…",
      //    popup: {
      //   zIndex: 3000,
      //   defaultOffset: 0, // jitna chaho offset
      // },
      toolbarAdaptive: false,
      // popup: {
      //   adjustPosition: true, // popup ko anchor se chipkakar rakhega
      // },
      toolbarSticky: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      height: 300,
      uploader: {
        url: "/api/jodit/upload",
        filesVariableName: () => "files",
        prepareData(formData: FormData) {
          return formData;
        },
        isSuccess(resp: any) {
          return Boolean(resp && (resp.url || (resp.data && resp.data.url)));
        },
        process(resp: any) {
          const url = resp.url || resp?.data?.url;
          return {
            files: url ? [url] : [],
            path: url,
            baseurl: "",
            error: resp.error,
            message: resp.message,
          };
        },
        defaultHandlerSuccess(this: any, resp: any) {
          const url = resp.url || resp?.data?.url;
          if (url) this.s.insertImage(url);
        },
        error(e: any) {
          console.error("Jodit upload error", e);
        },
      },
    }),
    [placeholder]
  );

  return (
    <div className="bg-background shadow-sm overflow-hidden w-transparent rounded-xl border-b border-solid border-2">
      <JoditEditor
        ref={editorRef}
        value={value}
        config={config}
        onBlur={(newContent: string) => onChange(newContent)}
        onChange={() => { }}
        className="hide-scrollbar"
      />
    </div>
  );
}

export default function ReadMeMd({
  selectedTask, tasks, open, setOpen, projectDeatail
}: {
  selectedTask? :  undefined | TaskList | Task; tasks? : undefined | Task[]  ; open : boolean; setOpen : Dispatch<SetStateAction<boolean>>, projectDeatail? : singleProjectType | undefined
}) {
  const key = (tasks !== undefined && tasks !== null) ? tasks[0]?.id + "#$#" + selectedTask?.id : (projectDeatail !== undefined && projectDeatail !== null) ? projectDeatail?._id + "#$#" + selectedTask?.id : "";

  console.log();
  

  const [value, setValue] = useState("");
  const [lastTimeUpdatedBy, setLastTimeUpdatedBy] = useState("");
  const [time, setTime] = useState<Date | null>();
  useEffect(() => {
    if (open === true) {
      document.body.style.backgroundColor = 'gray'
    }
  }, [open])
  const [loader, setLoader] = useState(false);
  const handleUploadHtml = async () => {
    setLoader(true);
    const request = await fetch("/api/loadHtml/post", {
      method: "POST",
      headers: {
        "ContentType": "application/json",
      },
      body: JSON.stringify({
        key: key,
        html: value
      })
    });
    if (request.ok) {
      const response = await request.json();
      if (response.success) {
        setValue(response?.data);
        await LoadUploadHtml();
        setLoader(false);
      } else {
        setLoader(false);
        toast.error(response?.message);
      }
    } else {
      setLoader(false);
      toast.error("Some Error occured");
    }
  }
  const LoadUploadHtml = async () => {
    setLoader(true);
    const request = await fetch("/api/loadHtml/get", {
      method: "POST",
      headers: {
        "ContentType": "application/json",
      },
      body: JSON.stringify({
        key: key
      })
    });
    if (request.ok) {
      const response = await request.json();
      if (response.success) {

        console.log(typeof response.data, response.data)
        setValue(response?.data?.html);
        setLastTimeUpdatedBy(response?.data?.updatedBy);
        setTime(response?.data?.updatedAt);
        setLoader(false);
      } else {
        setLoader(false);
        toast.error(response?.message);
      }
    } else {
      setLoader(false);
      toast.error("Some Error occured");
    }
  }
  useEffect(() => {
    LoadUploadHtml();
  }, [])
  return (
    <dialog open={open}
      className={`z-100 border-2 border-solid border-black flex-col absolute ${open === true ? 'animate-in fade-in-0 zoom-out-95' : 'animate-out fade-out-0 zoom-in-95'} flex items-center justify-center m-auto   w-[60vw] rounded-xl  px-6  py-1 shadow-lg duration-200 top-5 bottom-5 max-h-[80vh] overflow-y-scroll hide-scrollbar`}
    >
      <div id="x-dialog-box" className="w-full flex justify-end mb-4">
        <X onClick={() => setOpen(false)} />
      </div>
      {
        lastTimeUpdatedBy &&
        <p className="w-full flex justify-end mt-2 mb-2">
          Last Time Updated By : <span className="text-bold font-sans ml-2 mt-.5">{lastTimeUpdatedBy ?? "Unknown"} at {time !== null && time !== undefined && new Date(time).toLocaleString()}</span>
        </p>
      }
      <JoditEditorClient
        value={value} onChange={setValue} placeholder=""
      />
      <div className="flex justify-end w-full mt-2">
        <span onClick={() => {
          if (!loader) {
            handleUploadHtml()
          }
        }}>{
            loader ? <Upload className="animate-spin" /> : "Upload"
          }
        </span>
      </div>
    </dialog>
  );
}