"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const StepsFilter = () => {
  const [steps, setSteps] = useState("");
  const router = useRouter();

  const handleInputChange = (event) => {
    setSteps(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();

    if (steps && !isNaN(steps)) {
      // Update URL with the steps parameter
      const url = `/?page=1&steps=${steps}`;
      router.push(url);
    } else {
      alert("Please enter a valid number for steps.");
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center space-x-2">
      <label htmlFor="steps" className="text-gray-700 font-bold">
        Steps:
      </label>
      <input
        type="number"
        id="steps"
        value={steps}
        onChange={handleInputChange}
        className="px-4 py-2 border-2 border-gray-400 rounded-lg"
        placeholder="Enter steps"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
      >
        Search
      </button>
    </form>
  );
};

export default StepsFilter;
