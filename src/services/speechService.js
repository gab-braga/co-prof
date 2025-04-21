import api from "../api/api";
import { firebaseUserToken } from "../firebase/auth";

async function transcribeAudio(audioURL) {
  const token = await firebaseUserToken();
  const response = await api.post(
    `/speech/transcribe`,
    { audioURL },
    {
      headers: { Authorization: token },
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

export { transcribeAudio, transcribeMultipleAudios };
