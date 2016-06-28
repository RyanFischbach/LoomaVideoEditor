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
	fileTypes: []
	, videoName: ""
	, videoTimes: []
	, videoText: []
	, filePaths: []
, }

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
	var cancelButton = document.getElementById("cancel");
	var editButton = document.getElementById("edit");
	var textButton = document.getElementById("text");
	var imageButton = document.getElementById("image");
	var pdfButton = document.getElementById("pdf");
	var submitButton = document.getElementById("submit");
	var nextFrameButton = document.getElementById("next-frame");
	var prevFrameButton = document.getElementById("prev-frame");

	// Text Area
	var textArea = document.getElementById("comments");

	// Image Preview Div
	var imagePreviewDiv = document.getElementById("image-previews");
	var imageOptionButtons = document.getElementsByClassName("image-option");

	// Sliders
	var seekBar = document.getElementById("seek-bar");
	var volumeBar = document.getElementById("volume-bar");
<<<<<<< Updated upstream
    
    // Other Variables
    var edited = false;
    var currentImage = null;
    var currentEdit = "";
    var currentText = null;
=======
>>>>>>> Stashed changes

	// Other Variables
	var edited = false;
	var currentImage = null;
	var currentEdit = "";

	// Fullscreen Button
	$('#fullscreen-control').click(function (e) {
		e.preventDefault();
		screenfull.toggle(video);
	});

	//Var for timeline
	var timelineImageHeight;
	var timelineImageWidth;

	// Event Listeners

	// Video Event Listener
	video.addEventListener('loadeddata', function () {
		var vidWidth = window.getComputedStyle(video).getPropertyValue("width");
		var videoArea = document.getElementById("video-area");
		videoArea.style.width = parseInt(vidWidth) + "px";

		var videoPlayer = document.getElementById("video-player");
		var timelineArea = document.getElementById("timeline-area");

		timelineArea.style.width = ((videoPlayer.offsetWidth / 2) - (video.offsetWidth / 2)) + "px";
		timelineArea.style.height = video.offsetHeight + "px";

		timelineImageWidth = (timelineArea.offsetWidth / 2) - 15;
		timelineImageHeight = timelineArea.offsetHeight / 6;
		/*var textArea = document.getElementById("comments");
		textArea.style.height = parseInt(vidHeight) + "px";
		textArea.style.width = parseInt(vidWidth) + "px"; */
	});

	// Play Button Event Listener
	playButton.addEventListener("click", function () {
		if (video.paused == true) {
			// Play the video
			video.play();

			// Update the button text to 'Pause'
			playButton.innerHTML = "Pause";


			if (edited == true) {
				show_image_timeline(thumbFile);
				edited = false;
			}
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
<<<<<<< Updated upstream
		if (editButton.innerHTML == "Save") 
        {
            // Hide Edit Controls
            cancelButton.style.display = "none";
            textButton.style.display = 'none';
            imageButton.style.display = "none";
            pdfButton.style.display = "none";
            textArea.style.display = 'none';
            submitButton.style.display = 'none';
            nextFrameButton.style.display = "none";
            prevFrameButton.style.display = "none";

            imagePreviewDiv.style.display = "none";
            
            
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
                    show_image_timeline(image_src);
                    edited = true;
                    image_src = null;
                }

            }

            // Send to server to save as a txt file
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
            editButton.style.display = "none";
            cancelButton.style.display = "inline";
            textButton.style.display = 'inline';
            imageButton.style.display = 'inline';
            pdfButton.style.display = "inline";
            nextFrameButton.style.display = "inline";
            prevFrameButton.style.display = "inline";

            // change the edit button to say save
            editButton.innerHTML = "Save";

            video.pause();

            // change the play-pause button to say play
            playButton.innerHTML = "Play";
        }

    });
    
    cancelButton.addEventListener("click", function () {
        // Hide Edit Controls
        cancelButton.style.display = "none";
        textButton.style.display = 'none';
        imageButton.style.display = "none";
        pdfButton.style.display = "none";
        textArea.style.display = 'none';
        submitButton.style.display = 'none';
        nextFrameButton.style.display = "none";
        prevFrameButton.style.display = "none";

        imagePreviewDiv.style.display = "none";
        
        // Redisplay media controls
        mediaControls.style.display = "block";
        
        // Redisplay edit button
        editButton.style.display = "inline";

        // change the edit button to say edit
        editButton.innerHTML = "Edit";

        video.pause();
        
        // Remove edits
        if (currentEdit == "text")
        {
            editsObj.fileTypes.pop();
            editsObj.videoTimes.pop();
            editsObj.videoText.pop();
            document.getElementById("timeline-area").removeChild(currentText);
            currentText = null;
        }
        else if (currentEdit == "image")
        {
            editsObj.fileTypes.pop();
            editsObj.videoTimes.pop();
            editsObj.filePaths.pop();
            
            //Removes image overlay
            if(currentImage != null)
            {
                document.getElementById("image-area").removeChild(currentImage);
                currentImage = null;
            }
        }
        else if (currentEdit == "pdf")
        {
            /*
            editsObj.fileTypes.pop();
            editsObj.videoTimes.pop();
            editsObj.filePaths.pop();
            */
        }
        
        currentEdit = "";
        //playButton.innerHTML = "Play";
    });
    
    // Event listener for the text button
