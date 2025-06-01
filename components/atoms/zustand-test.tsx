/**
 * File: components/atoms/zustand-test.tsx
 * Description: Test component demonstrating Zustand state management
 * Author: Aaron J. Girton - https://github.com/aj0urdain
 * Created: 2025
 *
 * This component demonstrates the usage of Zustand for state management,
 * showcasing basic state operations like incrementing, decrementing,
 * text input, and state reset.
 */

import { useTestStore } from "@/stores/test-store";

/**
 * ZustandTest Component
 *
 * A test component that demonstrates Zustand state management capabilities.
 * Features:
 * - Counter state management
 * - Text input state management
 * - State reset functionality
 * - Clean UI with Tailwind CSS styling
 *
 * State Operations:
 * - Increment counter
 * - Decrement counter
 * - Update text input
 * - Reset all state
 *
 * @returns {JSX.Element} Test interface for Zustand state management
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ZustandTest />
 *
 * // With custom styling
 * <div className="custom-container">
 *   <ZustandTest />
 * </div>
 * ```
 */
export default function ZustandTest() {
  const { count, text, increment, decrement, setText, reset } = useTestStore();

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Zustand Test</h2>

      <div className="space-y-4">
        <div>
          <p>Count: {count}</p>
          <div className="space-x-2">
            <button
              onClick={increment}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              Increment
            </button>
            <button
              onClick={decrement}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              Decrement
            </button>
          </div>
        </div>

        <div>
          <p>Text: {text}</p>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border p-1 rounded"
          />
        </div>

        <button
          onClick={reset}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
