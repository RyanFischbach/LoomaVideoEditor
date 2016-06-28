<!doctype html>
<!--
Name: Skip, Aaron, Connor, Ryan
Email: skip@stritter.com
Owner: VillageTech Solutions (villagetechsolutions.org)
Date: 2016 06
Revision: Looma Video Editor 0.1
File: video.php
Description: Video viewer/editor page for Looma 2

Usage: 	<button id="testvideo" data-fn="galaxies.mp4"
						 data-fp="resources/videos/"
						 data-ft="video">
			VIDEO TEST</button>
	And: $("button#testvideo").click(LOOMA.playMedia);
-->
<?php $page_title = 'Looma Video Player';
	  include ('includes/header.php');

	  function thumbnail ($fn) {
				//given a CONTENT filename, generate the corresponding THUMBNAIL filename
				//find the last '.' in the filename, insert '_thumb.jpg' after the dot
				//returns "" if no '.' found
				//example: input 'aaa.bbb.mp4' returns 'aaa.bbb_thumb.jpg' - this is the looma standard for naming THUMBNAILS
		 		$dot = strrpos($fn, ".");
				if ( ! ($dot === false)) { return substr_replace($fn, "_thumb.jpg", $dot, 10);}
				else return "";
			} //end function THUMBNAIL

?>

	<link rel="stylesheet" type="text/css" href="css/looma-video.css">

	</head>

	<body>
		<?php
            $filename = $_REQUEST['fn'];
            $filepath = $_REQUEST['fp'];
            $thumbFile = $filepath . thumbnail($filename);
	    ?>
			<script>
				var thumbFile = <?php echo json_encode($thumbFile); ?>;
			</script>

			<div id="main-container-horizontal">
				<div id="video-player">
					<div id="video-area">
						<video id="video">
							<?php echo 'poster="' . $filepath . thumbnail($filename) . '">'; ?>
								<?php echo '<source src="' . $filepath . $filename . '" type="video/mp4">' ?>
						</video>
						<div id="text-box-area">
							<form class="media hidden_button" id="text-box">
								<textarea name="comments" id="comments" placeholder="Enter text..."></textarea>
							</form>
						</div>
						<div id="image-area"></div>
					</div>
					<div id="timeline-area"></div>
				</div>

				<div id="media-controls">

					<button id="fullscreen-control"></button>

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
				</div>

				<div id="edit-controls">
					<button type="button" class="media hidden_button" id="cancel">
						<?php keyword('Cancel') ?>
					</button>

					<button type="button" class="media" id="edit">
						<?php keyword('Edit') ?>
					</button>

					<button type="button" class="media hidden_button" id="text">
						<?php keyword('Text') ?>
					</button>

					<button type="button" class="media hidden_button" id="image">
						<?php keyword('Image') ?>
					</button>

					<button type="button" class="media hidden_button" id="pdf">
						<?php keyword('PDF') ?>
					</button>

					<button type="button" class="media hidden_button" id="submit">
						<?php keyword('Submit') ?>
					</button>

					<br>

					<button type="button" class="media hidden_button" id="prev-frame">
						<?php keyword('-') ?>
					</button>

					<button type="button" class="media hidden_button" id="next-frame">
						<?php keyword('+') ?>
					</button>

				</div>

				<div id="image-previews">
					<!-- include ('looma-video-editor-imageViewer.php') -->
					<?php

                        $imagePath = '../content/pictures/';
                        $dirImageArr = array();
                        $imageArr = array();
    
                        if (is_dir($imagePath))
                        {
                            $dirImageArr = glob($imagePath . "*.{jpg,jpeg,gif,png}", GLOB_BRACE);
                        }

                        // Remove all thumbnails from array of image previews
                        for ($i = 0; $i < count($dirImageArr); $i++)
                        {
                            if (strrpos($dirImageArr[$i], "_thumb") == false)
                            {
                                array_push($imageArr, $dirImageArr[$i]);
                            }
                        }
    

                        // Need to create a table with max buttons = 3

                        for ($i = 0; $i < count($imageArr); $i++)
                        {
                            /*echo '<input class="imageOption" id="' . $imageArr[$i] . '" type="image" src="' . $imageArr[$i] . '" width="150" height="90" />';*/
                            echo '<div class="img"><input class="image-option" type="image" src="' . $imageArr[$i] . '" /></div>';
                        }
                    ?>
				</div>

			</div>
			<?php include ('includes/toolbar.php'); ?>
				<?php include ('includes/js-includes.php'); ?>
					<script src="js/looma-screenfull.js"></script>

					<script src="js/looma-video.js"></script>

					<!-- Update Video Name in looma-video.js -->
					<script>
						var videoName = "<?php echo $filename; ?>";
						/*
						// Remove extension from videoName
						var strlen = videoName.length;
						videoName = videoName.substring(0, strlen - 4);*/
						editsObj.videoName = videoName;
						//DEBUG console.log(editsObj.videoName);
					</script>

	</body>