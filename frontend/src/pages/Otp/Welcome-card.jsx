import React, { useEffect } from "react";
import welcome from "../../assets/welcome.jpg";
const WelcomeModal = ({ onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

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
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        zIndex: "9999",
        textAlign: "center",
        width: "400px",
        height: "30%",
      }}
    >
      <img
        src={welcome}
        alt="Welcome"
        style={{ margin: "20px 0", width: "100px", height: "100px" }}
      />
      <h2>Welcome to the Board!</h2>
      <p>Thank you for signing up!</p>
    </div>
  );
};

export default WelcomeModal;
