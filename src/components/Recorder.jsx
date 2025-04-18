import React, { useState } from 'react';
import ButtonRecord from './ButtonRecord/ButtonRecord';
import Timer from './Timer';
import useRecorder from '../hooks/useRecorder';
import useTimer from '../hooks/useTimer';
import toast from 'react-hot-toast';
import { microphoneMessages } from '../utils/messages';

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
    try {
      await startRecording();
      startTimer();
      setIsRecordingStarted(true);
    } catch (error) {
      if (
        error.name === 'NotAllowedError' ||
        error.name === 'PermissionDeniedError'
      ) {
        toast.error(microphoneMessages.errorMicrophonePermission);
      } else if (
        error.name === 'NotFoundError' ||
        error.name === 'DevicesNotFoundError'
      ) {
        toast.error(microphoneMessages.errorMicrophoneNotFound);
      } else {
        toast.error(microphoneMessages.errorMicrophoneAccess);
      }
      console.error(error);
    }
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
      className="px-4 py-5 w-100 rounded"
      style={{ maxWidth: '400px', backgroundColor: '#EEEEEE' }}
    >
      <div className="w-100 d-flex flex-column gap-2 justify-content-center align-items-center">
        <h3 className="fs-5">
          {!isRecordingStarted
            ? 'Iniciar Gravação'
            : isRecording
            ? 'Gravando...'
            : 'Pausado'}
        </h3>
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
        {isRecordingStarted && (
          <button
            onClick={handleStopRecording}
            className="btn btn-primary mt-3 text-nowrap"
          >
            <i className="bi bi-stop-circle me-2"></i>
            Encerrar
          </button>
        )}
      </div>
    </div>
  );
};
