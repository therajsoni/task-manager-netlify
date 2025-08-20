// store/useProjectStore.ts
import { create } from "zustand";

interface ProjectState {
  identifier: string;
  setIdentifier: (id: string) => void;
}

const useProjectStore = create<ProjectState>((set) => ({
  identifier: "",
  setIdentifier: (id) => set({ identifier: id }),
}));

export default useProjectStore;
