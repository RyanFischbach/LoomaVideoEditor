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
                        include ('includes/mongo-connect.php');
                                
                        function makeButton($file, $path, $ext, $base, $dn, $thumb)
                        {
                            // Copied from looma library
                            //DEBUG   echo "making button with path= $path  file= $file   ext= $ext"; //DEBUG 
			
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

                        };  //end makeButton()

                        $path = '../content/pictures/';
                        $dirImageArr = array();
                        $fileArr = array();
                                
                                
                        foreach (new DirectoryIterator($path) as $fileInfo)
                        {
                            $file =  $fileInfo->getFilename();

                            //DEBUG  echo "   found " . $file . "<br>";

                            //skip ".", "..", and any ".filename" and any filename with '_thumb' in the name
                            if (($file[0]  == ".") || strpos($file, "_thumb") || $file == "thumbnail.png") continue;  

                            if ($fileInfo -> isFile())
                            {
                                $ext = $fileInfo -> getExtension();
                                $file = $fileInfo -> getFilename();
                                $base = trim($fileInfo -> getBasename($ext), ".");  //$base is filename w/o the file extension

                                //If the file is a .txt file (used to store edited videos) it gives it the correct display name
                                if(substr($file, strlen($file) - 4) == ".txt")
                                {
                                    $dn = str_replace('_', ' ', substr($file, 0, strlen($file) - 8) . "_Edited");
                                }
                                else
                                {
                                    // look in the database to see if this file has a DISPLAYNAME
                                    $query = array('fn' => $file);

                                    $projection = array('_id' => 0, 
                                                    'dn' => 1, 
                                        );		
                                    $activity = $activities_collection -> findOne($query, $projection);

                                    $dn = ($activity && array_key_exists('dn', $activity)) ? $activity['dn'] : $base;
                                }
                                
                                switch (strtolower($ext))
                                {
                                    case "video":
                                    case "mp4":
                                    case "mov":

                                    case "image":
                                    case "jpg":
                                    case "png":
                                    case "gif":

                                    case "audio":
                                    case "mp3":

                                    case "pdf":

                                        makeButton($file, $path, $ext, $base, $dn, $path . $base . "_thumb.jpg");
                                        break;

                                    case "txt":
                                        makeButton($file, $path, $ext, $base, $dn, $path . substr($base, 0, strlen($base) - 4) . "_thumb.jpg");
                                        break;

                                    default:
                                        // ignore unknown filetypes
                                        // echo "DEBUG: " . $fileInfo -> getFilename() . "unkown filetype in looma-library.php";
                                };  //end SWITCH
                            }
                        }
                        /*
                        if (is_dir($imagePath))
                        {
                            $dirImageArr = glob($imagePath . "*.{jpg,jpeg,gif,png}", GLOB_BRACE);
                        }

                        // Remove all thumbnails from array of image files
                        for ($i = 0; $i < count($dirImageArr); $i++)
                        {
                            if (strrpos($dirImageArr[$i], "_thumb") == false)
                            {
                                array_push($fileArr, $dirImageArr[$i]);
                            }
                        }
                        
    

                        // Need to create a table with max buttons = 3

                        for ($i = 0; $i < count($imageArr); $i++)
                        {
                            $fn =
                            echo '<input class="imageOption" id="' . $imageArr[$i] . '" type="image" src="' . $imageArr[$i] . '" width="150" height="90" />';
                            
                            echo '<div class="img"><input class="image-option" type="image" src="' . $imageArr[$i] . '" /></div>';
                            
                        }
                        */
                    ?>
                </div>
                
                <!--
                <div id="pdf-previews">
                    <?php
                        $imagePath = '../content/pdfs/';
                        $pdfArr = array();
                    
                        if (is_dir($imagePath))
                        {
                            $pdfArr = glob($imagePath . "*.{pdf}", GLOB_BRACE);
                        }
                    
                    for ($i = 0; $i < count($pdfArr); $i++)
                    {
                        echo '<div class="pdf"><button class="activity play img" /></div>';
                    }
                    ?>
                </div>
                -->
                
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
