import connectToDB from "@/actions/config";
import { updateParentStatuses } from "@/lib/updateParentStatus";
import { fallbackTaskModel } from "@/models/fallbackTaskModel";

export async function PUT(req: Request) {
  await connectToDB();
  const { projectId, updatedTaskTree } = await req.json();
  updateParentStatuses(updatedTaskTree);
  const updatedProject = await fallbackTaskModel.findOneAndUpdate(
    { projectId },
    { data: updatedTaskTree },
    { new: true }
  );
  return Response.json(updatedProject);
}
