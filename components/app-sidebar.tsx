"use client";

import * as React from "react";
import {
  Command,
  Eye,
  Inbox,
  Loader,
  Lock,
  Stethoscope,
  Trash2,
  UserLock,
  PersonStanding,
  AlignVerticalSpaceAround,
  PersonStandingIcon,
  Workflow,
  LoaderIcon,
} from "lucide-react";

import { NavUser } from "@/components/nav-user";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import toast from "react-hot-toast";
import { singleProjectType } from "@/types";
import { Button } from "./ui/button";
import ProgressBar from "./DataList/ProgressBar";
import HoverMessageBar from "@/utils/HoverMessager";
import FallBackShowProjectDialog from "./DataList/FallBackShowProjectDetailsDialog";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import NameLengthManage from "@/utils/nameLengthManage";
import Percentage_Review from "./Percentage";
import { useProjectFetchStata } from "@/utils/RefreshProjectStatus";
import Link from "next/link";
import { useRoleProvider } from "@/utils/roleProviderContext";
import { useRefreshDBProvider } from "@/utils/RefreshDbs";

// This is sample data
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Project's",
      url: "#",
      icon: Inbox,
      isActive: true,
    },
    {
      title: "Profile",
      url: "#",
      icon: UserLock,
      isActive: false,
    },
    {
      title: "admin",
      url: "/admin",
      icon: PersonStanding,
      isActive: false,
    },
    {
      title: "myWorkSpace",
      url: "/myWorkSpace",
      icon: Workflow,
      isActive: false,
    },
  ],
};

