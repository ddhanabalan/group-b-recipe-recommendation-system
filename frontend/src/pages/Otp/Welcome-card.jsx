import React, { useEffect } from "react";
import Confetti from "react-confetti";

const WelcomeModal = ({ onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Close the modal after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        zIndex: "9999",
        textAlign: "center",
      }}
    >
      <h2>Welcome to the Board!</h2>
      <p>Thank you for signing up!</p>
      <Confetti width={window.innerWidth} height={window.innerHeight} />
    </div>
  );
};

export default WelcomeModal;
