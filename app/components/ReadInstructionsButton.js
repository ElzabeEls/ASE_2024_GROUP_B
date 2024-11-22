"use client"; // Ensure this component runs on the client side

import { useEffect, useState } from "react";

/**
 * A button that reads the instructions aloud using speech synthesis.
 * It also listens for a "stop" command to stop the speech synthesis.
 *
 * @component
 * @example
 * // Example usage
 * <ReadInstructionsButton instructions={["Step 1: Do this", "Step 2: Do that"]} />
 */
export default function ReadInstructionsButton({ instructions }) {
  const [isReading, setIsReading] = useState(false);

  /**
   * Scrolls to the instructions section in the document.
   */
  const scrollToInstructions = () => {
    document.getElementById("instructions-section").scrollIntoView({
      behavior: "smooth",
    });
  };

  /**
   * Stops reading instructions and cancels speech synthesis.
   */
  const stopReading = () => {
    console.log("Stopping reading...");
    window.speechSynthesis.cancel(); // Stops speech synthesis immediately
    setIsReading(false);
  };

  /**
   * Reads the instructions aloud step by step using speech synthesis.
   * If no instructions are provided, an alert will be shown.
   * If speech synthesis is not supported, an alert will be shown.
   */
  const readInstructions = () => {
    if (!instructions || instructions.length === 0) {
      alert("No instructions available to read.");
      return;
    }

    if (!window.speechSynthesis) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    setIsReading(true); // Set reading state to true when reading starts

    // Create speech utterances for each instruction
    instructions.forEach((instruction, index) => {
      const utterance = new SpeechSynthesisUtterance(
        `Step ${index + 1}: ${instruction}`
      );
      utterance.lang = "en-US";
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    });
  };

  const handleButtonClick = () => {
    scrollToInstructions();
    readInstructions();
  };

  /**
   * Initializes speech recognition to listen for the "stop" command while reading instructions.
   * Sets up error handling if speech recognition fails.
   */
  useEffect(() => {
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      console.warn("Speech Recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = true; // Listen continuously
    recognition.interimResults = false;

    /**
     * Handles the speech recognition result when speech is detected.
     * Stops reading instructions if the word "stop" is detected.
     *
     * @param {SpeechRecognitionEvent} event - The speech recognition event containing the transcript.
     */
    const handleSpeechResult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("")
        .toLowerCase();

      console.log("Speech recognized:", transcript); // Log recognized speech

      if (transcript.includes("stop")) {
        console.log("Stop command detected.");
        stopReading();
        recognition.stop(); // Stop listening for commands
      }
    };

    if (isReading) {
      console.log("Starting speech recognition...");
      recognition.addEventListener("result", handleSpeechResult);
      recognition.start();
    }

    return () => {
      recognition.removeEventListener("result", handleSpeechResult);
      recognition.stop();
    };
  }, [isReading]);

  return (
    <button
      onClick={handleButtonClick}
      className="bg-brown text-white px-4 py-2 rounded-md hover:bg-peach transition duration-200"
    >
      Read Instructions
    </button>
  );
}
