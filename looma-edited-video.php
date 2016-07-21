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
        
            function getJSON($file, $path, $ext) {
            //Gets the path of the .txt file and return the information inside
            $realpath = realpath($path) . '/';
            return file_get_contents($realpath . $file, $realpath, null, 0);
        }

        function makeButton($file, $path, $ext, $base, $dn, $thumb)
        {
            // Copied from looma library
            //DEBUG   echo "making button with path= $path  file= $file   ext= $ext"; //DEBUG 
            
            // ignore edited videos which are txt files
            if ($ext != "txt")
            {
			
            echo "<button class='activity play img' 
                          data-fn='" .  $file . 
                       "' data-fp='" .  $path .
                       "' data-ft='" .  $ext . 
                       "' data-zm='" .  160 .
                       "' data-pg='1" .
                       //If the file is a .txt file (used to store edited videos) it pulls the information from the file
                       "' data-txt='" . ($ext == "txt" ? getJSON($file, $path, $ext) : null) .
                                    "'>";
					   
            //text and tooltip for BUTTON		  
            echo "<span class='displayname' 
                        class='btn btn-default'
                        data-toggle='tooltip' 
                        data-placement='top' 
                        title='" . $file . "'>" . 
                  "<img src='" . $thumb . "'>" . 
                                 $dn . "</span>";

            //finish BUTTON
            echo "</button>";
            
            }

        };  //end makeButton()
        ?>   
        
			<script>
				//Sends the information from the .txt file to js
				var commands = <?php echo $_REQUEST['txt']; ?>;
				var commandsBackup = <?php echo $_REQUEST['txt']; ?>;
                var displayName = "<?php echo addslashes($_REQUEST['dn']);?>";
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
                            <form class="media hidden_button" id="text-box">
								<textarea name="comments" id="comments" placeholder="Enter text..."></textarea>
							</form>
							<textarea name="text-playback" id="text-playback" readonly="true"></textarea>
						</div>
						<div id="image-area"></div>
                        <div id="pdf-area"></div>
                        <div id ="added-video-area"></div>
					</div>
				</div>
				<div id="video-controls-wrapper">
                    <div id="video-controls">
                        <div id="media-controls">
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
                        </div>
                        <div id="edit-controls">
                            <div id="rename-form-div">
                                <p> Save As </p>

                                <form autocomplete="off">
                                    <input type="text" id="rename-text" />
                                </form>

                                <br>
                                <button type="button" class="media hidden_button" id="rename-form-submit-button">
                                    <?php keyword("Submit") ?>
                                </button>
                            </div>
                    
                            <div id="add-time-div">
                                <div id="add-start-stop-time-div">
                                    <button type="button" class="media hidden_button" id="start-time">
                                        <?php
                                            $TKW['Set Start Time'] = 'समय सुरु सेट';
                                            keyword('Set Start Time')
                                        ?>
                                    </button>

                                    <button type="button" class="media hidden_button" id="stop-time">
                                        <?php
                                            $TKW['Set Stop Time'] = 'स्टप समय सेट';
                                            keyword('Set Stop Time')
                                        ?>
                                    </button>
                                </div>
                                <div id="default-start-stop-time-div">
                                    <button type="button" class="media hidden_button" id="default-start-stop-time">
                                        <?php
                                            $TKW['Default'] = 'पूर्वनिर्धारित';
                                            keyword('Default');
                                        ?>
                                    </button>
                                </div>
                            </div>
                            <button type="button" class="media" id="delete">
                                <?php tooltip('Delete') ?>
                            </button>
                            <button type ="button" class="media" id="edit">
                                <?php keyword('Edit') ?>
                            </button>
                            <div id="login-div">
                                <button type="button" class="media" id="login">
                                    <?php keyword('Log In') ?>
                                </button>
                            </div>
                            
                            <button type="button" class="media hidden_button" id="prev-frame5">
                                <<<
                                <?php
                                    $TKW['Previous Frame'] = 'अघिल्लो फ्रेम';
                                    tooltip('Previous Frame')
                                ?>
                            </button>

                            <button type="button" class="media hidden_button" id="prev-frame">
                                <
                                <?php
                                    $TKW['Previous Frame'] = 'अघिल्लो फ्रेम';
                                    tooltip('Previous Frame')
                                ?>
                            </button>

                            <button type="button" class="media hidden_button" id="next-frame">
                                >
                                <?php
                                    $TKW['Next Frame'] = 'अर्को फ्रेम';
                                    tooltip('Next Frame')
                                ?>
                            </button>


                             <button type="button" class="media hidden_button" id="next-frame5">
                                >>>
                                <?php
                                    $TKW['Next Frame'] = 'अर्को फ्रेम';
                                    tooltip('Next Frame')
                                ?>
                            </button>

                            <br>
                            
                            <button type="button" class="media" id="cancel">
                                <?php keyword('Cancel') ?>
                            <form class="media" id="search-box" style="display: none">
								<textarea name="search" id="search" placeholder="Search for..."></textarea>
							</form>
                            <button type="button" class="media" id="text">
                                <?php keyword('Text') ?>
                            </button>
                            <button type="button" class="media" id="image">
                                <?php keyword('Image') ?>
                            </button>
                            <button type="button" class="media hidden_button" id="pdf">
                                <?php keyword('Pdf') ?>
                            </button>

                            <button type="button" class="media hidden_button" id="video-button">
                                <?php keyword('Video') ?>
                            </button>

                            <button type="button" class="media hidden_button" id="submit">
                                <?php keyword('Submit') ?>
                            </button>
                                
                            <br>

                            <button type="button" class="media hidden_button" id="rename">
                                <?php keyword('Rename') ?>
                            </button>
                                
                                <!--Opens the pictures folder when you want to pick a picture-->
				<div id="image-previews">
					<!-- include ('looma-video-editor-imageViewer.php') -->
					<?php
                        $folder = "pictures";
                        include ('includes/video-editor-file-viewer.php');
                    ?>
				</div>

				<!--Opens the pdf folder when you want to pick a pdf-->
				<div id="pdf-previews">
					<?php
                        $folder = "pdfs";
                        include ('includes/video-editor-file-viewer.php');
                    ?>
				</div>

				<div id="video-previews">
					<?php
                        $folder = "videos";
                        include ('includes/video-editor-file-viewer.php');
                    ?>
				</div>
                            
                        </div>
                    </div>
					<!--<br><button type="button" id"mute"> </button> -->
				</div>
			</div> <!-- End of main container -->
			<?php include ('includes/toolbar.php'); ?>
				<?php include ('includes/js-includes.php'); ?>
					<script src="js/looma-screenfull.js"></script>
					<script src="js/looma-edited-video.js"></script>