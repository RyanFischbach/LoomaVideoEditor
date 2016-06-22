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
    fileTypes : [],
    videoName : "",
    videoTimes : [],
    videoText : [],
    filePaths : [],
    fileNames : []
}
    
'use strict';
$(document).ready(function () {

	// Video
	var video = document.getElementById("video");
    
    video.addEventListener('loadeddata', function (){
        var vidHeight = video.videoHeight;
        var vidWidth = video.videoWidth;
        var videoArea = document.getElementById("video-area");
        videoArea.style.height = parseInt(vidHeight) + "px";
        videoArea.style.width = parseInt(vidWidth) + "px";
        
        var textArea = document.getElementById("comments");
        textArea.style.height = parseInt(vidHeight) + "px";
        textArea.style.width = parseInt(vidWidth) + "px";
    });
    
	// Media Controls (play, mute, volume) 
    var mediaControls = document.getElementById("video-controls");
    
    // Image Preview Div
    var imagePreviewDiv = document.getElementById("image-previews");
    
    // Buttons
	var playButton = document.getElementById("play-pause");
	var muteButton = document.getElementById("mute");
	var editButton = document.getElementById("edit");
	var textButton = document.getElementById("text");
    var imageButton = document.getElementById("image");
    var imageOptionButtons = document.getElementsByClassName("imageOption");
	var submitButton = document.getElementById("submit");

	// Form
	var form = document.getElementById("comments");
	var rectangle = document.getElementById("rectangle");

	// Don't Show Text Button, Submit Button, Form
	textButton.style.display = 'none';
    imageButton.style.display = 'none';
	submitButton.style.display = 'none';
	form.style.display = 'none';
	rectangle.style.display = 'none';

	// Sliders
	var seekBar = document.getElementById("seek-bar");
	var volumeBar = document.getElementById("volume-bar");
    
    var edited = false;

	$('#fullscreen-control').click(function (e) {
		e.preventDefault();
		screenfull.toggle(video);
	});

	// Event listener for the play/pause button
	playButton.addEventListener("click", function () {
    if (video.paused == true) {
        // Play the video
        video.play();

        // Update the button text to 'Pause'
        playButton.innerHTML = "Pause";
            
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
    } 
    else {
        // Pause the video
        video.pause();

        // Update the button text to 'Play'
        playButton.innerHTML = "Play";
    }
	});

	// Event listener for the mute button
	muteButton.addEventListener("click", function () {
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
	editButton.addEventListener("click", function () {
		if (editButton.innerHTML == "Done") {
			
            // Hide Edit Controls
			textButton.style.display = 'none';
            form.style.display = 'none';
            submitButton.style.display = 'none';
            
            imagePreviewDiv.style.display = "none";
            
            // redisplay media controls
            mediaControls.style.display = "block";

			// change the edit button to say edit
			editButton.innerHTML = "Edit";

			video.pause();
            
            //Removes image overlay
            
            if(editsObj.filePaths.length != 0)
            {
                show_image_timeline(image_src, 150, 90);
                edited = true;
            }
            
            //var jsonString = JSON.stringify(editsObj);
			//console.log(editsObj);
			$.ajax("looma-video-editor-textConverter.php", {data : editsObj});
		} 
		else //if(editButton.innerHTML == "Done")
		{
            // display edit options
			textButton.style.display = 'inline';
            imageButton.style.display = 'inline';

			// change the edit button to say done
			editButton.innerHTML = "Done";

			video.pause();

			// change the play-pause button to say play
			playButton.innerHTML = "Play";
		}
		
	});
    
    function show_image_timeline(src, width, height) {
        var img = document.createElement("img");
        img.src = src;
        img.width = width;
        img.height = height;
        document.getElementById("timeline-area").appendChild(img);
    }

	// Event listener for the text button
	textButton.addEventListener("click", function () {
		//Hide Controls
        textButton.style.display = "none";
        imageButton.style.display = "none";
        editButton.style.display = "none";
        
        // Clear Text Area
        var textArea = document.getElementById("comments");
        textArea.value = "";

		// show the form and submit button
		form.style.display = "inline";
		submitButton.style.display = "inline";
        
		
	});
    
    // Event listener for image button
    imageButton.addEventListener("click", function () {
        
        // Hide Controls
        textButton.style.display = "none";
        imageButton.style.display = "none";
        mediaControls.style.display = "none";
        
        // Show all images for images
        imagePreviewDiv.style.display = "block";
    });
    
    var image_src = "";
    for (var i = 0; i < imageOptionButtons.length; i++)
    {
        imageOptionButtons[i].addEventListener("click", function () {
            
            // Store the type of file
            editsObj.fileTypes.push("image");
                
            this.style.display = "none";
                
            // Store the current video time
            editsObj.videoTimes.push(video.currentTime);
        
            image_src = this.src;
            editsObj.filePaths.push(image_src);
            console.log(image_src);
            
            editsObj.filePaths.push(image_src);
            
            // Display image over video
            show_image_preview(image_src);
        });
    }
    
    function show_image_preview(src) {
        var img = document.createElement("img");
        img.src = src;
        img.width = '480';
        img.height = '270';
        currentImage = img;
        document.getElementById("image-area").appendChild(img);
    }
    
    // Event listener for submit button
    submitButton.addEventListener("click", function () {
        // Redisplay Controls
        editButton.style.display = "inline";
        textButton.style.display = "inline";
        imageButton.style.display = "inline";
        mediaControls.style.display = "block";
            
        // get text from form
        var text = document.getElementById("comments").value;
            
        // Store the current video time in the array of video times
        editsObj.videoTimes.push(video.currentTime);
        
        // Store the type of file
        editsObj.fileTypes.push("text");

        // Push the text onto the array of edited video text
        editsObj.videoText.push(text);

        // don't show the submit button and form
        submitButton.style.display = "none";
        form.style.display = "none";
        
        // return true for some reason
        return true;
    });

	// Event listener for the seek bar
	seekBar.addEventListener("change", function () {
		// Calculate the new time
		var time = video.duration * (seekBar.value / 100);

		// Update the video time
		video.currentTime = time;
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