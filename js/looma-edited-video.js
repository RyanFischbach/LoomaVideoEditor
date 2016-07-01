/*
 * Name: Skip, Aaron, Connor, Ryan
Email: skip@stritter.com
Owner: VillageTech Solutions (villagetechsolutions.org)
Date: 2016 07
Revision: Looma Video Editor 0.1

filename: looma-edited-video.js
Description: Controls all interactions with an edited video, called by looma-edited-video.php
Attribution: File copied fronm looma-video.js
 */

'use strict';
$(document).ready(function () {
	

	// Video
	var video = document.getElementById("video");

	// Buttons
	var playButton = document.getElementById("play-pause");
	var muteButton = document.getElementById("mute");
    var deleteButton = document.getElementById("delete");

	// Sliders
	var seekBar = document.getElementById("seek-bar");
	var volumeBar = document.getElementById("volume-bar");

	var videoArea = document.getElementById("video-area");
	var textDiv = document.getElementById("text-box-area");
	var textArea = document.getElementById("text-playback");
    var pdfArea = document.getElementById("pdf-area");

	var currentImage = null;
    var currentPdf = null;
    var currentOverlaidVideo = null;
    
    var endTime;
	
	var isFullscreen = false;
	$('#fullscreen-control').click(function (e) {
		if(!isFullscreen)
		{
		isFullscreen = true;
		e.preventDefault();
		screenfull.toggle(videoArea);
		videoArea.className = "fullscreen";
		videoArea.style.width = "100%";
		}
		else
		{
		isFullscreen = false;
		e.preventDefault();
		screenfull.toggle(videoArea);
		videoArea.className = "";
//		setTimeout(function() {
//			var vidWidth = window.getComputedStyle(video).getPropertyValue("width");
//			videoArea.style.width = parseInt(vidWidth) + "px";
//		}, 1000);
		}
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
                    textDiv.style.zIndex = 4;
                    pdfArea.style.zIndex = 3;
                    
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
                    //Adds a pdf to pdfArea
                    commands.fileTypes.splice(0, 1);
                    show_pdf(commands.filePaths[0]);
                    commands.filePaths.splice(0, 1);
                    video.pause();
					playButton.innerHTML = "Play";
                    textDiv.style.zIndex = 3;
                    pdfArea.style.zIndex = 4;
                }
                else if (commands.fileTypes[0] == "video") {
                    //Overlays a video inside of OverlaidVideoArea
                    console.log(commands.filePaths[0]);
                    commands.fileTypes.splice(0, 1);
                    video.pause();  
                    var startTime = commands.videoTimes[0];
                    endTime = commands.videoTimes[1];
                    commands.videoTimes.splice(0, 2);
                    var overlaidVideo = document.createElement("video");
                    overlaidVideo.src = commands.filePaths[0];
                    commands.filePaths.splice(0, 1);
                    currentOverlaidVideo = overlaidVideo;
                    document.getElementById("overlaid-video-area").appendChild(overlaidVideo);
                    overlaidVideo.currentTime = startTime;
                    playButton.innerHTML = "Play";
                }
			}
            else {
                
//				if (!video.paused) {
//                    window.requestAnimationFrame(checkTime);
//				}
                
			}
            
		}
        if(currentOverlaidVideo != null) {
            console.log("1");
            console.log(currentOverlaidVideo.paused);
            if(currentOverlaidVideo.paused == false) {
                console.log("2");
                // Calculate the slider value
                var value = (100 / currentOverlaidVideo.duration) * currentOverlaidVideo.currentTime;

                // Update the slider value
                seekBar.value = value;

                if(currentOverlaidVideo.currentTime >= endTime) {
                    document.getElementById("overlaid-video-area").removeChild(currentOverlaidVideo);
                    currentOverlaidVideo = null;
                    playButton.innerHTML = "Play";
                }
                else {
//                    window.requestAnimationFrame(checkTime);
                }
            }
        }
		window.requestAnimationFrame(checkTime);
		//Fullscreen Stuff
		if (!isFullscreen) {
			var vidWidth = window.getComputedStyle(video).getPropertyValue("width");
			videoArea.style.width = parseInt(vidWidth) + "px";
		}
		
	}
    
    function show_pdf(src) {
        var pdf = document.createElement("iframe");
        pdf.src = src;
        currentPdf = pdf;
        pdfArea.appendChild(pdf);
    }


	video.addEventListener('loadeddata', function () {
		var vidWidth = window.getComputedStyle(video).getPropertyValue("width");
		videoArea.style.width = parseInt(vidWidth) + "px";
		console.log(parseInt(vidWidth));
	});

	// Event listener for the play/pause button
	playButton.addEventListener("click", function () {
        if(currentOverlaidVideo != null) {
            if (currentOverlaidVideo.paused == true) {
                // Play the video
                currentOverlaidVideo.play();

                // Update the button text to 'Pause'
                playButton.innerHTML = "Pause";
                
                //Keeps checking for new things
                window.requestAnimationFrame(checkTime);
            } 
            else {
                // Pause the video
                currentOverlaidVideo.pause();

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
                    pdfArea.removeChild(currentPdf);
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
        if(currentOverlaidVideo != null) {
            if (currentOverlaidVideo.muted == false) {
                // Mute the video
                currentOverlaidVideo.muted = true;

                // Update the button text
                muteButton.innerHTML = "Unmute";
            } 
            else {
                // Unmute the video
                currentOverlaidVideo.muted = false;

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
        if(currentOverlaidVideo != null) {
            // Calculate the new time
            var time = currentOverlaidVideo.duration * (seekBar.value / 100);

            // Update the video time
            currentOverlaidVideo.currentTime = time;

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
        // Calculate the slider value
        var value = (100 / video.duration) * video.currentTime;
        
        // Update the slider value
        seekBar.value = value;
        
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
    
    deleteButton.addEventListener("click", function () {
        $.ajax({
            url:'looma-delete-edited-video.php', 
            data: {fileSrc: fileSrc}, 
            method:'POST',
        });
        window.location = 'looma-library.php';
    });
});