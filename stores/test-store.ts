/**
 * @file test-store.ts
 * @description Simple Zustand store for testing and demonstration purposes
 * @author Aaron J. Girton - https://github.com/aj0urdain
 * @created 2025
 */

import { create } from "zustand";

/**
 * Interface for the test store state and actions
 * @interface TestStore
 * @property {number} count - Current count value
 * @property {string} text - Current text value
 * @property {function} increment - Increment the count
 * @property {function} decrement - Decrement the count
 * @property {function} setText - Set the text value
 * @property {function} reset - Reset both count and text to initial values
 */
interface TestStore {
  count: number;
  text: string;
  increment: () => void;
  decrement: () => void;
  setText: (text: string) => void;
  reset: () => void;
}

/**
 * Zustand store for testing and demonstration
 * @returns {TestStore} Store instance with state and actions
 */
export const useTestStore = create<TestStore>((set) => ({
  count: 0,
  text: "",
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  setText: (text: string) => set({ text }),
  reset: () => set({ count: 0, text: "" }),
}));
