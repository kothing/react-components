import React from 'react';
import PropTypes from 'prop-types';

export default class TextRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { className, maxHeight, color, lineSpacing, style } = this.props;

    const defaultStyles = {
      maxHeight,
      width: '100%',
      height: '1em',
      backgroundColor: color,
      marginTop: lineSpacing
    };

    const classes = ['text-row', className].filter(c => c).join(' ');

    return (
      <div
        className={classes}
        style={{ ...defaultStyles, ...style }}
      />
    );
  }

}

TextRow.propTypes = {
  maxHeight: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  className: PropTypes.string,
  color: PropTypes.string.isRequired,
  lineSpacing: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  style: PropTypes.object
}

TextRow.defaultProps = {
  lineSpacing: '0.7em'
}
