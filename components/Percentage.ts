import { singleProjectType } from "@/types";
import percentage from "@/utils/statusPercentage";

export default async function Percentage_Review() {
  const data = new Map();

  const fetchProjectData = async () => {
    const res = await fetch("/api/project/getAll", { method: "GET" });
    const json = await res.json();
    return json?.success ? json.data : [];
  };

  const projects = await fetchProjectData();

  await Promise.all(projects.map(async (item: singleProjectType) => {
    const subRes = await fetch("/api/tasks/", {
      method: "POST",
      body: JSON.stringify({ projectId: item._id }),
    });
    const subJson = await subRes.json();

    if (subJson.success) {
      const per = percentage(subJson?.data?.data[0]);
      data.set(item._id, per);
    } else {
      data.set(item._id, 0);
    }
  }));
  return data;
}
