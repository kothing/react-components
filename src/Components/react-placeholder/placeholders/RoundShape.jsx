import React from 'react';
import PropTypes from 'prop-types';

export default class RoundShape extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { className, style, color } = this.props;

    const defaultStyles = {
      backgroundColor: color,
      borderRadius: '500rem',
      width: '100%',
      height: '100%'
    };

    const classes = ['round-shape', className].filter(c => c).join(' ');

    return (
      <div className={classes} style={{ ...defaultStyles, ...style }} />
    );
  }

}

RoundShape.propTypes = {
  color: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object
}
