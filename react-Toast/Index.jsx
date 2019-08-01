import React from 'react';
import ReactDOM from 'react-dom';
import Toast from './Toast';
import { Animation, Type } from './Const';
import './toast.less';

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
    const container = document.createElement('div');
    document.body.appendChild(container);
    const component = (
      <Toast
        type={type}
        content={content}
        duration={duration}
        onClose={() => {
          ReactDOM.unmountComponentAtNode(container);
          document.body.removeChild(container);
          if (callback) {
            callback();
          }
        }}
        ref={ref => {
          toastInstance = ref;
        }}
      />
    );
    ReactDOM.render(component, container);
  }
}

export default {
  info(content, duration, onClose) {
    notice(Type.Info, { content, duration, onClose });
  },
  success(content, duration, onClose) {
    notice(Type.Success, { content, duration, onClose });
  },
  fail(content, duration, onClose) {
    notice(Type.Fail, { content, duration, onClose });
  },
  loading(content, onClose) {
    notice(Type.Loading, { content, onClose });
  },
  hide() {
    if (toastInstance) {
      toastInstance.fade(Animation.Out, toastInstance.props.onClose);
      toastInstance = null;
    }
  },
};
