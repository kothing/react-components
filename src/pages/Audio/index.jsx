import React from "react";
import { AudioPlayer } from "../../Components";

const AudioPage = () => {
  return (
    <div className="demoBox">
      <h3>音频播放器</h3>
      <AudioPlayer
        src="https://kothing.github.io/assets/audio/See-You-Again.mp3"
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
