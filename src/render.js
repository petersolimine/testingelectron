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
const { desktopCapturer, remote } = require('electron');
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
                    
}