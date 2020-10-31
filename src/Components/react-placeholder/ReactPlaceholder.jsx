import React from 'react';
import PropTypes from 'prop-types';
import * as placeholders from './placeholders';
import "./reactPlaceholder.css";

export default class ReactPlaceholder extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          ready: this.props.ready
      }
      this.timeout = undefined;
  }

  getFiller = () => {
    const { firstLaunchOnly, children, ready, className, type, customPlaceholder, showLoadingAnimation, ...rest } = this.props;

    const classes = showLoadingAnimation ? ['show-loading-animation', className].filter(c => c).join(' ') : className;

    if (customPlaceholder && React.isValidElement(customPlaceholder)) {
      const mergedCustomClasses = [
        customPlaceholder.props.className,
        classes
      ].filter(c => c).join(' ');
      return React.cloneElement(customPlaceholder, { className: mergedCustomClasses });
    } else if (customPlaceholder) {
      return customPlaceholder;
    }

    const Placeholder = placeholders[type];

    return <Placeholder {...rest} className={classes} />;
  };

  setNotReady = () => {
    const { delay } = this.props;

    if (delay && delay > 0) {
      this.timeout = window.setTimeout(() => {
        this.setState({ ready: false });
      }, delay);
    } else {
      this.setState({ ready: false });
    }
  }

  setReady = () => {
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }

    if (!this.state.ready) {
      this.setState({ ready: true });
    }
  }

  render() {
    return this.state.ready ? this.props.children : this.getFiller();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.firstLaunchOnly && this.state.ready && !nextProps.ready) {
      this.setNotReady();
    } else if (nextProps.ready) {
      this.setReady();
    }
  }
}

ReactPlaceholder.propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.element
    ]).isRequired,
    delay: PropTypes.number,
    ready: PropTypes.bool.isRequired,
    firstLaunchOnly: PropTypes.bool,
    type: PropTypes.oneOf(['text', 'media', 'textRow', 'rect', 'round']),
    rows: PropTypes.number,
    color: PropTypes.string,
    showLoadingAnimation: PropTypes.bool,
    customPlaceholder: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.element
    ]),
    className: PropTypes.string,
    style: PropTypes.object
}

ReactPlaceholder.defaultProps = {
  delay: 0,
  type: 'text',
  color: '#CDCDCD'
}
