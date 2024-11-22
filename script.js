let mediaRecorder;
let audiosChunks = [];

async function transcriber(audio) {
    const formData = new FormData();
    formData.append("file", audio);
    formData.append("model", "whisper-1");
    formData.append("language", "pt");
    formData.append("response_format", "json");
    formData.append("temperature", "0");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        body: formData,
        headers: {
            Authorization: "Bearer ..."
        }
    });

    return response.json();
}


async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event => {
            audiosChunks.push(event.data);
        });

        mediaRecorder.onstart = (_ => {
            console.log("Gravação iniciada.");
        });

        mediaRecorder.onstop = (async () => {
            console.log("Gravação finalizada.");
            const audioBlob = new Blob(audiosChunks, { type: "audio/wav" });
            const audioURL = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioURL);
            
            document.write("Transcrevendo...");
            audio.play();

            const transcription = await transcriber(audioBlob);
            console.log(transcription);
            document.write(transcription.text)
            
            audiosChunks = [];
        });

        mediaRecorder.start()
    } catch (err) {
        console.error(err);
    }
}

const btnStart = document.querySelector(".btn-start");
const btnStop = document.querySelector(".btn-stop");

btnStart.addEventListener("click", () => startRecording());
btnStop.addEventListener("click", () => mediaRecorder.stop());