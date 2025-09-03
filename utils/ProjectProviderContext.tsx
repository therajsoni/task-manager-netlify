"use client";
import { singleProjectType } from "@/types";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import toast from "react-hot-toast";
import percentage from "./statusPercentage";
type CreateProjectType = {
  name: string;
  client: string;
  description: string;
  projectManager: string;
};
type UpdateProjectType = {
  name: string;
  status: string;
  client: string;
  description: string;
  id: string;
};
type CreateProjectTeamType = {
  val: string;
  id: string;
};
type UpdateProjectTeamType = {
  newData: Response;
  id: string;
};
type DeleteProjectTeamType = {
  name: string;
  id: string;
};
type ProjectContextType = {
  projectData: singleProjectType[];
  userProjects: string[] | undefined;
  setProjectData: Dispatch<SetStateAction<singleProjectType[]>>;
  loading: boolean;
  fetchAll: () => void;
  createProject: (data: CreateProjectType) => Promise<void>;
  updateProject: (data: UpdateProjectType) => Promise<void>;
  percentageReview: () => Promise<Map<string, number>>;
  createProjectTeam: (data: CreateProjectTeamType) => Promise<void>;
  updateProjectStatus: (data: UpdateProjectTeamType) => Promise<void>;
  projectMemberDelete: (data: DeleteProjectTeamType) => Promise<void>;
};

const ProjectContext = createContext<ProjectContextType>({
  projectData: [],
  userProjects: [],
  setProjectData: () => {},
  loading: false,
  fetchAll: () => {},
  createProject: async () => {},
  updateProject: async () => {},
  percentageReview: async () => new Map(),
  createProjectTeam: async () => {},
  updateProjectStatus: async () => {},
  projectMemberDelete: async () => {},
});
export const ProjectDataContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [projectData, setProjectData] = useState<any>();
  const [userProjects, setUserProjects] = useState<string[] | undefined>();
  const [loading, setLoading] = useState(false);
  const fetchAll = async () => {
    setLoading(true);
    const request = await fetch("/api/project/getAll", {
      method: "GET",
    });
    const response = await request.json();
    if (response?.success) {
      setProjectData(response.data);
      const projectList = projectData?.map(
        (item: singleProjectType) => item.name
      );
      setUserProjects(projectList);
      toast.success("Entire Project Data Getted Successfully");
    } else {
      toast.error(response?.message);
    }
    setLoading(false);
  };
  const createProject = async (data: {
    name: string;
    client: string;
    description: string;
    projectManager: string;
  }) => {
    setLoading(true);
    const request = await fetch("/api/project/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data,
      }),
    });
    const response = await request.json();
    if (response?.success) {
      await fetchAll();
      toast.success("Project created successfully");
    } else {
      toast.error(response?.message);
    }
    setLoading(false);
  };
  const updateProject = async (data: {
    name: string;
    status: string;
    client: string;
    description: string;
    id: string;
  }) => {
    setLoading(true);
    const request = await fetch(`/api/project/patchById/${data?.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });
    const response = await request.json();
    if (response?.success) {
      toast.success(response.message);
      await fetchAll();
    } else {
      toast.error(response?.message);
    }
    setLoading(false);
  };
  const percentageReview = async () => {
    setLoading(true);
    const data = new Map();
    const fetchProjectData = async () => {
      const res = await fetch("/api/project/getAll", { method: "GET" });
      const json = await res.json();
      return json?.success ? json.data : [];
    };

    const projects = await fetchProjectData();

    await Promise.all(
      projects.map(async (item: singleProjectType) => {
        const subRes = await fetch("/api/tasks/", {
          method: "POST",
          body: JSON.stringify({ projectId: item._id }),
        });
        const subJson = await subRes.json();

        if (subJson.success) {
          const per = percentage(subJson?.data?.data[0]);
          data.set(item._id, per);
        } else {
          data.set(item._id, 0);
        }
      })
    );
    setLoading(false);
    return data;
  };
  const createProjectTeam = async ({ val, id }: CreateProjectTeamType) => {
    setLoading(true);
    const request = await fetch(`/api/project/create-project-team/${id}`, {
      method: "POST",
      body: JSON.stringify({ team: [val], id }),
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    const res = await request.json();
    if (request.ok && res.success) {
      toast.success("User added");
      await fetchAll();
    } else {
      toast.error("Not added Error");
    }
    setLoading(false);
  };
  const updateProjectStatus = async ({
    newData,
    id,
  }: UpdateProjectTeamType) => {
    setLoading(true);
    const rootStatus = await newData.json();
    const request = await fetch(`/api/project/update-status`, {
      method: "POST",
      body: JSON.stringify({
        status: rootStatus?.data[0]?.status,
        id: id,
      }),
    });
    const res = await request.json();
    if (request.ok && res.success) {
      toast.success("Update status update");
      await fetchAll();
    } else {
      toast.error("Update status Error occur");
    }
    setLoading(false);
  };
  const projectMemberDelete = async ({ name, id }: DeleteProjectTeamType) => {
    setLoading(true);
    const request = await fetch(`/api/project/project-member-delete/${id}`, {
      method: "POST",
      body: JSON.stringify({ name, id }),
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    const response = await request.json();
    if (request.ok && response.success) {
      await fetchAll();
      toast.success("User deleted from project");
    } else {
      toast.error("User not deleted");
    }

    setLoading(false);
  };
  useEffect(() => {
    fetchAll();
  }, [loading]);
  return (
    <ProjectContext.Provider
      value={{
        projectData,
        userProjects,
        setProjectData,
        loading,
        fetchAll,
        createProject,
        updateProject,
        percentageReview,
        createProjectTeam,
        updateProjectStatus,
        projectMemberDelete,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
export const useProject = () => useContext(ProjectContext);
