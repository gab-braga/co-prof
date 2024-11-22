let mediaRecorder;
let audiosChunks = [];

const API_KEY = '';

async function transcriber(audio) {
  const formData = new FormData();
  formData.append('file', audio);
  formData.append('model', 'whisper-1');
  formData.append('language', 'pt');
  formData.append('response_format', 'json');
  formData.append('temperature', '0');

  const response = await fetch(
    'https://api.openai.com/v1/audio/transcriptions',
    {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    },
  );

  return await response.json();
}

async function summarize(text) {
  const prompt = `Por favor, resuma o texto a seguir destacando dois tópicos: \"Visão Geral\" e \"Pontos Principais\". Confira o texto: \"${text}\".`;
  const data = {
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    max_completion_tokens: 300,
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    body: data,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  const summary = await response.json();
  console.log(summary);
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      audiosChunks.push(event.data);
    };

    mediaRecorder.onstart = (_) => {
      console.log('Gravação iniciada.');
    };

    mediaRecorder.onstop = async () => {
      console.log('Gravação finalizada.');
      const audioBlob = new Blob(audiosChunks, { type: 'audio/wav' });
      const audioURL = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioURL);

      document.write('Transcrevendo...');
      audio.play();

      const transcription = await transcriber(audioBlob);
      console.log(transcription);
      document.write(transcription.text);

      audiosChunks = [];
    };

    mediaRecorder.start();
  } catch (err) {
    console.error(err);
  }
}

const btnStart = document.querySelector('.btn-start');
const btnStop = document.querySelector('.btn-stop');
const btnTest = document.querySelector('.btn-test');

btnStart.addEventListener('click', () => startRecording());
btnStop.addEventListener('click', () => mediaRecorder.stop());

btnTest.addEventListener('click', () => {
  summarize(
    'Meu nome é Gabriel e estou trabalhando nesse projeto o dia inteiro. O projeto que estamos trabalhando é muito importante para o cliente. Por favor, vamos nos esforçar.',
  );
});
