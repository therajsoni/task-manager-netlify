export default function NameLengthManage(name:String,length:number){
    if (name?.length > length) {
        return name?.substring(0,length) + "..."
    }
    return name;
}