import { useEffect, useRef, useState } from 'react';

export default () => {
  const [isRecording, setIsRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [volume, setVolume] = useState(0);

  const recordingStartTime = useRef(null);
  const recordingStopTime = useRef(null);

  const audioChunks = useRef([]);
  const recorder = useRef(null);
  const analyser = useRef(null);
  const frequencyData = useRef(null);
  const animationPulse = useRef(null);

  async function startRecording(onRecordingStop) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const audioAnalyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(audioAnalyser);

    const audioFrequencyData = new Uint8Array(audioAnalyser.frequencyBinCount);
    const mediaRecorder = new MediaRecorder(stream);

    analyser.current = audioAnalyser;
    recorder.current = mediaRecorder;
    frequencyData.current = audioFrequencyData;

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      if (microphone) microphone.disconnect();
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/mp3' });
      audioChunks.current = [];

      const data = {
        audioBlob,
        recordingStartTime: recordingStartTime.current,
        recordingStopTime: recordingStopTime.current,
      };
      onRecordingStop(data);
    };

    recordingStartTime.current = Date.now();
    mediaRecorder.start();
    setPaused(false);
    setIsRecording(true);
    updateVolumeMeter();
  }

  function pauseRecording() {
    if (recorder.current && recorder.current.state !== 'inactive') {
      recorder.current.pause();
      setPaused(true);
      setIsRecording(false);
      setVolume(0);
      cancelVolumeAnimation();
    }
  }

  function resumeRecording() {
    if (recorder.current && recorder.current.state !== 'inactive') {
      recorder.current.resume();
      setPaused(false);
      setIsRecording(true);
      updateVolumeMeter();
    }
  }

  function stopRecording() {
    if (recorder.current && recorder.current.state !== 'inactive') {
      recordingStopTime.current = Date.now();
      recorder.current.stop();
      setIsRecording(false);
    }
  }

  function updateVolumeMeter() {
    analyser.current.getByteFrequencyData(frequencyData.current);
    const countFrequencyData = frequencyData.current.length;
    const totalFrequencyData = frequencyData.current.reduce(
      (sum, value) => sum + value,
      0,
    );
    const averageVolume = Math.floor(totalFrequencyData / countFrequencyData);
    setVolume(averageVolume);

    animationPulse.current = requestAnimationFrame(updateVolumeMeter);
  }

  function cancelVolumeAnimation() {
    if (animationPulse.current) cancelAnimationFrame(animationPulse.current);
  }

  useEffect(() => {
    return () => cancelVolumeAnimation();
  }, []);

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
