<!doctype html>
<!--
Name: Skip, Aaron, Connor, Ryan
Email: skip@stritter.com
Owner: VillageTech Solutions (villagetechsolutions.org)
Date: 2016 06
Revision: Looma Video Editor 0.1
File: video.php
Description: Video viewer page for Looma 2

Usage: 	<button id="testvideo" data-fn="galaxies.mp4"
						 data-fp="resources/videos/"
						 data-ft="video">
			VIDEO TEST</button>
	And: $("button#testvideo").click(LOOMA.playMedia);
-->

<head>
    <?php $page_title = 'Looma Video Player';
        include ('includes/header.php');

        function thumbnail ($fn) {
				return substr($fn, 0, $fn.length - 8);
        } //end function THUMBNAIL
        ?>
</head>

<body>
    <?php
		$filename = $_REQUEST['fn'];
        //Changes the filename from .txt to .mp4 so that the mp4 will play
        $filename = substr($filename, 0, strlen($filename) - 4);
		$filepath = $_REQUEST['fp'];
	?>
        <script>
            //Sends the information from the .txt file to js
            var commands = <?php echo $_REQUEST['txt']; ?>;
            var commandsBackup = <?php echo $_REQUEST['txt']; ?>;
        </script>

        <style>
            #video-area {
                position: relative;
                margin: auto;
                z-index: 0;
            }
            
            #text-box-area {
                position: absolute;
                top: 0px;
                left: 0px;
                z-index: 1;
            }
            
            #text-playback {
                display: none;
                resize: none;
                position: relative;
                height: 100%;
                width: 100%;
                color: black;
                font: 22px/30px sans-serif;
            }
            
            #image-area {
                position: absolute;
                top: 0px;
                left: 0px;
                height: 100%;
                width: 100%;
                z-index: 2;
            }
        </style>

        <div id="main-container-horizontal">
            <div height="95%">
                <div id="overlay-container">
                    <div id="video-area">
                        <video id="video">
                            <?php echo 'poster="' . $filepath . thumbnail($filename) . '">'; ?>
                                <?php echo '<source src="' . $filepath . $filename . '"type="video/mp4">' ?>
                        </video>
                        <div id="text-box-area">
                            <textarea name="text-playback" id="text-playback" readonly="true"></textarea>
                        </div>
                        <div id="image-area"></div>
                    </div>
                </div>
            </div>
            <div id="video-controls">
                <br>
                <button id="fullscreen-control"></button>
                <br>
                <button type="button" class="media" id="play-pause">
                    <?php keyword('Play') ?>
                </button>
                <input type="range" class="video" id="seek-bar" value="0" style="display:inline-block">
                <br>
                <button type="button" class="media" id="volume">
                    <?php keyword('Volume') ?>
                </button>
                <input type="range" class="video" id="volume-bar" min="0" max="1" step="0.1" value="0.5" style="display:inline-block">
                <br>
                <button type="button" class="media" id="mute">
                    <?php keyword('Mute') ?>
                </button>
                <!--<br><button type="button" id"mute"> <?//php keyword('Edit') ?></button> -->
            </div>
        </div>
        <?php include ('includes/toolbar.php'); ?>
            <?php include ('includes/js-includes.php'); ?>
                <script src="js/looma-screenfull.js"></script>
                <script src="js/looma-edited-video.js"></script>