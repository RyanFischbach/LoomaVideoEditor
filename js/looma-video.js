/*
 * Name: Skip, Aaron, Connor, Ryan
Email: skip@stritter.com
Owner: VillageTech Solutions (villagetechsolutions.org)
Date: 2016 07
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
    , addedVideoTimes: []
, }

'use strict';
$(document).ready(function () {

	// Video
	var video = document.getElementById("video");
    
    // Video Time Tracker
    var timeDiv = document.getElementById("time");
    timeDiv.innerHTML = "0:00";

	// Media Controls - play, mute, volume 
	var mediaControls = document.getElementById("media-controls");
	var playButton = document.getElementById("play-pause");
	var muteButton = document.getElementById("volume");
	var fullscreenPlayPauseButton = document.getElementById("fullscreen-playpause");
    
    // Media Controls - Sliders
	var seekBar = document.getElementById("seek-bar");
	var volumeBar = document.getElementById("volume-bar");
    
    //Edit Controls
    var editControls = document.getElementById("edit-controls");
    
    // Edit Controls - Renaming a video
    var renameButton = document.getElementById("rename");
    var didSave = false;    // Set to true after user saves one time
    var didRename = false;
    var renameFormDiv = document.getElementById("rename-form-div");
    var renameInput = document.getElementById("rename-text");
    var renameSubmitButton = document.getElementById("rename-form-submit-button");
    var oldName = editsObj.videoName.substring(0, editsObj.videoName.lastIndexOf("."));
    
    // Edit Controls - Cancelling an edit
    var cancelButton = document.getElementById("cancel");
    
    // Edit Controls - Making an edit
    var editButton = document.getElementById("edit");
    
    // Edit Controls - Adding Text
    var textButton = document.getElementById("text");

    // Edit Controls - Selecting Images
    var imageButton = document.getElementById("image");
    var submitButton = document.getElementById("submit");
    var imagePreviewDiv = document.getElementById("image-previews");
    var imageOptionButtons = imagePreviewDiv.children;
    
    // Edit Controls - Selecting Pdfs
    var pdfButton = document.getElementById("pdf");
    var pdfPreviewDiv = document.getElementById("pdf-previews");
    var pdfOptionButtons = pdfPreviewDiv.children;
    
    // Edit Controls - Selecting Videos
    var videoButton = document.getElementById("video-button");
    var videoPreviewDiv = document.getElementById("video-previews");
    var videoOptionButtons = videoPreviewDiv.children;
    
    // Edit Controls - Adding a video
    var addTimeDiv = document.getElementById("add-time-div");
    var addStartTimeButton = document.getElementById("start-time");
    var addStopTimeButton = document.getElementById("stop-time");
    var addDefaultButton = document.getElementById("default-start-stop-time");
    var addDefaultButtonPressed = false;
    var startTime = 0;
    var stopTime = 0;
    document.getElementById("default-start-stop-time-div").style.width = "50%";
    document.getElementById("default-start-stop-time-div").style.height = "50%";
    
    // Edit Controls - Frame by Frame Controls
    var nextFrameButton = document.getElementById("next-frame");
	var prevFrameButton = document.getElementById("prev-frame");
    
    // File Sources
    var image_src = "";
    var pdf_src = "";
    var video_src = "";
    
    // Displaying Edits - Media overlays
    var edited = true;  // true when the user makes an edit, false when the edit has been saved and disappears
    var currentImage = null;    // Used for image overlay - displays the selected image over the video
    var currentEdit = "";
    var currentText = null;     // Used for text overlay - displays text over the video
    var currentPdf = null;
    var currentAddedVideo = null;
    
    // Displaying Edits - Overlays
    
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
    
    // Timeline Edits - Clicking on a button in the timeline
    var timelineEdit = false; // True when the user is editing through the timeline
    var timelineImageTime = -1; // For keeping the time when the image is displayed
    var timelineImageType = ""; // For displaying the image the user clicks on in the timeline
    var timelineImagePath = ""; // For displaying the image when user clicks on button in timeline
    var timelineImageText = ""; // For displaying text when user clicks on button in timeline
    var didEditPast = false; // True when user went back in time and added an edit
    
    // Other var for timeline
	var timelineImageHeight;
	var timelineImageWidth;

	var isFullscreen = false;
	// Fullscreen Button
	$('#fullscreen-control').click(function (e) {
		e.preventDefault();
		screenfull.toggle(video);
		if(!isFullscreen)
		{
			fullscreenPlayPauseButton.style.display = "inline";
			isFullscreen = true;
		}
		else
		{
			fullscreenPlayPauseButton.style.display = "none";
			isFullscreen = false;
		}
	});
    

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

	
	// Event listener for the play pause button that appears when in fullscreen
	fullscreenPlayPauseButton.addEventListener("click", function() {
		if(video.paused)
		{
			video.play();
		}
		else
		{
			video.pause();
		}
	});
    
	// Play Button Event Listener
	playButton.addEventListener("click", function () {
        if(currentAddedVideo != null)
        {
            // Play or Pause the Current Added Video
            toggleCurrentAddedVideo();
        }
        else 
        {
            // Play or pause the video
            toggleVideo();
        }
	});
    
    function toggleCurrentAddedVideo() {
        if (currentAddedVideo.paused == true) 
            {
                // Play the video
                currentAddedVideo.play();

                // Update the button text to 'Pause'
                playButton.style.backgroundImage = 'url("images/pause.png")';
                
                
            } 
            else 
            {
                // Pause the video
                currentAddedVideo.pause();

                // Update the button text to 'Play'
                playButton.style.backgroundImage = 'url("images/video.png")';
            }
    }
    
    function toggleVideo() {
        if (video.paused == true)
            {
                // Play the video
                video.play();

                // Update the button text to 'Pause'
                playButton.style.backgroundImage = 'url("images/pause.png")';

                //When the user hits play after making an edit it adds the thumbnail of the video to the timeline
                if (edited == true)
                {
                    if (!didEditPast)
                    {
                        show_image_timeline(false, thumbFile, thumbFile, "null", video.currentTime);
                        edited = false;
                    }
                }
                /*
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
                */
            }
            else 
            {
                // Pause the video
                video.pause();

                // Update the button text to 'Play'
                playButton.style.backgroundImage = 'url("images/video.png")';
            }
    }

	// Event listener for the mute button
	muteButton.addEventListener("click", function () {
		if (video.muted == false) {
			// Mute the video
			video.muted = true;

			// Update the button text
			muteButton.style.backgroundImage = 'url("images/mute.png")';
		} else {
			// Unmute the video
			video.muted = false;

			// Update the button text
			muteButton.style.backgroundImage = 'url("images/audio.png")';
		}
	});
    
    renameButton.addEventListener("click", function () {
        // Rename video
        hideElements([renameButton, cancelButton, textButton, imageButton, pdfButton, videoButton, submitButton, nextFrameButton, prevFrameButton]);
        renameFormDiv.style.display = "block";
    });
    
    function hideElements (elements)
    {
        for (var x = 0; x < elements.length; x++)
        {
            elements[x].style.display = "none";
        }
    }
    
    renameSubmitButton.addEventListener("click", function () {   
        hideElements([renameFormDiv]);
            
        mediaControls.style.display = "block";
        document.getElementById("volume").style.display = "inline";
        volumeBar.style.display = "inline";
        editButton.style.display = "inline";
        editButton.innerHTML = "Edit";
        
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
        console.log("Edit Button Pressed");
		if (editButton.innerHTML == "Save") 
        {   
            // Set timeDiv back to normal video time
            timeDiv.innerHTML = minuteSecondTime(video.currentTime);
            seekBar.value = (100 / video.duration) * video.currentTime;
            // Set other changes back to normal
            mediaControls.style.height = "20%";
            editControls.style.height = "10%";
            cancelButton.style.height = "52%";
            editButton.style.height = "52%";
            editButton.disabled = false;
            editButton.style.opacity = "1.0";
            if (!didSave)
            {
                // Save file as...
                saveAs();
                save();
            }
            
            else
            {
            
                toggleControlsForSaveButton();
                save();
            }
            playButton.style.backgroundImage = 'url("images/video.png")';
        } 
		else
		{
            // Hide Media controls
            hideElements([mediaControls, editButton]);
            
            // Display edit options
            if (didSave)
            {
                renameButton.style.display = "inline";
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
            playButton.style.backgroundImage = 'url("images/video.png")';
        }

    });
    
    function saveAs() {
        hideElements([renameButton, cancelButton, textButton, imageButton, pdfButton, videoButton, submitButton, nextFrameButton, prevFrameButton, mediaControls, imagePreviewDiv, textArea, videoPreviewDiv, pdfPreviewDiv, editButton, addTimeDiv]);
        
        renameFormDiv.style.display = "block";
        didSave = true;  
    }
    
    function save() {
        video.pause();
                //Displays preview for image
                if (timelineEdit) {
                    saveTimelineEdit();
                }
                else {
                    saveEdit();
                }

                currentEdit = "";


                // Send to server to save as a txt file
                $.ajax("looma-video-editor-textConverter.php", {
                    data: {info: editsObj, location: oldName},
                    method: "POST"
                });
    }
    
    function toggleControlsForSaveButton() {
        // Hide Edit Controls
        hideElements([renameButton, cancelButton, textButton, imageButton, pdfButton, videoButton, submitButton, nextFrameButton, prevFrameButton, imagePreviewDiv, pdfPreviewDiv, videoPreviewDiv, addTimeDiv]);
            
        // Redisplay media controls
        mediaControls.style.display = "block";
        document.getElementById("volume").style.display = "inline";
        volumeBar.style.display = "inline";
        muteButton.style.display = "inline";
        
        // change the edit button to say edit
        editButton.innerHTML = "Edit";
    }
    
    function saveTimelineEdit() {
        if (currentText != null) {
            insertText();
            //currentEdit.readOnly = true;
            textArea.readOnly = true;
            textArea.removeChild(currentText);
            currentText = null;
            textArea.style.display = "none";
        }
        else if (image_src != "") {        
            // Insert Edit
            insertSrc(image_src, image_src, "image");
            
            if (currentImage != null)
            {
                imageArea.removeChild(currentImage);
                currentImage = null;
                image_src = "";
            }
        }
        else if (pdf_src != "") {
            // Save pdf
            insertSrc(pdf_src.substr(0, pdf_src.length - 4) + "_thumb.jpg", pdf_src, "pdf");
            if (currentPdf != null)
            {
                pdfArea.removeChild(currentImage);
                currentPdf = null;
                pdf_src = "";
            }
        }
        else if (video_src != "") {
            // Save video
            insertSrc(video_src.substr(0, video_src.length - 4) + "_thumb.jpg", video_src, "video");
            if (currentAddedVideo != null)
            {
                addedVideoArea.removeChild(currentImage);
                currentAddedVideo = null;
                video_src = "";
            }
        }
    }
    
    function insertText() {
        
        var timeIndex = editsObj.videoTimes.indexOf(video.currentTime);
        
        var numTextFiles = 0;
        for (var i = 0; i < timeIndex; i++) {
            if (editsObj.fileTypes[i] == "text") {
                numTextFiles++;
            }
        }
        
        // index of text file in videoText array
        var index = numTextFiles;
        if (index < editsObj.videoText.length - 1) {
            editsObj.videoText.splice(index + 1, 0, textArea.value);
        }
        else {
            editsObj.videoText.push(textArea.value);
        }
        editsObj.videoText.splice(index, 1);
        
        console.log("1");
        show_text_timeline(textArea.value, video.currentTime);
        timelineImageText = "";
        timelineEdit = false;
        //currentText = null;
    }
    
    /**
    * Replace old information with new information and update timeline
    */
    function insertSrc(image_src, src, type) {
            var index = editsObj.filePaths.indexOf(timelineImagePath);
            if (index > -1)
            {
                if (index < editsObj.filePaths.length - 1)
                {
                    editsObj.filePaths.splice(index + 1, 0, src);
                }
                else
                {
                    editsObj.filePaths.push(src);
                }
                // Remove old edit
                editsObj.filePaths.splice(index, 1);

                show_image_timeline(true, image_src, src, type, video.currentTime);
                timelineImagePath = "";
                timelineEdit = false;
                timelineImageType = "";
            }
    }
    
    function saveEdit() {
       
        if (currentText != null)
        {
            insertVideoTime(video.currentTime);
            insertFileType("text", video.currentTime);
            insertVideoText(currentText.value, video.currentTime);
            console.log("2");
            show_text_timeline(currentText.value, video.currentTime);
            edited = true;
            
            // Hide text
            textArea.style.display = "none";
            currentText = null;
        }
        else if (image_src != "")
        {
            insertVideoTime(video.currentTime);
            insertFileType("image", video.currentTime);
            insertFilePath(image_src, video.currentTime);
            show_image_timeline(true, image_src, image_src, "image", video.currentTime);
            edited = true;
            image_src = "";
            
            // Hide image
            if (currentImage != null)
            {
                imageArea.removeChild(currentImage);
                currentImage = null;
            }
        }
        else if (pdf_src != "")
        {
            insertVideoTime(video.currentTime);
            insertFileType("pdf", video.currentTime);
            insertFilePath(pdf_src, video.currentTime);
            show_image_timeline(true, pdf_src.substr(0, pdf_src.length - 4) + "_thumb.jpg", pdf_src, "pdf", video.currentTime);
            edited = true;
            pdf_src = "";
            
            // Hide pdf
            if (currentPdf != null)
            {
                pdfArea.removeChild(currentPdf);
                currentPdf = null;   
            }
        }
        else if (video_src != "")
        {
            insertVideoTime(video.currentTime);
            insertFileType("video", video.currentTime);
            insertFilePath(video_src, video.currentTime);
                
            if (currentAddedVideo != null)
            {
                insertAddedVideoTimes(startTime, stopTime, video.currentTime);
            }
                           
            show_image_timeline(true, video_src.substr(0, video_src.length - 4) + "_thumb.jpg", video_src, "video", video.currentTime);
            edited = true;
            video_src = "";
            
            if (currentAddedVideo != null)
            {
                // Stop Showing Added Video
                addedVideoArea.removeChild(currentAddedVideo);
                currentAddedVideo = null;  
            }
            
        }
    }
    
    /**
    * Inserts a video time into the editsObj.videoTimes array
    */
    function insertVideoTime(time)
    {
        var length = editsObj.videoTimes.length;
        if (length > 0)
        {
            if (time > editsObj.videoTimes[length - 1])
            {
                editsObj.videoTimes.push(time);    
            }
            else
            {
                // Time is in between two other times
                for (var i = 0; i < length; i++) {
                    if (time < editsObj.videoTimes[i]) {
                        //didEditPast = true;
                        editsObj.videoTimes.splice(i, 0, time);
                        i += length;
                    }
                }
            }
        }
        else
        {
            // Empty array
            editsObj.videoTimes.push(time);
        }
        
    }

    /**
    * Must be called after insertVideoTime is called and must be called with insertFilePath
    */
    function insertFileType(fileType, time) {
        if (editsObj.fileTypes.length > 0) {
            var index = editsObj.videoTimes.indexOf(time);
            editsObj.fileTypes.splice(index, 0, fileType);
        }
        else {
            // Empty Array
            editsObj.fileTypes.push(fileType);
        }
    }
    
    function insertVideoText(text, time) {
        if (editsObj.videoText.length > 0)
        {
            var timeIndex = editsObj.videoTimes.indexOf(time);
            var numTextFiles = 0;

            for (var i = 0; i < timeIndex; i++)
            {
                if (editsObj.fileTypes[i] == "text")
                {
                    numTextFiles++;
                }
            }
            
            if (numTextFiles < editsObj.videoText.length)
            {
                editsObj.videoText.splice(numTextFiles, 0, text);    
            }
            else
            {
                // Append text to array
                editsObj.videoText.push(text);
            }
        }
        else
        {
            // Empty array
            editsObj.videoText.push(text);
        }
        
    }

    /**
    * Must be called after insertVideoTime is called and must be called with insertFileType
    */
    function insertFilePath(filePath, time) {
        if (editsObj.filePaths.length > 0) {
            // Get index from time
            var index = editsObj.videoTimes.indexOf(time);
            
            // Find how many text files were added before this file
            var textCount = 0;
            for (var i = 0; i < editsObj.fileTypes.length; i++) {
                if (editsObj.fileTypes[i] == "text") {
                    textCount++;
                }
            }
            
            // Subtract number of text files from index because text files are not included in filePaths
            index = index - textCount;
            
            editsObj.filePaths.splice(index, 0, filePath);
        }
        else {
            // Empty array
            editsObj.filePaths.push(filePath);
        }
    }
    
    /**
    * Must be called for all added videos
    */
    function insertAddedVideoTimes(start, stop, time) {
        if (editsObj.addedVideoTimes.length > 0)
        {
            var timeIndex = editsObj.videoTimes[editsObj.videoTimes.indexOf(time)];
            var numVideos = 0;
            for (var i = 0; i < editsObj.fileTypes.length; i++)
            {
                numVideos++;
            }
            // Get proper index for addedVideoTimes array
            var index = 
            editsObj.addedVideoTimes.splice(index, 0, start, stop);
        }
        else
        {
            // Empty array
            editsObj.addedVideoTimes.push(start);
            editsObj.addedVideoTimes.push(stop);
        }
    }
    
    cancelButton.addEventListener("click", function () {
        mediaControls.style.height = "20%";
        editControls.style.height = "10%";
        cancelButton.style.height = "52%";
        editButton.style.height = "52%";
        editButton.disabled = false;
        editButton.style.opacity = "1.0";
        toggleControlsForCancelButton();
        video.pause();
        
        cancelEdit();
        
        // Redisplay media controls
            mediaControls.style.display = "block";
            document.getElementById("volume").style.display = "inline";
            volumeBar.style.display = "inline";
            muteButton.style.display = "inline";
        playButton.style.backgroundImage = 'url("images/video.png")';
    });
    
    function toggleControlsForCancelButton() {
        // Hide Edit Controls
        hideElements([renameButton, cancelButton, textButton, imageButton, pdfButton, videoButton, textArea, submitButton, nextFrameButton, prevFrameButton, imagePreviewDiv, pdfPreviewDiv, videoPreviewDiv, addTimeDiv]);
        
        // Redisplay media controls
        mediaControls.style.display = "block";
        
        // Redisplay edit button
        editButton.style.display = "inline";

        // change the edit button to say edit
        editButton.innerHTML = "Edit";
    }
    
    function cancelEdit() {
        // Remove edits
        timelineEdit = false;
        timelineImagePath = "";
        timelineImageTime = -1;
        timelineImageType = "";
        timelineImageText = "";
        currentText = null;
        if (currentEdit == "text")
        {
            if (timelineEdit)
            {
                // Need to determine if user saved the edit or not
            }
            /*
            else if (didEditPast)
            {
                // Added a new edit in the past
                var timeIndex = editsObj.videoTimes.indexOf(video.currentTime);
                var numTextFiles = 0;
                for (var i = 0; i < timeIndex; i++)
                {
                    numtextFiles++;
                }
                editsObj.videoTimes.splice(timeIndex, 1);
                editsObj.fileTypes.splice(timeIndex, 1);
                editsObj.videoText.splice(numTextFiles, 1);
            }
            else
            {
                editsObj.fileTypes.pop();
                editsObj.videoTimes.pop();
                editsObj.videoText.pop();
            }*/
            if (currentText != null)
            {
                document.getElementById("timeline-area").removeChild(currentText);
                currentText = null;
            }
        }
        else if (currentEdit == "image")
        {
            if (timelineEdit)
            {
                // Need to determine if user saved the edit or not
            }
            /*
            else if (didEditPast)
            {
                // Added a new edit in the past
                
            }
            else
            {
                
                editsObj.fileTypes.pop();
                editsObj.videoTimes.pop();
                editsObj.filePaths.pop();
            }*/
            
            
            //Removes image overlay
            if(currentImage != null)
            {
                imageArea.removeChild(currentImage);
                currentImage = null;
            }
            image_src = "";
        }
        else if (currentEdit == "pdf")
        {
            if (timelineEdit)
            {
                // Need to determine if user saved the edit or not
            }
            /*
            else if (didEditPast)
            {
                // Added a new edit in the past
            }
            else
            {
                editsObj.fileTypes.pop();
                editsObj.videoTimes.pop();
                editsObj.filePaths.pop(); 
            }*/
            
            if (currentPdf != null)
            {
                pdfArea.removeChild(currentPdf);
                currentPdf = null;
            }
            pdf_src = "";
        }
        else if (currentEdit == "video")
        {
            editButton.innerHTML = "Edit";
            mediaControls.style.display = "block";
            
            // Remove Added Video
            if (video_src != "")
                {
                    if (timelineEdit)
                    {
                        // Need to determine if user saved the edit or not
                    }
                    /*
                    else if (didEditPast)
                    {
                        // Added a new edit in the past
                    }
                    else
                    {
                        editsObj.fileTypes.pop();
                        editsObj.videoTimes.pop();
                        editsObj.filePaths.pop();
                        editsObj.addedVideoTimes.pop();
                        editsObj.addedVideoTimes.pop();
                    }
                    */
            
                    // Stop Showing Added Video
                    addedVideoArea.removeChild(currentAddedVideo);
                    currentAddedVideo = null;
                }
            
            video_src = "";
        }
        
        currentEdit = "";
    }
    
	// Event listener for the text button
	textButton.addEventListener("click", function () {
		//Hide Controls
        hideElements([renameButton, cancelButton, pdfButton, textButton, imageButton, videoButton, editButton, mediaControls, nextFrameButton, prevFrameButton]);

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
        
        currentText = textArea;
        
        /*
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
        */

        // don't show the submit button
        submitButton.style.display = "none";
        
        /*
        //Add timeline display
        console.log("3");
        show_text_timeline(textArea.value, video.currentTime);
        edited = true;
        */
        
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
        hideElements([renameButton, pdfButton, textButton, imageButton, videoButton, mediaControls, nextFrameButton, prevFrameButton]);
        
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
    
    // Show image previews in timeline
    function show_image_timeline(isAnEdit, image_src, src, type, time) {
        // image_src = src for image thumbnail
        // src = src for actual file
        if (timelineEdit) {
            var buttons = document.getElementsByClassName("" + time);
            var button;
            for (var i = 0; i < buttons.length; i++) {
                if (buttons[i].src == timelineImagePath) {
                    button = buttons[i];
                }
            }
                
            if (button != null)
            {
                var hoverDiv = button.parentElement;
                var img = hoverDiv.nextElementSibling;
                img.src = image_src;
                button.src = src;
            }
        }
        else if (didEditPast) {
            //didEditPast = false;
            
            var newChild;
            var imageDiv = document.createElement("div");
            var img = document.createElement("img");
            var hoverDiv = document.createElement("div");
            
            //var button = document.createElement("button");

            // Check to make sure timeline element is not the video thumbnail
            if (isAnEdit)
            {
                var button = document.createElement("button");
                if (editsObj.videoTimes.length > 0)
                {
                    button.className = editsObj.videoTimes[editsObj.videoTimes.indexOf(time)];
                    button.src = src;
                    button.innerHTML = minuteSecondTime(editsObj.videoTimes[editsObj.videoTimes.indexOf(time)]);
                }
                else
                {
                    button.innerHTML = "";
                }
                
                addTimelineButtonEventListener(button, type);
                
                hoverDiv.appendChild(button);
            }

            hoverDiv.style.display = "none";
            hoverDiv.style.position = "absolute";
            hoverDiv.style.top = "0px";
            hoverDiv.style.left = "0px";
            imageDiv.appendChild(hoverDiv);

            imageDiv.style.position = "relative";
            imageDiv.width = timelineImageWidth;
            imageDiv.height = timelineImageHeight;
            imageDiv.onmouseover = function() {
                hoverDiv.style.display = "block";
            };
            imageDiv.onmouseout = function() {
                hoverDiv.style.display = "none";
            };

            img.src = image_src;
            img.width = timelineImageWidth;
            img.height= timelineImageHeight;
            imageDiv.appendChild(img);
            newChild = imageDiv;
            
            var children = document.getElementById("timeline-area").children;
            var child = findChild(children, time);
            document.getElementById("timeline-area").insertBefore(newChild, child);
            
        }
        else {
        
            var imageDiv = document.createElement("div");
            var img = document.createElement("img");
            var hoverDiv = document.createElement("div");
            
            img.src = image_src;
            img.width = timelineImageWidth;
            img.height= timelineImageHeight;

            // Check to make sure timeline element is not the video thumbnail
            if (isAnEdit)
            {
                var button = document.createElement("button");
                if (editsObj.videoTimes.length > 0) {
                    button.className = editsObj.videoTimes[editsObj.videoTimes.length - 1];
                    button.src = src;
                    button.innerHTML = minuteSecondTime(editsObj.videoTimes[editsObj.videoTimes.length - 1]);
                }
                else {
                    button.innerHTML = "";
                }
                
                addTimelineButtonEventListener(button, type);
                
                hoverDiv.appendChild(button);
            }

            hoverDiv.style.display = "none";
            hoverDiv.style.position = "absolute";
            hoverDiv.style.top = "0px";
            hoverDiv.style.left = "0px";
            imageDiv.appendChild(hoverDiv);

            imageDiv.style.position = "relative";
            imageDiv.width = timelineImageWidth;
            imageDiv.height = timelineImageHeight;
            imageDiv.onmouseover = function() {
                hoverDiv.style.display = "block";
            };
            imageDiv.onmouseout = function() {
                hoverDiv.style.display = "none";
            };

            imageDiv.appendChild(img);
            document.getElementById("timeline-area").appendChild(imageDiv);
        }
    }
    
    function minuteSecondTime(time)
    {
        // Time should be in the form 0:00 (0 Min: 00 Sec)
        // Note that this time is not accurate since it removes some sig figs
        var timeAsString = "" + time;
        var seconds = timeAsString.substring(0, timeAsString.indexOf("."));
        var minutes = Math.floor(Number(seconds) / 60);
        seconds = Number(seconds) % 60;
        if (seconds < 10)
        {
            seconds = "0" + seconds;
        }
        return minutes + ":" + seconds;
    }
    
    function addTimelineButtonEventListener(button, type) 
    {
        button.addEventListener("click", function()
        {
            // Open the edit
            video.currentTime = this.className;
            video.pause;
                    
            if (type == "text") 
            {
                if (currentText != null)
                {
                    textArea.style.display = "none";
                    currentText = null;
                }
                // Show text to edit
                findText(this);
                toggleTimelineControls();
                cancelButton.style.display = "none";
                editButton.style.display = "none";
                editButton.innerHTML = "Save";

                currentEdit = "text";
                timelineEdit = true;
                
                //textArea = currentText;
                textArea.value = timelineImageText;
                // Need to do something with currentText so that cancelButton can remove it from timeline

                // show the text area and submit button
                textArea.style.display = "inline";
                submitButton.style.display = "inline";

                //Puts the text on top
                pdfArea.style.zIndex = basePdfZ;
                textBoxArea.style.zIndex = overlayZ
                addedVideoArea.style.zIndex = baseAddedVideoZ;
                imageArea.style.zIndex = baseImageZ;

            }        
            else if (type == "image") 
            {
                if (currentImage != null)
                {
                    imageArea.removeChild(currentImage);
                    currentImage = null;
                }
                // Show Image to edit
                for (var i = 0; i < editsObj.videoTimes.length; i++)
                {
                    if (this.className == editsObj.videoTimes[i] && type == editsObj.fileTypes[i])
                    {
                        for (var j = 0; j < editsObj.filePaths.length; j++)
                        {
                            if (this.src == editsObj.filePaths[j])
                            {
                                timelineImageTime = editsObj.videoTimes[i];
                                timelineImageType = editsObj.fileTypes[i];
                                timelineImagePath = editsObj.filePaths[j];
                            }
                        } 
                    }
                }
                        
                toggleTimelineControls();
                editButton.innerHTML = "Save";

                // Update current edit state
                currentEdit = "image";
                timelineEdit = true;
                //currentImage = img;

                // Show all images for images
                imagePreviewDiv.style.display = "block";

                //Puts the image on top
                pdfArea.style.zIndex = basePdfZ;
                textBoxArea.style.zIndex = baseTextZ
                addedVideoArea.style.zIndex = baseAddedVideoZ;
                imageArea.style.zIndex = overlayZ;

                show_image_preview(this.src);

            }
            else if (type == "pdf") 
            {
                if (currentPdf != null)
                {
                    pdfArea.removeChild(currentPdf);
                    currentPdf = null;
                }
                // Show Pdf to edit
                // Show Image to edit
                for (var i = 0; i < editsObj.videoTimes.length; i++)
                {
                    if (this.className == editsObj.videoTimes[i] && type == editsObj.fileTypes[i])
                    {
                        for (var j = 0; j < editsObj.filePaths.length; j++)
                        {
                            if (this.src == editsObj.filePaths[j])
                            {
                                timelineImageTime = editsObj.videoTimes[i];
                                timelineImageType = editsObj.fileTypes[i];
                                timelineImagePath = editsObj.filePaths[j];
                            }
                        } 

                    }
                }
                        
                toggleTimelineControls();
                        
                // Update current edit state
                currentEdit = "pdf";
                timelineEdit = true;
                        
                pdfPreviewDiv.style.display = "block";
                        
                //Puts the pdf on top
                pdfArea.style.zIndex = overlayZ;
                textBoxArea.style.zIndex = baseTextZ
                addedVideoArea.style.zIndex = baseAddedVideoZ;
                imageArea.style.zIndex = baseImageZ;
            
                editButton.innerHTML = "Save";
                        
                var pdf = document.createElement("iframe");
                pdf_src = this.src;
                pdf.src = pdf_src;
                currentPdf = pdf;
                pdfArea.appendChild(pdf);
            }
            else if (type == "video") 
            {
                if (currentAddedVideo != null)
                {
                    addedVideoArea.removeChild(currentAddedVideo);
                    currentAddedVideo = null;
                }
                
                // Show video to edit
                for (var i = 0; i < editsObj.videoTimes.length; i++)
                {
                    if (this.className == editsObj.videoTimes[i] && type == editsObj.fileTypes[i])
                    {
                        for (var j = 0; j < editsObj.filePaths.length; j++)
                        {
                            if (this.src == editsObj.filePaths[j])
                            {
                                timelineImageTime = editsObj.videoTimes[i];
                                timelineImageType = editsObj.fileTypes[i];
                                timelineImagePath = editsObj.filePaths[j];
                            }
                        } 

                    }
                }

                editButton.innerHTML = "Save";

                // Update current edit state
                currentEdit = "video";
                timelineEdit = true;

                toggleTimelineControls();

                videoPreviewDiv.style.display = "block";

                //Puts the pdf on top
                pdfArea.style.zIndex = basePdfZ;
                textBoxArea.style.zIndex = baseTextZ
                addedVideoArea.style.zIndex = overlayZ;
                imageArea.style.zIndex = baseImageZ;

                if (currentAddedVideo != null)
                {
                    addedVideoArea.removeChild(currentAddedVideo);
                }

                editButton.innerHTML = "Save";

                // Display video over video
                var addedVideo = document.createElement("video");
                video_src = this.src;
                addedVideo.src = video_src;
                currentAddedVideo = addedVideo;
                document.getElementById("added-video-area").appendChild(addedVideo);

            }
        });
    }
    
    function findText(button) {
        for (var i = 0; i < editsObj.videoTimes.length; i++)
        {
            if (button.className == editsObj.videoTimes[i] && editsObj.fileTypes[i] == "text")
            {
                for (var j = 0; j < editsObj.videoText.length; j++)
                {
                    if (button.parentNode.parentNode.getElementsByTagName("p")[0].innerHTML == editsObj.videoText[j]) {
                        // text in textDiv == videoText stored in txt file
                        console.log("Found Text File");
                        timelineImageTime = editsObj.videoTimes[i];
                        timelineImageText = editsObj.videoText[j];
                    }
                } 

            }
        }
    }
    
    function toggleTimelineControls() {
         // Hide Controls
        hideElements([renameButton, editButton, pdfButton, textButton, imageButton, videoButton, mediaControls, nextFrameButton, prevFrameButton]);
        
        cancelButton.style.display = "inline";
    }
    
    function findChild(children, time) {
        //for (var i = children.length - 1; i > -1; i--)
        for (var i = 0; i < children.length; i++)
            {
                if (children[i].hasChildNodes)
                {
                    for (var j = 0; j < children[i].children.length; j++)
                    {
                        if (children[i].children[j].hasChildNodes)
                        {
                            for (var k = 0; k < children[i].children[j].children.length; k++)
                            {
                                if (children[i].children[j].children[k].className > time)
                                {
                                    // Add child before here
                                    console.log("Added Child To Timeline");
                                    return children[i];
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        return null;
    }
    
    //Displays text box for timeline
    function show_text_timeline(message, time) {
        console.log("Show Text Timeline");
        if (timelineEdit)
        {
            var textDiv;
            var textDivs = document.getElementsByClassName("timeline-text-div");
            for (var i = 0; i < textDivs.length; i++) {
                if (textDivs[i].children[1].children[0].className == time) {
                    // textDivs[i].children[1] is the hoverDiv in the textDiv
                    textDiv = textDivs[i];
                }
            }
            
            if (textDiv != null) {
                // Change text inside of <p> tags
                textDiv.children[0].innerHTML = message;
            }
        }
        else if (didEditPast)
        {
            //didEditPast = false;
            
            var newChild;
            var textDiv = document.createElement("div");
            var hoverDiv = document.createElement("div");
            
            var timelineButton = document.createElement("button");
            if (editsObj.videoTimes.length > 0)
            {
                //timelineButton.className = editsObj.videoTimes[editsObj.videoTimes.indexOf(time)];
                timelineButton.className = time;
                timelineButton.innerHTML = minuteSecondTime(editsObj.videoTimes[editsObj.videoTimes.indexOf(time)]);
            }
            else
            {
                timelineButton.innerHTML = "";
            }

            addTimelineButtonEventListener(timelineButton, "text");

            hoverDiv.appendChild(timelineButton);
            hoverDiv.style.backgroundColor = "black";
            hoverDiv.style.display = "none";
            hoverDiv.style.position = "absolute";
            hoverDiv.style.top = "0px";
            hoverDiv.style.left = "0px";
            hoverDiv.style.zIndex = "1";


            textDiv.className = "timeline-text-div";
            //textDiv.style.overflow = "none";
            textDiv.style.position = "relative";
            textDiv.style.backgroundColor = "white";
            textDiv.style.color = "black";
            textDiv.style.width = timelineImageWidth + "px";
            textDiv.style.height = timelineImageHeight + "px";
            textDiv.style.zIndex = "0";
            textDiv.onmouseover = function() {
                hoverDiv.style.display = "block";
            };
            textDiv.onmouseout = function() {
                hoverDiv.style.display = "none";
            };

            textDiv.innerHTML = "<p>" + message + "</p>";


            // Update current Text
            var text = document.createElement("textarea");
            text.value = message;
            text.style.width = timelineImageWidth + "px";
            text.style.height = timelineImageHeight + "px";
            text.style.resize = "none";
            text.style.color = "black";
            text.readOnly = "readOnly";
            currentText = text;
            //textDiv.appendChild(text);
            textDiv.appendChild(hoverDiv);
            newChild = textDiv;
            
            var children = document.getElementById("timeline-area").children;
            //var child = findChild(children, time);
            var child = findChild(children, time);
            document.getElementById("timeline-area").insertBefore(newChild, child);
            
            // Add video thumbnail after for cleaner User interface
            //show_image_timeline(false, thumbFile, thumbFile, "null", video.currentTime);
            
        }
        else
        {
            var textDiv = document.createElement("div");
            var hoverDiv = document.createElement("div");


            var timelineButton = document.createElement("button");
            if (editsObj.videoTimes.length > 0)
            {
                //timelineButton.className = editsObj.videoTimes[editsObj.videoTimes.indexOf(time)];
                timelineButton.className = time;
                timelineButton.innerHTML = minuteSecondTime(editsObj.videoTimes[editsObj.videoTimes.indexOf(time)]);
            }
            else
            {
                timelineButton.innerHTML = "";
            }

            addTimelineButtonEventListener(timelineButton, "text");

            hoverDiv.appendChild(timelineButton);
            hoverDiv.style.backgroundColor = "black";
            hoverDiv.style.display = "none";
            hoverDiv.style.position = "absolute";
            hoverDiv.style.top = "0px";
            hoverDiv.style.left = "0px";
            hoverDiv.style.zIndex = "1";


            textDiv.className = "timeline-text-div";
            //textDiv.style.overflow = "none";
            textDiv.style.position = "relative";
            textDiv.style.backgroundColor = "white";
            textDiv.style.color = "black";
            textDiv.style.width = timelineImageWidth + "px";
            textDiv.style.height = timelineImageHeight + "px";
            textDiv.style.zIndex = "0";
            textDiv.onmouseover = function() {
                hoverDiv.style.display = "block";
            };
            textDiv.onmouseout = function() {
                hoverDiv.style.display = "none";
            };

            textDiv.innerHTML = "<p>" + message + "</p>";


            // Update current Text
            var text = document.createElement("textarea");
            text.value = message;
            text.style.width = timelineImageWidth + "px";
            text.style.height = timelineImageHeight + "px";
            text.style.resize = "none";
            text.style.color = "black";
            text.readOnly = "readOnly";
            currentText = text;
            //textDiv.appendChild(text);
            textDiv.appendChild(hoverDiv);
            document.getElementById("timeline-area").appendChild(textDiv);
            //document.getElementById("timeline-area").appendChild(text);
        }
    }
    
    pdfButton.addEventListener("click", function() {
       // Hide controls
        hideElements([renameButton, pdfButton, textButton, imageButton, videoButton, mediaControls, nextFrameButton, prevFrameButton]);
        
        // Update current edit state
        currentEdit = "pdf";
        
        pdfPreviewDiv.style.display = "block";
        
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
        hideElements([renameButton, pdfButton, textButton, imageButton, videoButton, mediaControls, nextFrameButton, prevFrameButton]);
        
        // Update current edit state
        currentEdit = "video";
        
        videoPreviewDiv.style.display = "block";
        
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
            mediaControls.style.height = "10%";
            editControls.style.height = "20%";
            cancelButton.style.height = "25%";
            editButton.style.height = "25%";
            editButton.disabled = true;
            editButton.style.opacity = "0.7";
            // Reset start and stoptime buttons
            addStartTimeButton.innerHTML = "Set Start Time";
            addStopTimeButton.innerHTML = "Set Stop Time";

            // Set Default Stop Time
            startTime = -1;
            stopTime = -1;
            
            toggleControlsForVideoOptionButtons();

            video_src = $(this).data("fp") + $(this).data("fn");

            if (currentAddedVideo != null) {
                addedVideoArea.removeChild(currentAddedVideo);
            }
            
            // Display video over video
            var addedVideo = document.createElement("video");
            addedVideo.src = video_src;
            currentAddedVideo = addedVideo;
            document.getElementById("added-video-area").appendChild(addedVideo);
            //playButton.innerHTML = "Play";
            if (currentAddedVideo != null)
            {
                // Update timeDiv
                timeDiv.innerHTML = minuteSecondTime(currentAddedVideo.currentTime);
                // Set seekbar to beginning of video
                seekBar.value = 0;
                currentAddedVideo.addEventListener("timeupdate", function () {
                    var value = (100 / currentAddedVideo.duration) * currentAddedVideo.currentTime;
                    seekBar.value = value;
                    timeDiv.innerHTML = minuteSecondTime(currentAddedVideo.currentTime);
                });
            }
        });
    }
    
    function toggleControlsForVideoOptionButtons() {
            // Hide Elements
            hideElements([videoPreviewDiv, document.getElementById("volume"), volumeBar]);

            // Redisplay media controls and hide video preview div
            mediaControls.style.display = "block";
            editButton.style.display = "inline";
            addTimeDiv.style.display = "block";
    }
    
    addStartTimeButton.addEventListener("click", function () {
        if (currentAddedVideo != null)
        {
            startTime = currentAddedVideo.currentTime;
            addStartTimeButton.innerHTML = "Start Time: " + minuteSecondTime(startTime);
            if (stopTime >= 0 && stopTime >= startTime)
            {
                editButton.disabled = false;
                editButton.style.opacity = "1.0";
            }
            else
            {
                addStopTimeButton.innerHTML = "Set Stop Time";
                stopTime = -1;
                editButton.disabled = true;
                editButton.style.opacity = "0.7";
            }
        }
    });
    
    addStopTimeButton.addEventListener("click", function () {
        if (currentAddedVideo != null)
        {
            stopTime = currentAddedVideo.currentTime;
            addStopTimeButton.innerHTML = "Stop Time: " + minuteSecondTime(stopTime);
            if (startTime >= 0 && stopTime >= startTime)
            {
                editButton.disabled = false;
                editButton.style.opacity = "1.0";
            }
            else
            {
                addStartTimeButton.innerHTML = "Set Start Time";
                startTime = -1;
                editButton.disabled = true;
                editButton.style.opacity = "0.7";
            }
        }
    });
    
    addDefaultButton.addEventListener("click", function () {
        if (currentAddedVideo != null)
        {
            addDefaultButtonPressed = !addDefaultButtonPressed;
            console.log(addDefaultButtonPressed);
            if (addDefaultButtonPressed)
            {
                startTime = 0;
                stopTime = currentAddedVideo.duration;
                addStartTimeButton.innerHTML = "Start Time: " + minuteSecondTime(startTime);
                addStopTimeButton.innerHTML = "Stop Time: " + minuteSecondTime(stopTime);
                editButton.disabled = false;
                editButton.style.opacity = "1.0";
            }
            else
            {
                startTime = -1;
                stopTime = -1;
                addStartTimeButton.innerHTML = "Set Start Time";
                addStopTimeButton.innerHTML = "Set Stop Time";
                editButton.disabled = true;
                editButton.style.opacity = "0.7";
            }
        }
    });
    
    // nextFrameButton Event Listener
    nextFrameButton.addEventListener("click", function () {
        // Move Forward 5 frames
        video.currentTime += (5 / 29.97);
    });
    
    // prevFrameButton Event Listener
    prevFrameButton.addEventListener("click", function () {
        // Move Backward 5 frames
        video.currentTime -= (5 / 29.97);
    });

    // Event listener for the seek bar
    seekBar.addEventListener("change", function () {
        if (currentAddedVideo != null)
        {
            var time = currentAddedVideo.duration * (seekBar.value / 100);
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
        
        playButton.style.backgroundImage = 'url("images/video.png")';
    });

    // Update the seek bar as the video plays
    video.addEventListener("timeupdate", function () {
        // Calculate the slider value
        var value = (100 / video.duration) * video.currentTime;

        // Update the slider value
        seekBar.value = value;
        
        timeDiv.innerHTML = minuteSecondTime(video.currentTime);
        
        // Check whether user went back in time
        if (editsObj.videoTimes.length > 0)
        {
            if (video.currentTime < editsObj.videoTimes[editsObj.videoTimes.length - 1])
            {
                didEditPast = true;
            }
            else
            {
                didEditPast = false;
            }
        }
    });

    // Pause the video when the slider handle is being dragged
    seekBar.addEventListener("mousedown", function () {
        if(currentAddedVideo != null)
        {
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