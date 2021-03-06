import React from "react";
import ReactDOM from "react-dom";
import Toast from "./Toast";
import { Animation, Type } from "./Const";
// import "./Toast.less";
import "./Toast.css";

let toastInstance = null;
function notice(type, { content, duration, onClose }) {
  if (toastInstance) {
    toastInstance.fade(Animation.Out, () => {
      toastInstance.props.onClose();
      render(onClose);
    });
  } else {
    render(onClose);
  }

  function render(callback) {
    const container = document.createElement("div");
    container.className = "react-toast";
    document.body.appendChild(container);
    const component = (
      <Toast
        type={type}
        content={content}
        duration={duration}
        onClose={() => {
          ReactDOM.unmountComponentAtNode(container);
          let bodyChildren = document.body.children;
          let isHasChildren = false;
          let toastNode = null;
          for (let i = 0; i < bodyChildren.length; i++) {
            if (
              bodyChildren[i].nodeName === "DIV" &&
              bodyChildren[i].className === "react-toast"
            ) {
              isHasChildren = true;
              toastNode = bodyChildren[i];
              break;
            }
          }
          if (isHasChildren && toastNode) document.body.removeChild(toastNode);
          if (callback) {
            callback();
          }
        }}
        ref={(ref) => {
          toastInstance = ref;
        }}
      />
    );
    ReactDOM.render(component, container);
  }
}

Toast.info = (content, duration, onClose) => {
  notice(Type.Info, { content, duration, onClose });
};

Toast.success = (content, duration, onClose) => {
  notice(Type.Success, { content, duration, onClose });
};
Toast.fail = (content, duration, onClose) => {
  notice(Type.Fail, { content, duration, onClose });
};
Toast.loading = (content, onClose) => {
  notice(Type.Loading, { content, onClose });
};
Toast.hide = () => {
  if (toastInstance) {
    toastInstance.fade(Animation.Out, toastInstance.props.onClose);
    toastInstance = null;
  }
};

export default Toast;
