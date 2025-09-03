/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useState,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
// import "./App.css";
import MDEditor from "@uiw/react-md-editor";
import mermaid from "mermaid";
import { Loader, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { singleProjectType, TaskList } from "@/types";
import toast from "react-hot-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const mdMermaid = ``;

const randomid = () => parseInt(String(Math.random() * 1e15), 10).toString(36);
const Code = ({ inline, children = [], className, ...props }: any) => {
  const demoid = useRef(`dome${randomid()}`);
  const code = getCode(children);
  const demo = useRef(null);
  useEffect(() => {
    const renderMermaid = async () => {
      if (demo.current) {
        try {
          // mermaid.render returns a Promise
          const str = await mermaid.render(demoid.current, code);
          // @ts-expect-error-no
          demo.current.innerHTML = str.svg || "";
        } catch (error: any) {
          // @ts-expect-error-no
          demo.current.innerHTML = error.message;
        }
      }
    };
    renderMermaid();
  }, [code, demo]);

  if (
    typeof code === "string" &&
    typeof className === "string" &&
    /^language-mermaid/.test(className.toLocaleLowerCase())
  ) {
    return (
      <code ref={demo}>
        <code id={demoid.current} style={{ display: "none" }} />
      </code>
    );
  }
  return <code className={String(className)}>{children}</code>;
};

const getCode = (arr: any = []): string => {
  const items = Array.isArray(arr) ? arr : [arr];
  return items
    .map((dt) => {
      if (typeof dt === "string") {
        return dt;
      }
      if (dt && dt.props && dt.props.children) {
        return getCode(dt.props.children);
      }
      return false;
    })
    .filter(Boolean)
    .join("");
};

function App({
  open,
  setOpen,
  selectedTask,
  tasks,
  projectDeatail,
}: {
  selectedTask?: undefined | TaskList | Task;
  tasks?: undefined | Task[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  projectDeatail?: singleProjectType | undefined;
}) {
  const key =
    tasks !== undefined && tasks !== null
      ? tasks[0]?.id + "#$#" + selectedTask?.id
      : projectDeatail !== undefined && projectDeatail !== null
      ? projectDeatail?._id + "#$#" + selectedTask?.id
      : "";
  const [lastTimeUpdatedBy, setLastTimeUpdatedBy] = useState("");
  const [time, setTime] = useState<Date | null>();
  const [timerOut, setTimerOut] = useState<NodeJS.Timeout | null>(null);

  const [value, setValue] = useState(mdMermaid);
  const [loader, setLoader] = useState(false);
  const handleChangeEditor = () => {
    if (timerOut !== null) {
      clearTimeout(timerOut);
    }
    const newTimer = setTimeout(() => {
      // handleUploadHtml();
    }, 8000);
    setTimerOut(newTimer);
  };
  const handleUploadHtml = async () => {
    setLoader(true);
    const request = await fetch("/api/loadHtml/post", {
      method: "POST",
      headers: {
        ContentType: "application/json",
      },
      body: JSON.stringify({
        key: key,
        html: value,
      }),
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
  };
  const LoadUploadHtml = async () => {
    setLoader(true);
    const request = await fetch("/api/loadHtml/get", {
      method: "POST",
      headers: {
        ContentType: "application/json",
      },
      body: JSON.stringify({
        key: key,
      }),
    });
    if (request.ok) {
      const response = await request.json();
      if (response.success) {
        console.log(typeof response.data, response.data);
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
  };
  useEffect(() => {
    LoadUploadHtml();
  }, []);
  return (
    <>
      {open && <div className="fixed inset-0  z-50 bg-black/50"></div>}

      <dialog
        open={open}
        className={`z-100  flex-col absolute ${
          open === true
            ? "animate-in fade-in-0 zoom-out-95"
            : "animate-out fade-out-0 zoom-in-95"
        } flex items-center justify-center m-auto   w-[60vw] rounded-xl   shadow-lg duration-200 top-5 bottom-5 max-h-[80vh] overflow-y-scroll hide-scrollbar py-4`}
      >
        <div id="x-dialog-box" className="w-full flex justify-end mb-4">
          <Tooltip>
            <TooltipContent className="mt-1">Save</TooltipContent>
            <TooltipTrigger>
              {loader ? (
                <Loader className="animate-spin" />
              ) : (
                <Save
                  className="mr-4"
                  size={32}
                  onClick={() => {
                    handleUploadHtml();
                  }}
                />
              )}
            </TooltipTrigger>
          </Tooltip>
          <X onClick={() => setOpen(false)} className="mr-2" size={32} />
        </div>
        <MDEditor
          onChange={(newValue = "") => {
            setValue(newValue);
          }}
          // onKeyUp={() => {
          //   handleChangeEditor();
          // }}
          textareaProps={{
            placeholder: "Please enter Markdown text",
          }}
          height={500}
          value={value}
          previewOptions={{
            components: {
              code: Code,
            },
          }}
          className="w-full p-2"
        />
      </dialog>
    </>
  );
}

export default App;
