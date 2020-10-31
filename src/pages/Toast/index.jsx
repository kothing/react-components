import React from "react";
import { Button, Toast } from "../../Components";

const ToastPage = () => {
  const handleShowToast = () => {
    Toast.info("message...", 3000, () => {
      // do something after the toast disappears
    });
  };

  return (
    <div className="demoBox">
      <h3>Toast</h3>
      <Button onClick={handleShowToast}>Show toast</Button>
    </div>
  );
};

export default ToastPage;