=======
		if (editButton.innerHTML == "Save") {
			// Hide Edit Controls
			cancelButton.style.display = "none";
			textButton.style.display = 'none';
			imageButton.style.display = "none";
			pdfButton.style.display = "none";
			textArea.style.display = 'none';
			submitButton.style.display = 'none';
			nextFrameButton.style.display = "none";
			prevFrameButton.style.display = "none";

			imagePreviewDiv.style.display = "none";


			// Redisplay media controls
			mediaControls.style.display = "block";

			// change the edit button to say edit
			editButton.innerHTML = "Edit";

			video.pause();

			//Removes image overlay            
			if (editsObj.filePaths.length != 0) {
				if (image_src != null) {
					show_image_timeline(image_src);
					edited = true;
					image_src = null;
				}

			}

			// Send to server to save as a txt file
			$.ajax("looma-video-editor-textConverter.php", {
				data: editsObj
				, method: "POST"
			});
		} else {
			// Hide Media controls
			mediaControls.style.display = "none";

			// Display edit options
			editButton.style.display = "none";
			cancelButton.style.display = "inline";
			textButton.style.display = 'inline';
			imageButton.style.display = 'inline';
			pdfButton.style.display = "inline";
			nextFrameButton.style.display = "inline";
			prevFrameButton.style.display = "inline";

			// change the edit button to say save
			editButton.innerHTML = "Save";

			video.pause();

			// change the play-pause button to say play
			playButton.innerHTML = "Play";
		}

	});

	cancelButton.addEventListener("click", function () {
		// Hide Edit Controls
		cancelButton.style.display = "none";
		textButton.style.display = 'none';
		imageButton.style.display = "none";
		pdfButton.style.display = "none";
		textArea.style.display = 'none';
		submitButton.style.display = 'none';
		nextFrameButton.style.display = "none";
		prevFrameButton.style.display = "none";

		imagePreviewDiv.style.display = "none";

		// Redisplay media controls
		mediaControls.style.display = "block";

		// Redisplay edit button
		editButton.style.display = "inline";

		// change the edit button to say edit
		editButton.innerHTML = "Edit";

		video.pause();

		// Remove edits
		if (currentEdit == "text") {
			editsObj.fileTypes.pop();
			editsObj.videoTimes.pop();
			editsObj.videoText.pop();
		} else if (currentEdit == "image") {
			editsObj.fileTypes.pop();
			editsObj.videoTimes.pop();
			editsObj.filePaths.pop();

			//Removes image overlay
			if (currentImage != null) {
				document.getElementById("image-area").removeChild(currentImage);
				currentImage = null;
			}
		} else if (currentEdit == "pdf") {
			/*
			editsObj.fileTypes.pop();
			editsObj.videoTimes.pop();
			editsObj.filePaths.pop();
			*/
		}

		//playButton.innerHTML = "Play";
	});

	// Event listener for the text button
