import { useEffect, useRef, useState } from "react";

const TIME_SLICE = 500;

export default () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(0);

  const recordingStartTime = useRef(null);
  const recordingStopTime = useRef(null);

  const audioChunks = useRef([]);
  const microphone = useRef(null);
  const recorder = useRef(null);
  const analyser = useRef(null);
  const frequencyData = useRef(null);
  const animationPulse = useRef(null);

  async function startRecording() {
    if (isRecording || isPaused) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const audioAnalyser = audioContext.createAnalyser();
    const streamSource = audioContext.createMediaStreamSource(stream);
    const audioFrequencyData = new Uint8Array(audioAnalyser.frequencyBinCount);
    const mediaRecorder = new MediaRecorder(stream);

    microphone.current = streamSource;
    analyser.current = audioAnalyser;
    recorder.current = mediaRecorder;
    frequencyData.current = audioFrequencyData;

    microphone.current.connect(analyser.current);

    mediaRecorder.ondataavailable = (event) =>
      audioChunks.current.push(event.data);
    mediaRecorder.start(TIME_SLICE);
    recordingStartTime.current = Date.now();

    setIsPaused(false);
    setIsRecording(true);
    updateVolumeMeter();
  }

  function pauseRecording() {
    if (recorder.current && recorder.current.state !== "inactive") {
      recorder.current.pause();

      setIsPaused(true);
      setIsRecording(false);
      cancelVolumeAnimation();
      setVolume(0);
    }
  }

  function resumeRecording() {
    if (recorder.current && recorder.current.state !== "inactive") {
      recorder.current.resume();

      setIsPaused(false);
      setIsRecording(true);
      updateVolumeMeter();
    }
  }

  async function stopRecording(onRecordingStop) {
    if (recorder.current && recorder.current.state !== "inactive") {
      await recorder.current.stop();
      recordingStopTime.current = Date.now();

      if (microphone.current) {
        microphone.current.disconnect();
        microphone.current = null;
      }

      const audioBlob = new Blob(audioChunks.current, { type: "audio/mp3" });
      audioChunks.current = [];

      const data = {
        audioBlob,
        recordingStartTime: recordingStartTime.current,
        recordingStopTime: recordingStopTime.current,
      };

      setIsPaused(false);
      setIsRecording(false);
      cancelVolumeAnimation();
      setVolume(0);

      onRecordingStop(data);
    }
  }

  function updateVolumeMeter() {
    if (analyser.current && frequencyData.current) {
      analyser.current.getByteFrequencyData(frequencyData.current);
      const countFrequencyData = frequencyData.current.length;
      const calculateSum = (sum, value) => sum + value;
      const totalFrequencyData = frequencyData.current.reduce(calculateSum, 0);
      const averageVolume = Math.floor(totalFrequencyData / countFrequencyData);
      setVolume(averageVolume);
    }
    animationPulse.current = requestAnimationFrame(updateVolumeMeter);
  }

  function cancelVolumeAnimation() {
    if (animationPulse.current) {
      cancelAnimationFrame(animationPulse.current);
      animationPulse.current = null;
    }
  }

  useEffect(() => {
    return () => cancelVolumeAnimation();
  }, []);

  return {
    isRecording,
    isPaused,
    volume,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
  };
};
