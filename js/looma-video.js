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

// Arrays of Edited Video Information
var editsObj = {
    fileTypes: [],
    videoName: "",
    videoTimes: [],
    videoText: [],
    filePaths: [],
}

'use strict';
$(document).ready(function () {

    // Video
	var video = document.getElementById("video");
    
    // Buttons
    
    // Media Controls (play, mute, volume) 
    var mediaControls = document.getElementById("media-controls");
	var playButton = document.getElementById("play-pause");
	var muteButton = document.getElementById("mute");
    
    // Edit Controls
	var editButton = document.getElementById("edit");
	var textButton = document.getElementById("text");
    var submitButton = document.getElementById("submit");
    var nextFrameButton = document.getElementById("next-frame");
    var prevFrameButton = document.getElementById("prev-frame");

	// Text Area
	var textArea = document.getElementById("comments");
	//var rectangle = document.getElementById("rectangle");

    // Image Preview Div
    var imagePreviewDiv = document.getElementById("image-previews");
    var imageButton = document.getElementById("image");
    var imageOptionButtons = document.getElementsByClassName("image-option");
	
	// Sliders
	var seekBar = document.getElementById("seek-bar");
	var volumeBar = document.getElementById("volume-bar");
    
    // Other Variables
    var edited = false;
    var currentImage = null;

    // Fullscreen Button
	$('#fullscreen-control').click(function (e) {
		e.preventDefault();
		screenfull.toggle(video);
	});
    
    // Event Listeners
    
    // Video Event Listener
    video.addEventListener('loadeddata', function () {
        var vidWidth = window.getComputedStyle(video).getPropertyValue("width");
        var videoArea = document.getElementById("video-area");
        videoArea.style.width = parseInt(vidWidth) + "px"; 
        
        /*var textArea = document.getElementById("comments");
        textArea.style.height = parseInt(vidHeight) + "px";
        textArea.style.width = parseInt(vidWidth) + "px"; */
    });

	// Play Button Event Listener
	playButton.addEventListener("click", function () {
        if (video.paused == true) 
        {
            // Play the video
            video.play();

            // Update the button text to 'Pause'
            playButton.innerHTML = "Pause";
            
            /*
            if(edited == true)
            {
                show_image_timeline(thumbFile, 150, 90);
                edited = false;
            }
            if(currentImage != null)
            {
                document.getElementById("image-area").removeChild(currentImage);
                currentImage = null;
            }*/        
        } 
        else 
        {
            // Pause the video
            video.pause();

            // Update the button text to 'Play'
            playButton.innerHTML = "Play";
        }
	});

	// Event listener for the mute button
	muteButton.addEventListener("click", function () {
		if (video.muted == false)
        {
			// Mute the video
			video.muted = true;

			// Update the button text
			muteButton.innerHTML = "Unmute";
		}
        else 
        {
			// Unmute the video
			video.muted = false;

			// Update the button text
			muteButton.innerHTML = "Mute";
		}
	});

	// Event listener for the edit button
	editButton.addEventListener("click", function () {
		if (editButton.innerHTML == "Done") 
        {
            // Hide Edit Controls
            textButton.style.display = 'none';
            imageButton.style.display = "none";
            textArea.style.display = 'none';
            submitButton.style.display = 'none';
            nextFrameButton.style.display = "none";
            prevFrameButton.style.display = "none";

            imagePreviewDiv.style.display = "none";
            
            if(edited == true)
            {
                show_image_timeline(thumbFile, 150, 90);
                edited = false;
            }
            if(currentImage != null)
            {
                document.getElementById("image-area").removeChild(currentImage);
                currentImage = null;
            }
            
            // Redisplay media controls
            mediaControls.style.display = "block";

            // change the edit button to say edit
            editButton.innerHTML = "Edit";

            video.pause();

            //Removes image overlay            
            if(editsObj.filePaths.length != 0)
            {
                if(image_src != null)
                {
                    show_image_timeline(image_src, 150, 90);
                    edited = true;
                    image_src = null;
                }

            }

            //var jsonString = JSON.stringify(editsObj);
            //console.log(editsObj.filePaths[0]);
            $.ajax("looma-video-editor-textConverter.php", {
                data: editsObj,
                method: "POST"
            });
        } 
		else
		{
            // Hide Media controls
            mediaControls.style.display = "none";
            
            // Display edit options
            textButton.style.display = 'inline';
            imageButton.style.display = 'inline';
            nextFrameButton.style.display = "inline";
            prevFrameButton.style.display = "inline";

            // change the edit button to say done
            editButton.innerHTML = "Done";

            video.pause();

            // change the play-pause button to say play
            playButton.innerHTML = "Play";
        }

    });
    
    // Event listener for the text button
	textButton.addEventListener("click", function () {
		//Hide Controls
        textButton.style.display = "none";
        imageButton.style.display = "none";
        editButton.style.display = "none";
        mediaControls.style.display = "none";
        nextFrameButton.style.display = "none";
        prevFrameButton.style.display = "none";
        
        // Clear Text Area
        textArea.value = "";

		// show the text area and submit button
		textArea.style.display = "inline";
		submitButton.style.display = "inline";
	});
    
    // Event listener for submit button
    submitButton.addEventListener("click", function () {
        // Redisplay Edit Controls
        editButton.style.display = "inline";
        /*
        textButton.style.display = "inline";
        imageButton.style.display = "inline";
        nextFrameButton.style.display = "inline";
        prevFrameButton.style.display = "inline";
        */
            
        // get text from text area
        var text = textArea.value;
            
        // Store the current video time in the array of video times
        editsObj.videoTimes.push(video.currentTime);
        
        // Store the type of file
        editsObj.fileTypes.push("text");

        // Push the text onto the array of edited video text
        editsObj.videoText.push(text);

        // don't show the submit button and text area
        submitButton.style.display = "none";
        textArea.style.display = "none";
        
        // return true for some reason
        return true;
    });
    
    // Event listener for image button
    imageButton.addEventListener("click", function () {

        // Hide Controls
        textButton.style.display = "none";
        imageButton.style.display = "none";
        mediaControls.style.display = "none";
        nextFrameButton.style.display = "none";
        prevFrameButton.style.display = "none";

        // Show all images for images
        imagePreviewDiv.style.display = "block";
    });
    
    // Show image previews in timeline
    
    function show_image_timeline(src, width, height) {
        var img = document.createElement("img");
        img.src = src;
        img.width = width;
        img.height = height;
        document.getElementById("timeline-area").appendChild(img);
    }
    
    // Functions for showing image previews for selecting an image
    
    var image_src = "";
    // var image_name = "";
    for (var i = 0; i < imageOptionButtons.length; i++) {
        imageOptionButtons[i].addEventListener("click", function () {

            // Store the type of file
            editsObj.fileTypes.push("image");

            //this.style.display = "none";

            // Store the current video time
            editsObj.videoTimes.push(video.currentTime);

            image_src = this.src;
            // image_name = this.name;

            editsObj.filePaths.push(image_src);
            //editsObj.fileNames.push(image_name);

            if (currentImage != null) {
                document.getElementById("image-area").removeChild(currentImage);
            }

            // Display image over video
            show_image_preview(image_src);
        });
    }

    function show_image_preview(src) {
        var img = document.createElement("img");
        img.src = src;
        img.style.height = "100%";
        img.style.width = "100%";
        /*
        img.width = '480';
        img.height = '270';
        */
        currentImage = img;
        document.getElementById("image-area").appendChild(img);
    }
    
    // nextFrameButton Event Listener
    nextFrameButton.addEventListener("click", function () {
        video.currentTime += (1 / 29.97);
    });
    
    // prevFrameButton Event Listener
    prevFrameButton.addEventListener("click", function () {
        video.currentTime -= (1 / 29.97);
    });

    // Event listener for the seek bar
    seekBar.addEventListener("change", function () {
        // Calculate the new time
        var time = video.duration * (seekBar.value / 100);

        // Update the video time
        video.currentTime = time;
        
        video.pause();
        
        playButton.innerHTML = "Play";
    });

    // Update the seek bar as the video plays
    video.addEventListener("timeupdate", function () {
        // Calculate the slider value
        var value = (100 / video.duration) * video.currentTime;

        // Update the slider value
        seekBar.value = value;
    });

    // Pause the video when the slider handle is being dragged
    seekBar.addEventListener("mousedown", function () {
        video.pause();
    });

    // Play the video when the slider handle is dropped
    seekBar.addEventListener("mouseup", function () {
        video.play();
    });

    // Event listener for the volume bar
    volumeBar.addEventListener("change", function () {
        // Update the video volume
        video.volume = volumeBar.value;
    });
});