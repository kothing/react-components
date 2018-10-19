/**
 * AudioPlayer Component
 * @author chzng
 * Web https://github.com/missra-kit
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.css';

class AudioPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlay: false,
      currentTime: 0,
      currentTotalTime: 0,
      volume: this.props.volume ? (this.props.volume*100).toString() : '100'
    }
  }


  /*
   * Play Pause
   */
  play(e){
    let me = this;
    const audio = me.audioEl;
    let promise = audio.play();
    //谷歌浏览器M66版本 自动播放问题
    //https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
    if (promise !== undefined) {
      promise.then(() => {
        me.setState({
          isPlay: true
        });
        console.log('Autoplay started');
      }).catch(error => {
        me.setState({
          isPlay: false
        });
        console.log('Autoplay was prevented.')
      });
    }
  }

  pause(e){
    const audio = this.audioEl;
    audio.pause();
    this.setState({
      isPlay: false
    });
  }


  /**
   * Set an interval to call props.onListen every listenInterval time period
   * 设置定时监听音轨
   */
  setListenTrack() {
    let me = this;
    if (!me.listenTracker) {
      me.listenTracker = setInterval(() => {
        me.updateCurrentTime();
        me.props.onListen(me.audioEl.currentTime);
      }, 1000);
    }
  }

  /*
   * Update audio currentTime
   */
  updateCurrentTime(){
    const audio = this.audioEl;
    this.setState({
      currentTime: audio.currentTime
    });
  }

  /**
   * Clear the onListen interval
   * 清除定时监听
   */
  clearListenTrack() {
    if (this.listenTracker) {
      clearInterval(this.listenTracker);
      this.listenTracker = null;
    }
  }

  /**
   * 设置播放时间点
   */
  changeProgress(){
    const audio = this.audioEl;
    const progress = this.progress;
    audio.currentTime = this.progress.value;
    this.setState({
        currentTime: progress.value
    });
  }

  /**
   * 时间转换
   */
  timeConvert(timestamp){
    var minutes = Math.floor(timestamp / 60);
    var seconds = Math.floor(timestamp - (minutes * 60));
    if(seconds < 10) {
        seconds = '0' + seconds;
    }
    timestamp = minutes + ':' + seconds;
    return timestamp;
  }

  /**
   * Set the volume on the audio element from props
   * @param {Number} volume
   */
  changeVolume() {
    const audio = this.audioEl;
    const volume = this.volume;
    audio.volume = parseInt(volume.value,0)/100;
    this.setState({
      volume: volume.value
    });
  }

  /**
   * Set muted
   */
  setMuted(){
    const audio = this.audioEl;
    audio.muted = !audio.muted;
  }

  //组件加载完成
  componentDidMount() {
    const audio = this.audioEl;

    // Set default volume
    audio.volume = this.state.volume/100;

    // When enough of the file has downloaded to start playing
    audio.addEventListener('canplay', (e) => {
      this.props.onCanPlay(e);
      this.setState({
        currentTotalTime: audio.duration ? audio.duration : 0
      });
    });

    // When enough of the file has downloaded to play the entire file
    audio.addEventListener('canplaythrough', (e) => {
      this.props.onCanPlayThrough(e);
    });

    // When audio play starts
    audio.addEventListener('play', (e) => {
      // this.play(e);
      this.setListenTrack();
      this.props.onPlay(e);
      this.setState({
        isPlay: true
      });
    });

    // When the user pauses playback
    audio.addEventListener('pause', (e) => {
      // this.pause(e);
      this.clearListenTrack();
      this.props.onPause(e);
      this.setState({
        isPlay: false
      });
    });

    // When unloading the audio player (switching to another src)
    audio.addEventListener('abort', (e) => {
      this.clearListenTrack();
      this.props.onAbort(e);
    });    

    // When the user drags the time indicator to a new time
    audio.addEventListener('seeked', (e) => {
      this.props.onSeeked(e);
      this.setState({
        currentTime: audio.currentTime ? audio.currentTime : 0
      });
    });

    audio.addEventListener('volumechange', (e) => {
      this.props.onVolumeChange(e);
      this.setState({
        volume: audio.muted ? 0 : audio.volume*100
      });
    });    

    audio.addEventListener('loadedmetadata', (e) => {
      this.props.onLoadedMetadata(e);
    });

    // When the file has finished playing to the end
    audio.addEventListener('ended', (e) => {
      this.clearListenTrack();
      this.props.onEnded(e);
      this.setState({
        currentTime: 0
      });
    });

    audio.addEventListener('error', (e) => {
      this.props.onError(e);
    });

  }

  /*
   * 组件卸载时候调用
   */
  componentWillUnmount(){
    this.clearListenTrack();
  }  
  
  /*
   * Render 
   */
  render() {
    const incompatibilityMessage = this.props.children || (
      <p>Your browser does not support the <code>audio</code> element.</p>
    );

    // Set lockscreen / process audio title on devices
    const title = this.props.title ? this.props.title : this.props.src;

    // Some props should only be added if specified
    const conditionalProps = {};
    if (this.props.controlsList) {
      conditionalProps.controlsList = this.props.controlsList;
    }

    //Volume icon
    let volumePathd = "M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z";
    if(parseInt(this.state.volume, 0) === 0 || this.state.isMuted) {
      volumePathd = "M0 7.667v8h5.333L12 22.333V1L5.333 7.667"
    } else if(parseInt(this.state.volume, 0) > 0 && parseInt(this.state.volume, 0) <= 50) {
      volumePathd = "M0 7.667v8h5.333L12 22.333V1L5.333 7.667M17.333 11.373C17.333 9.013 16 6.987 14 6v10.707c2-.947 3.333-2.987 3.333-5.334z"
    } else if(parseInt(this.state.volume, 0) > 50) {
      volumePathd = "M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z"
    }

    /* Return */
    return (
      <div className="react-audio-player-wrap">
        <audio
          autoPlay={this.props.autoPlay}
          className={`react-audio-player ${this.props.className}`}
          controls={false}
          crossOrigin={this.props.crossOrigin}
          id={this.props.id}
          loop={this.props.loop}
          muted={this.props.muted}
          preload={this.props.preload}
          ref={(ref) => {this.audioEl = ref}}
          src={this.props.src}
          style={this.props.style}
          title={title}
          {...conditionalProps}
        >
          {incompatibilityMessage}
        </audio>
        
        <div className="audio-controller">
          {/* 播放控制 */}
          <div className="audio-play-box">
              <span className={this.state.isPlay === true ? 'audio-play icon-play' : 'audio-play icon-pause'} onClick={this.state.isPlay ? ()=>this.pause() : ()=>this.play()}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 24">
                      <path fill="#44BFA3" fillRule="evenodd" d={this.state.isPlay ? "M0 0h6v24H0zM12 0h6v24h-6z" : "M18 12L0 24V0"}/>
                  </svg>
              </span>
          </div>

          {/* 进度 */}
          <div className="audio-progress">
            <div className="audio-progress-bar-bg">
                <div className="audio-progress-bar" style={{'width':(this.state.currentTime / this.state.currentTotalTime)*100 + '%'}}>
                    <i></i>
                </div>
            </div>
            <input 
                type="range" 
                className="audio-progress-range"
                ref={(ref) => { this.progress = ref }}
                step="0.01"
                max={this.state.currentTotalTime}     
                value={this.state.currentTime}  
                onChange={() => this.changeProgress()} 
            />
            <span className="audio-totalTime">{this.timeConvert(this.state.currentTime)} / {this.timeConvert(this.state.currentTotalTime)}</span>
          </div>
          {/* 音量 */}
          <div className="audio-volume">
            <span className={this.state.isMuted ? 'audio-volume-icon mute' : 'audio-volume-icon nomute'}  onClick={() => this.setMuted()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="#44BFA3" fillRule="evenodd" d={volumePathd} id="speaker"/>
                </svg>
            </span>
            <div className="audio-volume-bar-bg">
                <div className="audio-volume-bar" style={{'width': this.state.isMuted ? 0 : this.state.volume + '%'}}>
                    <i></i>
                </div>
            </div>
            <input 
              type="range" 
              ref={(ref) => {this.volume = ref}}
              className="audio-volume-range" 
              onChange={()=> this.changeVolume()} 
              value={this.state.volume}
            />
          </div>
        </div>
      </div>
    );
  }
}

