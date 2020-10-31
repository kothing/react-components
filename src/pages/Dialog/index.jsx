import React, { useState } from "react";
import { Dialog } from "../../Components";

const DialogPage = () => {
  const [dialogVisible, setDialogVisible] = useState(false);

  return (
    <div className="demoBox">
      <h3>对话框Dialog</h3>
      <button className="x-button" onClick={() => setDialogVisible(true)}>
        Dialog {dialogVisible ? "Hide" : "Show"}
      </button>
      <Dialog
        key="dialog"
        visible={dialogVisible}
        title="Dialog Title"
        onOK={() => setDialogVisible(false)}
        onCancel={() => setDialogVisible(false)}
      >
        <p>Dialog Content</p>
      </Dialog>
    </div>
  );
};

export default DialogPage;
