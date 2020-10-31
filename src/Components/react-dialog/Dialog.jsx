import React from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import "./dialog.css";

class Dialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const doc = window.document;
    this.node = doc.createElement("div");
    this.node.className = "dialog-root";
    doc.body.appendChild(this.node);
  }

  componentWillUnmount() {
    document.body.removeChild(this.node);
  }

  onOK = () => {
    this.props.onOK();
    this.onHide();
  };

  onCancel = () => {
    this.props.onCancel();
  };

  onHide = () => {
    this.props.onCancel();
  };

  render() {
    const { visible, className, title, onOK, onCancel } = this.props;
    return createPortal(
      <CSSTransition
        classNames="dialog"
        in={visible}
        timeout={300}
        unmountOnExit
        onEnter={() => {}}
        onExited={() => {}}
      >
        <div className="react-dialog-wrap">
          <div
            className={className ? `${className} react-dialog` : `react-dialog`}
          >
            <span className="dialog-close" onClick={this.onCancel}>
              x
            </span>
            <div className="dialog-header">{title}</div>
            <div className="dialog-body">
              {this.props.children && this.props.children}
            </div>
            <div className="dialog-footer">
              {onCancel ? (
                <button onClick={this.onCancel} className="cancel btn">
                  Cancel
                </button>
              ) : null}
              {onOK ? (
                <button onClick={this.onOK} className="ok btn">
                  OK
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </CSSTransition>,
      this.node
    );
  }
}

Dialog.defaultProps = {
  visible: false,
  title: "Title",
  onOk: () => {},
  onCancel: () => {}
};

Dialog.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
};

Dialog.displayName = "Dialog";

export default Dialog;
