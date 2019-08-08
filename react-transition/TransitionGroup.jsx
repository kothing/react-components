import React, { cloneElement, Children, isValidElement, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { ALL_TRANSITIONS } from './CONSTS';
import Transition from './Transition';


/**
 * Returns a createElement() type based on the props of the Component.
 * Useful for calculating what type a component should render as.
 *
 * @param {function} Component A function or ReactClass.
 * @param {object} props A ReactElement props object
 * @param {function} [getDefault] A function that returns a default element type.
 * @returns {string|function} A ReactElement type
 */
function getElementType(Component, props, getDefault) {
  const { defaultProps = {} } = Component;

  // ----------------------------------------
  // user defined "as" element type

  if (props.as && props.as !== defaultProps.as) return props.as;

  // ----------------------------------------
  // computed default element type

  if (getDefault) {
    const computedDefault = getDefault();
    if (computedDefault) return computedDefault;
  }

  // ----------------------------------------
  // infer anchor links

  if (props.href) return 'a';

  // ----------------------------------------
  // use defaultProp or 'div'

  return defaultProps.as || 'div';
}


/**
 * Returns an object consisting of props beyond the scope of the Component.
 * Useful for getting and spreading unknown props from the user.
 * @param {function} Component A function or ReactClass.
 * @param {object} props A ReactElement props object
 * @returns {{}} A shallow copy of the prop object
 */
const getUnhandledProps = (Component, props) => {
  // Note that `handledProps` are generated automatically during build with `babel-plugin-transform-react-handled-props`
  const { handledProps = [] } = Component

  return Object.keys(props).reduce((acc, prop) => {
    if (prop === 'childKey') return acc;
    if (handledProps.indexOf(prop) === -1) acc[prop] = props[prop];
    return acc;
  }, {});
}


/**
 * Given `this.props.children`, return an object mapping key to child.
 *
 * @param {object} children Element's children
 * @return {object} Mapping of key to child
 */
const getChildMapping = children => _.keyBy(_.filter(Children.toArray(children), isValidElement), 'key');

const getPendingKeys = (prev, next) => {
  const nextKeysPending = {};
  let pendingKeys = [];

  _.forEach(_.keys(prev), (prevKey) => {
    if (!_.has(next, prevKey)) {
      pendingKeys.push(prevKey);
      return;
    }

    if (pendingKeys.length) {
      nextKeysPending[prevKey] = pendingKeys;
      pendingKeys = [];
    }
  })

  return [nextKeysPending, pendingKeys];
}

const getValue = (key, prev, next) => (_.has(next, key) ? next[key] : prev[key]);

/**
 * When you're adding or removing children some may be added or removed in the same render pass. We want to show *both*
 * since we want to simultaneously animate elements in and out. This function takes a previous set of keys and a new set
 * of keys and merges them with its best guess of the correct ordering.
 *
 * @param {object} prev Prev children as returned from `getChildMapping()`
 * @param {object} next Next children as returned from `getChildMapping()`
 * @return {object} A key set that contains all keys in `prev` and all keys in `next` in a reasonable order
 */
const mergeChildMappings = (prev = {}, next = {}) => {
  const childMapping = {};
  const [nextKeysPending, pendingKeys] = getPendingKeys(prev, next);

  _.forEach(_.keys(next), (nextKey) => {
    if (_.has(nextKeysPending, nextKey)) {
      _.forEach(nextKeysPending[nextKey], (pendingKey) => {
        childMapping[pendingKey] = getValue(pendingKey, prev, next);
      })
    }

    childMapping[nextKey] = getValue(nextKey, prev, next);
  })

  _.forEach(pendingKeys, (pendingKey) => {
    childMapping[pendingKey] = getValue(pendingKey, prev, next);
  })

  return childMapping;
}


/**
 * A Transition.Group animates children as they mount and unmount.
 */
export default class TransitionGroup extends React.Component {
  static propTypes = {
    /** Named animation event to used. Must be defined in CSS. */
    animation: PropTypes.oneOfType([PropTypes.oneOf(ALL_TRANSITIONS), PropTypes.string]),

    /** Primary content. */
    children: PropTypes.node,

    /** Whether it is directional animation event or not. Use it only for custom transitions. */
    directional: PropTypes.bool,

    /** Duration of the CSS transition animation in milliseconds. */
    duration: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        hide: PropTypes.number.isRequired,
        show: PropTypes.number.isRequired,
      }),
      PropTypes.string,
    ]),
  };

  static defaultProps = {
    as: Fragment,
    animation: 'fade',
    duration: 500,
  };

  constructor(...args) {
    super(...args)

    const { children } = this.props;
    this.state = {
      children: _.mapValues(getChildMapping(children), child => this.wrapChild(child)),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { children: prevMapping } = this.state;
    const nextMapping = getChildMapping(nextProps.children);
    const children = mergeChildMappings(prevMapping, nextMapping);

    _.forEach(children, (child, key) => {
      const hasPrev = _.has(prevMapping, key);
      const hasNext = _.has(nextMapping, key);
      const { [key]: prevChild } = prevMapping;
      const isLeaving = !_.get(prevChild, 'props.visible');

      // Heads up!
      // An item is new (entering), it will be picked from `nextChildren`, so it should be wrapped
      if (hasNext && (!hasPrev || isLeaving)) {
        children[key] = this.wrapChild(child, { transitionOnMount: true });
        return;
      }

      // Heads up!
      // An item is old (exiting), it will be picked from `prevChildren`, so it has been already
      // wrapped, so should be only updated
      if (!hasNext && hasPrev && !isLeaving) {
        children[key] = cloneElement(prevChild, { visible: false });
        return;
      }

      // Heads up!
      // An item item hasn't changed transition states, but it will be picked from `nextChildren`,
      // so we should wrap it again
      const {
        props: { visible, transitionOnMount },
      } = prevChild;

      children[key] = this.wrapChild(child, { transitionOnMount, visible });
    })

    this.setState({ children });
  }

  handleOnHide = (nothing, childProps) => {
    const { reactKey } = childProps;

    this.setState((state) => {
      const children = { ...state.children };
      delete children[reactKey];

      return { children };
    })
  }

  wrapChild = (child, options = {}) => {
    const { animation, directional, duration } = this.props;
    const { key } = child;
    const { visible = true, transitionOnMount = false } = options;

    return (
      <Transition
        animation={animation}
        directional={directional}
        duration={duration}
        key={key}
        onHide={this.handleOnHide}
        reactKey={key}
        transitionOnMount={transitionOnMount}
        visible={visible}
      >
        {child}
      </Transition>
    );
  }

  render() {
    const { children } = this.state;
    const ElementType = getElementType(TransitionGroup, this.props);
    const rest = getUnhandledProps(TransitionGroup, this.props);

    return <ElementType {...rest}>{_.values(children)}</ElementType>
  }
}
