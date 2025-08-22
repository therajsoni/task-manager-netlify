"use client";

import { Dispatch, JSX, SetStateAction, useEffect, useState } from "react";
import { Plus, ChevronDown, ChevronRight, Edit, View, Delete, FileArchive, DownloadCloudIcon, Paperclip, Rotate3d, RotateCw, DockIcon, } from "lucide-react";
import AddTaskModal from "./AddTask";
import percentagefortask from "@/utils/statusPercentage";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import EditTaskModal from "./EditTask";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import ProgressBar from "./ProgressBar";
import { Table, TableCell, TableRow } from "../ui/table";
import { Task } from "./Tabs";
import NameLengthManage from "@/utils/nameLengthManage";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import React from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import ChatBox from "@/utils/chatPage";
import ReadMeMd from "@/utils/DocUtils/ReadMeMd";
export default function TaskTable({ userData, tasks, setTasks, projectId, setProjectId, initialTasks,
  features,
  setFeatures,
  loading,
  handleSaveChanges
}: {
  tasks: Task[],
  setTasks: Dispatch<SetStateAction<Task[]>>,
  projectId: string,
  setProjectId: Dispatch<SetStateAction<string>>,
  initialTasks: Task[],
  userData: {
    username: string,
    password: string,
    _id: string,
    identifier: string
  },
  features: boolean,
  setFeatures: Dispatch<SetStateAction<boolean>>,
  loading: boolean,
  handleSaveChanges: (args: Task[]) => Promise<void>
}) {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [typeOpen, setTypeOpen] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [fetchTaskName, setFetchTaskName] = useState("");
  const [docFeature, setDocFeature] = useState(false);
  const [showDeatilsDescription, setShowDetailsDescription] = useState({
    open: false, value: "",
  });
  useEffect(() => {
    if (tasks === undefined || tasks.length === 0) {
      setTasks(initialTasks)
    }
  });
  const toggleExpand = (id: string) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  useEffect(() => {
    if (!expanded.includes(tasks[0]?.id)) {
      toggleExpand(tasks[0]?.id);
    }
  });
  const handleAdd = (parentId: string, task: Task) => {
    setSelectedParentId(parentId);
    setOpenModal(true);
    setSelectedTask(task);
    setTypeOpen("")
  };
  function updateTaskById(tasks: Task[], taskId: string, updatedTask: Task): Task[] {
    return tasks.map(task => {
      if (task?.id === taskId) {
        return { ...task, ...updatedTask };
      }
      if (task.children && task.children.length > 0) {
        return { ...task, children: updateTaskById(task.children, taskId, updatedTask) };
      }
      return task;
    });
  }
  function deleteTaskById(tasks: Task[], taskId: string): Task[] {
    return tasks
      .map(task => {
        if (task.children) {
          task.children = deleteTaskById(task.children, taskId);
        }
        return task;
      })
      .filter(task => task?.id !== taskId);
  }
  const handleDelete = async () => {
    if (!selectedTask) return;
    const updatedTasks = deleteTaskById(tasks, selectedTask?.id);
    setTasks(updatedTasks);
    await handleSaveChanges(updatedTasks);
    setOpenModal(false);
  };
  const handleSaveAdd = async (data: { name: string; description: string; status: string, responsibility: string }) => {
    const newTask: Task = {
      id: `${uuidv4()}`,
      name: data.name,
      description: data.description,
      status: data.status,
      responsibility: data.responsibility,
      createdAt: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss A"),
      by: userData?.username,
      features: {
        documents: [],
      },
      chats: [],
    };
    const addChild = (tasks: Task[]): Task[] =>
      tasks.map((t) =>
        t?.id === selectedParentId!
          ? { ...t, children: [...(t.children || []), newTask] }
          : { ...t, children: t.children ? addChild(t.children) : [] }
      );
    setTasks(addChild(tasks));
    await handleSaveChanges(addChild(tasks))
    setOpenModal(false);
  };
  const handleSave = async (updatedTask: Task) => {
    const updatedTasks = updateTaskById(tasks, updatedTask?.id, updatedTask);
    // if (selectedTask?.name !== updatedTask?.name) {
    //   alert(selectedTask?.name + "," + initialTasks[0]?.name + "," + updatedTask?.name);
    //   const key = initialTasks[0]?.name + "#$#" + selectedTask?.name;
    //   await fetch("/api/loadHtml/updateLoadHtmlKeyWhenChangeTaskName", {
    //     method: "POST",
    //     body: JSON.stringify({
    //       key,
    //       Name: updatedTask?.name
    //     }),
    //   });
    // }
    setTasks(updatedTasks);
    await handleSaveChanges(updatedTasks)

  };
  const renderRows = (rows: Task[], level: number = 0, parentChildren: Task[] | null = null): JSX.Element[] => {
    if (!Array.isArray(rows)) return [];
    return rows.flatMap((task) => {
      const isExpanded = expanded.includes((task?.id));
      const hasChildren = !!task.children?.length;
      return [
        <TableRow key={task.id}
          className={`bg-white ${task?.id !== initialTasks[0]?.id ? level === 1 ? "border-1 border-gray-200" : "border-1 border-gray-200" : "border-none"}`}>
          {
            task?.id !== initialTasks[0]?.id && <TableCell className="px-3 py-2 text-sm">
              <div className="flex items-center " style={{ marginLeft: `${level * 20}px` }}>
                {hasChildren && (
                  <button onClick={() => toggleExpand((task.id))} className="mr-1">
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                )}
                {
                  task?.id !== initialTasks[0]?.id && <> {NameLengthManage(task?.name ?? "", 10)} </>
                }
              </div>
            </TableCell>
          }
          {
            task?.id !== initialTasks[0]?.id && <>
              <TableCell onClick={() => {
                setShowDetailsDescription({
                  value: task?.description,
                  open: true
                });
              }} colSpan={3}>{task?.description?.length > 100 ? task?.description?.substring(0, 101) : task?.description}</TableCell>
              <TableCell className="w-[200px] ">
                <div>
                  <ProgressBar percentage={task?.children !== undefined ? percentagefortask(task) : task?.status === "completed" ? 100 : 0} />
                </div>
              </TableCell>
            </>
          }
          {task?.id !== initialTasks[0]?.id && <TableCell>
            <div
              className="text-blue-600 hover:underline flex justify-start items-center"
            >
              <Popover>
                <PopoverTrigger>
                  <button>
                    <Plus
                      onClick={() => handleAdd(task.id, task)}
                      className={task.id === tasks[0].id ? "root-plus-btn" : "ml-2"}
                      size={task.id === tasks[0].id ? 36 : 16}
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[150px]">
                  <div className="flex justify-center items-center flex-col gap-2">
                    <div className="flex justify-center items-center flex-col gap-1">
                      <div className="flex flex-row items-center justify-start fade-in-10 bg-gray-100 rounded-sm">
                        <Button onClick={() => {
                          handleAdd(task.id, task)
                          setTypeOpen("add");
                        }} className="w-[100px] flex justify-around items-center  bg-gray-100 text-black hover:bg-gray-200 hover:text-black" >AddTask  <Plus /> </Button>
                      </div>
                      {
                        task?.id !== initialTasks[0]?.id && <>
                          <div className="flex flex-row items-center justify-start fade-in-10 bg-gray-100 rounded-sm">
                            <Button onClick={() => {
                              handleAdd(task.id, task)
                              setTypeOpen("show");
                            }} className="w-[100px] flex justify-around items-center  bg-gray-100 text-black hover:bg-gray-200 hover:text-black" >Show  <View /> </Button>
                          </div>
                          <div className="flex flex-row items-center justify-start fade-in-10 bg-gray-100 rounded-sm">
                            <Button onClick={() => {
                              handleAdd(task.id, task)
                              setTypeOpen("edit");
                            }} className="w-[100px] text-sm flex justify-around items-center  bg-gray-100 text-black hover:bg-gray-200 hover:text-black" >Edit <Edit /> </Button>
                          </div>
                          <div className="flex flex-row items-center justify-start ">
                            <AlertDialog>
                              <AlertDialogTrigger onClick={() => {
                                handleAdd(task.id, task);
                                setTypeOpen("delete");
                              }}
                                className="h-[40px] w-[100px] text-sm  text-black  flex justify-around items-center fade-in-10 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-black  "
                              >
                                <button className="flex flex-row font-medium gap-2">
                                  Delete<Delete />
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your task and below related tasks
                                    and remove your data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => {
                                    handleDelete(); toast.success("deleted & click the save changes btn", {
                                      position: "top-right"
                                    })
                                  }}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </>
                      }
                      {/* <div className="flex flex-row items-center justify-start">
                        <Button onClick={() => {
                          setFeatures(true);
                        }} className="w-[100px] text-sm flex justify-around items-center  bg-gray-100 text-black hover:bg-gray-200 hover:text-black" >Chat <FileArchive /> </Button>

                      </div> */}
                      <div className="flex flex-row items-center justify-start">
                        <Button onClick={() => {
                          setDocFeature(true);
                        }} className="w-[100px] text-sm flex justify-around items-center  bg-gray-100 text-black hover:bg-gray-200 hover:text-black" >Editor <DockIcon /> </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </TableCell>}
          {
            task?.id === initialTasks[0]?.id && <div className="flex justify-start items-center gap-4 mb-2">
              <Tooltip>
                <TooltipTrigger>
                  <Popover>
                    <PopoverTrigger className="flex justify-start items-center gap-5">
<button>
                      <Plus size={32} className="bg-black text-white" />
                   </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[150px]">
                      <div className="flex justify-center items-center flex-col gap-2">
                        <div className="flex justify-center items-center flex-col gap-1">
                          <div className="flex flex-row items-center justify-start fade-in-10 bg-gray-100 rounded-sm">
                            <div onClick={() => {
                              handleAdd(task.id, task)
                              setTypeOpen("add");
                            }} className="w-[100px] p-2 rounded-sm flex justify-around items-center  bg-gray-100 text-black hover:bg-gray-200 hover:text-black" >AddTask  <Plus /> </div>
                          </div>
                          {
                            task?.id !== initialTasks[0]?.id && <>
                              <div className="flex flex-row items-center justify-start fade-in-10 bg-gray-100 rounded-sm">
                                <div onClick={() => {
                                  handleAdd(task.id, task)
                                  setTypeOpen("show");
                                }} className="w-[100px] p-2 rounded-sm flex justify-around items-center  bg-gray-100 text-black hover:bg-gray-200 hover:text-black" >Show  <View /> </div>
                              </div>
                              <div className="flex flex-row items-center justify-start fade-in-10 bg-gray-100 rounded-sm">
                                <div onClick={() => {
                                  handleAdd(task.id, task)
                                  setTypeOpen("edit");
                                }} className="w-[100px] p-2 rounded-sm text-sm flex justify-around items-center  bg-gray-100 text-black hover:bg-gray-200 hover:text-black" >Edit <Edit /> </div>
                              </div>
                              <div className="flex flex-row items-center justify-start ">
                                <AlertDialog>
                                  <AlertDialogTrigger onClick={() => {
                                    handleAdd(task.id, task);
                                    setTypeOpen("delete");
                                  }}
                                    className="h-[40px] w-[100px] p-2 text-sm  text-black  flex justify-around items-center fade-in-10 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-black "
                                  >
                                    <button>
                                      Delete<Delete />
                                    </button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your task and below related tasks
                                        and remove your data from our servers.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => {
                                        handleDelete(); toast.success("deleted & click the save changes btn", {
                                          position: "top-right"
                                        })
                                      }}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                              {/* <div className="flex flex-row items-center justify-start">
                                <Button onClick={() => {
                                  setFeatures(true);
                                }} className="w-[100px] text-sm flex justify-around items-center  bg-gray-100 text-black hover:bg-gray-200 hover:text-black" >Chat <FileArchive /> </Button>
                              </div> */}
                            </>
                          }
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TooltipTrigger>
                <TooltipContent>
                  Create TaskShow
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  Refresh
                </TooltipContent>
              </Tooltip>
            </div>
          }
        </TableRow>,
        ...(isExpanded && task.children?.length
          ? [
            <TableRow
              key={`header-${task.id}`}
              className={`
    bg-gray-100 hover:bg-gray-100 
    border-2
  `}
            >
              {
                level === 0 && <TableCell className="p-4 text-xs font-medium">Task Name</TableCell>
              }
              {
                level === 0 && <TableCell className="p-4 text-xs font-medium" colSpan={3}>Description</TableCell>
              }
              {
                level === 0 && <TableCell className="p-4 text-xs font-medium  w-[200px] ">Status</TableCell>

              }
              {
                level === 0 && <TableCell className="p-4 text-xs font-medium">Action</TableCell>
              }
            </TableRow>,
            ...renderRows(task.children, level + 1, task?.children),
          ]
          : []),

      ];
    });
  };
  return (
    <>
      <div className="overflow-x-auto ">
        <Table className="min-w-full text-sm text-left text-gray-800">
          <tbody
          >{renderRows(tasks)}</tbody>
        </Table>
        {
          typeOpen === "add" && <AddTaskModal
            projectId={initialTasks[0]?.id} type={typeOpen} open={openModal} setOpen={setOpenModal} onSave={handleSaveAdd} />
        }
        {
          typeOpen !== "" && typeOpen !== "add" && typeOpen !== "doc" && typeOpen !== "delete" &&
          <EditTaskModal
            open={openModal}
            setOpen={setOpenModal}
            type={typeOpen}
            selectedTask={selectedTask}
            initialTasks={tasks}
            onSave={handleSave}
            handleSave={handleSave}
          />
        }
      </div>
      {
        features && <ChatBox type={"group"} selectedTask={selectedTask} tasks={tasks} open={features} setOpen={setFeatures} />
      }
      {
        docFeature && <ReadMeMd
          // project={tasks}
          selectedTask={selectedTask} tasks={tasks} open={docFeature} setOpen={setDocFeature}
        />
      }
      {
        showDeatilsDescription && <Dialog open={showDeatilsDescription.open} onOpenChange={() => {
          setShowDetailsDescription({
            open: false,
            value: ""
          })
        }}>
          <DialogContent className="overflow-y-scroll h-130 hide-scrollbar">
            <DialogTitle>Description</DialogTitle>
            <div>
              {showDeatilsDescription.value}
            </div>
          </DialogContent>
        </Dialog>
      }
    </>
  );
}
