import React from "react";

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
    <div className="mt-4 w-full max-w-xs">
      <label
        htmlFor="speed"
        className="text-[var(--title-color)] font-bold mb-2 flex items-center space-x-2"
      >
        <span className="text-m w-2 h-2 text-[var(--title-color)]">{speed.toFixed(1)}x</span>
      </label>
      <input
        type="range"
        id="speed"
        min="0.5"
        max="2"
        step="0.1"
        value={speed}
        onChange={(e) => setSpeed(parseFloat(e.target.value))}
        className="w-fit mt-2 rounded-lg cursor-pointer bg-[var(--b2r-bg)] [var(--border)]"
      />
    </div>
  );
}
