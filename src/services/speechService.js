import api from "../api/api";
import { firebaseUserToken } from "../firebase/auth";

async function transcribeAudio(audioURL) {
  const token = await firebaseUserToken();
  const response = await api.post(
    `/speech/transcribe`,
    { audioURL },
    {
      headers: { Authorization: token },
      timeout: 120000
    }
  );
  return response.data;
}

async function reduceTranscript(transcript) {
  const token = await firebaseUserToken();
  const response = await api.post(
    `/speech/reduce`,
    { transcript },
    {
      headers: { Authorization: token },
      timeout: 120000
    }
  );
  return response.data;
}

async function summarizeTranscript(transcript) {
  const token = await firebaseUserToken();
  const response = await api.post(
    `/speech/summary`,
    { transcript },
    {
      headers: { Authorization: token },
      timeout: 120000
    }
  );
  return response.data;
}

async function transcribeMultipleAudios(audioURLs) {
  if (!Array.isArray(audioURLs)) throw new Error("Audio URLs is not Array.");

  const promises = audioURLs.map((url) => transcribeAudio(url));
  const response = await Promise.all(promises);

  return response;
}

async function reduceMultipleTranscripts(transcripts) {
  if (!Array.isArray(transcripts)) throw new Error("Transcripts is not Array.");

  const promises = transcripts.map((transcript) => reduceTranscript(transcript));
  const response = await Promise.all(promises);

  return response;
}

export {
  transcribeAudio,
  reduceTranscript,
  summarizeTranscript,
  transcribeMultipleAudios,
  reduceMultipleTranscripts,
};
