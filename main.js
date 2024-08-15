// import playlist
import playlist from './audio.js';



// play button
const playBtn = document.querySelector(".play");
// next button
const nextBtn = document.querySelector('.next');
// previous button
const prevBtn = document.querySelector('.prev');
// img
const img = document.querySelector('.details img');
// soura-name
const souraName = document.querySelector('.soura-name');
// reader
const reader = document.querySelector('.reader');
// current volume value
const currentVolume = document.querySelector('.current-volume');
// mute sound
const muteIcon = document.querySelector('.volume i');
// input range to change volume value
const volumeRange = document.querySelector('.volumeValue');
// play all soura
const playAll = document.querySelector('.play-all');
// soura time beginning
const timeBegining = document.querySelector('.begin');
// soura end time duration
const endDuration = document.querySelector('.end-duration');
// soura time input range
const souraTime = document.querySelector('.soura-time');
// humberger icon
const humbergerIcon = document.querySelector('.fa-bars');
// close icon
const close = document.querySelector('.fa-times');
// playlist-div
const playlistDiv = document.querySelector('.playlist-div');
// playlist of soura
const playlistSoura = document.querySelector('.playlist');









let check = 0;
let num = 0;
let mutedChecking = 0;
let checkingPlayAll = 0;
let s = false;
let startIncreasingSec = 0;
let startIncreasingMin = 0;







// create audio element
const audio = document.createElement('audio');






// getsoura function
function getSoura(num){
    let souraDetails = playlist[num];
    img.src = souraDetails.souraImage;
    souraName.textContent = 'سورة' + ' ' + souraDetails.souraName;
    reader.textContent = souraDetails.souraReader + ' ' + 'القارئ';
    audio.src = souraDetails.souraPath;
    audio.load();
};
getSoura(num);









// to add soura detail in playlist
function customData(){
    for(let i=0; i < playlist.length; i++){
        let div = document.createElement('div');
        div.classList.add('soura');
        div.id = i;
        div.innerHTML = `
            <span>${i + 1} - </span>
            <p>سورة ${playlist[i].souraName}</p>
        `;
        playlistSoura.appendChild(div);
    }
};
customData();

playlistSoura.addEventListener('click' , selectSoura);


// select soura from playlist
function selectSoura(e){
    let selectedEle = e.target.classList.contains('soura');
    if(selectedEle){
        const selectedId = e.target.id;
        getSoura(selectedId);
        audio.play();
        playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
        HidePlayList();
    }
};















// events
playBtn.addEventListener('click' , startOrPauseSoura);
nextBtn.addEventListener('click' , nextSoura);
prevBtn.addEventListener('click' , prevSoura);
volumeRange.addEventListener('change' , changeVolume);
muteIcon.addEventListener('click' , muteSound);
playAll.addEventListener('click' , playAllSoura);
souraTime.addEventListener('change' , changeSouraTime);
audio.addEventListener('timeupdate' , displayTime);
humbergerIcon.addEventListener('click' , showPlayList);
close.addEventListener('click' , HidePlayList);







// get next soura
function nextSoura(){
    // reset check to start from begin
    check = 0;
    // reset to play icon on new soura
    resetPlayIcon();
    // reset input range of soura time to 0
    souraTime.value = 0;
    // reset two variables
    startIncreasingSec = 0;
    startIncreasingMin = 0;
    if(num === playlist.length - 1){
        num = 0;
        getSoura(num);
    } else{
        num++;
        getSoura(num);
    }
};



// get previous soura
function prevSoura(){
    // reset check to start from begin
    check = 0;
    // reset to play icon on new soura
    resetPlayIcon();
    // reset input range of soura time to 0
    souraTime.value = 0;
    // reset two variables
    startIncreasingSec = 0;
    startIncreasingMin = 0;
    // timeBegin();
    if(num <= 0){
        num = playlist.length - 1;
        getSoura(num);
    } else{
        num--;
        getSoura(num);
    }
};


// start or pause soura 
function startOrPauseSoura(){
    if(check === 0){
        playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
        audio.play();
        check = 1;
    } else {
        playBtn.innerHTML = `<i class="fas fa-play"></i>`;
        audio.pause();
        check = 0;
    }
};

// reset play icon on new soura
function resetPlayIcon(){
    playBtn.innerHTML = `<i class="fas fa-play"></i>`;
}

// change volume value
function changeVolume(){
    let valueOfVolume = volumeRange.value / 100;
    audio.volume = valueOfVolume;
    currentVolume.textContent = volumeRange.value;
};



// switching of muted sound and not
function muteSound(){
    if(mutedChecking === 0){
        audio.muted = true;
        mutedChecking = 1;
    } else{
        audio.muted = false;
        mutedChecking = 0;
    }
};



// play all soura
function playAllSoura(){
    if(checkingPlayAll === 0){
        playAll.style.background = '#af5700';
        // loopHappen();
        checkingPlayAll = 1;
    } else{
        playAll.style.background = '#eee';
        checkingPlayAll = 0;
    } 
};




// change soura time
function changeSouraTime(){
    let timePoistion = (souraTime.value * audio.duration ) / 100;
    audio.currentTime = timePoistion;
};







// step of change
function displayTime(){
    if(audio.duration){
        let startMin = Math.floor(audio.currentTime / 60);
        let startSec = Math.floor(audio.currentTime - (startMin * 60));
        let durMin = Math.floor(audio.duration / 60);
        let durSec = Math.floor(audio.duration - (durMin * 60));
        if(startMin < 10){
            startMin = '0' + startMin;
        }
        if(startSec < 10){
            startSec = '0' + startSec;
        }
        if(durMin < 10){
            durMin = '0' + durMin;
        }
        if(durSec < 10){
            durSec = '0' + durSec;
        }
        timeBegining.textContent = startMin + ':' + startSec;
        endDuration.textContent = durMin + ':' + durSec;


        // moving step of slider of soura time
        let timeStep = (audio.currentTime * 100) / (audio.duration);
        souraTime.value = timeStep; 

        // loop happen if audio in end of length with enable play all soura
        if(audio.currentTime === audio.duration && checkingPlayAll === 1){
            nextSoura();
            startOrPauseSoura();
        };
        // if audio in end of length without enabling play all soura
        if(audio.currentTime === audio.duration && checkingPlayAll === 0){
            souraTime.value = 0;
            playBtn.innerHTML = `<i class="fas fa-play"></i>`;
            timeBegining.textContent = '00' + ':' + '00';
            endDuration.textContent = '00' + ':' + '00'; 
        }

    } else{
        // if event updatetime not happen
        timeBegining.textContent = '00' + ':' + '00';
        endDuration.textContent = '00' + ':' + '00'; 
    }
};



// show playlist
function showPlayList(){
    playlistDiv.style.transform = 'translateX(0)';
};



// hide playlist
function HidePlayList(){
    playlistDiv.style.transform = 'translateX(-100%)';
};


