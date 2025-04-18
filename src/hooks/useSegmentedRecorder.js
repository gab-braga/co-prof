import { useEffect, useRef, useState } from "react";

const TIME_SLICE = 500;
const SEGMENTATION_VERIFICATION_TIME = 500;
const TIME_SPLIT_AUDIO = 570000;

export default () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(0);

  const recordedBlobs = useRef([]);
  const recordingStartTime = useRef(null);
  const recordingStopTime = useRef(null);

  const segmentedAudioChunks = useRef([]);
  const microphone = useRef(null);
  const recorder = useRef(null);
  const analyser = useRef(null);
  const frequencyData = useRef(null);
  const elapsedRecordingTime = useRef(0);
  const animationPulse = useRef(null);
  const segmentationCheckInterval = useRef(null);

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
      segmentedAudioChunks.current.push(event.data);

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(segmentedAudioChunks.current, { type: "audio/mp3" });
      recordedBlobs.current.push(audioBlob);
      segmentedAudioChunks.current = [];
    }

    mediaRecorder.start(TIME_SLICE);
    recordingStartTime.current = Date.now();
    startContinuousSegmentationCheck();

    setIsPaused(false);
    setIsRecording(true);
    updateVolumeMeter();
  }

  function pauseRecording() {
    if (recorder.current && recorder.current.state !== "inactive") {
      recorder.current.pause();
      clearSegmentationCheckInterval()

      setIsPaused(true);
      setIsRecording(false);
      cancelVolumeAnimation();
      setVolume(0);
    }
  }

  function resumeRecording() {
    if (recorder.current && recorder.current.state !== "inactive") {
      recorder.current.resume();
      startContinuousSegmentationCheck();

      setIsPaused(false);
      setIsRecording(true);
      updateVolumeMeter();
    }
  }

  async function stopRecording(onRecordingStop) {
    if (recorder.current && recorder.current.state !== "inactive") {
      
      await recorder.current.stop();
      recordingStopTime.current = Date.now();
      clearSegmentationCheckInterval();

      if (microphone.current) {
        microphone.current.disconnect();
        microphone.current = null;
      }

      const audioBlob = new Blob(segmentedAudioChunks.current, { type: "audio/mp3" });
      recordedBlobs.current.push(audioBlob);
      segmentedAudioChunks.current = [];

      const data = {
        recordedBlobs: recordedBlobs.current,
        recordingStartTime: recordingStartTime.current,
        recordingStopTime: recordingStopTime.current,
      };

      setIsPaused(false);
      setIsRecording(false);
      cancelVolumeAnimation();
      setVolume(0);

      recordedBlobs.current = [];
      recordingStartTime.current = null;
      recordingStopTime.current = null;

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

  function startContinuousSegmentationCheck() {
    segmentationCheckInterval.current = setInterval(() => {
      elapsedRecordingTime.current += SEGMENTATION_VERIFICATION_TIME;
      if (elapsedRecordingTime.current >= TIME_SPLIT_AUDIO) {
        recorder.current.stop();
        recorder.current.start(TIME_SLICE);
        elapsedRecordingTime.current = 0;
      }
    }, SEGMENTATION_VERIFICATION_TIME);
  }

  function cancelVolumeAnimation() {
    if (animationPulse.current) {
      cancelAnimationFrame(animationPulse.current);
      animationPulse.current = null;
    }
  }

  function clearSegmentationCheckInterval() {
    if (segmentationCheckInterval.current) {
      clearInterval(segmentationCheckInterval.current);
      segmentationCheckInterval.current = null;
    }
  }

  useEffect(() => {
    return () =>  {
      cancelVolumeAnimation();
      clearSegmentationCheckInterval();
    }
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
