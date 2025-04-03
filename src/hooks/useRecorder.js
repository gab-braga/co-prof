import { useRef, useState } from 'react';

export default () => {
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState(false);
  const [paused, setPaused] = useState(false);

  const analyser = useRef(null);
  const recorder = useRef(null);
  const audioChunks = useRef([]);

  const animationPulse = useRef(null);

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const audioAnalyser = audioContext.createAnalyser();
    const sourceMidia = audioContext.createMediaStreamSource(stream);
    sourceMidia.connect(audioAnalyser);

    const audioFrequencyData = new Uint8Array(audioAnalyser.frequencyBinCount);
    updateVolume(audioAnalyser, audioFrequencyData);

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (event) =>
      audioChunks.current.push(event.data);
    mediaRecorder.start();
    // mediaRecorder.onstop = () => {};

    analyser.current = audioAnalyser;
    recorder.current = mediaRecorder;
    setPaused(false);
    setIsRecording(true);
  }

  function pauseRecording() {
    if (recorder.current && recorder.current.state !== 'inactive') {
      recorder.current.pause();
      setPaused(true);
      setIsRecording(false);
      setVolume(0);
    }
  }

  function resumeRecording() {
    if (recorder.current && recorder.current.state !== 'inactive') {
      recorder.current.resume();
      setPaused(false);
      setIsRecording(true);
      setVolume(0);
    }
  }

  function stopRecording(onRecordingStop) {
    const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
    // const urlAudio = URL.createObjectURL(audioBlob);
    audioChunks.current = [];

    if (recorder.current && recorder.current.state !== 'inactive') {
      recorder.current.stop();
      setIsRecording(false);
    }

    onRecordingStop(audioBlob);
  }

  function updateVolume(analyser, audioFrequencyData) {
    analyser.getByteFrequencyData(audioFrequencyData);
    if (!paused) {
      const avgVolume = Number.parseInt(
        audioFrequencyData.reduce((sum, value) => sum + value, 0) /
          audioFrequencyData.length,
      );
      setVolume(avgVolume);
    }

    animationPulse.current = requestAnimationFrame(() =>
      updateVolume(analyser, audioFrequencyData),
    );
  }

  return {
    isRecording,
    volume,
    paused,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
  };
};
