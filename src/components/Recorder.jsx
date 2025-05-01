import React, { useState } from 'react';
import { microphoneMessages } from '../utils/messages';
import ButtonRecord from './ButtonRecord/ButtonRecord';
import Timer from './Timer';
import useSegmentedRecorder from '../hooks/useSegmentedRecorder';
import useTimer from '../hooks/useTimer';
import toast from 'react-hot-toast';
import useWakeLock from '../hooks/useWakeLock';

export default ({ handleSubmitRecording }) => {
  const [isRecordingStarted, setIsRecordingStarted] = useState(false);
  const { requestWakeLock, releaseWakeLock } = useWakeLock();

  const {
    isRecording,
    volume,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
  } = useSegmentedRecorder();

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
    try {
      await requestWakeLock();
      await startRecording();
      startTimer();
      setIsRecordingStarted(true);
      console.info('Recording started.');
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

  async function handlePauseRecording() {
    await releaseWakeLock();
    pauseRecording();
    pauseTimer();
    console.info('Recording paused.');
  }

  async function handleResumeRecording() {
    await requestWakeLock();
    resumeRecording();
    resumeTimer();
    console.info('Recording resumed.');
  }

  async function handleStopRecording() {
    await releaseWakeLock();
    stopRecording(handleSubmitRecording);
    stopTimer();
    setIsRecordingStarted(false);
    console.info('Recording stopped.');
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
