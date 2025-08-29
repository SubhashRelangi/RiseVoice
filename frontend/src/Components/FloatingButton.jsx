import React from "react";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./FloatingButton.module.css";

const FloatingButton = () => {
  const navigate = useNavigate();

  return (
    <button className={styles.floatingBtn} onClick={() => navigate("/raise-complaint")}>
      <MessageSquare className={styles.icon} />
    </button>
  );
};

export default FloatingButton;
