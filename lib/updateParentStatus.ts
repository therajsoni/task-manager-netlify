type TaskNode = {
  id: string;
  name: string;
  status: string;
  responsibility: string;
  createdAt: string;
  children: TaskNode[];
};

export const updateParentStatuses = (taskList: TaskNode[]): boolean => {
  let allCompleted = true;
  

  for (const task of taskList) {
  
     const hasChildren = Array.isArray(task.children) && task.children.length > 0;


    // Step 1: Recursively check children
    const childrenCompleted = hasChildren ? updateParentStatuses(task.children) : true;

    // Step 2: If all children are complete & current task is not, update it
    if (childrenCompleted && hasChildren && task.status !== "completed") {
      task.status = "completed";
    }

    // Step 3: If current task is not completed, mark allCompleted false
    if (task.status !== "completed") {
      allCompleted = false;
    }
  }

  return allCompleted;
};
