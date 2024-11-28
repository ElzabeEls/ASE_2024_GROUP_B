"use client";

import { useEffect, useState, useCallback } from "react";
import { BookOpen } from "lucide-react";
import SpeedAdjuster from "./SpeedAdjuster";

/**
 * A button that reads the instructions aloud using speech synthesis.
 * It also listens for voice commands to stop, pause, resume, and repeat steps.
 *
 * @component
 * @example
 * // Example usage
 * <ReadInstructionsButton instructions={["Step 1: Do this", "Step 2: Do that"]} />
 */
export default function ReadInstructionsButton({ instructions }) {
  // State variables
  const [isReading, setIsReading] = useState(false); // Whether instructions are being read
  const [isPaused, setIsPaused] = useState(false); // Whether speech synthesis is paused
  const [errorMessage, setErrorMessage] = useState(""); // Error messages to display
  const [speed, setSpeed] = useState(1); // Speed of speech synthesis
  const [currentStep, setCurrentStep] = useState(0); // Index of the current instruction being read

  /**
   * Scrolls smoothly to the section containing the instructions.
   * Ensures users see the instructions while they are being read aloud.
   */
  const scrollToInstructions = () => {
    document.getElementById("instructions-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  /**
   * Stops the speech synthesis and resets the state variables.
   */
  const stopReading = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
    setCurrentStep(0);
  };

  /**
   * Pauses the speech synthesis if currently reading.
   */
  const pauseReading = useCallback(() => {
    if (isReading && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isReading, isPaused]);

  /**
   * Resumes the speech synthesis if it was paused.
   */
  const resumeReading = useCallback(() => {
    if (isReading && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isReading, isPaused]);

  /**
   * Repeats the current step using speech synthesis.
   */
  const repeatCurrentStep = useCallback(() => {
    if (currentStep > 0) {
      const instruction = instructions[currentStep - 1];
      const utterance = new SpeechSynthesisUtterance(
        `Repeating step ${currentStep}: ${instruction}`
      );
      utterance.lang = "en-UK";
      utterance.rate = speed;
      window.speechSynthesis.speak(utterance);
    }
  }, [currentStep, instructions, speed]);

  /**
   * Reads all the instructions one by one using speech synthesis.
   * Updates the current step while reading.
   */
  const readInstructions = () => {
    if (!instructions || instructions.length === 0) {
      setErrorMessage("No instructions available to read.");
      return;
    }

    if (!window.speechSynthesis) {
      setErrorMessage("Speech synthesis is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    setIsReading(true);

    let index = 0;

    const speakNextInstruction = () => {
      if (index < instructions.length) {
        const utterance = new SpeechSynthesisUtterance(
          `Step ${index + 1}: ${instructions[index]}`
        );
        utterance.lang = "en-UK";
        utterance.rate = speed;

        utterance.onstart = () => setCurrentStep(index + 1); // Update current step
        utterance.onend = () => {
          index++;
          speakNextInstruction(); // Move to the next step
        };

        window.speechSynthesis.speak(utterance);
      } else {
        setIsReading(false); // Finished reading
      }
    };

    speakNextInstruction();
  };

  /**
   * Handles the click event for the button.
   * Scrolls to the instructions and starts reading them aloud.
   */
  const handleButtonClick = () => {
    scrollToInstructions();
    readInstructions();
  };

  /**
   * Effect hook to manage speech recognition.
   * Listens for voice commands like "stop", "pause", "resume", and "repeat step".
   */
  useEffect(() => {
    let recognition;

    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();

      recognition.lang = "en-UK";
      recognition.continuous = true;
      recognition.interimResults = false;

      const handleSpeechResult = (event) => {
        const result = Array.from(event.results)
          .filter((res) => res[0].confidence > 0.8)
          .map((res) => res[0].transcript)
          .join("")
          .toLowerCase();

        if (result.includes("stop")) {
          stopReading();
          recognition.stop();
        } else if (result.includes("pause")) {
          pauseReading();
        } else if (result.includes("resume")) {
          resumeReading();
        } else if (result.includes("repeat step")) {
          repeatCurrentStep();
        }
      };

      recognition.addEventListener("result", handleSpeechResult);
      recognition.onerror = (event) => {
        setErrorMessage("Speech to text feature failed. Please try again.");
        console.error("Speech recognition error:", event.error);
      };

      if (isReading) {
        recognition.start();
      }
    } else {
      setErrorMessage("Speech recognition is not supported in this browser.");
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isReading, pauseReading, resumeReading, repeatCurrentStep]);

  return (
    <div className="flex flex-col items-center">
      {/* Button to start reading instructions */}
      <button
        onClick={handleButtonClick}
        className="bg-brown text-white px-6 py-3 rounded-md hover:bg-peach transition duration-200 mb-4 flex items-center gap-2"
        title="Read Instructions"
      >
        <BookOpen className="w-5 h-5" aria-label="Read Instructions" />
        <SpeedAdjuster speed={speed} setSpeed={setSpeed} />
      </button>

      {/* Speed adjuster component */}
      

      {/* Error message display */}
      {errorMessage && (
        <div className="text-red-500 mt-2 text-sm font-medium">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
