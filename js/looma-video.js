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
    var mainVideoSrc = document.getElementById("video-source").src;

	// Buttons

	// Media Controls (play, mute, volume) 
	var mediaControls = document.getElementById("media-controls");
	var playButton = document.getElementById("play-pause");
	var muteButton = document.getElementById("mute");

	// Edit Controls
    var renameButton = document.getElementById("rename");
    var renameButtonLineBreak = document.getElementById("rename-line-break");
	var cancelButton = document.getElementById("cancel");
	var editButton = document.getElementById("edit");
	var textButton = document.getElementById("text");
	var imageButton = document.getElementById("image");
	var pdfButton = document.getElementById("pdf");
    var videoButton = document.getElementById("video-button");
	var submitButton = document.getElementById("submit");
	var nextFrameButton = document.getElementById("next-frame");
	var prevFrameButton = document.getElementById("prev-frame");
    
    // Edit Controls - Adding a video
    var addStartTimeButton = document.getElementById("start-time");
    var addStopTimeButton = document.getElementById("stop-time");
    var startTime = 0;
    var stopTime = 0;
    
    // Edit Controls - Renaming a video
    var didSave = false;    // Set to true after user saves one time
    var didRename = false;
    var renameFormDiv = document.getElementById("rename-form-div");
    var renameInput = document.getElementById("rename-text");
    var renameSubmitButton = document.getElementById("rename-form-submit-button");
    //var oldName = "/Applications/AMPPS/www/content" + mainVideoSrc.substring(mainVideoSrc.lastIndexOf("/videos/")) + ".txt";
    var oldName = editsObj.videoName;

    // Image Preview Div
    var imagePreviewDiv = document.getElementById("image-previews");
    var imageOptionButtons = imagePreviewDiv.children;
    
    // PDF Preview Div
    var pdfPreviewDiv = document.getElementById("pdf-previews");
    var pdfOptionButtons = pdfPreviewDiv.children;
    
    // Video Preview Div
    var videoPreviewDiv = document.getElementById("video-previews");
    var videoOptionButtons = videoPreviewDiv.children;

	// Sliders
	var seekBar = document.getElementById("seek-bar");
	var volumeBar = document.getElementById("volume-bar");
    
    // File Sources
    var image_src = "";
    var pdf_src = "";
    var video_src = "";
    
    // Other Variables
    var edited = false;
    var currentImage = null;
    var currentEdit = "";
    var currentText = null;
    var currentPdf = null;
    var currentAddedVideo = null;

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
    var baseAddedVideoZ = 4;
    var baseTextZ = 5;
    var overlayZ = 6;
    
    //Overlay areas
    var pdfArea = document.getElementById("pdf-area");
    var imageArea = document.getElementById("image-area");
    var textBoxArea = document.getElementById("text-box-area");
    var textArea = document.getElementById("comments");
    var addedVideoArea = document.getElementById("added-video-area");
    
    // Useful Functions
    function hideElements (elements)
    {
        for (var x = 0; x < elements.length; x++)
        {
            elements[x].style.display = "none";    
        }
    }
    
    function disableButton (button)
    {
        button.disabled = true;
        button.style.opacity = "0.7";
    }
    
    function enableButton (button)
    {
        button.disabled = "false";
        button.style.opacity = "1";
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
        if(currentAddedVideo != null)
        {
            if (currentAddedVideo.paused == true) 
            {
                // Play the video
                currentAddedVideo.play();

                // Update the button text to 'Pause'
                playButton.innerHTML = "Pause";
                
                
            } 
            else 
            {
                // Pause the video
                currentAddedVideo.pause();

                // Update the button text to 'Play'
                playButton.innerHTML = "Play";
            }
        }
        else 
        {
            if (video.paused == true)
            {
                // Play the video
                video.play();

                // Update the button text to 'Pause'
                playButton.innerHTML = "Pause";

                //When the user hits play after making an edit it adds the thumbnail of the video to the timeline
                if (edited == true)
                {
				    show_image_timeline(thumbFile);
				    edited = false;
                }
                //If an image is showing it removes it
                if (currentImage != null)
                {
				    imageArea.removeChild(currentImage);
				    currentImage = null;
                }
                //If a pdf is showing it removes it
                if(currentPdf != null) {
                    document.getElementById("pdf-area").removeChild(currentPdf);
                    document.getElementById("pdf-area").style.zIndex = 3;
				    currentPdf = null;
                }
                textArea.style.display = "none";
            }
            else 
            {
                // Pause the video
                video.pause();

                // Update the button text to 'Play'
                playButton.innerHTML = "Play";
            }
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
    
    renameButton.addEventListener("click", function () {
        // Rename video
        hideElements([renameButton, renameButtonLineBreak, cancelButton, textButton, imageButton, pdfButton, videoButton, submitButton, nextFrameButton, prevFrameButton]);
        renameFormDiv.style.display = "block";
    });
    
    renameSubmitButton.addEventListener("click", function () {   
            hideElements([renameFormDiv]);
            
            mediaControls.style.display = "block";
            editButton.style.display = "inline";
        
            var newName = renameInput.value;
            
            $.ajax("looma-rename-edited-video.php", {
                data: {oldPath: oldName, newPath: newName},
                method: "POST"
            });
        
            oldName = newName;
            return true;
    });

	// Event listener for the edit button
	editButton.addEventListener("click", function () {
		if (editButton.innerHTML == "Save") 
        {   
            if (!didSave)
            {
                didSave = true;        
            }
            // Hide Edit Controls
            var elements = [renameButton, renameButtonLineBreak, cancelButton, textButton, imageButton, pdfButton, videoButton, submitButton, nextFrameButton, prevFrameButton, imagePreviewDiv, pdfPreviewDiv, videoPreviewDiv, addStartTimeButton, addStopTimeButton];
            hideElements(elements);
            
            // Redisplay media controls
            mediaControls.style.display = "block";
            document.getElementById("volume").style.display = "inline";
            volumeBar.style.display = "inline";
            muteButton.style.display = "inline";

            // change the edit button to say edit
            editButton.innerHTML = "Edit";

            video.pause();

            //Displays preview for image          
            
                if(image_src != "")
                {
                    editsObj.fileTypes.push("image");
                    editsObj.videoTimes.push(video.currentTime);
                    editsObj.filePaths.push(image_src);
                    show_image_timeline(image_src);
                    edited = true;
                    image_src = "";
                }
                else if(pdf_src != "")
                {
                    editsObj.fileTypes.push("pdf");
                editsObj.videoTimes.push(video.currentTime);
                editsObj.filePaths.push(pdf_src);
                    
                    show_image_timeline(pdf_src.substr(0, pdf_src.length - 4) + "_thumb.jpg");
                    edited = true;
                    pdf_src = "";
                }
                else if (video_src != "")
                {
                    // Store the type of file
                editsObj.fileTypes.push("video");
                // Store the current video time
                editsObj.videoTimes.push(video.currentTime);
                editsObj.filePaths.push(video_src);
                
                if (currentAddedVideo != null)
                    {
                        // Send start and end time for video
                        editsObj.videoTimes.push(startTime);
                        editsObj.videoTimes.push(stopTime);    
                    }
                    
                    // Stop Showing Added Video
                    addedVideoArea.removeChild(currentAddedVideo);
                    currentAddedVideo = null;
                    
                    
                    show_image_timeline(video_src.substr(0, video_src.length - 4) + "_thumb.jpg");
                    edited = true;
                    video_src = "";
                }
            
            currentEdit = "";


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
            if (didSave)
            {
                renameButton.style.display = "inline";
                renameButtonLineBreak.style.display = "inline";
            }
            cancelButton.style.display = "inline";
            textButton.style.display = 'inline';
            imageButton.style.display = 'inline';
            pdfButton.style.display = "inline";
            videoButton.style.display = "inline";
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
        hideElements([renameButton, renameButtonLineBreak, cancelButton, textButton, imageButton, pdfButton, videoButton, textArea, submitButton, nextFrameButton, prevFrameButton, imagePreviewDiv, pdfPreviewDiv, videoPreviewDiv, addStartTimeButton, addStopTimeButton]);
        
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
            
            if (currentPdf != null)
            {
                pdfArea.removeChild(currentPdf);
                currentPdf = null;
            }
        }
        else if (currentEdit == "video")
        {
            // cancel
            //enableButton(editButton);
            editButton.innerHTML = "Edit";
            mediaControls.style.display = "block";
            
            // Remove Added Video
            if (video_src != "")
                {
                    editsObj.fileTypes.pop();
                    editsObj.videoTimes.pop();
                    editsObj.filePaths.pop();
            
                    // Stop Showing Added Video
                    addedVideoArea.removeChild(currentAddedVideo);
                    currentAddedVideo = null;
                }
        }
        
        currentEdit = "";
        
        // Redisplay media controls
            mediaControls.style.display = "block";
            document.getElementById("volume").style.display = "inline";
            volumeBar.style.display = "inline";
            muteButton.style.display = "inline";
        playButton.innerHTML = "Play";
    });
    
	// Event listener for the text button
	textButton.addEventListener("click", function () {
		//Hide Controls
        hideElements([renameButton, renameButtonLineBreak, cancelButton, pdfButton, textButton, imageButton, videoButton, editButton, mediaControls, nextFrameButton, prevFrameButton]);

		// Clear Text Area
		textArea.value = "";

		// show the text area and submit button
		textArea.style.display = "inline";
		submitButton.style.display = "inline";
        
        //Puts textArea on top
        imageArea.style.zIndex = baseImageZ;
        pdfArea.style.zIndex = basePdfZ;
        addedVideoArea.style.zIndex = baseAddedVideoZ;
        textBoxArea.style.zIndex = overlayZ;
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
        hideElements([renameButton, renameButtonLineBreak, pdfButton, textButton, imageButton, videoButton, mediaControls, nextFrameButton, prevFrameButton]);
        
        // Update current edit state
        currentEdit = "image";

        // Show all images for images
        imagePreviewDiv.style.display = "block";
        
        //Puts the image on top
        pdfArea.style.zIndex = basePdfZ;
        textBoxArea.style.zIndex = baseTextZ
        addedVideoArea.style.zIndex = baseAddedVideoZ;
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
    for (var i = 0; i < imageOptionButtons.length; i++) {
        imageOptionButtons[i].addEventListener("click", function () {


            editButton.style.display = "inline";


            image_src = $(this).data("fp") + $(this).data("fn");
            //image_src = this.src;
            // image_name = this.name;

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
    
    pdfButton.addEventListener("click", function() {
       // Hide controls
        hideElements([renameButton, renameButtonLineBreak, pdfButton, textButton, imageButton, videoButton, mediaControls, nextFrameButton, prevFrameButton]);
        
        // Update current edit state
        currentEdit = "pdf";
        
        pdfPreviewDiv.style.display = "inline-block";
        
        //Puts PDFs on top
        textBoxArea.style.zIndex = baseTextZ;
        imageArea.style.zIndex = baseImageZ;
        addedVideoArea.style.zIndex = baseAddedVideoZ;
        pdfArea.style.zIndex = overlayZ;
    });
    
    // Functions for showing pdf previews for selecting a pdf
    
    for (var i = 0; i < pdfOptionButtons.length; i++)
    {
        pdfOptionButtons[i].addEventListener("click", function () {

            editButton.style.display = "inline";

            pdf_src = $(this).data("fp") + $(this).data("fn");

            //Removes pdf currently displaying if there is one
            if (currentPdf != null) {
                pdfArea.removeChild(currentPdf);
            }

            // Display pdf over video
            var pdf = document.createElement("iframe");
            pdf.src = pdf_src;
            currentPdf = pdf;
            pdfArea.appendChild(pdf);
        });
    }
    
    videoButton.addEventListener("click", function () {
        // Hide controls
        hideElements([renameButton, renameButtonLineBreak, pdfButton, textButton, imageButton, videoButton, mediaControls, nextFrameButton, prevFrameButton]);
        
        // Update current edit state
        currentEdit = "video";
        
        videoPreviewDiv.style.display = "inline-block";
        
        // Put added video on top
        textBoxArea.style.zIndex = baseTextZ;
        imageArea.style.zIndex = baseImageZ;
        pdfArea.style.zIndex = basePdfZ;
        addedVideoArea.style.zIndex = overlayZ;
    });
    
    // Functions for showing video previews for selecting a video
    
    for (var i = 0; i < videoOptionButtons.length; i++)
    {
        videoOptionButtons[i].addEventListener("click", function () {

            // Set Default Stop Time
            startTime = 0;
            stopTime = this.duration;
            
            // Hide Elements
            hideElements([muteButton, document.getElementById("volume"), volumeBar, videoPreviewDiv]);

            // Redisplay media controls and hide video preview div
            mediaControls.style.display = "block";
            document.getElementById("volume").style.display = "none";
            editButton.style.display = "inline";
            addStartTimeButton.style.display = "inline";
            addStopTimeButton.style.display = "inline";
            //disableButton(editButton);

            video_src = $(this).data("fp") + $(this).data("fn");

            // Might not need this
            /*
            if (currentImage != null) {
                imageArea.removeChild(currentImage);
            }*/

            // Display video over video
            var addedVideo = document.createElement("video");
            addedVideo.src = video_src;
            currentAddedVideo = addedVideo;
            document.getElementById("added-video-area").appendChild(addedVideo);
            //playButton.innerHTML = "Play";
            if (currentAddedVideo != null)
            {
                console.log("Added event listener");
                currentAddedVideo.addEventListener("timeupdate", function () {
                    var value = (100 / currentAddedVideo.duration) * currentAddedVideo.currentTime;
                    seekBar.value = value;
                });
            }
        });
    }
    
    addStartTimeButton.addEventListener("click", function () {
        if (currentAddedVideo != null)
        {
            startTime = currentAddedVideo.currentTime;    
        }
    });
    
    addStopTimeButton.addEventListener("click", function () {
        if (currentAddedVideo != null)
        {
            stopTime = currentAddedVideo.currentTime;    
        }
    });
    
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
        if (currentAddedVideo != null)
        {
            console.log("Change");
            var time = currentAddedVideo.duration + (seekBar.value / 100);
            currentAddedVideo.currentTime = time;
            currentAddedVideo.pause();
        }
        else
        {
            // Calculate the new time
            var time = video.duration * (seekBar.value / 100);

            // Update the video time
            video.currentTime = time;
        
            video.pause();
        }
        
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
        if(currentAddedVideo != null)
        {
            console.log("Mouse Down");
            currentAddedVideo.pause();
        }
        else
        {
            video.pause();
        }
    });

    // Play the video when the slider handle is dropped
    seekBar.addEventListener("mouseup", function () {
        if(currentAddedVideo != null)
        {
            currentAddedVideo.play();
        }
        else
        {
            video.play();
        }
    });

    // Event listener for the volume bar
    volumeBar.addEventListener("change", function () {
        // Update the video volume
        video.volume = volumeBar.value;
    });
    
});