"use client";
import { AppSidebar } from "@/components/app-sidebar"
import CreateProjectDialog from "@/components/Createproject";
import DefaultPage from "@/components/defaultHomePageProjectWhenNotClickAnyProject";
// import { DraggableToast } from "@/components/DraggableToast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { singleProjectType } from "@/types";
import NameLengthManage from "@/utils/nameLengthManage";
import useProjectStore from "@/utils/store";
import dynamic from "next/dynamic";
import {useState } from "react";
const HomeDataListPage = dynamic(() => import("@/components/DataList/Home"), { ssr: false })
export default function Page(
) {
  const identifier = useProjectStore((state) => state.identifier);
  const [actionCreateUpdate, setActionCreateUpdate] = useState<{
    open: boolean,
    action: string
  }>({ open: false, action: "" });
  const [clickProjectData, setClickProjectData] = useState<singleProjectType | undefined>();
  const [openCreateProject, setOpenCreateProject] = useState(false);
  function toggleActionCreateUpdateFn(args: string) {
    setActionCreateUpdate({ open: !actionCreateUpdate.open, action: args });
  }
  const [user, setUser] = useState<{
    username: string,
    password: string,
    identifier: string,
    _id: string
  }>({
    username: "",
    password: "",
    identifier: "",
    _id: "",
  });
   const [newAlert, setNewAlert] = useState(false);
   const [alertData,setAlertData] = useState<{
    title : string,
    description : string,
    createdBy : string,
    time : Date
   }>({
    title : "",
    description : "",
    createdBy : "",
    time : new Date()
   })
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        user={user}
        setUser={setUser}
        setOpenCreateProject={setOpenCreateProject} 
        clickProjectData={clickProjectData} 
        toggleActionCreateUpdateFn={toggleActionCreateUpdateFn}
        setClickProjectData={setClickProjectData}
      />
      <SidebarInset>
        <header className="bg-background fixed w-full top-0 flex shrink-0 items-center gap-2 border-b p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{NameLengthManage(clickProjectData?.name ?? "", 160) ?? "project"}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className=" scroll-auto flex flex-1 flex-col mt-3 " style={{
        }}>
          {
            openCreateProject && <CreateProjectDialog
              setOpen={setOpenCreateProject} open={openCreateProject} />
          }
          {
            clickProjectData === null ? <DefaultPage /> : <HomeDataListPage
              username={user?.username}
              userData={user}
              identifier={identifier}
              toggleActionCreateUpdateFn={toggleActionCreateUpdateFn} actionCreateUpdate={actionCreateUpdate} clickProjectData={clickProjectData} setActionCreateUpdate={setActionCreateUpdate} />
          }
        </div>
        {/* {
                newAlert && <DraggableToast
                    data={alertData}
                    onClose={() =>
                        setNewAlert(false)
                    } />
            }  */}
      </SidebarInset>
    </SidebarProvider>
  )
}