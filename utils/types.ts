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
