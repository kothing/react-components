import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './LoadingOverlay.less';

import Transition from 'components/Transition';

// High Order Component
const Auxiliary = props => props.children;

//组件类
class LoadingOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // ----------------------------------------
  // Lifecycle
  // ----------------------------------------

  componentDidUpdate(prevProps, prevState) {
    if (this.props.visible && !prevProps.visible && this.props.fullScreenMask) {
      document.body.style.overflow = 'hidden';
    } else if (!this.props.visible && prevProps.visible && document.body.style.overflow !== '') {
      document.body.style.overflow = '';
    }
  }

  // ----------------------------------------
  // Rendering Dom
  // ----------------------------------------

  renderMask() {
    const { visible, showMask, maskMode, fullScreenMask, backgroundColor, zIndex } = this.props;
    const maskBackgroundColor = maskMode === 'light' ? 'rgba(255, 255, 255, 0.4)' : backgroundColor;
    const styleMap = {
      position: fullScreenMask ? 'fixed' : 'absolute',
      backgroundColor: showMask ? maskBackgroundColor : 'transparent',
      opacity: visible && showMask ? 1 : 0,
      zIndex
    };
    return (
      visible && showMask ? 
        <div
          ref={(c) => { this.loadingMask = c; }}
          className={
            classnames({
              'loading-mask': true
            })
          }
          style={styleMap}
        >
        </div> : null
    )
  }

  renderIcon() {
    let _this = this;
    const { iconType } = _this.props;
    let svgIcon = <svg className="loading-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <path fill="#f37327" d="M840.3968 755.712c3.072 0 5.632-2.6624 5.632-5.9904a5.7856 5.7856 0 0 0-5.632-5.9392c-3.1232 0-5.632 2.6624-5.632 5.9392 0 3.328 2.5088 5.9904 5.632 5.9904z m-118.5792 141.5168c6.144 0 11.1616-5.2736 11.1616-11.8272a11.52 11.52 0 0 0-11.1616-11.8272 11.52 11.52 0 0 0-11.2128 11.8272c0 6.5536 5.0176 11.8272 11.2128 11.8272z m-161.6896 75.776a17.3056 17.3056 0 0 0 16.7936-17.7664c0-9.8304-7.5264-17.8176-16.7936-17.8176a17.3056 17.3056 0 0 0-16.8448 17.8176c0 9.8304 7.5264 17.8176 16.8448 17.8176z m-174.592-3.4304a23.04 23.04 0 0 0 22.3744-23.7056 23.04 23.04 0 0 0-22.3744-23.7056 23.04 23.04 0 0 0-22.3744 23.7056 23.04 23.04 0 0 0 22.3744 23.7056z m-154.112-80.896c15.4112 0 27.9552-13.312 27.9552-29.6448 0-16.384-12.544-29.6448-28.0064-29.6448-15.4624 0-28.0064 13.312-28.0064 29.6448 0 16.384 12.544 29.6448 28.0064 29.6448zM126.3104 747.008c18.5344 0 33.5872-15.9744 33.5872-35.6352 0-19.6608-15.0528-35.584-33.5872-35.584-18.5856 0-33.6384 15.9232-33.6384 35.584 0 19.6608 15.0528 35.6352 33.6384 35.6352z m-35.9936-175.4112c21.6576 0 39.168-18.5856 39.168-41.472 0-22.9376-17.5104-41.472-39.168-41.472-21.6064 0-39.168 18.5344-39.168 41.472 0 22.8864 17.5616 41.472 39.168 41.472z m39.7824-174.1312c24.7808 0 44.8-21.248 44.8-47.4624s-20.0192-47.4112-44.8-47.4112c-24.7296 0-44.8 21.1968-44.8 47.4112s20.0704 47.4624 44.8 47.4624z m108.1344-139.264c27.8528 0 50.432-23.9104 50.432-53.4016 0-29.4912-22.528-53.4016-50.432-53.4016-27.8528 0-50.432 23.9104-50.432 53.4016 0 29.4912 22.5792 53.4016 50.432 53.4016z m156.1088-77.312c30.9248 0 55.9616-26.5216 55.9616-59.2896 0-32.768-25.088-59.2896-55.9616-59.2896-30.9248 0-56.0128 26.5728-56.0128 59.2896 0 32.768 25.088 59.2896 56.0128 59.2896z m174.6432 0.8192c34.048 0 61.6448-29.184 61.6448-65.28 0-35.9936-27.5968-65.2288-61.6448-65.2288-33.9968 0-61.5936 29.184-61.5936 65.2288 0 36.0448 27.5968 65.28 61.5936 65.28z m160.3584 79.616c37.12 0 67.1744-31.8464 67.1744-71.168 0-39.2192-30.0544-71.1168-67.1744-71.1168-37.0688 0-67.1744 31.8976-67.1744 71.168 0 39.2704 30.1056 71.168 67.1744 71.168z m115.6096 144.4864c40.192 0 72.8064-34.5088 72.8064-77.056 0-42.5984-32.6144-77.1072-72.8064-77.1072-40.192 0-72.7552 34.5088-72.7552 77.1072 0 42.5472 32.5632 77.056 72.7552 77.056z m49.408 185.4464c43.264 0 78.3872-37.2224 78.3872-83.0464 0-45.8752-35.1232-83.0464-78.3872-83.0464-43.3152 0-78.4384 37.1712-78.4384 83.0464 0 45.824 35.1232 83.0464 78.4384 83.0464z"></path>
    </svg>;
    switch (iconType) {
      case 'loading':
        svgIcon = svgIcon;
        break;

      case 'success':
        svgIcon = <svg className="success-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
          <path fill="#66bc5c" d="M510.545 28.22c-267.043 0-483.521 216.477-483.521 483.52s216.479 483.521 483.521 483.521 483.52-216.479 483.52-483.521S777.588 28.22 510.545 28.22zM776.855 407.855l-315.37 315.37c-9.763 9.763-22.559 14.645-35.355 14.645-12.796 0-25.592-4.882-35.355-14.645l-176.13-176.13c-19.526-19.525-19.526-51.184 0-70.71 19.526-19.526 51.184-19.527 70.711 0L426.13 617.159l280.015-280.015c19.527-19.526 51.184-19.526 70.711 0C796.382 356.671 796.382 388.329 776.855 407.855z"></path>
        </svg>;
        break;

      case 'info':
        svgIcon = <svg className="error-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
          <path fill="#F04631" d="M512 0C229.376 0 0 229.376 0 512s229.376 512 512 512 512-229.376 512-512S794.624 0 512 0z m218.624 672.256c15.872 15.872 15.872 41.984 0 57.856-8.192 8.192-18.432 11.776-29.184 11.776s-20.992-4.096-29.184-11.776L512 569.856l-160.256 160.256c-8.192 8.192-18.432 11.776-29.184 11.776s-20.992-4.096-29.184-11.776c-15.872-15.872-15.872-41.984 0-57.856L454.144 512 293.376 351.744c-15.872-15.872-15.872-41.984 0-57.856 15.872-15.872 41.984-15.872 57.856 0L512 454.144l160.256-160.256c15.872-15.872 41.984-15.872 57.856 0 15.872 15.872 15.872 41.984 0 57.856L569.856 512l160.768 160.256z"></path>
        </svg>;
        break;

      case 'error':
        svgIcon = <svg className="error-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
          <path fill="#F04631" d="M512 0C229.376 0 0 229.376 0 512s229.376 512 512 512 512-229.376 512-512S794.624 0 512 0z m218.624 672.256c15.872 15.872 15.872 41.984 0 57.856-8.192 8.192-18.432 11.776-29.184 11.776s-20.992-4.096-29.184-11.776L512 569.856l-160.256 160.256c-8.192 8.192-18.432 11.776-29.184 11.776s-20.992-4.096-29.184-11.776c-15.872-15.872-15.872-41.984 0-57.856L454.144 512 293.376 351.744c-15.872-15.872-15.872-41.984 0-57.856 15.872-15.872 41.984-15.872 57.856 0L512 454.144l160.256-160.256c15.872-15.872 41.984-15.872 57.856 0 15.872 15.872 15.872 41.984 0 57.856L569.856 512l160.768 160.256z"></path>
        </svg>;
        break;

      default:
        svgIcon = svgIcon;
    }
    return svgIcon
  }

  renderClose() {
    let { maskMode, fullScreenMask, closeable } = this.props;
    return (
      closeable ? <span className={`close ${maskMode}`} onClick={() => { this.handleClose(); }} style={{position: fullScreenMask ? 'fixed' : 'absolute'}}>
        <svg className="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="12" height="12">
          <path d="M908.3 882.3c7 7 7 18.4 0 25.5-7 7-18.4 7-25.5 0L512 537 141.1 907.8c-7 7-18.4 7-25.4 0s-7-18.4 0-25.5L486 512 115.7 141.7c-7-7-7-18.4 0-25.5 7-7 18.4-7 25.4 0L512 487.1l370.8-370.9c7-7 18.4-7 25.5 0 7 7 7 18.4 0 25.5L538 512l370.3 370.3z"></path>
        </svg>
      </span> : null
    );
  }

  renderLoadingOverlay() {
    const { visible, className, size, loadingText, fullScreenMask, zIndex } = this.props;
    return (
      <Auxiliary>
        <Transition.Group animation='fade' duration={200}>
          {this.renderMask()}
        </Transition.Group>
        <Transition.Group animation='fade up' duration={300}>
          {visible ?
            <div
              ref={(c) => { this.loadingOverlay = c; }}
              className={
                classnames({
                  'loading-overlay': true,
                  [className]: !!className,
                })
              }
              style={{
                position: fullScreenMask ? 'fixed' : 'absolute',
                zIndex: zIndex
              }}
            >
              <div
                className={
                  classnames({
                    "loading-box": true,
                    [size]: true
                  })
                }
              >
                {this.renderIcon()}
                {loadingText !== '' ? <span className="loading-text">{loadingText}</span> : ''}
              </div>
              {this.renderClose()}
            </div> : null}
        </Transition.Group>
      </Auxiliary>
    );
  }

  // ----------------------------------------
  // Callback handling
  // ----------------------------------------

  handleClose() {
    const _this = this;
    _this.setState({
      visible: false,
    }, () => {
      _this.props.onDidHide();
    });
  }

  // ----------------------------------------
  // Render
  // ----------------------------------------

  render() {
    return (this.renderLoadingOverlay());
  }
}

LoadingOverlay.defaultProps = {
  visible: false,
  showMask: true,
  maskMode: 'dark',
  fullScreenMask: true,
  size: 'small',
  iconType: 'loading',
  loadingText: 'Loading',
  closeable: false,
  onDidHide: () => { },
  onWillHide: () => { },
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  zIndex: 1000,
};

LoadingOverlay.propTypes = {
  visible: PropTypes.bool,
  showMask: PropTypes.bool,
  maskMode: PropTypes.oneOf(['dark', 'light']),
  fullScreenMask: PropTypes.bool,
  size: PropTypes.string,
  iconType: PropTypes.string,
  loadingText: PropTypes.string,
  closeable: PropTypes.bool,
  onDidHide: PropTypes.func,
  onWillHide: PropTypes.func,
  backgroundColor: PropTypes.string,
  zIndex: PropTypes.number,
};

LoadingOverlay.displayName = 'LoadingOverlay';

export default LoadingOverlay;
