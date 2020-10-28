const videoElement = document.querySelector('video');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const videoSelectBtn = document.getElementById('videoSelectBtn');
videoSelectBtn.onclick = getVideoSources;
/*
startBtn.onclick = async() => {
    const inputSources = await desktopCapturer.getSources({
        types: ['window', 'screen']
    });
    console.log(inputSources);
};
*/
const { desktopCapturer, remote, dialog } = require('electron');
const { Menu } = remote;

//get avail video sources
async function getVideoSources(){
    const inputSources = await desktopCapturer.getSources({
        types: ['window', 'screen']
    });

    const videoOptionsMenu = Menu.buildFromTemplate(
        inputSources.map(source => {
            return {
                label: source.name,
                click: () => selectSource(source)
            };
        })
    );

    videoOptionsMenu.popup();
}

let mediaRecorder; // MediaRecorder instance to capture footage
const recordedChunks = [];

async function selectSource(source){
    videoSelectBtn.innerText = source.name;

    const constraints = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id
            }
        }
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    //preview the source in video element
    videoElement.srcObject = stream;
    videoElement.play();
    const options = {mimeType: 'video/webm; codecs=vp9'};
    mediaRecorder = new MediaRecorder(stream, options);

    //register event handlers
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;
}
    //capture all recorded chunks
    function handleDataAvailable(e){
        console.log('video data available');
        recordedChunks.push(e.data);
    }

const { writeFile } = require('fs'); //built in file system module for nodejs

    //save video file on stop
    async function handleStop(e){
        const blob = new Blob(recordedChunks, {
            type: 'video/webm; codecs=vp9'
        });
        const buffer = Buffer.from(await blob.arrayBuffer());
        const { filePath } = await dialog.showSaveDialog({
            buttonLabel: 'Save Video',
            defautPath: `vid-${Date.now()}.webm`
        });
        console.log(filePath);

        writeFile(filepath, buffer);
    }

                    