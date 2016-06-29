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
$(document).ready(function () {

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

	var currentImage = null;
    var currentPdf = null;
    var currentOverlayedVideo = null;
    
    var endTime;

	$('#fullscreen-control').click(function (e) {
		e.preventDefault();
		screenfull.toggle(videoArea);
	});

	function checkTime() {
		if (commands.videoTimes.length > 0) {
			//While there are still annotatins in the video
			if (commands.videoTimes[0] <= video.currentTime) {
				//If we have passed the time stamp for the next annotation 
				//play check the type and delete that time stamp
				commands.videoTimes.splice(0, 1);
				if (commands.fileTypes[0] == "text") {
					//If the type is a text file create a overlay and put the text there and pause the video
					commands.fileTypes.splice(0, 1);
					var message = commands.videoText[0];
					commands.videoText.splice(0, 1);
					textArea.value = message;
					textArea.style.display = 'inline-block';
					video.pause();
					playButton.innerHTML = "Play";
				} 
                else if (commands.fileTypes[0] == "image") {
					commands.fileTypes.splice(0, 1);

					if (currentImage != null) {
						document.getElementById("image-area").removeChild(currentImage);
					}

					show_image(commands.filePaths[0], "Image not found");
					commands.filePaths.splice(0, 1);
					video.pause();
					playButton.innerHTML = "Play";
				}
                else if (commands.fileTypes[0] == "pdf") {
                    show_pdf(commands.filePaths[0]);
                    video.pause();
					playButton.innerHTML = "Play";
                }
                else if (commands.fileTypes[0] == "video") {
                    video.pause();  
                    var startTime = commands.videoTimes[0];
                    endTime = commands.videoTimes[1];
                    commands.videoTimes.splice(0, 2);
                    var overlayedVideo = document.createElement("video");
                    overlayedVideo.src = commands.filePaths[0];
                    commands.filePaths.splice(0, 1);
                    currentOverlayedVideo = overlayedVideo;
                    document.getElementById("overlayed-video-area").appendChild(overlayedVideo);
                    overlayedVideo.currentTime = startTime;
                    playButton.innerHTML = "Play";
                }
			} 
            else {
                
				if (!video.paused) {
                    window.requestAnimationFrame(checkTime);
				}
                
			}
            
		}
        if(currentOverlayedVideo != null) {
            if(currentOverlayedVideo.currentTime >= endTime) {
                document.getElementById("overlayed-video-area").removeChild(currentOverlayedVideo);
                currentOverlayedVideo = null;
                playButton.innerHTML = "Play";
            }
            else {
                window.requestAnimationFrame(checkTime);
            }
        }
	}
    
    function show_pdf(src) {
        var pdf = document.createElement("iframe");
        pdf.src = src;
        currentPdf = pdf;
        document.getElementById("pdf-area").appendChild(pdf);
    }


	video.addEventListener('loadeddata', function () {
		/*var vidHeight = video.videoHeight;
		var vidWidth = video.videoWidth;
		var textArea = document.getElementById("comments");
		div.style.height = parseInt(vidHeight) + "px";
		div.style.width = parseInt(vidWidth) + "px";

		videoArea.style.height = parseInt(vidHeight) + "px";
		videoArea.style.width = parseInt(vidWidth) + "px";*/

		var vidWidth = window.getComputedStyle(video).getPropertyValue("width");
		videoArea.style.width = parseInt(vidWidth) + "px";
	});

	// Event listener for the play/pause button
	playButton.addEventListener("click", function () {
        if(currentOverlayedVideo != null) {
            if (currentOverlayedVideo.paused == true) {
                // Play the video
                currentOverlayedVideo.play();

                // Update the button text to 'Pause'
                playButton.innerHTML = "Pause";
                
                
            } 
            else {
                // Pause the video
                currentOverlayedVideo.pause();

                // Update the button text to 'Play'
                playButton.innerHTML = "Play";
                
                //Keeps checking for new things
                window.requestAnimationFrame(checkTime);
            }
        }
        else {
            if (video.paused == true) {
                // Play the video
                video.play();

                // Update the button text to 'Pause'
                playButton.innerHTML = "Pause";

                //Stop showing the textbox or the image
                textArea.style.display = "none";

                //Keeps checking for new things
                window.requestAnimationFrame(checkTime);

                if(currentImage != null) {
				    document.getElementById("image-area").removeChild(currentImage);
				    currentImage = null;
                }
                if(currentPdf != null) {
                    document.getElementById("pdf-area").removeChild(currentPdf);
				    currentPdf = null;
                }
            } 
            else {
                // Pause the video
                video.pause();

                // Update the button text to 'Play'
                playButton.innerHTML = "Play";
            }
        }
	});

	// Event listener for the mute button
	muteButton.addEventListener("click", function () {
        if(currentOverlayedVideo != null) {
            if (currentOverlayedVideo.muted == false) {
                // Mute the video
                vcurrentOverlayedVideo.muted = true;

                // Update the button text
                muteButton.innerHTML = "Unmute";
            } 
            else {
                // Unmute the video
                currentOverlayedVideo.muted = false;

                // Update the button text
                muteButton.innerHTML = "Mute";
		    }
        }
        else {
            if (video.muted == false) {
                // Mute the video
                video.muted = true;

                // Update the button text
                muteButton.innerHTML = "Unmute";
            } 
            else {
                // Unmute the video
                video.muted = false;

                // Update the button text
                muteButton.innerHTML = "Mute";
		    }
        }
	});

	// Event listener for the seek bar
	seekBar.addEventListener("change", function () {
        if(currentOverlayedVideo != null) {
            // Calculate the new time
            var time = currentOverlayedVideo.duration * (seekBar.value / 100);

            // Update the video time
            currentOverlayedVideo.currentTime = time;

            playButton.innerHTML = "Play"
        }
        else {
            // Calculate the new time
            var time = video.duration * (seekBar.value / 100);

            // Update the video time
            video.currentTime = time;

            playButton.innerHTML = "Play"

            var moddedBackup = JSON.parse(JSON.stringify(commandsBackup));
            commands = moddedBackup;
            var counter = 0;
            for (var i = 0; i < commands.videoTimes.length; i++) {
                if (commands.videoTimes[i] < time) {
                    counter++;
                }
            }

            for (var z = 0; z < counter; z++) {
                commands.videoTimes.splice(0, 1);
                if (commands.fileTypes[0] == "text") {
                    commands.fileTypes.splice(0, 1);
                    commands.videoText.splice(0, 1);
                } else {
                    commands.fileTypes.splice(0, 1);
                    commands.filePaths.splice(0, 1);
                }
            }
        }
	});

	// Update the seek bar as the video plays
	video.addEventListener("timeupdate", function () {
        if(currentOverlayedVideo != null) {
            // Calculate the slider value
            var value = (100 / currentOverlayedVideo.duration) * video.currentTime;

            // Update the slider value
            seekBar.value = value;
        }
        else {
            // Calculate the slider value
            var value = (100 / video.duration) * video.currentTime;

            // Update the slider value
            seekBar.value = value;
        }
	});

	function show_image(src, alt) {
		var img = document.createElement("img");
		img.src = src;
		//img.width = 100%;
		//img.height = 100%;
		img.alt = alt;
		img.setAttribute("id", "image-overlay");
		currentImage = img;
		document.getElementById("image-area").appendChild(img);
	}

	// Pause the video when the slider handle is being dragged
	seekBar.addEventListener("mousedown", function () {
		video.pause();
	});

	// Event listener for the volume bar
	volumeBar.addEventListener("change", function () {
		// Update the video volume
		video.volume = volumeBar.value;
	});
});