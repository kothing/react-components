import React from 'react';
import PropTypes from 'prop-types';

export default class RectShape extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { className, style, color } = this.props;

    const defaultStyle = {
      backgroundColor: color,
      width: '100%',
      height: '100%',
      marginRight: 10
    };

    const classes = ['rect-shape', className].filter(c => c).join(' ');

    return (
      <div className={classes} style={{ ...defaultStyle, ...style }} />
    );
  }

}

RectShape.propTypes = {
  color: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object
}
