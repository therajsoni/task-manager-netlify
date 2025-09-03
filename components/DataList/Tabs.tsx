import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskTable from "./Task";
import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import TaskShowSingleUser from "../Users/TaskShow/page";
import toast from "react-hot-toast";
import { ProjectResponse, singleProjectType } from "@/types";
import { useProjectFetchStata } from "@/utils/RefreshProjectStatus";
import { useRoleProvider } from "@/utils/roleProviderContext";
import { useRefreshDBProvider } from "@/utils/RefreshDbs";
export type Task = {
  id: string;
  name: string;
  responsibility: string;
  status: string;
  createdAt: string;
  children?: Task[];
  description: string;
  by?: string;
  features?: {
    document?: boolean;
  };
  chats: [];
};
export const dynamic = "force-dynamic";
export default function CustomTabs({
  data,
  identifier,
  userData,
}: {
  data: singleProjectType;
  identifier: string;
  userData: {
    username: string;
    password: string;
    identifier: string;
    _id: string;
  };
}) {
  const initialTasks: Task[] = useMemo(() => {
    return [
      {
        id: data?._id,
        name: data?.name,
        responsibility: data?.by?.username,
        status: "Pending",
        createdAt: dayjs(new Date(data?.createdAt)).format(
          "YYYY-MM-DD HH:mm:ss A"
        ),
        children: [],
        features: {
          document: false,
        },
        description: data?.description,
        chats: [],
      },
    ];
  }, [
    data?._id,
    data?.name,
    data?.by?.username,
    data?.createdAt,
    data?.description,
  ]);

  const { addTaskDBRefreshDB, setAddTaskDBRefreshDB } = useRefreshDBProvider();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [projectId, setProjectId] = useState("");
  const [loading, setLoading] = useState(false);
  const [taskData, setTaskData] = useState<ProjectResponse | undefined>();
  const [features, setFeatures] = useState<boolean>(false);
  const fetchProjectTask = useCallback(async () => {
    const request = await fetch(`/api/tasks/`, {
      method: "POST",
      body: JSON.stringify({
        projectId: data?._id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (request.ok) {
      const response = await request.json();
      if (response.success) {
        setAddTaskDBRefreshDB(true);
        setTasks(response?.data?.data);
        setTaskData(response?.data);
      } else {
        setTasks(initialTasks);
      }
    } else {
      setTasks(initialTasks);
    }
  }, [data?._id, initialTasks]);

  useEffect(() => {
    fetchProjectTask();
  }, [data?._id, fetchProjectTask]);
  // useEffect(() => {
  //   if (addTaskDBRefreshDB == true) {
  //     fetchProjectTask();
  //     setAddTaskDBRefreshDB(false);
  //   }
  // }, [addTaskDBRefreshDB]);
  const { setRefreshDataAgain } = useProjectFetchStata();
  const submitProjectTask = async (tasks_: Task[]) => {
    setLoading(true);
    const request = await fetch("/api/fallbackTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: `${data?._id}`,
        data: tasks_,
      }),
      cache: "no-store",
    });
    if (request.ok) {
      setRefreshDataAgain(true);
      const response = await request.json();
      if (response.success) {
        toast.success(
          <span
            style={{
              fontWeight: "bold",
              fontSize: 15,
            }}
          >
            Task Updated
          </span>,
          {
            position: "top-right",
            duration: 3000,
          }
        );
        const newData = await fetch("/api/tasks/update", {
          method: "PUT",
          body: JSON.stringify({
            projectId: `${data?._id}`,
            updatedTaskTree: tasks_,
          }),
        });
        await updateProjectAfterSubmitTaskStatus(newData);
        setAddTaskDBRefreshDB(true);
      } else {
        //
        toast.error("Raj soni");
        toast.error(response.message);
      }
    } else {
      toast.error("some error occured");
    }
    setLoading(false);
  };
  const updateProjectAfterSubmitTaskStatus = async (newData: Response) => {
    // newData = await newData.json();
    const rootStatus = await newData.json();
    const update = await fetch(`/api/project/update-status`, {
      method: "POST",
      body: JSON.stringify({
        status: rootStatus?.data[0]?.status,
        id: data?._id,
      }),
    });
  };
  const handleSaveChanges = async (tasks_: Task[]) => {
    await submitProjectTask(tasks_);
  };
  const {
    loginrole,
    projectrole,
    data: UserGlobalData,
    projectBaseRole,
  } = useRoleProvider();
  useEffect(() => {
    if (loginrole && UserGlobalData && data?.name) {
      projectBaseRole(data.name);
    }
  }, [loginrole, UserGlobalData, data?.name]);

  return (
    <div className="flex w-full p-5 flex-col">
      <Tabs defaultValue="users">
        <TabsList className="flex-1 px-2 py-2  w-full">
          <TabsTrigger className="px-17 py-2.5" value="users">
            My Work
          </TabsTrigger>
          {(loginrole === "core-admin" || projectrole === "core-admin") && (
            <TabsTrigger className="px-17 py-2.5 w-fit" value="tasks">
              Tasks
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="users" defaultChecked>
          <TaskShowSingleUser projectData={data} taskData={taskData} />
        </TabsContent>
        {(loginrole === "core-admin" || projectrole === "core-admin") && (
          <TabsContent
            value="tasks"
            className="scroll-y-scroll max-h-[50vh] hide-scrollbar"
          >
            <div className="relative group inline-block cursor-pointer"></div>
            {
              <TaskTable
                userData={userData}
                initialTasks={initialTasks}
                projectId={projectId}
                setProjectId={setProjectId}
                tasks={tasks}
                setTasks={setTasks}
                features={features}
                setFeatures={setFeatures}
                loading={loading}
                handleSaveChanges={handleSaveChanges}
              />
            }
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
