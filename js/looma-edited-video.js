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

var editsObj = {
	fileTypes: []
	, videoName: ""
    , fileName: ""
	, videoTimes: []
	, videoText: []
	, filePaths: []
    , addedVideoTimes: []
, }

'use strict';
$(document).ready(function () {
    
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
	

	// Video
	var video = document.getElementById("video");
    
    // Time Tracker
    var timeDiv = document.getElementById("time");
    timeDiv.innerHTML = "0:00";

	// Media Controls - play, mute, volume 
	var mediaControls = document.getElementById("media-controls");
	var playButton = document.getElementById("play-pause");
	var muteButton = document.getElementById("volume");
    
    // Sliders
	var seekBar = document.getElementById("seek-bar");
	var volumeBar = document.getElementById("volume-bar");
	
	// Make fullscreenPlayPauseButton invisible when not in fullscreen
    var fullscreenPlayPauseButton = document.getElementById("fullscreen-playpause");

	//var videoArea = document.getElementById("video-area");
	//var textPlaybackDiv = document.getElementById("text-box-area");
	var textPlaybackArea = document.getElementById("text-playback");
    //var pdfArea = document.getElementById("pdf-area");

	var currentPlaybackImage = null;
    var currentPlaybackPdf = null;
    var currentPlaybackOverlaidVideo = null;
    
    // Edit Playback
    var index = 0;
    var endTime;
    
    /**************************************************************/
    
    //Edit Controls
    var editControls = document.getElementById("edit-controls");
    var deleteButton = document.getElementById("delete");
    var editButton = document.getElementById("edit");
    var loginButton = document.getElementById("login");
    
    // Edit Controls - Renaming a video
    var renameButton = document.getElementById("rename");
    var didRename = false;
    var renameFormDiv = document.getElementById("rename-form-div");
    var renameInput = document.getElementById("rename-text");
    var renameSubmitButton = document.getElementById("rename-form-submit-button");
    var oldName = editsObj.fileName;
    
    // Edit Controls - Cancelling an edit
    var cancelButton = document.getElementById("cancel");
    
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
	
	var isFullscreen = false;
	$('#fullscreen-control').click(function (e) {
		if(!isFullscreen)
		{
		isFullscreen = true;
		fullscreenPlayPauseButton.style.display = "";
		e.preventDefault();
		screenfull.toggle(videoArea);
		videoArea.className = "fullscreen";
		videoArea.style.width = "100%";
		}
		else
		{
		isFullscreen = false;
		fullscreenPlayPauseButton.style.display = "none";
		e.preventDefault();
		screenfull.toggle(videoArea);
		videoArea.className = "";
		}
	});
    
    function checkTime() {
        commands = editsObj;
		if (editsObj.videoTimes.length > 0) {
            if(index < editsObj.videoTimes.length)
            {
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
                        video.pause();
                        playButton.style.backgroundImage = 'url("images/video.png")';
                        textArea.style.zIndex = overlayZ;
                        pdfArea.style.zIndex = basePdfZ;

                    } 
                    else if (editsObj.fileTypes[index] == "image") {
                        console.log("Call show image");

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
                        video.pause();
                        playButton.style.backgroundImage = 'url("images/video.png")';
                    }
                    else if (editsObj.fileTypes[index] == "pdf") {
                        console.log("Call show pdf");
                        
                        var filesBefore = 0;
                        for(var i = 0; i < index; i++)
                        {
                            if(editsObj.fileTypes[i] == "image" || editsObj.fileTypes[i] == "pdf" || editsObj.fileTypes[i] == "video")
                                filesBefore++;
                        }
                        
                        //Adds a pdf to pdfArea
                        show_pdf(editsObj.filePaths[filesBefore]);
                        video.pause();
                        playButton.style.backgroundImage = 'url("images/video.png")';
                        textArea.style.zIndex = baseTextZ;
                        pdfArea.style.zIndex = overlayZ;
                    }
                    else if (editsObj.fileTypes[index] == "video") {
                        
                        var filesBefore = 0;
                        for(var i = 0; i < index; i++)
                        {
                            if(editsObj.fileTypes[i] == "image" || editsObj.fileTypes[i] == "pdf" || editsObj.fileTypes[i] == "video")
                                filesBefore++;
                        }
                        
                        //Overlays a video inside of OverlaidVideoArea
                        console.log(editsObj.filePaths[filesBefore]);
                        video.pause();
                        
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
    
    function minuteSecondTime (time)
    {
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
    
    function show_pdf(src) {
        console.log("Show Pdf");
        var pdf = document.createElement("iframe");
        pdf.src = src;
        currentPlaybackPdf = pdf;
        pdfArea.appendChild(pdf);
    }


	video.addEventListener('loadeddata', function () {
		var vidWidth = window.getComputedStyle(video).getPropertyValue("width");
		videoArea.style.width = parseInt(vidWidth) + "px";
	});

	// Event listener for the play pause button that appears when in fullscreen
	fullscreenPlayPauseButton.addEventListener("click", function() {
	if(currentPlaybackOverlaidVideo != null) {
            if (currentPlaybackOverlaidVideo.paused == true) {
                // Play the video
                currentPlaybackOverlaidVideo.play();
				
				fullscreenPlayPauseButton.style.backgroundImage = 'url("images/pause.png")';
                
                //Keeps checking for new things
                window.requestAnimationFrame(checkTime);
            } 
            else {
                // Pause the video
                currentPlaybackOverlaidVideo.pause();
				
				fullscreenPlayPauseButton.style.backgroundImage = 'url("images/video.png")';
                
                //Keeps checking for new things
                window.requestAnimationFrame(checkTime);
            }
        }
        else {
            if (video.paused == true) {
                // Play the video
                video.play();
				
				fullscreenPlayPauseButton.style.backgroundImage = 'url("images/pause.png")';
                //Stop showing the textbox or the image
                textPlaybackArea.style.display = "none";

                //Keeps checking for new things
                window.requestAnimationFrame(checkTime);

                if(currentPlaybackImage != null) {
				    document.getElementById("image-area").removeChild(currentPlaybackImage);
				    currentPlaybackImage = null;
                }
                if(currentPlaybackPdf != null) {
                    pdfArea.removeChild(currentPlaybackPdf);
				    currentPlaybackPdf = null;
                }
            } 
            else {
                // Pause the video
                video.pause();
				fullscreenPlayPauseButton.style.backgroundImage = 'url("images/video.png")';
            }
        }    
	});	
	
	// Event listener for the play/pause button
	playButton.addEventListener("click", function () {
        if(currentPlaybackOverlaidVideo != null) {
            if (currentPlaybackOverlaidVideo.paused == true) {
                // Play the video
                currentPlaybackOverlaidVideo.play();

                // Update the button text to 'Pause'
                playButton.style.backgroundImage = 'url("images/pause.png")';
                
                //Keeps checking for new things
                window.requestAnimationFrame(checkTime);
            } 
            else {
                // Pause the video
                currentPlaybackOverlaidVideo.pause();

                // Update the button text to 'Play'
                playButton.style.backgroundImage = 'url("images/video.png")';
                
                //Keeps checking for new things
                window.requestAnimationFrame(checkTime);
            }
        }
        else {
            if (video.paused == true) {
                // Play the video
                video.play();

                // Update the button text to 'Pause'
                playButton.style.backgroundImage = 'url("images/pause.png")';

                //Stop showing the textbox
                console.log("hide text");
                textPlaybackArea.style.display = "none";
                textArea.style.display = "none";

                //Keeps checking for new things
                window.requestAnimationFrame(checkTime);

                if(currentPlaybackImage != null) {
				    document.getElementById("image-area").removeChild(currentPlaybackImage);
				    currentPlaybackImage = null;
                }
                if(currentPlaybackPdf != null) {
                    pdfArea.removeChild(currentPlaybackPdf);
				    currentPlaybackPdf = null;
                }
            } 
            else {
                // Pause the video
                video.pause();

                // Update the button text to 'Play'
                playButton.style.backgroundImage = 'url("images/video.png")';
            }
        }
	});

	// Event listener for the mute button
	muteButton.addEventListener("click", function () {
        if(currentPlaybackOverlaidVideo != null) {
            if (currentPlaybackOverlaidVideo.muted == false) {
                // Mute the video
                currentPlaybackOverlaidVideo.muted = true;

                // Update the button text
               muteButton.style.backgroundImage = 'url("images/mute.png")';
            } 
            else {
                // Unmute the video
                currentPlaybackOverlaidVideo.muted = false;

                // Update the button text
                muteButton.style.backgroundImage = 'url("images/auido.png")';
		    }
        }
        else {
            if (video.muted == false) {
                // Mute the video
                video.muted = true;

                // Update the button text
                muteButton.style.backgroundImage = 'url("images/mute.png")';
            } 
            else {
                // Unmute the video
                video.muted = false;

                // Update the button text
                muteButton.style.backgroundImage = 'url("images/audio.png")';
		    }
        }
	});

	// Event listener for the seek bar
	seekBar.addEventListener("change", function () {
        if(currentPlaybackOverlaidVideo != null) {
            // Calculate the new time
            var time = currentPlaybackOverlaidVideo.duration * (seekBar.value / 100);

            // Update the video time
            currentPlaybackOverlaidVideo.currentTime = time;

            playButton.style.backgroundImage = 'url("images/video.png")';
        }
        else {
            // Calculate the new time
            var time = video.duration * (seekBar.value / 100);

            // Update the video time
            video.currentTime = time;

            playButton.style.backgroundImage = 'url("images/video.png")';

            /*
            var moddedBackup = JSON.parse(JSON.stringify(commandsBackup));
            commands = moddedBackup;
            commands = editsObj;
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
            }*/
            
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
        }
	});

	// Update the seek bar as the video plays
	video.addEventListener("timeupdate", function () {
        // Calculate the slider value
        var value = (100 / video.duration) * video.currentTime;
        
        // Update the slider value
        seekBar.value = value;
        
        timeDiv.innerHTML = minuteSecondTime(video.currentTime);
        
	});

	function show_image(src, alt) {
		var img = document.createElement("img");
		img.src = src;
		img.alt = alt;
		img.setAttribute("id", "image-overlay");
		currentPlaybackImage = img;
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
    
    
    loginButton.addEventListener("click", function() {
        if (loginButton.innerHTML == "Log Out") {
            loginButton.innerHTML = "Log In";
            deleteButton.style.display = "none";
            editButton.style.display = "none"
        }
        else {
            loginButton.innerHTML = "Log Out";
            deleteButton.style.display = "inline";
            editButton.style.display = "inline";
        }
    });
    
    deleteButton.addEventListener("click", function () {
        $.ajax({
            url:'looma-delete-edited-video.php', 
            data: {fileSrc: fileSrc}, 
            method:'POST',
        });
        window.location = 'looma-library.php';
    });
    
    // Edit
    function hideElements (elements)
    {
        for (var x = 0; x < elements.length; x++)
        {
            elements[x].style.display = "none";
        }
    }
    
    renameButton.addEventListener("click", function () {
        // Rename video
        hideElements([renameButton, cancelButton, textButton, imageButton, pdfButton, videoButton, submitButton, nextFrameButton, prevFrameButton, prev5FrameButton, next5FrameButton]);
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
            editButton.innerHTML = "Edit";
            editButton.style.display = "inline"; 
        
        
        var newName = renameInput.value;
        editsObj.fileName = newName;
            
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
            
                toggleControlsForSaveButton();
                save();
            playButton.style.backgroundImage = 'url("images/video.png")';
            index++;
        } 
		else
		{
            // Hide Media controls
            hideElements([mediaControls, editButton, loginButton, deleteButton]);
            
                renameButton.style.display = "inline";
                cancelButton.style.display = "inline";
                textButton.style.display = 'inline';
                imageButton.style.display = 'inline';
                pdfButton.style.display = "inline";
                videoButton.style.display = "inline";
                nextFrameButton.style.display = "inline";
                prevFrameButton.style.display = "inline";
                next5FrameButton.style.display = "inline";
                prev5FrameButton.style.display = "inline";
				mediaControls.style.display = "inline";
				muteButton.style.display = "none";
				volumeBar.style.display = "none";

            // change the edit button to say save
            editButton.innerHTML = "Save";

            video.pause();

            // change the play-pause button to say play
            playButton.style.backgroundImage = 'url("images/video.png")';
        }

    });
    
    function saveAs() {
        hideElements([renameButton, cancelButton, textButton, imageButton, pdfButton, videoButton, submitButton, nextFrameButton, prevFrameButton, next5FrameButton, prev5FrameButton, mediaControls, imagePreviewDiv, textArea, videoPreviewDiv, pdfPreviewDiv, editButton, addTimeDiv]);
        
        renameFormDiv.style.display = "block";
        //didSave = true;  
    }
    
    function save() {
        video.pause();
        saveEdit();
        currentEdit = "";

        // Send to server to save as a txt file
        $.ajax("looma-video-editor-textConverter.php", {
            data: {info: editsObj, location: oldName},
            method: "POST"
        });
    }
    
    function toggleControlsForSaveButton() {
        // Hide Edit Controls
        hideElements([renameButton, cancelButton, textButton, imageButton, pdfButton, videoButton, submitButton, nextFrameButton, prevFrameButton,  imagePreviewDiv, pdfPreviewDiv, videoPreviewDiv, addTimeDiv]);
            
        // Redisplay media controls
        mediaControls.style.display = "block";
        document.getElementById("volume").style.display = "inline";
        volumeBar.style.display = "inline";
        muteButton.style.display = "inline";
        
        // change the edit button to say edit
        editButton.innerHTML = "Edit";
    }
    
    function saveEdit() {
       
        if (currentText != null)
        {
            console.log("save text");
            insertVideoTime(video.currentTime);
            insertFileType("text", video.currentTime);
            insertVideoText(currentText.value, video.currentTime);
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
        hideElements([renameButton, cancelButton, textButton, imageButton, pdfButton, videoButton, textArea, submitButton, nextFrameButton, prevFrameButton, next5FrameButton, prev5FrameButton, imagePreviewDiv, pdfPreviewDiv, videoPreviewDiv, addTimeDiv]);
        
        // Redisplay media controls
        mediaControls.style.display = "block";
        
        // Redisplay edit button
        editButton.style.display = "inline";

        // change the edit button to say edit
        editButton.innerHTML = "Edit";
    }
    
    function cancelEdit() {
        if (currentEdit == "text")
        {
            if (currentText != null)
            {
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
        }
        
        currentEdit = "";
    }
    
	// Event listener for the text button
	textButton.addEventListener("click", function () {
		//Hide Controls
        hideElements([renameButton, cancelButton, pdfButton, textButton, imageButton, videoButton, editButton, mediaControls, nextFrameButton, next5FrameButton, prev5FrameButton, prevFrameButton]);

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

        // don't show the submit button
        submitButton.style.display = "none";
        
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
        hideElements([renameButton, pdfButton, textButton, imageButton, videoButton, mediaControls, nextFrameButton, prevFrameButton, next5FrameButton,
					 prev5FrameButton]);
        
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
    
    pdfButton.addEventListener("click", function() {
       // Hide controls
        hideElements([renameButton, pdfButton, textButton, imageButton, videoButton, mediaControls, nextFrameButton, prevFrameButton, next5FrameButton, 
					 prev5FrameButton]);
        
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
        hideElements([renameButton, pdfButton, textButton, imageButton, videoButton, mediaControls, nextFrameButton, prevFrameButton, next5FrameButton, prev5FrameButton]);
        
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
    
    // nextFrameButton Event Listener\
    /*
    nextFrameButton.addEventListener("click", function () {
        // Move Forward 1 frames
        video.currentTime += (1 / 29.97);
    });*/
    
    var mouseDown = false;
    
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
	
    
});