import React, { useEffect, useRef, useState } from 'react';
import ButtonRecord from './ButtonRecord/ButtonRecord';
import Timer from './Timer';
import useRecorder from '../hooks/useRecorder';
import useTimer from '../hooks/useTimer';

export default ({ handleSubmitRecording }) => {
  const [isRecordingStarted, setIsRecordingStarted] = useState(false);

  const {
    isRecording,
    volume,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
  } = useRecorder();

  const { time, startTimer, pauseTimer, resumeTimer, stopTimer } = useTimer();

  function handleToggleRecording() {
    if (!isRecordingStarted) {
      handleStartRecording();
    } else if (isRecording) {
      handlePauseRecording();
    } else {
      handleResumeRecording();
    }
  }

  async function handleStartRecording() {
    console.log('Iniciado');
    startRecording();
    startTimer();
    setIsRecordingStarted(true);
  }

  function handlePauseRecording() {
    console.log('Pausado');
    pauseRecording();
    pauseTimer();
  }

  function handleResumeRecording() {
    console.log('Retomado');
    resumeRecording();
    resumeTimer();
  }

  function handleStopRecording() {
    console.log('Parado');
    stopRecording(handleSubmitRecording);
    stopTimer();
    setIsRecordingStarted(false);
  }

  return (
    <div
      className="mt-4 mx-4 px-4 py-5 w-100 rounded"
      style={{ maxWidth: '400px', backgroundColor: '#EEEEEE' }}
    >
      <div className="w-100 d-flex flex-column gap-2 justify-content-center align-items-center">
        <h3 className="fs-5">Iniciar Gravação</h3>
        <div className="p-4">
          <ButtonRecord
            onClick={handleToggleRecording}
            isRecording={isRecording}
            pulse={volume}
          />
        </div>
        <div>
          <Timer time={time} />
        </div>
        <button onClick={handleStopRecording} className="btn btn-primary mt-3">
          Encerrar
        </button>
      </div>
    </div>
  );
};
