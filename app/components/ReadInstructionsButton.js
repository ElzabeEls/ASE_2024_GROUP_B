"use client"; // Ensure this component runs on the client side

export default function ReadInstructionsButton() {
  const scrollToInstructions = () => {
    document.getElementById("instructions-section").scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToInstructions}
      className="bg-brown text-white px-4 py-2 rounded-md hover:bg-peach transition duration-200"
    >
      Read Instructions
    </button>
  );
}
