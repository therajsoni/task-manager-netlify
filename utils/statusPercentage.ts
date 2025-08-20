import { ProjectData, ProjectResponse, TaskNode } from "@/types";

// Calculates percentage based on children status
function calculateNodePercentage(task: TaskNode): number {
  if (!task.children || task.children.length === 0) {
    return task.status === "completed" ? 100 : 0;
  }

  const childPercentages = task.children.map(child => calculateNodePercentage(child));
  const sum = childPercentages.reduce((a, b) => a + b, 0);
  return sum / childPercentages.length;
}

export default function percentage(data: ProjectResponse | TaskNode): number {
  // if it's a project, pass its first level of tasks
  if(data === undefined)return 0;
  if ("data" in data) {
    const childPercentages = data.data.map(task => calculateNodePercentage(task));
    const sum = childPercentages.reduce((a, b) => a + b, 0);
    return data.data.length ? sum / data.data.length : 0;
  }

  // if it's a single task node
  return calculateNodePercentage(data);
}
