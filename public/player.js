(function(){

    document.addEventListener('DOMContentLoaded', function(){
    
    // player variables
    var video = document.getElementById('video');
    var playBtn = document.getElementById('play-button');
    var progressbar = document.getElementById('progressbar');
    var progressbarContainer = document.getElementById('progressbar-container');
    var timeField = document.getElementById('time-field');
    var soundGroup = document.getElementById('sound-group');
    var soundBtn = document.getElementById('sound-button');
    var soundbar = document.getElementById('soundbar');
    var soundbarContainer = document.getElementById('soundbar-container');
    var fullscreen = document.getElementById('fullscreen-button');
    var mainPlayButton = document.getElementById('main-play-button');
    var mainPlayContainer = document.getElementById('main-play-container');

    // remove default browser's controls
    video.removeAttribute('controls');

    // add all listeners
    playBtn.addEventListener('click', playOrPause, false);
    video.addEventListener('canplay', updateProgressbar, false);
    video.addEventListener('timeupdate', updateProgressbar, false);
    progressbarContainer.addEventListener('click', rewindVideo, false);
    soundBtn.addEventListener('click', toggleMute, false);
    soundbarContainer.addEventListener('click', changeVolume, false);
    soundBtn.addEventListener('mouseover', function(){
        soundbarContainer.style.display = 'inline-block';
    }, false);
    soundGroup.addEventListener('mouseleave', function(){
        soundbarContainer.style.display = 'none';
    }, false);
    fullscreen.addEventListener('click', makeFullscreen, false);
    mainPlayButton.addEventListener('click', playOrPause, false);

    if(Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource('http://www.streambox.fr/playlists/x36xhzz/x36xhzz.m3u8');        
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED,function() {
            playOrPause();
        });
    };

    function playOrPause(){
        if(video.paused){
            video.play();
            changeBtnImage(playBtn, 'images/pause.png');
            mainPlayContainer.style.display = 'none';
        }else{
            video.pause();
            changeBtnImage(playBtn, 'images/play.png');
        }
    };

    function changeBtnImage(btn, source){
        btn.src = source;
    };

    function updateProgressbar(){
        var percentage = (video.currentTime/video.duration) * 100;
        progressbar.style.width = percentage + '%';
        timeField.innerHTML = getFormattedTime(video.currentTime) + ' / ' + getFormattedTime(video.duration);

        if(video.ended){
            changeBtnImage(playBtn, 'images/replay.png');
        }else if(video.paused){
            changeBtnImage(playBtn, 'images/play.png');
        }
    };

    function rewindVideo(event){
        var coordX = event.pageX - progressbarContainer.offsetLeft;
        var width = parseFloat(window.getComputedStyle(progressbarContainer).getPropertyValue('width'));
        video.currentTime = (coordX/width) * video.duration;
    };

    function getFormattedTime(time){
        var totalSeconds = Math.round(time);
        var totalHours = Math.floor(totalSeconds/3600);
        var totalMinutes = Math.floor(totalSeconds/60);

        if(totalHours > 0){
            var mitutes = Math.floor((totalSeconds - totalHours * 3600)/60);
            var seconds = totalSeconds - (totalHours * 3600 + minutes * 60);
            minutes = minutes > 9? minutes : '0' + minutes;
            seconds = seconds > 9? seconds : '0' + seconds;
            return totalHours + ':' + minutes + ':' + seconds;              
        }

        if(totalMinutes > 0){
            var seconds = totalSeconds - totalMinutes * 60;
            seconds = seconds > 9? seconds : '0' + seconds;
            return totalMinutes + ':' + seconds;
        }

        totalSeconds = totalSeconds > 9? totalSeconds : '0' + totalSeconds;
        return '0:' + totalSeconds; 
    };

    function toggleMute(){
        if(!video.muted){
            video.muted = true;
            changeBtnImage(soundBtn, 'images/mute.png');
            soundbar.style.display = 'none';
        }else{
            video.muted = false;
            changeBtnImage(soundBtn, 'images/sound.png');
            soundbar.style.display = 'block';
        }
    };

    function changeVolume(event){
        var coordX = event.pageX - soundbarContainer.offsetLeft;
        var width = parseFloat(window.getComputedStyle(soundbarContainer).getPropertyValue('width'));
        video.volume = coordX/width;
        soundbar.style.width = coordX/width * 100 + '%';
        soundbar.style.display = 'block';

        if(video.muted && video.volume > 0){
            video.muted = false;
            changeBtnImage(soundBtn, 'images/sound.png');
        }
    };

    function makeFullscreen(){
        if(video.requestFullscreen){
            video.requestFullscreen();
        }else if(video.webkitRequestFullScreen){
            video.webkitRequestFullScreen();
        }else if(video.mozRequestFullScreen){
            video.mozRequestFullScreen();
        }else if(video.msRequestFullScreen){
            video.msRequestFullScreen();
        }
    };

}, false);

})();