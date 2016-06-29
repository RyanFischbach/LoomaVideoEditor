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

    // Image Preview Div
    var imagePreviewDiv = document.getElementById("image-previews");
    var imageOptionButtons = imagePreviewDiv.children;
    
    // PDF Preview Div
    var pdfPreviewDiv = document.getElementById("pdf-previews");
    var pdfOptionButtons = pdfPreviewDiv.children;

	// Sliders
	var seekBar = document.getElementById("seek-bar");
	var volumeBar = document.getElementById("volume-bar");
    
    // Other Variables
    var edited = false;
    var currentImage = null;
    var currentEdit = "";
    var currentText = null;
    var currentPdf = null;

	// Fullscreen Button
	$('#fullscreen-control').click(function (e) {
		e.preventDefault();
		screenfull.toggle(video);
	});

	//Var for timeline
	var timelineImageHeight;
	var timelineImageWidth;
    
    //Base zIndexs
    var baseImageZ = 2;
    var basePdfZ = 3;
    var baseTextZ = 4;
    var overlayZ = 5;
    
    //Overlay areas
    var pdfArea = document.getElementById("pdf-area");
    var imageArea = document.getElementById("image-area");
    var textArea = document.getElementById("comments");
    
    // Useful Functions
    function hideElements (elements)
    {
        for (var x = 0; x < elements.length; x++)
        {
            elements[x].style.display = "none";    
        }
    }

	// Event Listeners

	// Video Event Listener
	video.addEventListener('loadeddata', function () {
        //Sets the video-area to the size of the video by finding the calculated width of the video
		var vidWidth = window.getComputedStyle(video).getPropertyValue("width");
		var videoArea = document.getElementById("video-area");
		videoArea.style.width = parseInt(vidWidth) + "px";

		var videoPlayer = document.getElementById("video-player");
		var timelineArea = document.getElementById("timeline-area");
        
        //Makes the timline area fills the space to the left of the video
		timelineArea.style.width = ((videoPlayer.offsetWidth / 2) - (video.offsetWidth / 2)) + "px";
		timelineArea.style.height = video.offsetHeight + "px";
        
        //The timeline puts 1 image across leaving 30px for the scrollbar
		timelineImageWidth = timelineArea.offsetWidth - 30;
        //There can be 6 rows of images before a scrollbar is created
		timelineImageHeight = timelineArea.offsetHeight / 3;
	});

	// Play Button Event Listener
	playButton.addEventListener("click", function () {
		if (video.paused == true) {
			// Play the video
			video.play();

			// Update the button text to 'Pause'
			playButton.innerHTML = "Pause";

            //When the user hits play after making an edit it adds the thumbnail of the video to the timeline
			if (edited == true) {
				show_image_timeline(thumbFile);
				edited = false;
			}
            //If an image is showing it removes it
			if (currentImage != null) {
				imageArea.removeChild(currentImage);
				currentImage = null;
			}
            //If a pdf is showing it removes it
            if(currentPdf != null) {
                document.getElementById("pdf-area").removeChild(currentPdf);
                document.getElementById("pdf-area").style.zIndex = 3;
				currentPdf = null;
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
		if (editButton.innerHTML == "Save") 
        {
            // Hide Edit Controls
            var elements = [cancelButton, textButton, imageButton, pdfButton, submitButton, nextFrameButton, prevFrameButton, imagePreviewDiv, pdfPreviewDiv];
            hideElements(elements);
            
            // Redisplay media controls
            mediaControls.style.display = "block";

            // change the edit button to say edit
            editButton.innerHTML = "Edit";

            video.pause();

            //Displays perview for image          
            if(editsObj.filePaths.length != 0)
            {
                if(image_src != "")
                {
                    show_image_timeline(image_src);
                    edited = true;
                    image_src = "";
                }
                else if(pdf_src != "")
                {
                    show_image_timeline(pdf_src.substr(0, pdf_src.length - 4) + "_thumb.jpg");
                    edited = true;
                    pdf_src = "";
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
            hideElements([mediaControls, editButton]);
            
            // Display edit options
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
        hideElements([cancelButton, textButton, imageButton, pdfButton, textArea, submitButton, nextFrameButton, prevFrameButton, imagePreviewDiv, pdfPreviewDiv]);
        
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
                imageArea.removeChild(currentImage);
                currentImage = null;
            }
        }
        else if (currentEdit == "pdf")
        {
            
            editsObj.fileTypes.pop();
            editsObj.videoTimes.pop();
            editsObj.filePaths.pop();
            
        }
        
        currentEdit = "";
        //playButton.innerHTML = "Play";
    });
    
	// Event listener for the text button
	textButton.addEventListener("click", function () {
		//Hide Controls
        hideElements([cancelButton, pdfButton, textButton, imageButton, editButton, mediaControls, nextFrameButton, prevFrameButton]);

		// Clear Text Area
		textArea.value = "";

		// show the text area and submit button
		textArea.style.display = "inline";
		submitButton.style.display = "inline";
        
        imageArea.style.zIndex = baseImageZ;
        pdfArea.style.zIndex = basePdfZ;
        textArea.style.zIndex = overlayZ;
	});
    
    pdfButton.addEventListener("click", function() {
       // Hide controls
        hideElements([pdfButton, textButton, imageButton, mediaControls, nextFrameButton, prevFrameButton]);
        
        // Show edit button
        editButton.style.display = "inline";
        
        // Update current edit state
        currentEdit = "pdf";
        
        pdfPreviewDiv.style.display = "inline-block";
        
        textArea.style.zIndex = baseTextZ;
        imageArea.style.zIndex = baseImageZ;
        pdfArea.style.zIndex = overlayZ;
    });
    
    // Functions for showing pdf previews for selecting a pdf
    
    var pdf_src = "";
    for (var i = 0; i < pdfOptionButtons.length; i++)
    {
        pdfOptionButtons[i].addEventListener("click", function () {

            // Store the type of file
            editsObj.fileTypes.push("pdf");

            //this.style.display = "none";

            // Store the current video time
            editsObj.videoTimes.push(video.currentTime);

            pdf_src = $(this).data("fp") + $(this).data("fn");

            editsObj.filePaths.push(pdf_src);

            // Might not need this
            if (currentImage != null) {
                imageArea.removeChild(currentImage);
            }

            // Display pdf over video
            var pdf = document.createElement("iframe");
            pdf.src = pdf_src;
            pdfArea.style.zIndex = 5;
            currentPdf = pdf;
            pdfArea.appendChild(pdf);
        });
    }
    
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

        // don't show the submit button
        submitButton.style.display = "none";
        
        //Add timeline display
        show_text_timeline(textArea.value);
        edited = true;
        
        //If there is an image it removes it
        if (currentImage != null) {
            imageArea.removeChild(currentImage);
            currentImage = null;
        }
        // return true for some reason
        return true;
    });
    
    // Event listener for image button
    imageButton.addEventListener("click", function () {

        // Hide Controls
        hideElements([pdfButton, textButton, imageButton, mediaControls, nextFrameButton, prevFrameButton]);
        
        // Show edit button
        editButton.style.display = "inline";
        
        // Update current edit state
        currentEdit = "image";

        // Show all images for images
        imagePreviewDiv.style.display = "block";
        
        pdfArea.style.zIndex = basePdfZ;
        textArea.style.zIndex = baseTextZ
        imageArea.style.zIndex = overlayZ;
    });
    
    // Show image previews in timeline
    function show_image_timeline(src) {
        var img = document.createElement("img");
        img.src = src;
        img.width = timelineImageWidth;
        img.height = timelineImageHeight;
        document.getElementById("timeline-area").appendChild(img);
    }
    
    //Displays text box for timeline
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
    
    for (var i = 0; i < imageOptionButtons.length; i++) {
        imageOptionButtons[i].addEventListener("click", function () {

            // Store the type of file
            editsObj.fileTypes.push("image");

            //this.style.display = "none";

            // Store the current video time
            editsObj.videoTimes.push(video.currentTime);

            image_src = $(this).data("fp") + $(this).data("fn");
            //image_src = this.src;
            // image_name = this.name;

            editsObj.filePaths.push(image_src);
            //editsObj.fileNames.push(image_name);

            if (currentImage != null) {
                imageArea.removeChild(currentImage);
            }

            // Display image over video
            show_image_preview(image_src);
        });
    }
    
    //Shows the image over the video as a preview
    function show_image_preview(src) {
        var img = document.createElement("img");
        img.src = src;
        img.style.height = "100%";
        img.style.width = "100%";
        currentImage = img;
        imageArea.appendChild(img);
    }
    
    // nextFrameButton Event Listener
    nextFrameButton.addEventListener("click", function () {
        video.currentTime += (5 / 29.97);
    });
    
    // prevFrameButton Event Listener
    prevFrameButton.addEventListener("click", function () {
        video.currentTime -= (5 / 29.97);
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