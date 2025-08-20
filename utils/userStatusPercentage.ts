import { ProjectData, TaskNode } from "@/types";

// if project children is null undefined !length = 0
class StatusPercentage {
    completed: number = 0;
    total: number = 0;
    constructor() { }
    findStatusByProject(data: TaskNode[] | undefined, username: string) {
        if (!data || data?.length === 0) {
            return;
        }
        for (let index = 0; index < data?.length; index++) {
            const element = data[index];
            if (element?.responsibility === username && element?.status === "completed") {
                this.completed += 1;
            }
            this.total += 1;
            this.findStatusByProject(element?.children, username);
        }
    }
}
export default function percentageUser(
    data: TaskNode | ProjectData,
    username: string
) {
    const obj = new StatusPercentage();
    obj.findStatusByProject(data?.children, username);
    return obj.total === 0 ? 0 : ((obj.completed / obj.total) * 100).toFixed(2);
}
