import dayjs from "dayjs";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import {  singleProjectType } from "@/types";
import { Dispatch, SetStateAction } from "react";

export default function FallBackShowProjectDialog(
    {
        isOpenShowProjectDetail,
        setIsOpenShowProjectDetailDialog,
        clickProjectData
    }: {
        isOpenShowProjectDetail  : boolean,
         setIsOpenShowProjectDetailDialog : Dispatch<SetStateAction<boolean>> ,
        clickProjectData : singleProjectType | null
    }
) {
    return (
        <Dialog open={isOpenShowProjectDetail} onOpenChange={setIsOpenShowProjectDetailDialog} >
            <DialogContent>
                <DialogTitle>
                    {clickProjectData?.name}
                </DialogTitle>
                <div>
                    <div>
                        <div className="w-[100%] flex flex-1 justify-start items-center flex-col px-3 rounded-l-2xl rounded-3xl">
                            <ul className="mb-3 w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <li className="w-full px-4 py-[15px] border-b border-gray-200 dark:border-gray-600">Client : <span className="">{clickProjectData?.client}</span></li>
                                <li className="w-full px-4 py-[15px] border-b border-gray-200 dark:border-gray-600">Creator : <span className="">{clickProjectData?.by?.username}</span></li>
                                <li className="w-full px-4 py-[15px] border-b border-gray-200 rounded-t-lg dark:border-gray-600 flex flex-row justify-center items-center">
                                    <Label className="flex flex-row w-[70px]">Status : </Label>
                                    <div className="w-full font-bold">
                                        {clickProjectData?.status}
                                    </div>
                                </li>
                                <li className="w-full px-4 py-[15px] border-b border-gray-200 dark:border-gray-600">Start Date : <span className="">{dayjs(new Date(clickProjectData?.createdAt ?? new Date())).format("DD/MM/YY HH:mm:ss ")}</span></li>
                                <li className="w-full px-4 py-[15px] border-b border-gray-200 dark:border-gray-600">Current Date : <span className="">{dayjs(new Date()).format("DD/MM/YY HH:mm:ss ")}</span></li>
                            </ul>
                        </div>
                        <div className="w-[100%] p-2">
<span className="text-sm font-medium ml-2">

                                {clickProjectData?.description ?? "It's Very Big Project and important project we all need to focus on them and try to give agian as we give 100% to all projects"}</span>  </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}