import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFeatureProvider } from "../FeaturesContext";
import { singleProjectType, TaskList } from "@/types";
import toast from "react-hot-toast";
import { Checkbox } from "@/components/ui/checkbox";
const dictonaryConfigMatcher = {
  document: false,
  chat: false,
  autocomplete: false,
  care: false,
  gpt: false,
};
export default function DictinaryFeatures({
  selectedTask,
  tasks,
  open,
  setOpen,
  projectDeatail,
}: {
  selectedTask?: undefined | TaskList | Task;
  tasks?: undefined | Task[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  projectDeatail?: singleProjectType | undefined;
}) {
  const [dictonaryConfig, setDictonaryConfig] = useState<{}>({});
  const [status, setStatus] = useState<string | null>(null);
  const key =
    tasks !== undefined && tasks !== null
      ? tasks[0]?.id + "#$#" + selectedTask?.id
      : projectDeatail !== undefined && projectDeatail !== null
      ? projectDeatail?._id + "#$#" + selectedTask?.id
      : "";
  //   const { getShowingFeatures, postUpdateTaskFeatures } = useFeatureProvider();
  useEffect(() => {
    const getShowingFeatures = async (key: string) => {
      const request = await fetch("/api/projectFeature", {
        method: "POST",
        body: JSON.stringify({
          key: key,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await request.json();
      if (response.status == "403") {
        setStatus("403");
      }
      if (response.success) {
        const dataResponse = response?.data;
        let objBody = {};
        dataResponse?.features?.map(
          (d: { key: string; value: string; data: string }) => {
            console.log(d, "d");
            objBody[d.key] = d.value;
          }
        );
        setDictonaryConfig(objBody);
      }
    };
    getShowingFeatures(key);
  }, [open]);
  const { FitRefreshDb, setFitRefreshDb } = useFeatureProvider();
  const postUpdateTaskFeatures = async (
    key: string,
    features: [
      {
        key: String;
        value: String;
        data: String;
      }
    ]
  ) => {
    const request = await fetch("/api/projectFeature/post", {
      method: "POST",
      body: JSON.stringify({
        key,
        features,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }); //http://localhost:3000/api/projectFeature
    const response = await request.json();
    if (request.ok) {
      if (response.success) {
        setFitRefreshDb(true);
        toast.success("Features Updated");
      } else toast.error(response.message);
    } else {
      toast.error("Unknown error with features posting...");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <div className="flex justify-around items-center">
          <Label className="w-24">Features:</Label>
          <div className="w-[93%] border-1 rounded-[4px] p-2 border-gray-300 mt-3">
            <div className="flex gap-3 items-center flex-wrap">
              {Object.entries(dictonaryConfigMatcher)
                // ?.filter(([key, value]: any) => {
                //   console.log(key, value);
                //   return value === true;
                // })
                ?.map(([key, value], index) => {
                  return (
                    <div className="flex flex-row gap-2">
                      <div>{key?.toUpperCase()}</div>
                      {/* <input
                        checked={dictonaryConfig[`${key}`]}
                        onChange={(e) => {
                          dictonaryConfigMatcher[`${key}`] = e.target.checked;
                        }}
                        //   defaultChecked={selectedTask?.features?.document}
                        className="h-6 w-6"
                        type="checkbox"
                      /> */}
                      <Checkbox
                        checked={dictonaryConfig[key] === true} // ensure boolean
                        onCheckedChange={(checked) => {
                          const isChecked =
                            checked === true || checked === "checked";

                          setDictonaryConfig((prev) => ({
                            ...prev,
                            [key]: isChecked,
                          }));
                        }}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <Button
          onClick={() => {
            const DataArray = Object.entries(dictonaryConfig)?.map(
              ([key, value]) => ({
                key,
                value,
                data: null,
              })
            );

            setOpen(false);
            postUpdateTaskFeatures(key, DataArray);
          }}
        >
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
