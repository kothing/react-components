import React from "react";
import { AudioPlayer } from "../../Components";

const AudioPage = () => {
  return (
    <div className="demoBox">
      <h3>音频播放器</h3>
      <AudioPlayer
        src="https://github.com/kothing/kothing.github.io/blob/master/assets/audio/See-You-Again.mp3?raw=true"
        autoPlay
        loop
        title="audio player"
        name="custom-name"
        controlsList="nodownload"
      />
    </div>
  );
};

export default AudioPage;
