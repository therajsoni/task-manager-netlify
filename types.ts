export interface JWTpayload {
  id: string;
  identifier: string;
  username: string;
  iat: number;
  exp: number;
}

export interface LoginUserType {
  group: {
    member: string,
    time: Date
  };
  username: string;
}
export interface GroupMember {
  member: string;
  date: Date
}
export interface ProjectOne {
  name: string;
  status: string;
  description: string;
  createdAt: string;
  client: string;
  _id: string;
  group: [LoginUserType] | [GroupMember]
}

export interface ClickProject {
  by: {
    username: string;
  },
  client: string,
  createdAt: Date,
  description: string,
  group: [{
    member: string,
    time: Date,
  }],
  name: string,
  status: string,
  _id: string
}

export interface dataObj {
  project_name: "",
  actions: {
    addItems: [oldTask],
    responsibility: [string],
  },
}
export interface oldTask{
  project_name: "",
  actions: {
    addItems: [],
    responsibility: [],
  },
}

export interface dataType {
  by : {
    username : string 
  },
  client:string,
  createdAt : Date,
  description : string,
  group : [] | [
    {
      member : string,
      time : Date
    }
  ],
  name : string,
  status : string,
  _id : string
}

export interface singleProjectType{
  by : {
    username : string;
  },
  client : string;
  createdAt : Date;
  description : string;
  group : [{
    member : string;
    time : Date;
    identifier : string;
  }],
  name : string;
  status : string;
  _id : string;
  attachments : {
    name:string;url:string;uploader:string;date:Date
  }[]
}

export interface TaskNode {
  id: string;
  name: string;
  description: string;
  status: string;
  responsibility: string;
  createdAt : string;
  children?: TaskNode[];
}

export interface ProjectData {
  id: string;
  name: string;
  responsibility: string;
  status: string;
  createdAt: string;
  description: string;
  children?: TaskNode[];
}

export interface ProjectResponse {
  _id: string;
  projectId: string;
  data: ProjectData[];
}


export interface TaskList{
 id : string,
 name : string,
 description : string,
 status :string,
 responsibility : string,
 createdAt : string
 by? : string;
}

export interface CompletedTaskList extends TaskList{
}

