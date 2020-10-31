import React from "react";
import PropTypes from "prop-types";
import Icon from "./Icon";
import { Animation, Type } from "./Const";
import { requestAnimationFrame } from "./Raf";

class Toast extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.isFadingIn = false;
    this.eventStacks = [];
  }

  componentDidMount() {
    this.isFadingIn = true;
    this.fade(Animation.In, () => {
      if (this.props.type !== Type.Loading) {
        this.startTimer();
      }
    });
  }

  fade(type, callback) {
    let last = Date.now();
    const tick = () => {
      if (this.ele) {
        const opacity = Number(this.ele.style.opacity);
        this.ele.style.opacity =
          type === Animation.In
            ? (opacity + (Date.now() - last) / 400).toString()
            : (opacity - (Date.now() - last) / 400).toString();
        last = Date.now();
      }
      if (
        (type === Animation.In && this.ele && +this.ele.style.opacity < 1) ||
        (type === Animation.Out && this.ele && +this.ele.style.opacity > 0)
      ) {
        requestAnimationFrame(tick);
      } else {
        callback();
        this.isFadingIn = false;
        if (this.eventStacks.length > 0) {
          const event = this.eventStacks.pop();
          this.fade(event.type, event.callback);
        }
      }
    };
    if (type === Animation.Out && this.isFadingIn) {
      this.eventStacks.push({ type, callback });
    } else {
      requestAnimationFrame(tick);
    }
  }

  startTimer() {
    const { duration, animation, onClose } = this.props;
    setTimeout(() => {
      this.fade(animation, onClose);
    }, duration);
  }

  render() {
    const { type, content } = this.props;
    return (
      <div className="react-toast-mask">
        <span
          className={`react-toast-message${type === Type.Info ? "" : " icon"}`}
          ref={(ref) => (this.ele = ref)}
        >
          {type !== Type.Info && (
            <div className="react-toast-icon-wrapper">
              <Icon type={type} />
            </div>
          )}
          {content}
        </span>
      </div>
    );
  }
}

Toast.defaultProps = {
  duration: 3000,
  content: "",
  onClose: () => {},
};

Toast.propTypes = {
  duration: PropTypes.number,
  content: PropTypes.string,
  onClose: PropTypes.func,
};

Toast.displayName = "Toast";

export default Toast;
