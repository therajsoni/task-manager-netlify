type TaskNode = {
  id: string
  name: string
  status: "Pending" | "completed" | string
  children?: TaskNode[]
}

type TaskWithPercentage = TaskNode & {
  percentage: number
  children: TaskWithPercentage[]
}

type Task = {
  id: string
  name: string
  status: string
  children?: Task[]
}

function calculatePercentage(task: Task): number {
  if (!task.children || task.children.length === 0) {
    return task.status === "completed" ? 100 : 0
  }

  const childPercentages = task.children.map(calculatePercentage)
  const total = childPercentages.reduce((sum, percent) => sum + percent, 0)
  return Math.round(total / childPercentages.length)
}