>>>>>>> Stashed changes
	textButton.addEventListener("click", function () {
		//Hide Controls
		cancelButton.style.display = "none";
		pdfButton.style.display = "none";
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
<<<<<<< Updated upstream
    
    pdfButton.addEventListener("click", function() {
       // Hide controls
        pdfButton.style.display = "none";
        textButton.style.display = "none";
        imageButton.style.display = "none";
        mediaControls.style.display = "none";
        nextFrameButton.style.display = "none";
        prevFrameButton.style.display = "none";
        
        // Show edit button
        editButton.style.display = "inline";
        
        // Update current edit state
        currentEdit = "pdf";
    });
    
    // Event listener for submit button
    submitButton.addEventListener("click", function () {
        // Redisplay Edit Controls
        cancelButton.style.display = "inline";
        editButton.style.display = "inline";
        
        // Update current edit state
        currentEdit = "text";
            
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
        
        //Add timeline display
        show_text_timeline(textArea.value);
        
        // return true for some reason
        return true;
    });
    
    // Event listener for image button
    imageButton.addEventListener("click", function () {

        // Hide Controls
        pdfButton.style.display = "none";
        textButton.style.display = "none";
        imageButton.style.display = "none";
        mediaControls.style.display = "none";
        nextFrameButton.style.display = "none";
        prevFrameButton.style.display = "none";
        
        // Show edit button
        editButton.style.display = "inline";
        
        // Update current edit state
        currentEdit = "image";

        // Show all images for images
        imagePreviewDiv.style.display = "block";
    });
    
    // Show image previews in timeline
    
    function show_image_timeline(src) {
        var img = document.createElement("img");
        img.src = src;
        img.width = timelineImageWidth;
        img.height = timelineImageHeight;
        document.getElementById("timeline-area").appendChild(img);
    }
    
    function show_text_timeline(message) {
        var text = document.createElement("textarea");
        text.value = message;
        text.style.width = timelineImageWidth + "px";
        text.style.height = timelineImageHeight + "px";
        text.style.resize = "none";
        text.style.color = "black";
        text.readOnly = "readOnly";
        currentText = text;
        document.getElementById("timeline-area").appendChild(text);
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
=======

	pdfButton.addEventListener("click", function () {
		// Hide controls
		pdfButton.style.display = "none";
		textButton.style.display = "none";
		imageButton.style.display = "none";
		mediaControls.style.display = "none";
		nextFrameButton.style.display = "none";
		prevFrameButton.style.display = "none";

		// Show edit button
		editButton.style.display = "inline";

		// Update current edit state
		currentEdit = "pdf";
	});

	// Event listener for submit button
	submitButton.addEventListener("click", function () {
		// Redisplay Edit Controls
		cancelButton.style.display = "inline";
		editButton.style.display = "inline";

		// Update current edit state
		currentEdit = "text";

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

		//Add timeline display
		show_text_timeline(textArea.value);

		// return true for some reason
		return true;
	});

	// Event listener for image button
	imageButton.addEventListener("click", function () {

		// Hide Controls
		pdfButton.style.display = "none";
		textButton.style.display = "none";
		imageButton.style.display = "none";
		mediaControls.style.display = "none";
		nextFrameButton.style.display = "none";
		prevFrameButton.style.display = "none";

		// Show edit button
		editButton.style.display = "inline";

		// Update current edit state
		currentEdit = "image";

		// Show all images for images
		imagePreviewDiv.style.display = "block";
	});

	// Show image previews in timeline

	function show_image_timeline(src) {
		var img = document.createElement("img");
		img.src = src;
		img.width = timelineImageWidth;
		img.height = timelineImageHeight;
		document.getElementById("timeline-area").appendChild(img);
	}

	function show_text_timeline(message) {
		var text = document.createElement("textarea");
		text.value = message;
		text.style.width = timelineImageWidth + "px";
		text.style.height = timelineImageHeight + "px";
		text.style.resize = "none";
		text.style.color = "black";
		text.readOnly = "readOnly";
		document.getElementById("timeline-area").appendChild(text);
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
>>>>>>> Stashed changes
});