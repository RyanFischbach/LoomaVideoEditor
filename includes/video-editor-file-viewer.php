
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
        ?>