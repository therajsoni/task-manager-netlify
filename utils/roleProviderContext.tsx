"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type RoleContextType = {
  loginrole:string |undefined,
  projectrole : string|undefined,
  data : {
    username : string|undefined,
    identifier : string|undefined,
    _id : string |undefined,
  },
  projectBaseRole : (args:string) => Promise<void>
}

const RoleContext = createContext<RoleContextType>({
  loginrole : "developer",
  projectrole : "developer",
  data : {
    username : "",
    identifier : "",
    _id : "" ,
  },
  projectBaseRole : async() => {}
});

export const RoleProvider = ({children}:{children:ReactNode}) => {
  const [loginrole,setLoginrole] = useState<string|undefined>();
  const [projectrole,setProjectrole] = useState<string|undefined>();
  const [data,setData] = useState<{
    username : string|undefined,
    identifier : string|undefined,
    _id : string|undefined,
  }>();
  const [allEmployee,setAllEmployee] = useState<{username:string,identifier:string,}[]>([]);
  async function fetchLoginRole(){
    const request = await fetch("/api/admin/register/registerUserDetails/details",{
      method : "GET",
    });
    console.log(request, "Request  is send here");
    
    const json = await request.json();
    if (request.ok && json?.success) {
      setLoginrole(json?.data?.role);
      setData({
        username : json?.data?.username,
        identifier : json?.data?.role,
        _id : json?.data?._id
      })
    }
  } 
  async function projectBaseRole(projectName: string) {
  if (!data?._id || !loginrole) return; // Guard clause

  const request = await fetch(`/api/project/getByName/${projectName}`, {
    method: "POST",
    body : JSON.stringify({
      name : projectName
    })
  });
  
  const json = await request.json();
  console.log(json);
  console.log(data);
  
  
  if (json.success && request.ok) {
    if (loginrole === "core-admin") {
      setProjectrole("core-admin");
    } else if (json?.data?.by?.username === data?.username || json?.data?.projectManager?.username === data?.username) {
      setProjectrole("core-admin");
    }
  }
}


  useEffect(()=>{
    fetchLoginRole();
  },[]);

  return (
    <RoleContext.Provider value={{
      loginrole,
      projectrole,
      data : {
        username: data?.username || undefined,
        identifier:  data?.identifier || undefined,
        _id: data?._id || undefined
      },
      projectBaseRole
    }}>
      {children}
    </RoleContext.Provider>
  )
}
export const useRoleProvider = () => useContext(RoleContext);