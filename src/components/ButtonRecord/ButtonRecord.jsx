import React from 'react';
import './ButtonRecord.css';
import PauseIcon from '../../assets/pause.svg';
import PlayIcon from '../../assets/play.svg';

export default ({ isRecording, pulse, ...rest }) => {
  return (
    <button
      {...rest}
      style={{
        '--scale-size': isRecording ? '1' : '1.5',
        '--pulse-size': isRecording ? `${pulse}px` : '0px',
      }}
      className="button-record"
    >
      {isRecording ? <img src={PauseIcon} /> : <img src={PlayIcon} />}
    </button>
  );
};
