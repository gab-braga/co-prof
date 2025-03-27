import React, { useEffect, useRef, useState } from 'react';
import PanelHeader from '../components/PanelHeader';
import { findClass } from '../services/classService';
import CreateClassModal from '../components/CreateClassModal';
import { Link, Navigate, useParams } from 'react-router-dom';
import ButtonRecord from '../components/ButtonRecord/ButtonRecord';
import Timer from '../components/Timer';

export default () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRecordingStarted, setIsRecordingStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [volume, setVolume] = useState(false);
  const [time, setTime] = useState(0);
  const [urlAudio, setUrlAudio] = useState(null);

  const paused = useRef(false);

  const animationPulse = useRef(null);
  const timerInterval = useRef(0);

  const [classData, setClassData] = useState({});
  const { id } = useParams(null);

  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

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
    setUrlAudio(null);
    startTime.current = Date.now();
    paused.current = false;

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
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setIsRecordingStarted(false);
      setVolume(0);
    }
  }

  function stopRecording() {
    if (animationPulse.current) cancelAnimationFrame(animationPulse.current);
    if (timerInterval.current) clearInterval(timerInterval.current);

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

  function handleSubmitRecording(urlAudio) {
    setUrlAudio(urlAudio);
  }

  async function loadingData() {
    setIsLoading(true);
    try {
      const data = await findClass(id);
      setClassData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadingData();

    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, []);

  if (!id) return <Navigate to="/classes" />;

  return (
    <div className="min-vh-100 d-flex flex-column gradient-blue-to-top">
      <PanelHeader />

      <div className="container flex-grow-1">
        <div
          className="d-flex flex-column bg-white p-4 mt-4 rounded-3 shadow mb-5"
          style={{ minHeight: '70vh' }}
        >
          <div className="d-flex gap-2 flex-wrap justify-content-between align-items-start">
            <div className="d-flex flex-column">
              <h2 className="fs-4 text-truncate">{classData.name || '...'}</h2>
              {classData.section && (
                <span className="text-secondary text-truncate">
                  {classData.section}
                </span>
              )}
            </div>

            <div className="d-flex gap-3 flex-wrap">
              <Link to={`/classes/${id}`} className="btn btn-primary">
                Gravações
              </Link>
            </div>
          </div>

          {isLoading ? (
            <p className="fw-medium mt-4" style={{ color: '#8a8a8a' }}>
              Carregando...
            </p>
          ) : (
            <div className="flex-grow-1 d-flex justify-content-center align-items-center">
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
                  <button
                    onClick={handleStopRecording}
                    className="btn btn-primary mt-3"
                  >
                    Encerrar
                  </button>

                  {urlAudio && (
                    <a
                      href={urlAudio}
                      download="audio.wav"
                      className="btn btn-primary"
                    >
                      Baixar Gravação
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateClassModal handleUpdates={loadingData} />
    </div>
  );
};
