import React from "react";
import { FastForward } from "lucide-react"; // Importing the FastForward icon

/**
 * A component for adjusting the speech speed.
 * It renders a range input to control the speed of speech synthesis.
 *
 * @param {number} speed - The current speech speed value.
 * @param {function} setSpeed - The function to update the speech speed.
 *
 * @component
 * @example
 * <SpeedAdjuster speed={1} setSpeed={setSpeed} />
 */
export default function SpeedAdjuster({ speed, setSpeed }) {
  return (
    <div className="mt-4">
      <label
        htmlFor="speed"
        className="text-gray-700 font-medium mb-2 flex items-center space-x-2"
      >
        {/* Icon and Speed Text */}
        <FastForward className="w-5 h-5 text-white hover:text-black" />
        <span className="text-sm text-gray-500">{speed.toFixed(1)}x</span>
      </label>
      <input
        type="range"
        id="speed"
        min="0.5"
        max="2"
        step="0.1"
        value={speed}
        onChange={(e) => setSpeed(parseFloat(e.target.value))}
        className="w-full mt-2"
      />
    </div>
  );
}
