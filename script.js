let mediaRecorder;
let audiosChunks = [];

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

        mediaRecorder.onstop = (_ => {
            console.log("Gravação finalizada.");
            const audioBlob = new Blob(audiosChunks, { type: "audio/wav" });
            const audioURL = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioURL);
            audio.play();
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