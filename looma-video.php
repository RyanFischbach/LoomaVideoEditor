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

	<link rel="stylesheet" type="text/css" href="css/looma-video.css">

	</head>

	<body>
		<?php
            //Gets the filename, filepath, and the thumbnail location
            $filename = $_REQUEST['fn'];
            $filepath = $_REQUEST['fp'];
            $thumbFile = $filepath . thumbnail($filename);
	    ?>
        <script>
            //Converts thumbFile to js
            var thumbFile = <?php echo json_encode($thumbFile); ?>;
        </script>
        
            <div id="main-container-horizontal">
                    <div id="video-player">
                        <div id="video-area">
                            <video id="video">
                                <!--Gets the source of the video and the thumbnail of the video-->
                                <?php echo 'poster="' . $filepath . thumbnail($filename) . '">'; ?>
                                <?php echo '<source src="' . $filepath . $filename . '" type="video/mp4">' ?>
                            </video>
                            <div id="text-box-area">
                                <form class="media hidden_button" id="text-box">
                                    <textarea name="comments" id="comments" placeholder="Enter text..."></textarea>
                                </form>
                            </div>
                            <div id="image-area"></div>
                            <div id="pdf-area"></div>
                            <div id="added-video-area"></div>
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
                    <!-- Edit Controls: Adding a video in a video -->
                     <button type="button" class="media hidden_button" id="start-time">
                            <?php keyword('Set Start Time') ?>
                        </button>
                        
                        <button type="button" class="media hidden_button" id="stop-time">
                            <?php keyword('Set Stop Time') ?>
                        </button>
                    <!-- -------- -->
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
                            <?php keyword('Pdf') ?>
                        </button>
                        
                        <button type="button" class="media hidden_button" id="video-button">
                            <?php keyword('Video') ?>
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
                <!--
                <div id="video-previews">
                    php
                        $folder = "videos";
                        include ('includes/video-editor-file-viewer.php');
                    ?>
                </div> -->
                
                
            </div>
            <!--Adds the toolbar to the video player screen-->
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