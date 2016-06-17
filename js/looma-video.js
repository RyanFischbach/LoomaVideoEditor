/*
 * Name: Skip
Email: skip@stritter.com
Owner: VillageTech Solutions (villagetechsolutions.org)
Date: 2015 03
Revision: Looma 2.0.0

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
  var editButton = document.getElementById("edit");
  var textButton = document.getElementById("text");
	
  // Text button doesn't show up
  textButton.style.display = 'none';
	
  var submitButton = docuent.getElementById("submit");

  submitButton.style.display = 'none';
	
  var form = document.getElementById("comments");
	
  form.style.display = 'none';
	
  // Arrays of video annotation information
  var editedVideoTime = [];
  var editedVideoText = [];

  // Sliders
  var seekBar = document.getElementById("seek-bar");
  var volumeBar = document.getElementById("volume-bar");

        $('#fullscreen').click(function (e) {
                e.preventDefault();
                screenfull.toggle(this);
            });
//

// Event listener for the play/pause button
playButton.addEventListener("click", function() {
  if (video.paused == true) {
    // Play the video
    video.play();

    // Update the button text to 'Pause'
    playButton.innerHTML = "Pause";
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
	
// Event listener for the edit button
editButton.addEventListener("click", function() {
	if(editButton.innerHTML == "Edit")
	{
		// display the text box
		textButton.style.display = 'inline';
		
		// change the edit button to say done
		editButton.innerHTML = "Done";
		
		video.pause();	
		
		// change the play-pause button to say play
		playButton.innerHTML = "Play";
	}
	else // editButton.innerHTML == "Done"
	{
		var object = {type: "text", title: "$document", timeArray: editedVideoTime, 
				  textArray: editedVideoText};
		
		var jsonString = json.stringify(object);
		
		
		// don't display the text box
		textButton.style.display = 'none';
		
		// change the edit button to say edit
		editButton.innerHTML = "Edit";	
		
		video.pause();
	}
});

// Event listener for the text button
textButton.addEventListener("click", function() {
	// store the current video time in the array of video times
	editedVideoTime.push(video.currentTime);
	
	form.style.display = 'inline';
	
	submitButton.style.display = 'inline';
	
	submitButton.addEventListener("click", function(){
		
		var text = document.getElementById("comments");
		editedVideoText.push(text);
		return true;
	})
	
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
});

// Pause the video when the slider handle is being dragged
seekBar.addEventListener("mousedown", function() {
  video.pause();
});

// Play the video when the slider handle is dropped
seekBar.addEventListener("mouseup", function() {
  video.play();
});

// Event listener for the volume bar
volumeBar.addEventListener("change", function() {
  // Update the video volume
  video.volume = volumeBar.value;
});
});