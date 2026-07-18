import './style.css'

document.querySelector('#app').innerHTML = `
<div id="app-container">

    <video id="video-player" playsinline></video>

    <input
        id="video-upload"
        type="file"
        accept="video/*"
    >

    <div id="strike-zone">
        <div id="resize-handle"></div>
    </div>


    <div id="timeline-container">

    <div id="time-display">
        0:00 / 0:00
    </div>
  

    <div id="video-info">


    FPS: 30

</div>

   

    <input
        id="timeline"
        type="range"
        min="0"
        max="100"
        value="0"
    >

</div>


    <div id="controls">

        <button id="upload-button">Upload</button>

        <button id="frame-back">◀ Frame</button>

        <button id="play-button">▶</button>

        <button id="frame-forward">Frame ▶</button>

        <button id="speed-button">1x</button>

        <button id="fullscreen-button">⛶</button>

    </div>


    <div id="play-overlay">▶</div>

</div>
`;
// =====================
// VIDEO PLAYER
// =====================

const video = document.getElementById("video-player");
const upload = document.getElementById("video-upload");


let videoFPS = 30;


document.getElementById("upload-button").onclick = () => {
    upload.click();
};


upload.onchange = () => {

    const file = upload.files[0];

    if(file){

        video.src = URL.createObjectURL(file);

    }

};


const playButton =
document.getElementById("play-button");


function togglePlay(){

    if(!video.src) return;


    if(video.paused){

        video.play();

    }
    else{

        video.pause();

    }

}


playButton.onclick = togglePlay;

video.onclick = togglePlay;



const overlay =
document.getElementById("play-overlay");


function flashIcon(){

    overlay.classList.add("show");


    setTimeout(()=>{

        overlay.classList.remove("show");

    },150);

}



video.addEventListener("play",()=>{

    playButton.textContent="⏸";

    flashIcon();

});


video.addEventListener("pause",()=>{

    playButton.textContent="▶";

    flashIcon();

});



// =====================
// FULLSCREEN
// =====================


document
.getElementById("fullscreen-button")
.onclick=()=>{


const container =
document.getElementById("app-container");


if(!document.fullscreenElement){

    container.requestFullscreen();

}
else{

    document.exitFullscreen();

}


};



// =====================
// STRIKE ZONE
// =====================


const strikeZone =
document.getElementById("strike-zone");


const resizeHandle =
document.getElementById("resize-handle");



let savedZone =
JSON.parse(localStorage.getItem("ALVPR-zone"));



if(savedZone){

    strikeZone.style.left =
    savedZone.left+"%";

    strikeZone.style.top =
    savedZone.top+"%";

    strikeZone.style.width =
    savedZone.width+"%";

    strikeZone.style.height =
    savedZone.height+"%";

}



function saveZone(){

    localStorage.setItem(
        "ALVPR-zone",
        JSON.stringify({

            left:
            parseFloat(strikeZone.style.left),

            top:
            parseFloat(strikeZone.style.top),

            width:
            parseFloat(strikeZone.style.width),

            height:
            parseFloat(strikeZone.style.height)

        })
    );

}



// =====================
// DRAGGING
// =====================


let dragging=false;

let startX;
let startY;

let startLeft;
let startTop;



strikeZone.addEventListener(
"pointerdown",
(e)=>{


if(e.target===resizeHandle)
return;


dragging=true;


startX=e.clientX;

startY=e.clientY;


startLeft=
strikeZone.offsetLeft;


startTop=
strikeZone.offsetTop;



strikeZone.setPointerCapture(
e.pointerId
);


});



strikeZone.addEventListener(
"pointermove",
(e)=>{


if(!dragging)
return;


const container =
document
.getElementById("app-container")
.getBoundingClientRect();



let left =
((startLeft + e.clientX-startX)
/
container.width)*100;


let top =
((startTop + e.clientY-startY)
/
container.height)*100;



left=Math.max(0,Math.min(70,left));

top=Math.max(0,Math.min(75,top));



strikeZone.style.left=
left+"%";


strikeZone.style.top=
top+"%";



});



strikeZone.addEventListener(
"pointerup",
()=>{

dragging=false;

saveZone();

});



// =====================
// RESIZE
// =====================


let resizing=false;


