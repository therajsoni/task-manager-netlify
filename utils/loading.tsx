import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
    <div className="bg-gray-50 h-full w-full flex flex-1 justify-center items-center">
      <Loader size={50}  className="animate-spin"  />
    </div>
    </div>
  );
}
