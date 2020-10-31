import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { getRect, addClass, setStyle, getTouchEvent, getOtherProperties } from './dom';
import './style.css';

export default class Ripple extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      children: [],
    };
    this.touchEvent = getTouchEvent();
  }

  seed = 0;

  getUuid = () => {
    return `Ripple-${Date.now()}_${this.seed += 1}`;
  }

  getRef = (node) => {
    this.rippleNode = node;
  }

  ripple = (event, element) => {
    const touchEvent = this.getPoint(event);
    const { prefixCls, centerMode, size: sizeProps } = this.props;
    let x = touchEvent.pageX || document.documentElement.scrollLeft + document.body.scrollLeft + touchEvent.clientX;
    let y = touchEvent.pageY || document.documentElement.scrollTop + document.body.scrollTop + touchEvent.clientY;
    const parentNode = this.rippleNode.parentNode;
    const { offsetWidth, offsetHeight } = parentNode;
    const scale = sizeProps === 'small' ? 2 : 1;
    const size = Math.max(offsetWidth, offsetHeight) * 2;
    const rect = getRect(parentNode);
    if (!centerMode) {
      x = x - rect.left - document.documentElement.scrollLeft - (size / (sizeProps === 'small' ? 4 : 2));
      y = y - rect.top - document.documentElement.scrollTop - (size / (sizeProps === 'small' ? 4 : 2));
    } else {
      x = -(size - offsetWidth) / 2;
      y = -(size - offsetHeight) / 2;
    }
    setStyle(element, {
      width: `${size / scale}px`,
      height: `${size / scale}px`,
      top: `${y}px`,
      left: `${x}px`,
    });
    addClass(element, `${prefixCls}-Effect`);
  }

  handleTouchStart = (event) => {
    const children = [...this.state.children];
    const { prefixCls } = this.props;
    children.push(this.getUuid());
    this.setState({ children }, () => {
      const activeIndex = children.length - 1;
      const rippleChild = this.rippleNode.querySelectorAll(`.${prefixCls}`);
      if (rippleChild[activeIndex]) {
        this.ripple(event, rippleChild[activeIndex]);
      }
    });
  }

  handleAnimationEnd = (key) => {
    const children = (this.state.children).filter((child) => {
      return key !== child;
    });
    this.setState({ children });
  }

  getPoint = (event) => {
    event = event || window.event;
    return this.touchEvent.mobile ? event.changedTouches[0] : event;
  }

  componentDidMount() {
    if (this.rippleNode) {
      this.rippleNode.parentNode.addEventListener(this.touchEvent.touchstart, this.handleTouchStart);
      if (document.defaultView.getComputedStyle(this.rippleNode.parentNode, null).position !== 'relative') {
        this.rippleNode.parentNode.style.position = 'relative';
      }
    }
  }

  componentWillUnmount() {
    if (this.rippleNode) {
      this.rippleNode.parentNode.removeEventListener(this.touchEvent.touchstart, this.handleTouchStart);
    }
    this.rippleNode = null;
    this.touchEvent = null;
  }

  render() {
    const { className, children, overHidden, prefixCls, rippleColor, ...other } = this.props;
    const styleClass = classNames(
      prefixCls, className,
    );
    const groupClass = classNames(
      `${prefixCls}-wrap`,
      {
        [`${prefixCls}-overHidden`]: overHidden,
      },
    );
    const styles = {
      backgroundColor: this.props.rippleColor,
    };
    const otherProps = getOtherProperties(other, ['centerMode']);
    return (
      <div className={groupClass} ref={this.getRef}>
        {
          (this.state.children).map((child) => {
            return (
              <div
                key={child}
                className={styleClass}
                style={styles}
                {...otherProps}
                onAnimationEnd={this.handleAnimationEnd.bind(this, child)}
              >
                {children}
              </div>
            );
          })
        }
      </div>
    );
  }
}

Ripple.defaultProps = {
  overHidden: true,
  centerMode: false,
  size: 'default',
  prefixCls: 'react-ripple',
};
Ripple.propTypes = {
  overHidden: PropTypes.bool,
  centerMode: PropTypes.bool,
  size: PropTypes.string,
  rippleColor: PropTypes.string,
  prefixCls: PropTypes.string,
};
