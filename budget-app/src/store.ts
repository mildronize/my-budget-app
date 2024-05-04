import { create } from "zustand";

export const useGlobalLoadingStore = create<{
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));

// export const useQueueService = create((set) => ({

//   refetech: () => {

// }));