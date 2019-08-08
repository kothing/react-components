import React, { cloneElement, Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import { ALL_TRANSITIONS, DIRECTIONAL_TRANSITIONS } from './CONSTS';
import TransitionGroup from './TransitionGroup';
import './transition.css';

/**
 * Normalizes the duration of a transition.
 * @param {number|object} duration The value to normalize.
 * @param {'hide'|'show'} type The type of transition.
 * @returns {number}
 */
const normalizeTransitionDuration = (duration, type) => (
  (typeof duration === 'number' || typeof duration === 'string') ? duration : duration[type]
);

/**
 * Props where only the prop key is used in the className.
 * @param {*} val A props value
 * @param {string} key A props key
 */
const useKeyOnly = (val, key) => val && key;

const TRANSITION_TYPE = {
  ENTERING: 'show',
  EXITING: 'hide',
};

/**
 * A transition is an animation usually used to move content in or out of view.
 */
export default class Transition extends Component {
  static propTypes = {
    /** Named animation event to used. Must be defined in CSS. */
    animation: PropTypes.oneOfType([PropTypes.oneOf(ALL_TRANSITIONS), PropTypes.string]),

    /** Primary content. */
    children: PropTypes.element.isRequired,

    /** Whether it is directional animation event or not. Use it only for custom transitions. */
    directional: PropTypes.bool,

    /** Duration of the CSS transition animation in milliseconds. */
    duration: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        hide: PropTypes.number,
        show: PropTypes.number,
      }),
      PropTypes.string,
    ]),

    /** Show the component; triggers the enter or exit animation. */
    visible: PropTypes.bool,

    /** Wait until the first "enter" transition to mount the component (add it to the DOM). */
    mountOnShow: PropTypes.bool,

    /**
     * Callback on each transition that changes visibility to shown.
     *
     * @param {null}
     * @param {object} data - All props with status.
     */
    onComplete: PropTypes.func,

    /**
     * Callback on each transition that changes visibility to hidden.
     *
     * @param {null}
     * @param {object} data - All props with status.
     */
    onHide: PropTypes.func,

    /**
     * Callback on each transition that changes visibility to shown.
     *
     * @param {null}
     * @param {object} data - All props with status.
     */
    onShow: PropTypes.func,

    /**
     * Callback on animation start.
     *
     * @param {null}
     * @param {object} data - All props with status.
     */
    onStart: PropTypes.func,

    /** React's key of the element. */
    reactKey: PropTypes.string,

    /** Run the enter animation when the component mounts, if it is initially shown. */
    transitionOnMount: PropTypes.bool,

    /** Unmount the component (remove it from the DOM) when it is not shown. */
    unmountOnHide: PropTypes.bool,
  }

  static defaultProps = {
    animation: 'fade',
    duration: 500,
    visible: true,
    mountOnShow: true,
    transitionOnMount: false,
    unmountOnHide: false,
  };

  static ENTERED = 'ENTERED';
  static ENTERING = 'ENTERING';
  static EXITED = 'EXITED';
  static EXITING = 'EXITING';
  static UNMOUNTED = 'UNMOUNTED';

  static Group = TransitionGroup;

  constructor(...args) {
    super(...args)

    const { initial: status, next } = this.computeInitialStatuses();
    this.nextStatus = next;
    this.state = { status };
  }

  // ----------------------------------------
  // Lifecycle
  // ----------------------------------------

  componentDidMount() {
    this.updateStatus();
  }

  componentWillReceiveProps(nextProps) {
    const { current: status, next } = this.computeStatuses(nextProps);

    this.nextStatus = next;
    if (status) this.setState({ status });
  }

  componentDidUpdate() {
    this.updateStatus();
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  // ----------------------------------------
  // Callback handling
  // ----------------------------------------

  handleStart = () => {
    const { duration } = this.props;
    const status = this.nextStatus;

    this.nextStatus = null;
    this.setState({ status, animating: true }, () => {
      const durationType = TRANSITION_TYPE[status];
      const durationValue = normalizeTransitionDuration(duration, durationType);

      _.invoke(this.props, 'onStart', null, { ...this.props, status });
      this.timeoutId = setTimeout(this.handleComplete, durationValue);
    })
  }

  handleComplete = () => {
    const { status: current } = this.state;

    _.invoke(this.props, 'onComplete', null, { ...this.props, status: current });

    if (this.nextStatus) {
      this.handleStart();
      return;
    }

    const status = this.computeCompletedStatus();
    const callback = current === Transition.ENTERING ? 'onShow' : 'onHide';

    this.setState({ status, animating: false }, () => {
      _.invoke(this.props, callback, null, { ...this.props, status });
    })
  }

  updateStatus = () => {
    const { animating } = this.state;

    if (this.nextStatus) {
      this.nextStatus = this.computeNextStatus();
      if (!animating) this.handleStart();
    }
  }

  // ----------------------------------------
  // Helpers
  // ----------------------------------------

  computeClasses = () => {
    const { animation, directional, children } = this.props;
    const { animating, status } = this.state;

    const childClasses = _.get(children, 'props.className');
    const isDirectional = _.isNil(directional) ? _.includes(DIRECTIONAL_TRANSITIONS, animation) : directional;

    if (isDirectional) {
      return cx(
        childClasses,
        'react-transition',
        animation,
        useKeyOnly(animating, 'animating'),
        useKeyOnly(status === Transition.ENTERING, 'in'),
        useKeyOnly(status === Transition.EXITING, 'out'),
        useKeyOnly(status === Transition.EXITED, 'trans-hidden'),
        useKeyOnly(status !== Transition.EXITED, 'trans-visible')
      );
    }

    return cx(childClasses, animation, useKeyOnly(animating, 'animating react-transition'));
  }

  computeCompletedStatus = () => {
    const { unmountOnHide } = this.props;
    const { status } = this.state;

    if (status === Transition.ENTERING) return Transition.ENTERED;
    return unmountOnHide ? Transition.UNMOUNTED : Transition.EXITED;
  }

  computeInitialStatuses = () => {
    const { visible, mountOnShow, transitionOnMount, unmountOnHide } = this.props;

    if (visible) {
      if (transitionOnMount) {
        return {
          initial: Transition.EXITED,
          next: Transition.ENTERING,
        };
      }
      return { initial: Transition.ENTERED };
    }

    if (mountOnShow || unmountOnHide) return { initial: Transition.UNMOUNTED };
    return { initial: Transition.EXITED };
  }

  computeNextStatus = () => {
    const { animating, status } = this.state;

    if (animating) return status === Transition.ENTERING ? Transition.EXITING : Transition.ENTERING;
    return status === Transition.ENTERED ? Transition.EXITING : Transition.ENTERING;
  }

  computeStatuses = (props) => {
    const { status } = this.state;
    const { visible } = props;

    if (visible) {
      return {
        current: status === Transition.UNMOUNTED && Transition.EXITED,
        next:
          status !== Transition.ENTERING && status !== Transition.ENTERED && Transition.ENTERING,
      };
    }

    return {
      next: (status === Transition.ENTERING || status === Transition.ENTERED) && Transition.EXITING,
    };
  }

  computeStyle = () => {
    const { children, duration } = this.props
    const { status } = this.state

    const childStyle = _.get(children, 'props.style');
    const type = TRANSITION_TYPE[status];
    const animationDuration = type && `${normalizeTransitionDuration(duration, type)}ms`;

    return { ...childStyle, animationDuration };
  }

  // ----------------------------------------
  // Render
  // ----------------------------------------

  render() {
    const { children } = this.props;
    const { status } = this.state;
    if (status === Transition.UNMOUNTED) return null;
    return cloneElement(children ? children : <span></span> , {
      className: this.computeClasses(),
      style: this.computeStyle(),
    });
  }
}
