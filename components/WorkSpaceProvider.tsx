"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

type WorkSpaceContextType = {
    myregistrationDeatails: {
        name: string,
        username: string,
        email: string,
        phone: string,
        role: string,
        registrationDate: Date | undefined

    },
    myProjectsOverView: {
        totalProjects: string,
        completedProjects: string,
        currentProjectsInRoled: string,
        roles: string[],
    },
    myProjectList: { name: string, role: string, added: Date }[],
    fetchData: () => void;
}

const WorkSpaceContext = createContext<WorkSpaceContextType>({
    myregistrationDeatails: {
        name: "",
        username: "",
        email: "",
        phone: "",
        role: "",
        registrationDate: new Date()
    },
    myProjectsOverView: {
        totalProjects: "",
        completedProjects: "",
        currentProjectsInRoled: "",
        roles: [],
    },
    myProjectList: [],
    fetchData: () => { },
})

export const WorkSpaceProvider = ({ children }: {
    children: ReactNode
}) => {
    const [projects, setProjects] = useState<{
        name: string,
        role: string,
        added: Date,
    }[]>([]);
    const [totalData, setTotalData] = useState<{
        totalProjects: string,
        completedProjects: string,
        currentProjectsInRoled: string,
        roles: string[]
    }>({
        totalProjects: "",
        completedProjects: "",
        currentProjectsInRoled: "",
        roles: []
    })
    const [registrationDetails, setRegistrationDeatils] = useState<{
        name: string, username: string, email: string, phone: string, role: string, registrationDate: Date | undefined,
    }>({
        name: "", username: "", email: "", phone: "", role: "", registrationDate: undefined
    });
    const fetchData = async () => {
        const request = await fetch(`/api/work-space/`, {
            // fetch token data of registration _id and put store in token registration _id with login _id
            method: "GET",
        });
        if (!request.ok) {
            toast.error("Error occured when fetching my work space");
            return;
        } else {
            const resposne = await request.json();
            console.log("Response", resposne);
            
            if (!resposne?.success) {
                // toast.error(resposne?.message);
                return;
            }
            const respData = resposne?.data?.[0];
            console.log(respData,"res work ");
            
            const registerData = respData?.registration;
            setRegistrationDeatils({
                name: registerData?.name,
                username: registerData?.username,
                email: registerData?.email,
                phone: registerData?.phone,
                role: registerData?.role,
                registrationDate: registerData?.createdAt
            })
            const totalDataRes = respData?.totalData;
            setTotalData({
                totalProjects: totalDataRes?.totalProjects,
                completedProjects: totalDataRes?.totalCompleted,
                currentProjectsInRoled: totalDataRes?.totalCurrent,
                roles: totalDataRes?.roles,
            })
            const projectListdata = respData?.projectListData;
            setProjects(projectListdata);
        }
    }

    
    useEffect(() => {
        fetchData();
    },[]);


    return (
        <WorkSpaceContext.Provider value={{
            myregistrationDeatails: registrationDetails,
            myProjectsOverView: totalData,
            myProjectList: projects,
            fetchData,
        }}>
            {children}
        </WorkSpaceContext.Provider>
    )
}

export const useWorkSpaceProvider = () => useContext(WorkSpaceContext);