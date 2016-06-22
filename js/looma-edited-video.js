/*
 * Name: Skip, Aaron, Connor, Ryan
Email: skip@stritter.com
Owner: VillageTech Solutions (villagetechsolutions.org)
Date: 2016 06
Revision: Looma Video Editor 0.1

filename: looma-video.js
Description: videoplayer controls for videoplayer.php
Attribution: heavily borrowed from Matt West (blog.teamtreehouse.com)
 */

'use strict';
$(document).ready(function() {

  // Video
  var video = document.getElementById("video");

  // Buttons
  var playButton = document.getElementById("play-pause");
  var muteButton = document.getElementById("mute");

  // Sliders
  var seekBar = document.getElementById("seek-bar");
  var volumeBar = document.getElementById("volume-bar");
  
  var videoArea = document.getElementById("video-area");
  var div = document.getElementById("text-box-area");
  var textArea = document.getElementById("text-playback");
    
  var currentImage;

  $('#fullscreen-control').click(function (e) {
      e.preventDefault();
      screenfull.toggle(video);
  });


  video.addEventListener('loadeddata', function (){
        var vidHeight = video.videoHeight;
        var vidWidth = video.videoWidth;
        var textArea = document.getElementById("comments");
        div.style.height = parseInt(vidHeight) + "px";
        div.style.width = parseInt(vidWidth) + "px";
      
        videoArea.style.height = parseInt(vidHeight) + "px";
        videoArea.style.width = parseInt(vidWidth) + "px";
    });

// Event listener for the play/pause button
playButton.addEventListener("click", function() {
  if (video.paused == true) {
    // Play the video
    video.play();

    // Update the button text to 'Pause'
    playButton.innerHTML = "Pause";
      
    //Stop showing the textbox or the image
    textArea.style.display = "none";
      
    if (currentImage != null) {
        document.getElementById("image-area").removeChild(currentImage);
        currentImage = null;
    }
  } else {
    // Pause the video
    video.pause();

    // Update the button text to 'Play'
    playButton.innerHTML = "Play";
  }
});

// Event listener for the mute button
muteButton.addEventListener("click", function() {
  if (video.muted == false) {
    // Mute the video
    video.muted = true;

    // Update the button text
    muteButton.innerHTML = "Unmute";
  } else {
    // Unmute the video
    video.muted = false;

    // Update the button text
    muteButton.innerHTML = "Mute";
  }
});

// Event listener for the seek bar
seekBar.addEventListener("change", function() {
  // Calculate the new time
  var time = video.duration * (seekBar.value / 100);

  // Update the video time
  video.currentTime = time;
});

// Update the seek bar as the video plays
video.addEventListener("timeupdate", function() {
  // Calculate the slider value
  var value = (100 / video.duration) * video.currentTime;

  // Update the slider value
  seekBar.value = value;
    
  if(commands.videoTimes.length > 0){
    //While there are still annotatins in the video
    if(commands.videoTimes[0] <= video.currentTime)
    {
        //If we have passed the time stamp for the next annotation 
        //play check the type and delete that time stamp
        commands.videoTimes.splice(0, 1);
        if(commands.fileTypes[0] == "text")
        { 
            //If the type is a text file create a overlay and put the text there and pause the video
            commands.fileTypes.splice(0,1);
            var message = commands.videoText[0];
            commands.videoText.splice(0, 1);
            textArea.value = message;
            textArea.style.display = 'inline-block';
            video.pause();
            playButton.innerHTML = "Play";
        }
        else if(commands.fileTypes[0] == "image") 
        {
            commands.fileTypes.splice(0,1);
            show_image(commands.filePaths[0], 480, 270, "I just love images!")
            commands.filePaths.splice(0,1);
            video.pause();
            playButton.innerHTML = "Play";
        }
    }
  }
  
});
    
function show_image(src, width, height, alt) {
    var img = document.createElement("img");
    img.src = src;
    img.width = width;
    img.height = height;
    img.alt = alt;
    currentImage = img;
    document.getElementById("image-area").appendChild(img);
}

// Pause the video when the slider handle is being dragged
seekBar.addEventListener("mousedown", function() {
  video.pause();
});

// Event listener for the volume bar
volumeBar.addEventListener("change", function() {
  // Update the video volume
  video.volume = volumeBar.value;
});
});