let startWidth;
let startHeight;



resizeHandle.addEventListener(
"pointerdown",
(e)=>{


e.stopPropagation();


resizing=true;


startX=e.clientX;

startY=e.clientY;


startWidth=
strikeZone.offsetWidth;


startHeight=
strikeZone.offsetHeight;



resizeHandle.setPointerCapture(
e.pointerId
);


});



resizeHandle.addEventListener(
"pointermove",
(e)=>{


if(!resizing)
return;


const container =
document
.getElementById("app-container")
.getBoundingClientRect();



let width =
((startWidth + e.clientX-startX)
/
container.width)*100;



let height =
((startHeight + e.clientY-startY)
/
container.height)*100;



width=Math.max(10,Math.min(80,width));

height=Math.max(10,Math.min(70,height));



strikeZone.style.width=
width+"%";


strikeZone.style.height=
height+"%";



});



resizeHandle.addEventListener(
"pointerup",
()=>{

resizing=false;

saveZone();

});
// ===============================
// AL VPR REPLAY CONTROLS
// ===============================

const frameBack =
document.getElementById("frame-back");

const frameForward =
document.getElementById("frame-forward");

const speedButton =
document.getElementById("speed-button");


// Move video by frames

function moveFrame(direction){

  if(!video.src) return;

  video.pause();


  let newTime =
  video.currentTime + (direction / videoFPS);


  if(newTime < 0){

      newTime = 0;

  }


  if(newTime > video.duration){

      newTime = video.duration;

  }


  video.currentTime = newTime;

}

// Previous frame

frameBack.onclick = () => {

    moveFrame(-1);

};


// Next frame

frameForward.onclick = () => {

    moveFrame(1);

};


// Speed control

const speeds = [
    0.25,
    0.5,
    1,
    1.5,
    2
];


let speedIndex = 2;


speedButton.onclick = () => {

    speedIndex++;


    if(speedIndex >= speeds.length){

        speedIndex = 0;

    }


    video.playbackRate =
    speeds[speedIndex];


    speedButton.textContent =
    speeds[speedIndex] + "x";

};
// ===============================
// AL VPR TIMELINE
// ===============================

const timeline =
document.getElementById("timeline");


// When video loads

video.addEventListener("loadedmetadata",()=>{

    timeline.max =
    video.duration;

});


// Move slider while playing

video.addEventListener("timeupdate",()=>{

    timeline.value =
    video.currentTime;

});


// Drag timeline

timeline.oninput = ()=>{

    video.currentTime =
    timeline.value;

};

// ===============================
// AL VPR TIME DISPLAY
// ===============================

const timeDisplay =
document.getElementById("time-display");


function formatTime(seconds){

    if(isNaN(seconds)) return "0:00";

    let minutes =
    Math.floor(seconds / 60);

    let secs =
    Math.floor(seconds % 60);

    if(secs < 10){

        secs = "0" + secs;

    }

    return minutes + ":" + secs;

}


function updateTimeDisplay(){

    timeDisplay.textContent =
    formatTime(video.currentTime)
    +
    " / "
    +
    formatTime(video.duration);

}


video.addEventListener(
"timeupdate",
updateTimeDisplay
);


video.addEventListener(
"loadedmetadata",
updateTimeDisplay
);

const frameDisplay =
document.getElementById("frame-display");


function updateFrameCounter(){

    if(video.readyState >= 2){

        frameDisplay.textContent =
        "Frame: " +
        Math.floor(video.currentTime * videoFPS);

    }


    video.requestVideoFrameCallback(
        updateFrameCounter
    );

}


// Start frame tracking

video.addEventListener("loadeddata",()=>{

    updateFrameCounter();

});

// ===============================
// AL VPR VIDEO INFO
// ===============================


const videoInfo =
document.getElementById("video-info");


function updateVideoInfo(){

    if(videoInfo){

        videoInfo.textContent =
        "FPS: "
        + videoFPS
        +
        " | Frame: "
        +
        Math.round(video.currentTime * videoFPS)
        +
        " | Time: "
        +
        video.currentTime.toFixed(2)
        +
        "s";

    }


}


video.addEventListener(
"timeupdate",
updateVideoInfo
);


video.addEventListener(
"loadedmetadata",
updateVideoInfo
);