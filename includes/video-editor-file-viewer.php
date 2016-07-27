<!--
Name: Aaron, Connor, Ryan
Email: skip@stritter.com
Owner: VillageTech Solutions (villagetechsolutions.org)
Date: 2016 07
Revision: Looma Video Editor 1.0
File: video-editor-file-viewer.php
Description: Accesses files for the video editor. Mainly copied from looma-library.php
-->

<?php
include ('includes/mongo-connect.php');
/*
if ($type == "image")
{
    $pngs = $activities_collection->find(array("ft" => "png"));
    $jpgs = $activities_collection->find(array("ft" => "jpg"));
    $gifs = $activities_collection->find(array("ft" => "gif"));
    foreach($pngs as $png)
    {
        $dn = $png['dn'];
        $file = $png['fn'];
        $base = substr($file, strrpos($file, "."));
        $ext = "png";
        $path = "../content/pictures/";
        makeButton($file, $path, $ext, $base, $dn, $path . $base . "_thumb.jpg");
    }
    foreach($jpgs as $jpg)
    {
        $dn = $jpg['dn'];
        $file = $jpg['fn'];
        $base = substr($file, strrpos($file, "."));
        $ext = "jpg";
        $path = "../content/pictures/";
        makeButton($file, $path, $ext, $base, $dn, $path . $base . "_thumb.jpg");
    }
    foreach($gifs as $gif)
    {
        $dn = $gif['dn'];
        $file = $gif['fn'];
        $base = substr($file, strrpos($file, "."));
        $ext = "gif";
        $path = "../content/pictures/";
        makeButton($file, $path, $ext, $base, $dn, $path . $base . "_thumb.jpg");
    }
}
else if ($type == "pdf")
{
    $pdfs = $activities_collection->find(array("ft" => "pdf"));
    foreach($pdfs as $pdf)
    {
        $dn = $pdf['dn'];
        $file = $pdf['fn'];
        $base = substr($file, strrpos($file, "."));
        $ext = "pdf";
        $path = "../content/pdfs/";
        makeButton($file, $path, $ext, $base, $dn, $path . $base . "_thumb.jpg");    
    }
}
else if ($type == "video")
{
    $videos = $activities_collection->find(array("ft" => "mp4"));
    foreach($videos as $video)
    {
        $dn = $video['dn'];
        $file = $video['fn'];
        $base = substr($file, strrpos($file, "."));
        $ext = "mp4";
        $path = "../content/videos/";
        makeButton($file, $path, $ext, $base, $dn, $path . $base . "_thumb.jpg");
    }
}
*/
                       
$path = '../content/' . $folder . '/';
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