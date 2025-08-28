import React from "react";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../StyleSheets/FloatingButton.css";

const FloatingButton = () => {
  const navigate = useNavigate();

  return (
    <button className="floating-btn" onClick={() => navigate("/raise-complaint")}>
      <MessageSquare className="icon" />
    </button>
  );
};

export default FloatingButton;
