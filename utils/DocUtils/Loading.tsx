import { LoaderIcon } from "lucide-react";

export default function LoadingComponet() {
  return (
    <div className="h-screen w-screen flex justify-center items-center m-auto p-auto">
      <LoaderIcon className="animate-spin" size={36} />
    </div>
  );
}
