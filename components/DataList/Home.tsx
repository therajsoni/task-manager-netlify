import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CustomTabs from "./Tabs";
import NameLengthManage from "@/utils/nameLengthManage";
import DefaultPage from "../defaultHomePageProjectWhenNotClickAnyProject";
import FallBackShowProjectDialog from "./FallBackShowProjectDetailsDialog";
import FallBackShowStatus from "./FallBackShowStatus";
import UpdateProjectDetails from "../UpdateProjectDetails";
import { Label } from "../ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { AlertCircle, Plus, RotateCw, Upload, View } from "lucide-react";
import { singleProjectType } from "@/types";
import { AlertLogges } from "./ShowAlertLogges";
import { useRoleProvider } from "@/utils/roleProviderContext";
import TaskEditor from "../DictinoryBox/TaskDescribeDetailBox";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import ViewGraphs from "@/utils/DocUtils/ViewGraphs";
// import AlertPage from "../AlertPage";
// import AlertPage from "../AlertPage";
export default function HomeDataListPage({ username, userData, identifier, actionCreateUpdate, clickProjectData, toggleActionCreateUpdateFn, setActionCreateUpdate
}: {
    username: string,
    userData: {
        username: string,
        password: string,
        identifier: string,
        _id: string
    },
    actionCreateUpdate: {
        open: boolean,
        action: string
    }, clickProjectData: singleProjectType | undefined, toggleActionCreateUpdateFn: (args: string) => void, identifier: string, setActionCreateUpdate: Dispatch<SetStateAction<{
        open: boolean,
        action: string,
    }>>
}) {
    const [uploadBoxOpen, setUploadBoxOpen] = useState<boolean>(false);
    const [stateAlert, setStateAlert] = useState(false);
    const [isEmail, setIsEmail] = useState(false);
    const [updateProjectData, setUpdateProjectData] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isAdmin] = useState<boolean>(false);
    const [isOpenShowProjectDetailDialog, setIsOpenShowProjectDetailDialog] = useState<boolean>(false);
    const [type, setType] = useState("");
    const [showLogges, setShowLogges] = useState<boolean>(false);
    const [viewGraphs, setViewGraphs] = useState(false);
    const {
        loginrole,
        projectBaseRole,
        data: UserGlobalData,
    } = useRoleProvider();
    const [uploadBoxKeyBoardDown, setUploadBoxKeyBoardDown] = useState(false);
    useEffect(() => {
        if (loginrole && UserGlobalData && clickProjectData?.name) {
            projectBaseRole(clickProjectData?.name);
        }
    }, [
        loginrole,
        UserGlobalData,
        clickProjectData?.name
    ]);
    function onClose() {
        setIsOpen((prev: boolean) => !prev);
    }
    if (actionCreateUpdate.open && actionCreateUpdate?.action === "createProject") {
        return <></>
    }
    if (!clickProjectData) {
        return <DefaultPage />
    }
    return (
        <>
            <div className="bg-white shadow-md p-4 w-full mt-2">
                <div className="flex flex-wrap justify-between items-center mb-3">
                    <h1 className="text-lg font-semibold text-gray-800 flex flex-col">
                        <div className="m-2 ml-0">{NameLengthManage(clickProjectData?.name, 80)}</div>
                    </h1>
                    <div className="w-full sm:w-auto sm:min-w-[20%] flex justify-end gap-4 text-sm pt-2">
                        <div className="flex flex-wrap justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-2">
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className="bg-[#DEE791] hover:bg-[#DEE791] text-black ml-5 p-2 rounded-xs"
                                                onClick={() => {
                                                    setType("addGroupMember")
                                                    setIsOpen((prev: boolean) => !prev);
                                                }}
                                            >
                                                <button>
                                                    <Plus />
                                                </button>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Add Group Member
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="bg-[#DEE791] hover:bg-[#DEE791] text-black ml-5 p-2 rounded-xs"
                                            onClick={() => {
                                                setUpdateProjectData(true);
                                            }}
                                        >
                                            <button>
                                                <RotateCw />
                                            </button>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Update Project
                                    </TooltipContent>
                                </Tooltip>
                                {/* <span className="bg-[#DEE791] hover:bg-[#DEE791] text-black ml-5 p-2 rounded-xs"
                                    onClick={() => {
                                        setUploadBoxOpen(true);
                                    }}
                                    onMouseEnter={() => {
                                        setUploadBoxKeyBoardDown(true);
                                    }}
                                    onMouseLeave={() => {
                                        setUploadBoxKeyBoardDown(false);
                                    }}
                                > */}
                                {/* {uploadBoxKeyBoardDown && <span>
                                        Upload project files
                                    </span>} */}
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="bg-[#DEE791] hover:bg-[#DEE791] text-black ml-5 p-2 rounded-xs"

                                        >
                                            <button>
                                                <Upload onClick={() => {
                                                    setUploadBoxOpen(true);
                                                }} />
                                            </button>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Add Attachments
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="bg-[#DEE791] hover:bg-[#DEE791] text-black ml-5 p-2 rounded-xs"
                                        >
                                            <button>
                                                <View onClick={() => {
                                                    setViewGraphs(true);
                                                }} />
                                            </button>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        View Graphs
                                    </TooltipContent>
                                </Tooltip>
                                {/* <Tooltip>
                                    <TooltipTrigger>
                                              <div className="bg-[#DEE791] hover:bg-[#DEE791] text-black ml-5 p-2 rounded-xs"

                                        >
                                            <button>
                                                <AlertCircle onClick={() => {
                                        setStateAlert(true);
                                    }} />
                                            </button>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Create Project Alert
                                    </TooltipContent>
                                </Tooltip> */}
                                {/* </span> */}
                                {/* <span className="bg-[#DEE791] hover:bg-[#DEE791] text-black ml-5 p-2 rounded-xs"
                                    onClick={() => {
                                        setStateAlert(true);
                                    }}
                                >
                                    <AlertCircle />
                                </span> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap justify-between items-center p-2 tracking-normal bg-gray-100">
                <Label className="text-sm/8  font-thinlight pl-3">{clickProjectData?.description ?? <>{"It's Very Big Project and important project we all need to focus on them and try to give agian as we give 100% to all projects Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi sapiente consectetur error ullam eveniet aperiam similique reprehenderit distinctio?"}
                </>} </Label>
            </div>
            <hr className="text-black" />
            {
                updateProjectData
                &&
                <UpdateProjectDetails id={clickProjectData?._id} oldData={clickProjectData} open={updateProjectData} setOpen={setUpdateProjectData} />
            }
            {isOpen ?
                <FallBackShowStatus isOpen={isOpen} onClose={onClose} isAdmin={isAdmin} type={type} clickProjectData={clickProjectData} /> : <></>}
            {isOpenShowProjectDetailDialog && <FallBackShowProjectDialog isOpenShowProjectDetail={isOpenShowProjectDetailDialog} setIsOpenShowProjectDetailDialog={setIsOpenShowProjectDetailDialog} clickProjectData={clickProjectData} />}
            <CustomTabs identifier={identifier}
                data={clickProjectData}
                userData={userData}
            />
            {
                showLogges && <AlertLogges open={showLogges} onClose={setShowLogges} />
            }
            {
                uploadBoxOpen && <>
                            <TaskEditor uploadBoxOpen={uploadBoxOpen} setUploadBoxOpen={setUploadBoxOpen} openMain={uploadBoxOpen} clickProjectData={clickProjectData} />
                    
                </>
            }
            {
                viewGraphs && <>
                        <ViewGraphs 
                        viewGraphs={viewGraphs}
                        setViewGraphs={setViewGraphs}
                        // clickProjectData={clickProjectData}
                         />
                </>
            }
            {/* {
                stateAlert && <>
                    <AlertPage stateAlert={stateAlert} setStateAlert={setStateAlert} projectDeatils={clickProjectData} />
                </>
            } */}
        </>
    );
}
