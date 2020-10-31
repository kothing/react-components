import React, { useState } from "react";
import { Button, Modal } from "../../Components";

const modalStyles = {
  content: {
    width: "520px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const ModalPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div className="demoBox">
      <h3>对话框Modal</h3>
      <Button onClick={() => setModalIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={modalIsOpen}
        style={modalStyles}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Example Modal"
      >
        <h2>Hello</h2>
        <div>I am a modal</div>
        <div>I am a modal</div>
        <div>I am a modal</div>
        <div>I am a modal</div>
        <button onClick={() => setModalIsOpen(false)}>close</button>
      </Modal>
    </div>
  );
};

export default ModalPage;
