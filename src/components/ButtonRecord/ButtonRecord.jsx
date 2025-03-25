import React from 'react';
import './ButtonRecord.css';

export default ({ isRecording, pulse, ...rest }) => {
  return (
    <button
      {...rest}
      style={{
        '--scale-size': isRecording ? '1' : '1.5',
        '--pulse-size': `${pulse}px`,
      }}
      className="button-record"
    ></button>
  );
};
