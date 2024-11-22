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

  // Scroll to instructions section
  const scrollToInstructions = () => {
    document.getElementById("instructions-section").scrollIntoView({
      behavior: "smooth",
    });
  };

  // Stop the reading and speech synthesis
  const stopReading = () => {
    console.log("Stopping reading...");
    window.speechSynthesis.cancel(); // Stops speech synthesis immediately
    setIsReading(false);
  };

  // Read the instructions step by step
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

  // Use Speech Recognition to listen for "stop"
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
