<!doctype html>
<!--
Name: Skip, Aaron, Connor, Ryan
Email: skip@stritter.com
Owner: VillageTech Solutions (villagetechsolutions.org)
Date: 2016 07
Revision: Looma Video Editor 0.1
File: looma-edited-video.php
Description: Edited Video viewer page for Looma 2

Usage: 	<button id="testvideo" data-fn="A_Day_On_Earth_Edited.txt"
						 data-fp="content/videos/"
						 data-txt="{"fileTypes":["],"videoName":"A_Day_On_Earth.mp4","videoTimes":[""],"filePaths":[""]}">
			VIDEO TEST</button>
	And: $("button#testvideo").click(LOOMA.playMedia);
-->

<?php $page_title = 'Looma Video Player';
    include ('includes/header.php');

    function thumbnail ($fn) {
            return substr($fn, 0, strlen($fn) - 4) + "_thumb";
    } //end function THUMBNAIL
?>

	<link rel="stylesheet" type="text/css" href="css/looma-video.css">

	</head>

	<body>
		<?php
            //Sets the filepath and filename
            $filepath = $_REQUEST['fp']; 
            $filename = findName($_REQUEST['txt']);
        
            //Finds the name of an edited video based of the text inside the file
            function findName($txt)
            {
                //Finds the videoName from inside the text file
                $startLoc = strpos($txt, "videoName") + 12;
                $endLoc = strpos(substr($txt, $startLoc), '"') + $startLoc;
                $len = $endLoc - $startLoc;
                return substr($txt, $startLoc, $len);
            }
        ?>   
        
			<script>
				//Sends the information from the .txt file to js
				var commands = <?php echo $_REQUEST['txt']; ?>;
				var commandsBackup = <?php echo $_REQUEST['txt']; ?>;
                var fileSrc = "<?php echo $_REQUEST['fp'] . $_REQUEST['fn']; ?>";
			</script>

			<link rel="stylesheet" type="text/css" href="css/looma-edited-video.css">

			<div id="main-container-horizontal">
				<div id="video-player">
					<div id="video-area">
						<video id="video">
							<?php echo 'poster="' . $filepath . thumbnail($filename) . '">'; ?>
								<?php echo '<source src="' . $filepath . $filename . '"type="video/mp4">' ?>
						</video>
						<div id="text-box-area">
							<textarea name="text-playback" id="text-playback" readonly="true"></textarea>
						</div>
						<div id="image-area"></div>
                        <div id="pdf-area"></div>
                        <div id ="overlaid-video-area"></div>
                        
					</div>
				</div>
				<div id="video-controls">
					<br>
					<button id="fullscreen-control"></button>
					
					<button id="fullscreen-playpause"></button>
                    
                    <div id="time"></div>
					
					<br>
					<button type="button" class="media" id="play-pause">
						<?php tooltip('Play/Pause'); ?>
					</button>
					<input type="range" class="video" id="seek-bar" value="0" style="display:inline-block">
					<br>
					<button type="button" class="media" id="volume">
						<?php tooltip('Volume') ?>
					</button>
					<input type="range" class="video" id="volume-bar" min="0" max="1" step="0.1" value="0.5" style="display:inline-block">
					<br>
                    <button type="button" class="media" id="delete">
						<?php tooltip('Delete') ?>
					</button>
					<!--<br><button type="button" id"mute"> <?//php keyword('Edit') ?></button> -->
				</div>
			</div>
			<?php include ('includes/toolbar.php'); ?>
				<?php include ('includes/js-includes.php'); ?>
					<script src="js/looma-screenfull.js"></script>
					<script src="js/looma-edited-video.js"></script>