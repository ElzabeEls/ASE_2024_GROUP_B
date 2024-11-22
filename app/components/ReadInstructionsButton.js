"use client"; // Ensure this component runs on the client side

import { useEffect, useState } from "react";

export default function ReadInstructionsButton({ instructions }) {
  const [isReading, setIsReading] = useState(false);

  const scrollToInstructions = () => {
    document.getElementById("instructions-section").scrollIntoView({
      behavior: "smooth",
    });
  };

  const stopReading = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel(); // Stops speech synthesis immediately
    }
    setIsReading(false);
  };

  const readInstructions = () => {
    if (!instructions || instructions.length === 0) {
      alert("No instructions available to read.");
      return;
    }

    // Check if the browser supports speech synthesis
    if (!window.speechSynthesis) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create a new speech utterance for each instruction
    instructions.forEach((instruction, index) => {
      const utterance = new SpeechSynthesisUtterance(
        `Step ${index + 1}: ${instruction}`
      );
      utterance.lang = "en-US"; // Set the language
      utterance.rate = 1; // Set the speech rate
      window.speechSynthesis.speak(utterance);
    });
  };

  const handleButtonClick = () => {
    scrollToInstructions();
    readInstructions();
  };

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

      if (transcript.includes("stop")) {
        stopReading();
        recognition.stop(); // Stop listening for commands
      }
    };

    if (isReading) {
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
