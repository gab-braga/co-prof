import React, { useEffect, useRef, useState } from 'react';
import ButtonRecord from './ButtonRecord/ButtonRecord';
import Timer from './Timer';

export default ({ handleSubmitRecording }) => {
  const [isRecordingStarted, setIsRecordingStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [volume, setVolume] = useState(false);
  const [time, setTime] = useState(0);

  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const paused = useRef(false);

  const animationPulse = useRef(null);
  const timerInterval = useRef(0);

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

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);

    updateVolume(analyser, dataArray);
    startTime();

    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (event) => audioChunks.current.push(event.data);
    recorder.onstop = stopRecording;

    recorder.start();
    paused.current = false;
    mediaRecorder.current = recorder;

    setIsRecording(true);
    setIsRecordingStarted(true);
  }

  function handlePauseRecording() {
    console.log('Pausado');
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.pause();
      setIsRecording(false);
      paused.current = true;
    }
  }

  function handleResumeRecording() {
    console.log('Retomado');
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.resume();
      setIsRecording(true);
      paused.current = false;
    }
  }

  function handleStopRecording() {
    console.log('Parado');

    if (animationPulse.current) cancelAnimationFrame(animationPulse.current);
    if (timerInterval.current) clearInterval(timerInterval.current);

    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setIsRecordingStarted(false);
      setVolume(0);
      setTime(0);
    }
  }

  function stopRecording() {
    const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
    const urlAudio = URL.createObjectURL(audioBlob);
    audioChunks.current = [];
    handleSubmitRecording(urlAudio);
  }

  function updateVolume(analyser, dataArray) {
    if (!paused.current) {
      analyser.getByteFrequencyData(dataArray);
      const avgVolume = Number.parseInt(
        dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length,
      );
      setVolume(avgVolume);
    }

    animationPulse.current = requestAnimationFrame(() =>
      updateVolume(analyser, dataArray),
    );
  }

  function startTime() {
    const range = 100;
    timerInterval.current = setInterval(() => {
      if (!paused.current) setTime((time) => time + range);
    }, range);
  }

  useEffect(() => {
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, []);

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
