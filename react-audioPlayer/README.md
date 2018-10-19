# React Audio Player

This is a light React wrapper around the HTML5 audio tag. It provides the ability to manipulate the player and listen to events through a nice React interface.

## Usage 使用

    import AudioPlayer from './components/AudioPlayer';
    //...
    <ReactAudioPlayer
      src="my_audio_file.ogg"
      autoPlay
      loop
      title="audio player"
      name="custom-name"
      controlsList="nodownload"
      onPlay={()=>this.play()}
      onPause={()=>this.pause()}
      onEnd={()=>this.end()}
    />


### Example 示例

See the example directory for a basic working example of using this project. To run it locally, run `npm install` in the example directory and then `npm start`.


## Props

### Props - Native/React Attributes 属性

See the [audio tag documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) for detailed explanations of these attributes.

Property|Type|Default|Description
---|---|---|---
autoPlay|Bool|false|auto play
children|Element|/|children element
className|String|/|class name
crossOrigin|String|/|See [MDN's article on CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for more about this attribute.
controlsList|String|/|eg:nodownload, _For Chrome 58+. Only available in React 15.6.2+_
id|String|/|ID
loop|Bool|false|loop
muted|Bool|false|muted
volume|Number|1.0|volume value,0~1, eg: 0.1, 0.5, 0.8
preload|String|metadata|preload
src|String|/|src url
style|Object|{}|style
---------------------------


### Props - Events 事件

Property|Type|Default|Description
---|---|---|---
onCanPlay|Function|/|Called when enough of the file has been downloaded to be able to start playing. Passed the event.
onCanPlayThrough|Function|/|Called when enough of the file has been downloaded to play through the entire file. Passed the event.
onListen|Function|/|Called every `listenInterval` milliseconds during playback. Passed the event.
onLoadedMetadata|Function|/|Called when the metadata for the given audio file has finished downloading. Passed the event.
onPause|Function|/|Called when the user pauses playback. Passed the event.
onPlay|Function|/|Called when the user taps play. Passed the event.
onSeeked|Function|/|Called when the user drags the time indicator to a new time. Passed the event.
onVolumeChange|Function|/|Called when the user changes the volume, such as by dragging the volume slider.
onEnded|Function|/|Called when playback has finished to the end of the file. Passed the event.
onAbort|Function|/|Called when unloading the audio player, like when switching to a different src file. Passed the event.
onError|Function|/|Called when the audio tag encounters an error. Passed the event.
