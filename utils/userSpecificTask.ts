import { ProjectData, ProjectResponse } from "@/types";

class UserTaskStatus {
  numberofTotalTasks = 0;
  numberOfCompletedTasks = 0;
  listOfTask: ProjectData[] = [];
  listOfCompletedTasks: ProjectData[] = [];
  findUserTask(data: ProjectData, username: string) {
    if (!data) return;

    // If data is an array of TaskNode (like children)
    if (Array.isArray(data)) {
      for (const task of data) {
        this.processTask(task, username);
      }
    } else {
      // If data is a ProjectData (single project with root task and children)
      this.processTask(data, username);
    }
  }

  processTask(task: ProjectData, username: string) {
    // change repsonsibility is string array use ,, split use to check the name
    const responsibilitySplit = task?.responsibility?.split(',')?.map(name => name?.trim());

    if (responsibilitySplit?.includes(username)) {
      this.numberofTotalTasks++;
      this.listOfTask.push(task);
      if (task.status.toLowerCase() === "completed") {
        console.log(task?.name, task?.responsibility);
        this.listOfCompletedTasks?.push(task)
        this.numberOfCompletedTasks++;
      }
    }

    if (task?.children && task.children.length > 0) {
      for (const child of task.children) {
        this.processTask(child, username);
      }
    }
  }

  findUserTasksReverse() {
    return this.listOfTask.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  updateParentTaskStatus(task: ProjectData) {
    if (!task.children || task.children.length === 0) {
      return task.status;
    }

    // Recursively update all children first
    for (const child of task.children) {
      this.updateParentTaskStatus(child);
    }

    // After updating all children, check if all are "completed"
    const allCompleted = task.children.every(child => child.status === "completed");

    // After travel all children check if parent is completed and any of child is pending then also parent is pending
    const anyPending = task.children.find(child => child.status === "Pending");

    if (allCompleted) {
      task.status = "completed";
    }
    if (anyPending) {
      task.status = "Pending";
    }
    return task.status;
  }
}


export default function userTaskStatusDescription(data: ProjectResponse, userName: string) {
  const mainData: ProjectResponse = data;
  const userTaskStatus = new UserTaskStatus();
  userTaskStatus.updateParentTaskStatus(mainData.data[0]);
  userTaskStatus.findUserTask(mainData.data[0], userName);
  // console.log("Total Tasks:", userTaskStatus.numberofTotalTasks);
  // console.log("Completed Tasks:", userTaskStatus.numberOfCompletedTasks);
  // console.log("Tasks List:", userTaskStatus.findUserTasksReverse());
  return {
    totalTasks: userTaskStatus.numberofTotalTasks,
    completedTasks: userTaskStatus.numberOfCompletedTasks,
    tasksList: userTaskStatus.findUserTasksReverse(),
    completedList: userTaskStatus.listOfCompletedTasks,
  }
}