/*
 * Name: Skip, Aaron, Connor, Ryan
Email: skip@stritter.com
Owner: VillageTech Solutions (villagetechsolutions.org)
Date: 2016 07
Revision: Looma Video Editor 1.0

filename: looma-edited-video.js
Description: videoplayer controls for videoplayer.php
Attribution: slightly borrowed from Matt West (blog.teamtreehouse.com)
 */

// Arrays of Edited Video Information
var videoPath;

var editsObj = {
	fileTypes: []
	, videoName: vn
    , fileName: fn
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
    var fullscreenControlButton = document.getElementById("fullscreen-control");
    
    // Media Controls - Sliders
	var seekBar = document.getElementById("seek-bar");
	var volumeBar = document.getElementById("volume-bar");
    
    //Edit Controls
    var editControls = document.getElementById("edit-controls");
    var loginButton = document.getElementById("login");
    var videoDelete = document.getElementById("delete");
    
    // Edit Controls - Renaming a video
    var renameButton = document.getElementById("rename");
    var didSaveOnce = false;    // Set to true after user saves one time
    var didRename = false;
    var renameFormDiv = document.getElementById("rename-form-div");
    var renameInput = document.getElementById("rename-text");
    var renameSubmitButton = document.getElementById("rename-form-submit-button");
    
    // Edit Controls - Cancelling an edit
    var cancelButton = document.getElementById("cancel");
    
    // Edit Controls - Making an edit
    var editButton = document.getElementById("edit");
    
    // Edit Controls - Adding Text
    var textButton = document.getElementById("text");
    
    //Edit Controls - Searching
    var searchArea = document.getElementById("search-area");
    var searchBox = document.getElementById("search-box");
    var message = "";

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
	var next5FrameButton = document.getElementById("next-frame5");
	var prev5FrameButton = document.getElementById("prev-frame5");
    
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
    var currentBlackScreen = null;
    
    // Displaying Edits - Overlays
    
    //Base zIndexs
    var baseImageZ = 2;
    var basePdfZ = 3;
    var baseAddedVideoZ = 4;
    var baseTextZ = 5;
    var overlayZ = 6;
    
    // Overlay areas
    var pdfArea = document.getElementById("pdf-area");
    var imageArea = document.getElementById("image-area");
    var textBoxArea = document.getElementById("text-box-area");
    var textArea = document.getElementById("comments");
    var addedVideoArea = document.getElementById("added-video-area");
    var videoArea = document.getElementById("video-area");
    
    // Timeline Edits - Clicking on a button in the timeline
    var timelineEdit = false; // True when the user is editing through the timeline
    var timelineImageTime = -1; // For keeping the time when the image is displayed
    var timelineImageType = ""; // For displaying the image the user clicks on in the timeline
    var timelineImagePath = ""; // For displaying the image when user clicks on button in timeline
    var timelineImageText = ""; // For displaying text when user clicks on button in timeline
    var didEditPast = false; // True when user went back in time and added an edit
    var deleteButtonId = 0;
    
    var timelineArea = document.getElementById("timeline-area");
    
    // Other var for timeline
	var timelineImageHeight;
	var timelineImageWidth;
    
    // Playback var
    var endTime;
    var index = 0;
    var removeCounter = 0;
    
    // MongoDB
    var didSaveToDBOnce = false;
    
    // Important Functions
    
    // Important Functions - Changing CSS
    function hideElements(elements)
    {
        for (var x = 0; x < elements.length; x++)
        {
            elements[x].style.display = "none";
        }
    }
    function hideAllElements()
    {
        hideElements([mediaControls, editButton, cancelButton, textButton, imageButton, pdfButton, videoButton, imagePreviewDiv, pdfPreviewDiv, videoPreviewDiv, submitButton, addTimeDiv, next5FrameButton, nextFrameButton, prev5FrameButton, prevFrameButton]);
    }
    function displayElementsInline(elements)
    {
        for (var i = 0; i < elements.length; i++)
        {
            elements[i].style.display = "inline";
        }
    }
    function disableButton(button)
    {
        button.disabled = true;
        button.style.opacity = "0.7";
    }
    
    function enableButton(button)
    {
        button.disabled = false;
        button.style.opacity = "1.0";
    }
    
    // Important Functions - Video
    function playVideo(vid)
    {
        vid.play();
        playButton.style.backgroundImage = 'url("images/pause.png")';    
    }
    function pauseVideo(vid)
    {
        vid.pause();
        playButton.style.backgroundImage = 'url("images/video.png")';
    }
    
    // Important Functions - Displaying Edits - Media Overlays
    function removeCurrentText() {
        if (currentText != null)
        {
            currentText = null;
            textArea.style.display = "none";
            textBoxArea.style.display = "none";
        }
    }
    function removeCurrentImage()
    {
        if (currentImage != null)
        {
            imageArea.removeChild(currentImage);
            currentImage = null;
        }
    }
    function removeCurrentPdf()
    {
        if (currentPdf != null)
        {
            pdfArea.removeChild(currentPdf);
            currentPdf = null;
        }
    }
    function removeCurrentAddedVideo()
    {
        if (currentAddedVideo != null)
        {
            addedVideoArea.removeChild(currentAddedVideo);
            currentAddedVideo = null;
        }
    }
    function removeCurrentBlackScreen()
    {
        if(currentBlackScreen != null) {
                document.getElementById("video-area").removeChild(currentBlackScreen);
            }
    }
    
    // Important Functions - Timeline Functions
    function getFilesBefore(index)
    {
        var filesBefore = 0;
        for(var x = 0; x < index; x++)
        {
            if(editsObj.fileTypes[x] == "image" || editsObj.fileTypes[x] == "pdf" || editsObj.fileTypes[x] == "video")
            {
                filesBefore++;
            }   
        }
        return filesBefore;
    }
    
    if (commands != null)
    {
        didSaveOnce = true;
        if (commands.fileTypes != null) {
            editsObj.fileTypes = commands.fileTypes;
        }
        if (commands.videoName != null) {
            editsObj.videoName = commands.videoName;
        }
        if (commands.fileName != null) {
            editsObj.fileName = commands.fileName;
        }
        if (commands.videoTimes != null) {
            editsObj.videoTimes = commands.videoTimes;
            console.log(editsObj.videoTimes);
            if (editsObj.videoTimes.indexOf("0") > -1)
            {
                disableButton(textButton);
                disableButton(imageButton);
                disableButton(pdfButton);
                disableButton(videoButton);
                disableOneTime = true;
            }
        }
        if (commands.videoText != null) {
            editsObj.videoText = commands.videoText;
        }
        if (commands.filePaths != null) {
            editsObj.filePaths = commands.filePaths;
        }
        if (commands.addedVideoTimes != null) {
            editsObj.addedVideoTimes = commands.addedVideoTimes;
        }
    }
    else (commands == null)
    {
        loginButton.innerHTML = "Log Out";
        editButton.style.display = "inline";
        videoDelete.style.display = "inline";
    }
    
    // Event Listeners
    
		var isFullscreen = false;
	$('#fullscreen-control').click(function (e) {
		e.preventDefault();
		if(!isFullscreen)
		{
		e.preventDefault();
		screenfull.toggle(videoArea);
		isFullscreen = true;
		fullscreenPlayPauseButton.style.display = "block";
		videoArea.className = "fullscreen";
		videoArea.style.width = "100%";
		}
		else
		{
		e.preventDefault();
		screenfull.toggle(videoArea);
		isFullscreen = false;
		fullscreenPlayPauseButton.style.display = "none";
		videoArea.className = "";
		}
	});
    

	// Video Event Listener
	video.addEventListener('loadeddata', function () {
        //Sets the video-area to the size of the video by finding the calculated width of the video
		var vidWidth = window.getComputedStyle(video).getPropertyValue("width");
		var videoArea = document.getElementById("video-area");
		videoArea.style.width = parseInt(vidWidth) + "px";

		var videoPlayer = document.getElementById("video-player");
		//var timelineArea = document.getElementById("timeline-area");
        
        //Makes the timline area fills the space to the left of the video
		timelineArea.style.width = ((videoPlayer.offsetWidth / 2) - (video.offsetWidth / 2)) + "px";
		timelineArea.style.height = video.offsetHeight + "px";
        
        //The timeline puts 1 image across leaving 30px for the scrollbar
		timelineImageWidth = timelineArea.offsetWidth - 30;
        //There can be 6 rows of images before a scrollbar is created
		timelineImageHeight = timelineArea.offsetHeight / 3;
        
        //Updates timeline if edits already exist
        if (editsObj.videoTimes.length > 0)
        {
            if(editsObj.videoTimes[0] > 0)
            {
                show_image_timeline(false, thumbFile, thumbFile, "null", 0);
            }
            
            for(var i = 0; i < editsObj.videoTimes.length; i++)
            {
                if(editsObj.fileTypes[i] == "text")
                {
                    var textsBefore = 0;
                    for(var x = 0; x < i; x++)
                    {
                        if(editsObj.fileTypes[x] == "text")
                        {
                            textsBefore++;
                        }
                    }
                    show_text_timeline(editsObj.videoText[textsBefore], editsObj.videoTimes[i]);
                }
                else if(editsObj.fileTypes[i] == "image")
                {
                    console.log("image");
                     var imgLoc = editsObj.filePaths[getFilesBefore(i)];
                    show_image_timeline(true, imgLoc, imgLoc, "image", editsObj.videoTimes[i]);
                    
                }
                else if(editsObj.fileTypes[i] == "pdf")
                {
                    console.log("pdf");
                    var pdfLoc = editsObj.filePaths[getFilesBefore(i)];
                    show_image_timeline(true, pdfLoc.substr(0, pdfLoc.length - 4) + "_thumb.jpg", pdfLoc, "pdf", editsObj.videoTimes[i]);
                }
                else if(editsObj.fileTypes[i] == "video")
                {
                    console.log("video");
                    var filesBefore = 0;
                    var videoLoc = editsObj.filePaths[getFilesBefore(i)];
                    show_image_timeline(true, videoLoc.substr(0, videoLoc.length - 4) + "_thumb.jpg", videoLoc, "video", editsObj.videoTimes[i]);
                    
                }
                if(i < editsObj.videoTimes.length - 1)
                {
                    if((editsObj.videoTimes[i+1] - editsObj.videoTimes[i]) > 1)
                    {
                        show_image_timeline(false, thumbFile, thumbFile, "null", -1);
                    }
                }
            }
        }
	});

	
	// Event listener for the play pause button that appears when in fullscreen
	fullscreenPlayPauseButton.addEventListener("click", function() {
		 if(currentAddedVideo != null)
        {
            // Play or Pause the Current Added Video
            toggleCurrentAddedVideo();
            window.requestAnimationFrame(checkTime);
			if (video.paused)
			{
				fullscreenPlayPauseButton.style.backgroundImage = 'url("images/video.png")';	
			}
			else
			{
				fullscreenPlayPauseButton.style.backgroundImage = 'url("images/pause.png")';	
			}
        }
        else 
        {
            // Play or pause the video
            toggleVideo();
            window.requestAnimationFrame(checkTime);
            
            //Stop showing the textbox
            textArea.style.display = "none";
            
            removeCurrentImage();
            
            removeCurrentPdf();
			
			if (video.paused)
			{
				fullscreenPlayPauseButton.style.backgroundImage = 'url("images/video.png")';	
			}
			else
			{
				fullscreenPlayPauseButton.style.backgroundImage = 'url("images/pause.png")';	
			}
        }
	});
    
	// Play Button Event Listener
	playButton.addEventListener("click", function () {
        if(currentAddedVideo != null)
        {
            // Play or Pause the Current Added Video
            toggleCurrentAddedVideo();
            window.requestAnimationFrame(checkTime);
        }
        else 
        {
            // Play or pause the video
            toggleVideo();
            window.requestAnimationFrame(checkTime);
            
            //Stop showing the textbox
            textArea.style.display = "none";
            
            removeCurrentImage();
            
            removeCurrentPdf();
        }
	});
    
    function toggleCurrentAddedVideo() {
        if (currentAddedVideo.paused == true) 
            {
                playVideo(currentAddedVideo); 
            } 
            else 
            {
                pauseVideo(currentAddedVideo);
            }
    }
    
    function toggleVideo() {
        if (video.paused == true)
        {
                playVideo(video);

                //When the user hits play after making an edit it adds the thumbnail of the video to the timeline
                if (edited == true)
                {
                    if (!didEditPast)
                    {
                        show_image_timeline(false, thumbFile, thumbFile, "null", video.currentTime);
                        edited = false;
                    }
                }
        }
            else 
            {
                pauseVideo(video);
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
    
    loginButton.addEventListener("click", function () {
        if (loginButton.innerHTML == "Log Out")
        {
            loginButton.innerHTML = "Log In";
            editButton.style.display = "none";
            videoDelete.style.display = "none";
            pauseVideo(video);
        }
        else
        {
            loginButton.innerHTML = "Log Out";
            editButton.style.display = "inline";
            videoDelete.style.display = "inline"
            pauseVideo(video);
        }
    });
    
    renameButton.addEventListener("click", function () {
        // Rename video
        pauseVideo(video);
        hideElements([mediaControls, renameButton, cancelButton, textButton, imageButton, pdfButton, videoButton, submitButton, nextFrameButton, prevFrameButton, prev5FrameButton, next5FrameButton]);
        renameFormDiv.style.display = "block";
    });
    
    renameSubmitButton.addEventListener("click", function () { 
        timelineArea.style.visibility = "visible";
        if(renameInput.value == "") {
            newName = editsObj.videoName.substr(0, editsObj.videoName.length-4);
        }
        else {
            var newName = renameInput.value;
        }
        
        if (didSaveOnce)
        {
            hideElements([renameFormDiv]);
            mediaControls.style.display = "block";
            document.getElementById("volume").style.display = "inline";
            volumeBar.style.display = "inline";
            editButton.innerHTML = "Edit";
            editButton.style.display = "inline"; 
            var videoName = editsObj.videoName.substring(0, editsObj.videoName.lastIndexOf(".")); 
            console.log(editsObj.fileName);
        $.ajax("looma-rename-edited-video.php", {
            data: {info: editsObj, oldPath: editsObj.fileName, newPath: newName, vn: videoName, vp: videoPath},
            method: "POST",
            complete: function() {
                editsObj.fileName = newName;
            }
        });
        
        }
        else
        {
            displayElementsInline([renameButton, cancelButton, textButton, imageButton, pdfButton, videoButton, nextFrameButton, prevFrameButton, next5FrameButton, prev5FrameButton, mediaControls]);
			volumeBar.style.display = "none";
			muteButton.style.display = "none";
            renameFormDiv.style.display = "none";
            didSaveOnce = true;
            editsObj.fileName = newName;
        }
        
        
        //newName = $('<div/>').text(renameInput.value).html();
        
        return true;
    });

	// Event listener for the edit button
	editButton.addEventListener("click", function () {
		if (editButton.innerHTML == "Save") 
        {
            loginButton.style.display = "inline";
            
            searchArea.style.display = "none";
            
            disableButton(textButton);
            disableButton(imageButton);
            disableButton(pdfButton);
            disableButton(videoButton);
            // Set timeDiv back to normal video time
            timeDiv.innerHTML = minuteSecondTime(video.currentTime);
            seekBar.value = (100 / video.duration) * video.currentTime;
            // Set other changes back to normal
            mediaControls.style.height = "20%";
            editControls.style.height = "10%";
            cancelButton.style.height = "52%";
            editButton.style.height = "52%";
            if (!didSaveOnce)
            {
                // Save file as...
                save();
            }
            
            else
            {
            
                toggleControlsForSaveButton();
                save();
            }
            pauseVideo(video);
            if(currentBlackScreen != null) {
                document.getElementById("video-area").removeChild(currentBlackScreen);
            }
            index++;
            removeCurrentText();
            removeCurrentImage();
            removeCurrentPdf();
            removeCurrentAddedVideo();
            
            if(commands != null)
                videoDelete.style.display = "inline";
        } 
		else
		{
            // Hide Media controls
            hideElements([mediaControls, editButton, loginButton, videoDelete]);
            
            // Display edit options
            if (didSaveOnce)
            {
                displayElementsInline([renameButton, cancelButton, textButton, imageButton, pdfButton, videoButton, nextFrameButton, prevFrameButton, next5FrameButton, prev5FrameButton, mediaControls]);
				muteButton.style.display = "none";
				volumeBar.style.display = "none";
                timelineArea.style.visibility = "visible";
            }
            else
            {
                saveAs();
            }
            

            // change the edit button to say save
            editButton.innerHTML = "Save";

            pauseVideo(video);
        }

    });
    
    function saveAs() {
        hideElements([renameButton, cancelButton, textButton, imageButton, pdfButton, videoButton, submitButton, nextFrameButton, prevFrameButton, next5FrameButton, prev5FrameButton, mediaControls, imagePreviewDiv, textArea, videoPreviewDiv, pdfPreviewDiv, editButton, addTimeDiv]);
        
        renameFormDiv.style.display = "block";
        //didSaveOnce = true;  
    }
    
    function save() {
                //Displays preview for image
                if (timelineEdit) {
                    saveTimelineEdit();
                }
                else {
                    saveEdit();
                }

                currentEdit = "";


                // Send to server to save as a txt file
                var videoName = editsObj.videoName.substring(0, editsObj.videoName.lastIndexOf("."));
                $.ajax("looma-video-db-save.php", {
                    data: {info: editsObj, vn: videoName, vp: videoPath, location: editsObj.fileName, doesExist: didSaveToDBOnce},
                    method: "POST",
                    complete: function() {
                        didSaveToDBOnce = true;
                    }
                });
    }
    
    function toggleControlsForSaveButton() {
        // Hide Edit Controls
        hideElements([renameButton, cancelButton, textButton, imageButton, pdfButton, videoButton, submitButton, nextFrameButton, prevFrameButton,  imagePreviewDiv, pdfPreviewDiv, videoPreviewDiv, addTimeDiv]);
            
        // Redisplay media controls
        mediaControls.style.display = "block";
        displayElementsInline([document.getElementById("volume"), volumeBar, muteButton]);
        
        // change the edit button to say edit
        editButton.innerHTML = "Edit";
    }
    
    function saveTimelineEdit() {
        if (currentText != null) {
            insertText();
            textArea.readOnly = true;
            removeCurrentText();
        }
        else if (image_src != "") {        
            // Insert Edit
            insertSrc(image_src, image_src, "image");
            
            removeCurrentImage();
            image_src = "";
        }
        else if (pdf_src != "") {
            // Save pdf
            insertSrc(pdf_src.substr(0, pdf_src.length - 4) + "_thumb.jpg", pdf_src, "pdf");
            if (currentPdf != null)
            {
                removeCurrentPdf();
                pdf_src = "";
            }
        }
        else if (video_src != "") {
            // Save video
            insertSrc(video_src.substr(0, video_src.length - 4) + "_thumb.jpg", video_src, "video");
            if (currentAddedVideo != null)
            {
                removeCurrentAddedVideo();
                video_src = "";
            }
            if(currentBlackScreen != null) {
                document.getElementById("video-area").removeChild(currentBlackScreen);
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
        if (numTextFiles < editsObj.videoText.length - 1)
        {
            editsObj.videoText.splice(numTextFiles, 0, currentText.value);
            console.log(editsObj.videoText);
        }
        else
        {
            editsObj.videoText.push(currentText.value);
            editsObj.videoText.splice(numTextFiles, 1);
        }
        //editsObj.videoText.splice(numTextFiles, 1);
        
        console.log("1");
        show_text_timeline(currentText.value, video.currentTime);
        timelineImageText = "";
        timelineEdit = false;
        console.log(editsObj.videoText);
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
            if (time >= editsObj.videoTimes[length - 1])
            {
                editsObj.videoTimes.push(time);    
            }
            else
            {
                // Time is in between two other times
                for (var i = length - 1; i > -1; i--)
                {
                    if (time >= editsObj.videoTimes[i]) {
                        //didEditPast = true;
                        editsObj.videoTimes.splice(i, 0, time);
                        break;
                        //i += length;
                    }
                }
            }
        }
        else
        {
            console.log("editsObj.videoTimes.length <= 0");
            // Empty array
            editsObj.videoTimes.push(time);
        }
        
    }
    
    searchBox.addEventListener ("input", function() {
        var i = 0;
        var changed = false;
        if(imagePreviewDiv.style.display != "none") {
            while(changed == false && i < imageOptionButtons.length) {
                var newMessage = searchBox.value;
                if (newMessage != message) {
                    message = newMessage;
                }
                if(imageOptionButtons[i].children[0].childNodes[1].data.toLowerCase().indexOf(message.toLowerCase()) == -1)
                {
                    imageOptionButtons[i].style.display = "none";
                }
                else
                {
                    imageOptionButtons[i].style.display = "";
                }
                i++;
            }
        }
        if(pdfPreviewDiv.style.display != "none") {
            while(changed == false && i < pdfOptionButtons.length) {
                var newMessage = searchBox.value;
                if (newMessage != message) {
                    message = newMessage;
                }
                if(pdfOptionButtons[i].children[0].childNodes[1].data.toLowerCase().indexOf(message.toLowerCase()) == -1)
                {
                    pdfOptionButtons[i].style.display = "none";
                }
                else
                {
                    pdfOptionButtons[i].style.display = "";
                }
                i++;
            }
        }
        if(pdfPreviewDiv.style.display != "none") {
            while(changed == false && i < pdfOptionButtons.length) {
                var newMessage = searchBox.value;
                if (newMessage != message) {
                    message = newMessage;
                }
                if(pdfOptionButtons[i].children[0].childNodes[1].data.toLowerCase().indexOf(message.toLowerCase()) == -1)
                {
                    pdfOptionButtons[i].style.display = "none";
                }
                else
                {
                    pdfOptionButtons[i].style.display = "";
                }
                i++;
            }
        }
        if(videoPreviewDiv.style.display != "none") {
            while(changed == false && i < videoOptionButtons.length) {
                var newMessage = searchBox.value;
                if (newMessage != message) {
                    message = newMessage;
                }
                if(videoOptionButtons[i].children[0].childNodes[1].data.toLowerCase().indexOf(message.toLowerCase()) == -1)
                {
                    videoOptionButtons[i].style.display = "none";
                }
                else
                {
                    videoOptionButtons[i].style.display = "";
                }
                i++;
            }
        }
    });

    /**
    * Must be called after insertVideoTime is called and must be called with insertFilePath
    */
    function insertFileType(fileType, time) {
        if (editsObj.fileTypes.length > 0) {
            var index = editsObj.videoTimes.lastIndexOf(time);
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
            var timeIndex = editsObj.videoTimes.lastIndexOf(time);
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
            var index = editsObj.videoTimes.lastIndexOf(time);
            
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
            var timeIndex = editsObj.videoTimes[editsObj.videoTimes.lastIndexOf(time)];
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
        pauseVideo(video);
        displayElementsInline([loginButton, document.getElementById("volume"), volumeBar, muteButton]);
        mediaControls.style.height = "20%";
        editControls.style.height = "10%";
        cancelButton.style.height = "52%";
        editButton.style.height = "52%";
        editButton.disabled = false;
        editButton.style.opacity = "1.0";
        toggleControlsForCancelButton();
        video.pause();
        
        searchArea.style.display = "none";
        
        cancelEdit();
        
        // Redisplay media controls
        mediaControls.style.display = "block";
        playButton.style.backgroundImage = 'url("images/video.png")';
    });
    
    function toggleControlsForCancelButton() {
        // Hide Edit Controls
        hideElements([renameButton, cancelButton, textButton, imageButton, pdfButton, videoButton, textArea, submitButton, nextFrameButton, prevFrameButton, next5FrameButton, prev5FrameButton, imagePreviewDiv, pdfPreviewDiv, videoPreviewDiv, addTimeDiv]);
        
        // Redisplay media controls
        mediaControls.style.display = "block";
        
        // Redisplay edit button
        editButton.style.display = "inline";

        // change the edit button to say edit
        editButton.innerHTML = "Edit";
        
        // Shows delete button
        if(commands != null)
            videoDelete.style.display = "inline";
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
            if (currentText != null)
            {
                document.getElementById("timeline-area").removeChild(currentText);
                currentText = null;
            }
        }
        else if (currentEdit == "image")
        {      
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
            
                    // Stop Showing Added Video
                    addedVideoArea.removeChild(currentAddedVideo);
                    currentAddedVideo = null;
                }
            
            video_src = "";
            removeCurrentBlackScreen();
        }
        
        currentEdit = "";
    }
    
	// Event listener for the text button
	textButton.addEventListener("click", function () {
        pauseVideo(video);
		//Hide Controls
        hideElements([renameButton, cancelButton, pdfButton, textButton, imageButton, videoButton, editButton, mediaControls, nextFrameButton, next5FrameButton, prev5FrameButton, prevFrameButton]);

		// Clear Text Area
		textArea.value = "";

		// show the text area and submit button
        displayElementsInline([textArea, submitButton]);
        
        //Puts textArea on top
        imageArea.style.zIndex = baseImageZ;
        pdfArea.style.zIndex = basePdfZ;
        addedVideoArea.style.zIndex = baseAddedVideoZ;
        textBoxArea.style.zIndex = overlayZ;
	});
    
    // Event listener for submit button
    submitButton.addEventListener("click", function () {
        // Redisplay Edit Controls
        displayElementsInline([cancelButton, editButton]);
        
        currentText = textArea;
        
        // don't show the submit button
        submitButton.style.display = "none";
        
        removeCurrentImage();
    
        return true;
    });
    
    // Event listener for image button
    imageButton.addEventListener("click", function () {
        pauseVideo(video);

        // Hide Controls
        hideElements([renameButton, pdfButton, textButton, imageButton, videoButton, mediaControls, nextFrameButton, prevFrameButton, next5FrameButton,
					 prev5FrameButton]);
        
        searchArea.style.display = "inline";
        
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
                var deleteButton = document.createElement("button");
                if (editsObj.videoTimes.length > 0)
                {
                    button.className = editsObj.videoTimes[editsObj.videoTimes.indexOf(time)];
                    button.src = src;
                    button.innerHTML = minuteSecondTime(editsObj.videoTimes[editsObj.videoTimes.indexOf(time)]);
                    deleteButton.id = deleteButtonId;
                    deleteButtonId++;
                    deleteButton.innerHTML = "Delete";
                    deleteButton.src = src;
                }
                else
                {
                    button.innerHTML = "";
                    deleteButton.innerHTML = "";
                }
                
                addTimelineButtonEventListener(button, type);
                deleteButtonEventListener(deleteButton, type);
                
                hoverDiv.appendChild(button);
                hoverDiv.appendChild(deleteButton);
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
                var deleteButton = document.createElement("button");
                if (editsObj.videoTimes.length > 0)
                {
                    button.className = editsObj.videoTimes[editsObj.videoTimes.indexOf(time)];
                    button.src = src;
                    button.innerHTML = minuteSecondTime(editsObj.videoTimes[editsObj.videoTimes.indexOf(time)]);
                    deleteButton.id = deleteButtonId;
                    deleteButtonId++;
                    deleteButton.innerHTML = "Delete";
                    deleteButton.src = src;
                }
                else
                {
                    button.innerHTML = "";
                    deleteButton.innerHTML = "";
                }
                
                addTimelineButtonEventListener(button, type);
                deleteButtonEventListener(deleteButton, type);
                
                hoverDiv.appendChild(button);
                hoverDiv.appendChild(deleteButton);
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
    
    function deleteButtonEventListener(button, type) 
    {
        button.addEventListener("click", function() {
            var index = button.id - removeCounter;
            
            if(type == "text")
            {
                var textsBefore = 0;
                for(var i = 0; i < editsObj.fileTypes.length; i++)
                {
                    if(editsObj.fileTypes[i] == "text")
                    {
                        textsBefore++;
                    }
                }
                editsObj.videoText.splice(textsBefore, 1);
                editsObj.videoTimes.splice(index, 1);
                editsObj.fileTypes.splice(index, 1);
                
            }
            else if(type == "image")
            {
                var filesBefore = 0;
                for(var i = 0; i < index; i++)
                {
                    if(editsObj.fileTypes[i] == "image" || editsObj.fileTypes[i] == "pdf" || editsObj.fileTypes[i] == "video")
                    {
                       filesBefore++;
                    }
                }
                editsObj.filePaths.splice(filesBefore, 1);
                editsObj.videoTimes.splice(index, 1);
                editsObj.fileTypes.splice(index, 1);
            }
            else if(type == "pdf")
            {
                var filesBefore = 0;
                for(var i = 0; i < index; i++)
                {
                    if(editsObj.fileTypes[i] == "image" || editsObj.fileTypes[i] == "pdf" || editsObj.fileTypes[i] == "video")
                    {
                       filesBefore++;
                    }
                }
                editsObj.filePaths.splice(filesBefore, 1);
                editsObj.videoTimes.splice(index, 1);
                editsObj.fileTypes.splice(index, 1);
            }
            else if(type == "video")
            {
                var filesBefore = 0;
                for(var i = 0; i < index; i++)
                {
                    if(editsObj.fileTypes[i] == "image" || editsObj.fileTypes[i] == "pdf" || editsObj.fileTypes[i] == "video")
                    {
                       filesBefore++;
                    }
                }
                editsObj.filePaths.splice(filesBefore, 1);
                
                var videosBefore = 0;
                for(var i = 0; i < index; i++)
                {
                    if(editsObj.fileTypes[i] == "video")
                    {
                        videosBefore += 2;
                    }
                }
                editsObj.addedVideoTimes.splice(videosBefore, 2);
                editsObj.videoTimes.splice(index, 1);
                editsObj.fileTypes.splice(index, 1);
            }
            //button.parentElement.parentElement.parentElement.style = "none";
            $(button.parentElement.parentElement).remove();
            var videoName = editsObj.videoName.substring(0, editsObj.videoName.lastIndexOf("."));
             $.ajax("looma-video-db-save.php", {
                data: {info: editsObj, vn: videoName, vp: videoPath, location: editsObj.fileName, doesExist: didSaveToDBOnce},
                    method: "POST",
                    complete: function() {
                    didSaveToDBOnce = true;
                }
            });
            
            //Reset view to normal
            displayElementsInline([loginButton, document.getElementById("volume"), volumeBar, muteButton]);
            toggleControlsForCancelButton();
            cancelEdit();
            removeCounter++;
        });
    }
    
    function addTimelineButtonEventListener(button, type) 
    {
        button.addEventListener("click", function()
        {
            pauseVideo(video);
            enableButton(editButton);
            enableButton(imageButton);
            enableButton(textButton);
            enableButton(pdfButton);
            enableButton(videoButton);
            // Open the edit
            hideAllElements();
            removeCurrentText();
            removeCurrentImage();
            removeCurrentPdf();
            removeCurrentAddedVideo();
            removeCurrentBlackScreen();
            video.currentTime = this.className;
            pauseVideo(video);
                    
            if (type == "text") 
            {
                currentEdit = "text";
                // Show text to edit
                findText(this);
                toggleTimelineControls();
                cancelButton.style.display = "none";
                editButton.innerHTML = "Save";

                timelineEdit = true;
                
                //textArea = currentText;
                textArea.value = timelineImageText;
                textArea.readOnly = false;
                // Need to do something with currentText so that cancelButton can remove it from timeline

                // show the text area and submit button
                textArea.style.display = "inline";
                //currentText = textArea;
                textBoxArea.style.display = "block";
                submitButton.style.display = "inline";

                //Puts the text on top
                pdfArea.style.zIndex = basePdfZ;
                textBoxArea.style.zIndex = overlayZ
                addedVideoArea.style.zIndex = baseAddedVideoZ;
                imageArea.style.zIndex = baseImageZ;

            }        
            else if (type == "image") 
            {
                currentEdit = "image";
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
                currentEdit = "pdf";
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
                currentEdit = "video";
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
                        timelineImageTime = editsObj.videoTimes[i];
                        timelineImageText = editsObj.videoText[j];
                    }
                } 

            }
        }
    }
    
    function toggleTimelineControls() {
         // Hide Controls
        hideElements([renameButton, editButton, pdfButton, textButton, imageButton, videoButton, mediaControls, nextFrameButton, prevFrameButton, next5FrameButton, prev5FrameButton]);
        
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
            var deleteButton = document.createElement("button");
            if (editsObj.videoTimes.length > 0)
            {
                //timelineButton.className = editsObj.videoTimes[editsObj.videoTimes.indexOf(time)];
                timelineButton.className = time;
                timelineButton.innerHTML = minuteSecondTime(editsObj.videoTimes[editsObj.videoTimes.indexOf(time)]);
                deleteButton.id = deleteButtonId;
                deleteButtonId++;
                deleteButton.innerHTML = "Delete";
            }
            else
            {
                timelineButton.innerHTML = "";
                deleteButton.innerHTML = "";
            }

            addTimelineButtonEventListener(timelineButton, "text");
            deleteButtonEventListener(deleteButton, "text");

            hoverDiv.appendChild(timelineButton);
            hoverDiv.appendChild(deleteButton);
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
            var deleteButton = document.createElement("button");
            if (editsObj.videoTimes.length > 0)
            {
                //timelineButton.className = editsObj.videoTimes[editsObj.videoTimes.indexOf(time)];
                timelineButton.className = time;
                timelineButton.innerHTML = minuteSecondTime(editsObj.videoTimes[editsObj.videoTimes.indexOf(time)]);
                deleteButton.id = deleteButtonId;
                deleteButtonId++;
                deleteButton.innerHTML = "Delete";
            }
            else
            {
                timelineButton.innerHTML = "";
                deleteButton.innerHTML
            }

            addTimelineButtonEventListener(timelineButton, "text");
            deleteButtonEventListener(deleteButton, "text");

            hoverDiv.appendChild(timelineButton);
            hoverDiv.appendChild(deleteButton);
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
            textDiv.style.textOverflow = "ellipsis";
            textDiv.style.overflowWrap = "break-word";
            textDiv.style.fontSize = "xmall";
            textDiv.style.overflowY = "hidden";
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
        pauseVideo(video);
       // Hide controls
        hideElements([renameButton, pdfButton, textButton, imageButton, videoButton, mediaControls, nextFrameButton, prevFrameButton, next5FrameButton, 
					 prev5FrameButton]);
        
        searchArea.style.display = "inline";
        
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
        pauseVideo(video);
        // Hide controls
        hideElements([renameButton, pdfButton, textButton, imageButton, videoButton, mediaControls, nextFrameButton, prevFrameButton, next5FrameButton, prev5FrameButton]);
        
        searchArea.style.display = "inline";
        
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
            searchArea.style.display = "none";
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
            
            var blackScreen = document.createElement("div");
            currentBlackScreen = blackScreen
            blackScreen.id = "black-screen";
            blackScreen.style.zIndex = overlayZ - 1;
            document.getElementById("video-area").appendChild(blackScreen);
            
            //playButton.innerHTML = "Play";
            if (currentAddedVideo != null)
            {
                // Update timeDiv
                timeDiv.innerHTML = minuteSecondTime(currentAddedVideo.currentTime);
                // Set seekbar to beginning of video
                seekBar.value = 0;
                currentAddedVideo.addEventListener("timeupdate", function () {
                    if (currentAddedVideo != null)
                    { 
                        var value = (100 / currentAddedVideo.duration) * currentAddedVideo.currentTime;
                        seekBar.value = value;
                        timeDiv.innerHTML = minuteSecondTime(currentAddedVideo.currentTime);
                    }
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
    
    nextFrameButton.addEventListener("click", function () {
        video.currentTime += (1 / 29.97);
    });
    
	// prevFrameButton Event Listener
    prevFrameButton.addEventListener("click", function () {
        // Move Backward 1 frames
		video.currentTime -= (1 / 29.97);
    });
    
	next5FrameButton.addEventListener("click", function () {
		video.currentTime += (10 / 29.97);
	});
	
	prev5FrameButton.addEventListener("click", function () {
        video.currentTime -= (10 / 29.97);
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
            // Remove All Overlays
            removeCurrentText();
            removeCurrentImage();
            removeCurrentPdf();
            removeCurrentAddedVideo();
            removeCurrentBlackScreen();
            // Calculate the new time
            var time = video.duration * (seekBar.value / 100);

            // Update the video time
            video.currentTime = time;
        
            video.pause();
            
            var checking = true;
            var i = 0;
            while(checking == true)
            {
                if(i < editsObj.videoTimes.length)
                {
                    if(time <= editsObj.videoTimes[i])
                    {    
                        index = i;
                        console.log(i);
                        checking = false;
                    }
                    else
                    {    
                        i++
                    }
                }
                else
                {
                    checking = false;
                    i = editsObj.videoTimes.length;
                }
            }
        }
        
        playButton.style.backgroundImage = 'url("images/video.png")';
    });

    // Update the seek bar as the video plays
    video.addEventListener("timeupdate", function () {
        enableButton(textButton);
        enableButton(imageButton);
        enableButton(pdfButton);
        enableButton(videoButton);
        // Disable Edit Button if an edit has already been made here
        for (var i = 0; i < editsObj.videoTimes.length; i++)
        {
            if (video.currentTime == editsObj.videoTimes[i])
            {
                disableButton(textButton);
                disableButton(imageButton);
                disableButton(pdfButton);
                disableButton(videoButton);
                break;
            }
        }
        
        
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
            playVideo(currentAddedVideo);
        }
        else
        {
            playVideo(video);
        }
    });

    // Event listener for the volume bar
    volumeBar.addEventListener("change", function () {
        // Update the video volume
        video.volume = volumeBar.value;
    });
    
    function checkTime() {
		if (editsObj.videoTimes.length > 0) {
            if(index < editsObj.videoTimes.length) {
                //While there are still annotatins in the video
                if (editsObj.videoTimes[index] <= video.currentTime) {
                    //If we have passed the time stamp for the next annotation
                    if (editsObj.fileTypes[index] == "text") {
                        //If the type is a text file create a overlay and put the text there and pause the video
                        var textsBefore = 0;
                        for(var i = 0; i < index; i++)
                        {
                            if(editsObj.fileTypes[i] == "text")
                                textsBefore++;
                        }
                        var message = editsObj.videoText[textsBefore];
                        textArea.value = message;
                        textArea.style.display = 'inline-block';
                        pauseVideo(video);
						fullscreenPlayPauseButton.style.backgroundImage = 'url("images/video.png")';
                        textArea.style.zIndex = overlayZ;
                        pdfArea.style.zIndex = basePdfZ;

                    } 
                    else if (editsObj.fileTypes[index] == "image") {

                        if (currentImage != null) {
                            document.getElementById("image-area").removeChild(currentImage);
                        }
                        
                        var filesBefore = 0;
                        for(var i = 0; i < index; i++)
                        {
                            if(editsObj.fileTypes[i] == "image" || editsObj.fileTypes[i] == "pdf" || editsObj.fileTypes[i] == "video")
                                filesBefore++;
                        }
                        
                        show_image(editsObj.filePaths[filesBefore], "Image not found");
                        pauseVideo(video);
						fullscreenPlayPauseButton.style.backgroundImage = 'url("images/video.png")';
                    }
                    else if (editsObj.fileTypes[index] == "pdf") {
                        
                        var filesBefore = 0;
                        for(var i = 0; i < index; i++)
                        {
                            if(editsObj.fileTypes[i] == "image" || editsObj.fileTypes[i] == "pdf" || editsObj.fileTypes[i] == "video")
                                filesBefore++;
                        }
                        
                        //Adds a pdf to pdfArea
                        show_pdf(editsObj.filePaths[filesBefore]);
                        pauseVideo(video);
                        textArea.style.zIndex = baseTextZ;
                        pdfArea.style.zIndex = overlayZ;
						fullscreenPlayPauseButton.style.backgroundImage = 'url("images/video.png")';
                    }
                    else if (editsObj.fileTypes[index] == "video") {
                        
                        var filesBefore = 0;
                        for(var i = 0; i < index; i++)
                        {
                            if(editsObj.fileTypes[i] == "image" || editsObj.fileTypes[i] == "pdf" || editsObj.fileTypes[i] == "video")
                                filesBefore++;
                        }
                        
                        //Overlays a video inside of OverlaidVideoArea
                        pauseVideo(video);
						fullscreenPlayPauseButton.style.backgroundImage = 'url("images/video.png")';
                        
                        var videosBefore = 0;
                        for(var i = 0; i < index; i++)
                        {
                            if(editsObj.fileTypes[i] == "video")
                                videosBefore += 2;
                        }
                        
                        var startTime = editsObj.addedVideoTimes[videosBefore];
                        endTime = editsObj.addedVideoTimes[videosBefore + 1];
                        var addedVideo = document.createElement("video");
                        addedVideo.src = editsObj.filePaths[filesBefore];
                        currentAddedVideo = addedVideo;
                        document.getElementById("added-video-area").appendChild(addedVideo);
                        addedVideo.currentTime = startTime;
                        timeDiv.innerHTML = minuteSecondTime(currentAddedVideo.currentTime);
                        playButton.style.backgroundImage = 'url("images/video.png")';
						fullscreenPlayPauseButton.style.backgroundImage = 'url("images/video.png")';
                        
                        var blackScreen = document.createElement("div");
                        currentBlackScreen = blackScreen
                        blackScreen.id = "black-screen";
                        blackScreen.style.zIndex = overlayZ - 1;
                        addedVideoArea.style.zIndex = overlayZ;
                        document.getElementById("video-area").appendChild(blackScreen);
                    }
                    index++;
                }
            }
		}
        if(currentAddedVideo != null) {
            if(currentAddedVideo.paused == false) {
                // Calculate the slider value
                var value = (100 / currentAddedVideo.duration) * currentAddedVideo.currentTime;

                // Update the slider value
                seekBar.value = value;
                
                timeDiv.innerHTML = minuteSecondTime(currentAddedVideo.currentTime);
                if(currentAddedVideo.currentTime >= endTime) {
                    document.getElementById("added-video-area").removeChild(currentAddedVideo);
                    currentAddedVideo = null;
                    playButton.style.backgroundImage = 'url("images/video.png")';
                    timeDiv.innerHTML = minuteSecondTime(video.currentTime);
                    
                    removeCurrentBlackScreen();
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
    
    function show_image(src, alt) {
		var img = document.createElement("img");
		img.src = src;
		img.alt = alt;
		img.setAttribute("id", "image-overlay");
		currentImage = img;
		document.getElementById("image-area").appendChild(img);
	}
    
     function show_pdf(src) {
        var pdf = document.createElement("iframe");
        pdf.src = src;
        currentPdf = pdf;
        pdfArea.appendChild(pdf);
    }
    
    videoDelete.addEventListener("click", function() {
         $.ajax({
            url:'looma-delete-edited-video.php', 
            data: {displayName: displayName}, 
            method:'POST',
        });
        window.location = 'looma-library.php';
    });
   
});