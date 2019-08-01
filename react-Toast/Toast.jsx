import raf from 'raf';
import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';
import { Animation, Type } from './Const';

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
      const opacity = Number(this.ele.style.opacity);
      this.ele.style.opacity = type === Animation.In ? (opacity + (Date.now() - last) / 400).toString() : (opacity - (Date.now() - last) / 400).toString();
      last = Date.now();

      if (
        (type === Animation.In && +this.ele.style.opacity < 1) ||
        (type === Animation.Out && +this.ele.style.opacity > 0)
      ) {
        raf(tick);
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
      raf(tick);
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
      <div className="light-toast-mask">
        <span
          className={`light-toast-message${type === Type.Info ? '' : ' icon'}`}
          ref={ref => this.ele = ref}
        >
          {type !== Type.Info && (
            <div className="light-toast-icon-wrapper">
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
  content: '',
  onClose: () => { }
};

Toast.propTypes = {
  duration: PropTypes.number,
  content: PropTypes.string,
  onClose: PropTypes.func,
};

Toast.displayName = 'Toast';

export default Toast;
