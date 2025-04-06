import { create } from "zustand";

interface TestStore {
  count: number;
  text: string;
  increment: () => void;
  decrement: () => void;
  setText: (text: string) => void;
  reset: () => void;
}

export const useTestStore = create<TestStore>((set) => ({
  count: 0,
  text: "",
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  setText: (text: string) => set({ text }),
  reset: () => set({ count: 0, text: "" }),
}));