export function AppSidebar({
  user,
  setUser,
  clickProjectData,
  toggleActionCreateUpdateFn,
  setOpenCreateProject,
  setClickProjectData,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  toggleActionCreateUpdateFn: (arg: string) => void;
  setClickProjectData: React.Dispatch<
    React.SetStateAction<singleProjectType | undefined>
  >;
  clickProjectData: singleProjectType | undefined;
  setOpenCreateProject: React.Dispatch<React.SetStateAction<boolean>>;
  user: {
    username: string;
    password: string;
    identifier: string;
    _id: string;
  };
  setUser: React.Dispatch<
    React.SetStateAction<{
      username: string;
      password: string;
      identifier: string;
      _id: string;
    }>
  >;
}) {
  const { addProjectDBRefreshDB, setAddProjectDBRefreshDB } =
    useRefreshDBProvider();
  const [percentageScore, setPercentageScore] = React.useState<
    Map<string, number>
  >(new Map());
  const [projectData, setProjectData] = React.useState<
    singleProjectType[] | []
  >([]);
  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
  const [filterProjects, setFilterProjects] = React.useState<string>("");
  const [selectedProjectChangeColor, setSelectedProjectChangeColor] =
    React.useState("");
  // hover Eyes for
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [isOpenDetails, setIsOpenDetails] = React.useState(false);

  // hover status progress bar
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);

  // see profile and update
  const [profileShow, setProfileShow] = React.useState<boolean>(false);

  // loading
  const [projectLoading, setProjectLoading] = React.useState(false);

  // userdetails
  const [userDetails, setUserDetails] = React.useState<{
    username: string;
    password: string;
    identifier: string;
  }>({
    username: "",
    password: "",
    identifier: "",
  });

  const { setOpen } = useSidebar();
  const fetchAll = async () => {
    setProjectLoading(true);
    const request = await fetch("/api/project/getAll", {
      method: "GET",
    });
    const response = await request.json();
    if (response?.success) {
      setProjectData(response.data); // Project Data
      const projectList = projectData?.map((item) => item.name);
    } else {
      toast.error(response?.message);
    }
    setProjectLoading(false);
  };
  React.useEffect(() => {
    if (addProjectDBRefreshDB === true) {
      fetchAll();
      setAddProjectDBRefreshDB(false);
    }
  }, [addProjectDBRefreshDB]);

  const [loadingLogout, setLoadingLogout] = React.useState(false);
  const submitLogOut = async () => {
    setLoadingLogout(true);
    const request = await fetch("/api/logout", {
      method: "GET",
    });
    if (request?.ok) {
      const response = await request.json();
      if (response?.success) {
        toast.success("SuccessFully Logout");
        setLoadingLogout(false);
        window.location.reload();
      } else {
        setLoadingLogout(false);
        toast.error(response?.message);
      }
    } else {
      setLoadingLogout(false);
      toast.error("Some Error Occured");
    }
  };

  const fetchUserDetails = async () => {
    try {
      const request = await fetch(`/api/login/details`);
      if (request.ok) {
        const response = await request.json();
        if (response?.success) {
          setUserDetails(response.data);
          setUser(response.data);
        } else {
          console.log(response);
          toast.error(response?.message);
        }
      } else {
        toast.error("Server error");
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal Server error");
    }
  };
  // percentage
  const dataSet = async () => {
    const list = await Percentage_Review();
    console.log(list, 241);
    setPercentageScore(list);
  };

  React.useEffect(() => {
    dataSet();
    fetchAll();
    fetchUserDetails();
  }, []);

  const { refreshDataAgain, setRefreshDataAgain } = useProjectFetchStata();

  React.useEffect(() => {
    if (refreshDataAgain === true) {
      dataSet();
      fetchAll();
      setRefreshDataAgain(false);
    }
  });

  const { loginrole } = useRoleProvider();
  return (
    <>
      <Sidebar
        collapsible="icon"
        className=" overflow-hidden *:data-[sidebar=sidebar]:flex-row"
        {...props}
      >
        <Sidebar
          collapsible="none"
          className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
        >
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                  <a href="#">
                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                      <Command className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">Acme Inc</span>
                      <span className="truncate text-xs">Enterprise</span>
                    </div>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {data.navMain.map((item) => {
                    if (loginrole !== "core-admin" && item.title === "admin") {
                      return;
                    }
                    return (
                      <SidebarMenuItem
                        key={item.title}
                        className="flex justify-center items-center p-[-10px]"
                      >
                        <SidebarMenuButton
                          tooltip={{
                            children: item.title,
                            hidden: false,
                          }}
                          onClick={() => {
                            // Logout
                            if (item.title === "Profile") {
                              // submitLogOut();
                              setProfileShow((prev) => !prev);
                            } else {
                              // Projects
                              setActiveItem(item);
                              // const mail = data.mails.sort(() => Math.random() - 0.5)
                              setOpen(true);
                              if (item.title === "myWorkSpace") {
                                window.location.replace(item.url);
                              }
                              if (
                                item.title === "admin" &&
                                loginrole === "core-admin"
                              ) {
                                window.location.replace(item.url);
                              }
                            }
                          }}
                          isActive={activeItem?.title === item.title}
                          className="flex flex-row  justify-center items-center"
                        >
                          {/* {
                          userDetails?.identifier === "core-admin" && item.title === "admin" && <item.icon className="ml-2" size={100} />
                        } */}
                          {item.title === "myWorkSpace" && (
                            <Link href={item.url}>
                              <Workflow size={20} />
                            </Link>
                          )}
                          {item.title !== "admin" &&
                            item.title !== "myWorkSpace" && (
                              <item.icon className="ml-2" size={100} />
                            )}
                          {item.title === "admin" &&
                            loginrole === "core-admin" && (
                              <Link href={"/admin"}>
                                <PersonStandingIcon />
                              </Link>
                            )}
                          {/* {
                            item.title === "myWorkSpace" && <Link href={"/myWorkSpace"}>
                              <Workflow/>
                            </Link>
                          } */}
                          {<span>{item.title}</span>}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <NavUser user={data.user} />
          </SidebarFooter>
        </Sidebar>
        {/* This is the second sidebar */}
        {/* We disable collapsible and let it fill remaining space */}
        <Sidebar collapsible="none" className="hidden flex-1 md:flex">
          <SidebarHeader className="gap-3.5 text-3xl border-b py-4">
            <div className="flex w-full items-center justify-between">
              <div className="text-foreground font-[400] m-.5 text-4xl">
                {activeItem?.title}
              </div>
            </div>
            <SidebarInput
              className="h-9 mt-2 w-68"
              placeholder="Type to search..."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                e.preventDefault();
                setFilterProjects(e.target.value);
              }}
            />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup className="px-0 mt-[-8px] overflowY-scroll overflow-x-hidden">
              <SidebarGroupContent>
                {projectLoading === true ? (
                  <div className=" w-full h-[100%]  p-auto flex justify-center items-center">
                    <Loader className="animate-spin" size={32} />
                  </div>
                ) : (
                  projectData?.map((item, index) => {
                    if (
                      filterProjects !== "" &&
                      !item.name.startsWith(filterProjects)
                    ) {
                      return;
                    }
                    return (
                      <a
                        onMouseEnter={() => {
                          setHoverIndex(index);
                        }}
                        onMouseLeave={() => {
                          setHoverIndex(null);
                        }}
                        onClick={() => {
                          if (item !== undefined) {
                            console.log(item);

                            setClickProjectData(item);
                          }
                          setSelectedProjectChangeColor(item?.name);
                        }}
                        href="#"
                        key={item?._id}
                        className={`border-b-1 first:border-t-1 first:border-t-gray-400 border-b-gray-400 hover:text-sidebar-accent-foreground flex flex-col items-start  pl-2 pt-2 pb-3 pr-2 text-sm leading-tight whitespace-nowrap ${
                          selectedProjectChangeColor === item?.name
                            ? "bg-gray-200"
                            : "bg-wheat"
                        } hover:bg-gray-300 ${
                          hoverIndex === index ? "h-[90px]" : "h-[50px]"
                        } `}
                      >
                        <div className="flex w-full items-center">
                          <span className="text-xl font-[400]">
                            {NameLengthManage(
                              item.name.substring(0, 1).toUpperCase() +
                                item.name?.substring(1).toLowerCase(),
                              20
                            )}
                          </span>{" "}
                          <span
                            className="ml-auto text-sm font-semibold"
                            onClick={() => {
                              setIsOpenDetails((prev) => !prev);
                            }}
                          >
                            <HoverMessageBar
                              title={<Eye />}
                              msg="Show Details"
                              index={index}
                              hoveredIndex={hoveredIndex}
                              setHoveredIndex={setHoveredIndex}
                            />
                          </span>
                        </div>
                        {hoverIndex === index && (
                          <div className="w-[290px]">
                            <ProgressBar
                              comeFrom={"app-sidebar"}
                              percentage={
                                // givePercentage(item?.status)
                                percentageScore.get(item?._id)
                              }
                            />
                          </div>
                        )}
                      </a>
                    );
                  })
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <Button
            onClick={() => {
              setOpenCreateProject(true);
            }}
            style={{
              backgroundColor: "black",
              color: "white",
              width: "290px",
              marginBottom: "10px",
              marginLeft: "5px",
            }}
          >
            <span>Add Project</span>
          </Button>
        </Sidebar>
      </Sidebar>
      {isOpenDetails && (
        <FallBackShowProjectDialog
          clickProjectData={clickProjectData ?? null}
          isOpenShowProjectDetail={isOpenDetails}
          setIsOpenShowProjectDetailDialog={setIsOpenDetails}
        />
      )}
      {profileShow && (
        <ProfileDialog
          fn={submitLogOut}
          open={profileShow}
          onClose={setProfileShow}
          data={userDetails}
          loadingLogout={loadingLogout}
        />
      )}
    </>
  );
}

const ProfileDialog = ({
  data,
  fn,
  open,
  onClose,
  loadingLogout,
}: {
  data: {
    username: string;
    password: string;
    identifier: string;
  };
  fn: () => void;
  open: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  loadingLogout: boolean;
}) => {
  const [loading, setLoading] = React.useState(false);
  const [details, setDetails] = React.useState<{
    username: string;
    oldPassword: string;
    password: string;
  }>({
    username: data?.username,
    oldPassword: "",
    password: "",
  });
  const [checkPassword, setCheckPassword] = React.useState(false);
  const [isUpdateClick, setIsUpdateClick] = React.useState(false);
  const handleData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetails({
      ...details,
      [e.target.name]: e.target.value,
    });
  };

  const updatePassword = async () => {
    setLoading(true);
    if (details?.oldPassword === "") {
      toast.error("Password is not empty");
    }
    if (details?.oldPassword !== data?.password) {
      toast.error("Wrong password");
      setLoading(false);
      return;
    } else {
      setCheckPassword(true);
    }
    setLoading(false);
  };

  const update = async () => {
    try {
      console.log(details?.username, details?.password);
      const request = await fetch("/api/login/updateById", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          details,
        }),
      });
      if (request.ok) {
        const response = await request.json();
        if (response.success) {
          toast.success(response?.message);
          window.location.reload();
        } else {
          toast.error(response?.message);
        }
      } else {
        toast.error("SomeThing went wrong");
      }
    } catch (error) {
      console.log(error);

      toast.error("SomeThing went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>{data?.username + " Profile"}</DialogTitle>
        <div className="p-3 m-3 grid grid-cols-1">
          <div className="flex justify-start items-center m-2 gap-4.5">
            <Label className="w-17">UserName</Label>
            <Input
              value={details?.username}
              placeholder="Profile username"
              className="text-black"
              disabled
            />
          </div>
          <div className="flex justify-start items-center m-2 gap-4.5">
            <Label className="w-21">Role</Label>
            <Input
              value={data?.identifier}
              placeholder="Profile identifier"
              className="text-black"
              disabled
            />
          </div>
          {isUpdateClick && (
            <>
              <div className="flex justify-start items-center m-2 gap-4.5">
                <Label className="w-17">oldPassword</Label>
                <Input
                  value={details?.oldPassword}
                  name="oldPassword"
                  placeholder="Profile oldPassword"
                  onChange={handleData}
                  className=""
                />
              </div>
              {checkPassword && (
                <div className="flex justify-start items-center m-2 gap-4.5">
                  <Label className="w-17 mr-2">Enternew</Label>
                  <Input
                    value={details?.password}
                    name="password"
                    placeholder="password"
                    onChange={handleData}
                    className=""
                  />
                </div>
              )}
            </>
          )}
          <div className="flex justify-start items-center gap-4 mt-5">
            {isUpdateClick && (
              <Button
                onClick={() => {}}
                className="bg-black text-white font-medium"
              >
                {loading ? (
                  <Loader className="animate-spin" />
                ) : details?.password === "" ? (
                  <div
                    onClick={() => {
                      updatePassword();
                    }}
                  >
                    {" "}
                    Check{" "}
                  </div>
                ) : (
                  <div
                    className="flex flex-row gap-3"
                    onClick={() => {
                      update();
                    }}
                  >
                    {loading ? (
                      <Loader className="animate-spin" />
                    ) : (
                      <>
                        Update <Stethoscope />
                      </>
                    )}
                  </div>
                )}
              </Button>
            )}
            {!isUpdateClick && (
              <Button
                onClick={async () => {
                  setIsUpdateClick((prev) => !prev);
                }}
                className="bg-black text-white font-medium"
              >
                {loading ? (
                  <Loader className="animate-spin" />
                ) : (
                  <>
                    Update password
                    <Lock />{" "}
                  </>
                )}
              </Button>
            )}
            <Button
              disabled={loadingLogout}
              onClick={() => {
                fn();
              }}
            >
              {loadingLogout ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                <>
                  Logout <Trash2 />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
