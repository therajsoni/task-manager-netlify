import NameLengthManage from "./nameLengthManage";

export default function CapitalizeWord(word:string){
    return NameLengthManage(word?.substring(0,1)?.toUpperCase() + word?.substring(1,word?.length),10);
}