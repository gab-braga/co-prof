import React, { useEffect, useRef, useState } from 'react';
import { microphoneMessages } from '../utils/messages';
import ButtonRecord from './ButtonRecord/ButtonRecord';
import Timer from './Timer';
import useSegmentedRecorder from '../hooks/useSegmentedRecorder';
import useTimer from '../hooks/useTimer';
import toast from 'react-hot-toast';
import useWakeLock from '../hooks/useWakeLock';
import usePreventPageLeave from '../hooks/usePreventPageLeave';

const RECORDING_TIME_LIMIT = 3600000; // 1h

export default ({ handleSubmitRecording }) => {
  const [statusIndicator, setStatusIndicator] = useState("Iniciar Gravação");
  const [isRecordingStarted, setIsRecordingStarted] = useState(false);
  const [isRecordingEnabled, setIsRecordingEnabled] = useState(true);
  const timeLimitReachedRef = useRef(false);
  const stoppedRef = useRef(false);

  const { enablePreventPageLeave, disablePreventPageLeave } =
    usePreventPageLeave();
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
      enablePreventPageLeave();
      requestWakeLock();

      await startRecording();
      startTimer();
      setIsRecordingStarted(true);
      setStatusIndicator("Gravando...");
      console.info('Recording started.');
    } catch (error) {
      disablePreventPageLeave();
      releaseWakeLock();

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
    releaseWakeLock();
    pauseRecording();
    pauseTimer();
    setStatusIndicator("Pausado");
    console.info('Recording paused.');
  }

  async function handleResumeRecording() {
    requestWakeLock();
    resumeRecording();
    resumeTimer();
    setStatusIndicator("Gravando...");
    console.info('Recording resumed.');
  }

  async function handleStopRecording() {
    stoppedRef.current = true;
    setIsRecordingEnabled(false);
    
    disablePreventPageLeave();
    releaseWakeLock();

    stopTimer();
    setIsRecordingStarted(false);
    await stopRecording(handleSubmitRecording);
    setStatusIndicator("Encerrado");
    console.info('Recording stopped.');
  }
  
  async function checkAndStopRecordingIfTimeExceeded() {
    if (time >= RECORDING_TIME_LIMIT) {
      timeLimitReachedRef.current = true;
      setIsRecordingEnabled(false);
      await countdownToStopRecordind();
      handleStopRecording();
    }
  }

  async function countdownToStopRecordind() {
    const times = 10;
    for (let sec = times; sec >= 1; sec--) {
      if (stoppedRef.current) break;
      setStatusIndicator(`Encerrando em ${sec}s`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  useEffect(() => {
    if (!timeLimitReachedRef.current) {
      checkAndStopRecordingIfTimeExceeded();
    }
  }, [time]);

  return (
    <div
      className="px-4 py-5 w-100 rounded"
      style={{ maxWidth: '400px', backgroundColor: '#EEEEEE' }}
    >
      <div className="w-100 d-flex flex-column gap-2 justify-content-center align-items-center">
        <h3 className="fs-5">
          {statusIndicator}
        </h3>
        <div className="p-4">
          <ButtonRecord
            onClick={handleToggleRecording}
            isRecording={isRecording}
            pulse={volume}
            disabled={!isRecordingEnabled}
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