AudioPlayer.defaultProps = {
  id: '',
  className: '',
  controls: false,
  controlsList: '',
  autoPlay: false,
  children: null,
  crossOrigin: null,
  loop: false,
  muted: false,
  onCanPlay: () => {},
  onCanPlayThrough: () => {},
  onLoadedMetadata: () => {},
  onPlay: () => {},
  onPause: () => {},
  onEnded: () => {},
  onAbort: () => {},
  onError: () => {},
  onListen: () => {},
  onSeeked: () => {},
  onVolumeChange: () => {},
  preload: 'metadata',
  src: null,
  style: {},
  title: '',
  volume: 1,
};

// http://facebook.github.io/react/docs/reusable-components.html
AudioPlayer.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  // controls: PropTypes.bool,
  controlsList: PropTypes.string,
  autoPlay: PropTypes.bool,
  children: PropTypes.element,
  crossOrigin: PropTypes.string,
  loop: PropTypes.bool,
  muted: PropTypes.bool,
  onAbort: PropTypes.func,
  onCanPlay: PropTypes.func,
  onCanPlayThrough: PropTypes.func,
  onEnded: PropTypes.func,
  onError: PropTypes.func,
  onListen: PropTypes.func,
  onLoadedMetadata: PropTypes.func,
  onPause: PropTypes.func,
  onPlay: PropTypes.func,
  onSeeked: PropTypes.func,
  onVolumeChange: PropTypes.func,
  preload: PropTypes.oneOf(['', 'none', 'metadata', 'auto']),
  src: PropTypes.string, // Not required b/c can use <source>
  style: PropTypes.objectOf(PropTypes.string),
  title: PropTypes.string,
  volume: PropTypes.number,
};

export default AudioPlayer;
