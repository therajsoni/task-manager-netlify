import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import UpdateTask from "./UpdateTask";
import toast from "react-hot-toast";
import userTaskStatusDescription from "@/utils/userSpecificTask";
import {
  CompletedTaskList,
  ProjectResponse,
  singleProjectType,
  TaskList,
} from "@/types";
import { useRoleProvider } from "@/utils/roleProviderContext";
import ChatBox from "@/utils/chatPage";
import { Task } from "@/components/DataList/Tabs";
import ReadMeMd from "@/utils/DocUtils/ReadMeMd";
import { useRefreshDBProvider } from "@/utils/RefreshDbs";
import { useFeatureProvider } from "@/utils/FeaturesContext";
import ProEditor from "@/utils/DocUtils/ProEditor";

export default function TaskShowSingleUser({
  taskData,
  projectData,
}: {
  taskData: ProjectResponse | undefined;
  projectData: singleProjectType;
}) {
  if (
    taskData?.projectId !== projectData?._id ||
    taskData?.data[0]?.id !== projectData?._id
  ) {
    taskData = undefined;
  }
  const { setKeyDefine } = useFeatureProvider();

  const [editorOpen, setEditorOpen] = useState(false);
  const [propsData, setPropsData] = useState<ProjectResponse>();
  useEffect(() => {
    if (taskData) {
      setPropsData(taskData);
    }
  }, [taskData]);
  const [open, setOpen] = useState<boolean>(false);
  const [openFeatures, setOpenFeatures] = useState(false);
  const handleSave = () => {
    console.log();
    setOpen(false);
    toast.success("task updated successfully");
  };
  const [selectedUpdateForDataState, setSelectedUpdateForDataState] = useState<
    TaskList | undefined
  >();
  const [taskDataState, setTaskDataState] = useState<{
    totalTasks: number;
    completedTasks: number;
    tasksList: TaskList[];
    completedList: CompletedTaskList[];
  }>();
  const [userName, setUserName] = useState("");
  const fetchUserDetails = async () => {
    const request = await fetch("/api/login/details", {
      method: "GET",
    });
    const response = await request?.json();
    if (request?.ok && response?.success) {
      setUserName(response?.data?.username);
    }
  };
  useEffect(() => {
    fetchUserDetails();
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5; // Change based on how many tasks per page
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = taskDataState?.tasksList?.slice(
    indexOfFirstTask,
    indexOfLastTask
  );
  const totalPages = Math.ceil(
    (taskDataState?.tasksList?.length || 0) / tasksPerPage
  );
  useEffect(() => {
    if (propsData !== undefined) {
      const request = userTaskStatusDescription(propsData, userName);
      setTaskDataState({
        totalTasks: request?.totalTasks,
        completedTasks: request?.completedTasks,
        tasksList: request?.tasksList,
        completedList: request?.completedList,
      });
    }
  }, [propsData, userName, taskData]);
  const [featureState, setFeatureState] = useState(false);
  const [fetchTask, setFetchTask] = useState<TaskList | Task>();
  const [readmeDescription, setReadmeDescription] = useState(false);
  const {
    loginrole,

    data: UserGlobalData,
    projectBaseRole,
  } = useRoleProvider();

  useEffect(() => {
    if (loginrole && UserGlobalData && projectData?.name) {
      projectBaseRole(projectData.name);
    }
  }, [loginrole, UserGlobalData, projectData?.name]);
  const [renderFeatures, setRenderFeatures] = useState({});
  const [featureEditor, setFeatureEditor] = useState<
    Map<string, Record<string, string | boolean>>
  >(new Map());
  const utilFunctionForAllTaskEditor = async () => {
    const promises = currentTasks
      ?.filter((item) => item?.name !== projectData?.name)
      .map(async (taskEach) => {
        const uniqueIdKey = projectData?._id + "#$#" + taskEach?.id;
        const dataForEach = await getShowingFeatures(uniqueIdKey);
        return [uniqueIdKey, dataForEach] as const;
      });

    if (promises) {
      const results = await Promise.all(promises);
      setFeatureEditor(new Map(results));
    }
  };
  const getShowingFeatures = async (key: string) => {
    const request = await fetch("/api/projectFeature", {
      method: "POST",
      body: JSON.stringify({
        key,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }); //http://localhost:3000/api/projectFeature
    const response = await request.json();
    console.log(response, "Response-+09()");
    console.log(response, "Response");
    if (request.ok && response.success) {
      const dataResponse = response?.data;
      const objBody: Record<string, string | boolean> = {};

      console.log(objBody, "----OBJECTBODY----");

      dataResponse?.features?.map(
        (d: { key: string; value: boolean; data: string }) => {
          // console.log(d, "d");
          // objBody[d.key] = d.value;
          objBody[d.key] = d.value === true; // normalize to boolean
        }
      );
      setRenderFeatures(objBody);
      return objBody;
    } else {
      setRenderFeatures({});
      return {};
    }
  };
  // useEffect(() => {
  //   // 68b7e589e5db043d5352aaaa#$#15d2e47b-e0ff-43cc-9cc3-a979aa71f78e
  //   const key = projectData?._id + "#$#" + fetchTask?.id;

  // console.log(key);
  // }, []);
  // console.log(renderFeatures, "Render Features0010");
  useEffect(() => {
    if (currentTasks?.length) {
      utilFunctionForAllTaskEditor();
    }
  }, [currentTasks]);

  return (
    <>
      <Table>
        <TableCaption>A list of your tasks</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Name Of Task</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assign</TableHead>
            <TableHead>Assign by</TableHead>
            <TableHead>Review</TableHead>
            {/* <TableHead>
                            Chat
                        </TableHead> */}
            <TableHead>Editor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentTasks
            ?.filter((item) => {
              return item?.name !== projectData?.name;
            })
            .map((item, index) => {
              const uniqueId = projectData._id + "#$#" + item.id;
              // getShowingFeatures(uniqueId);
              return (
                <TableRow key={index + 1}>
                  <TableCell>{indexOfFirstTask + index + 1}</TableCell>
                  <TableCell>{item?.name}</TableCell>
                  <TableCell>{item?.status}</TableCell>
                  <TableCell>{item?.createdAt}</TableCell>
                  <TableCell>{item?.by}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        setOpen(true);
                        setSelectedUpdateForDataState(item);
                      }}
                    >
                      Show
                    </Button>
                  </TableCell>
                  {/* <TableCell onClick={() => {
                                    setOpenFeatures(
                                        true
                                    )
                                    setFetchTask(item);
                                }} >
                                    <Button>
                                        Chat
                                    </Button>
                                </TableCell> */}
                  {featureEditor.get(uniqueId)?.document === true ? (
                    <TableCell
                      onClick={() => {
                        setReadmeDescription(true);
                        setFetchTask(item);
                      }}
                    >
                      <Button>Editor</Button>
                    </TableCell>
                  ) : (
                    <TableCell>
                      <Button disabled>Forbid</Button>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      <div className="flex justify-center mt-4 gap-2">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </Button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
      {open && (
        <UpdateTask
          type="edit"
          open={open}
          setOpen={setOpen}
          onSave={handleSave}
          data={selectedUpdateForDataState}
        />
      )}

      {openFeatures && (
        <ChatBox
          open={openFeatures}
          setOpen={setOpenFeatures}
          type=""
          selectedTask={fetchTask}
          projectDeatail={projectData}
        />
      )}
      {readmeDescription && (
        <ProEditor
          open={readmeDescription}
          setOpen={setReadmeDescription}
          selectedTask={fetchTask}
          projectDeatail={projectData}
        />
      )}
      {/* {
                editorOpen && <ReadMeMd open={editorOpen} setOpen={setEditorOpen}
                    selectedTask={fetchTask}
                    projectDeatail={projectData} />} */}
    </>
  );
}
