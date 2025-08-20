import { Dispatch, SetStateAction, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import SelectInputBar from "./SelectBar";
// import TextAreaHTML from "./TextareaHTML";
// import UsersTable from "./UsersTable";
import { ClickProject } from "@/types";
import { useRoleProvider } from "@/utils/roleProviderContext";
import toast from "react-hot-toast";

export default function FallBackShowStatus({ isOpen, onClose, isAdmin, type, clickProjectData}: {
    isOpen : boolean ,
    onClose : Dispatch<SetStateAction<boolean>>,
    isAdmin : boolean,
    type : string,
    clickProjectData : ClickProject
}) {
    console.log(isAdmin);
    // admin project only change anything of project
    // const {
    //     loginrole,
    //     projectBaseRole,
    //     projectrole,
    //     data: UserGlobalData,
    // } = useRoleProvider();

    // useEffect(() => {
    //     if (loginrole && UserGlobalData && clickProjectData?.name) {
    //         projectBaseRole(clickProjectData.name);
    //     }
    // }, [
    //     loginrole,
    //     UserGlobalData,
    //     clickProjectData?.name
    // ]);

    // if (projectrole === undefined ||( projectrole !== undefined && projectrole !== "core-admin")) {
    //     toast(<>
    //         You are not allowed to update the project
    //     </>)
    //     return <></>
    // }
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogHeader />
            <DialogContent>
                <DialogTitle>
                    {
                        type === "addGroupMember" ? "Add group member" : "Status of project"
                    }
                </DialogTitle>
                <div>
                    {
                        type === "addGroupMember" && <SelectInputBar clickProjectData={clickProjectData}   />
                    }                  
                </div>
            </DialogContent>
        </Dialog>
    )
}