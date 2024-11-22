"use client"; // Ensure this component runs on the client side

export default function ReadInstructionsButton({ instructions }) {
  const scrollToInstructions = () => {
    document.getElementById("instructions-section").scrollIntoView({
      behavior: "smooth",
    });
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

  return (
    <button
      onClick={handleButtonClick}
      className="bg-brown text-white px-4 py-2 rounded-md hover:bg-peach transition duration-200"
    >
      Read Instructions
    </button>
  );
}
