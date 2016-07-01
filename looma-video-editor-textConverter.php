<!doctype html>
<!--
Name: Aaron, Connor, Ryan
Email: skip@stritter.com
Owner: VillageTech Solutions (villagetechsolutions.org)
Date: 2016 06
Revision: Looma Video Editor 0.1
File: looma-video-editor-textConverter.php
Description: Converts edit information into a txt file for the video editor
-->

<?php

//include ('includes/mongo-connect.php');
        
$name = $_REQUEST['videoName'];
$strJSON = json_encode($_POST);
writeToFile($name, $strJSON);
        
function writeToFile($videoTitle, $strJSON)
{
    $this_dir = dirname(__FILE__);

    // admin's parent dir path can be represented by admin/..
    $parent_dir = realpath($this_dir . '/..');

    // concatenate the target path from the parent dir path
    $target_path = $parent_dir . '/content/videos/' . $videoTitle . '.txt';
    
     // open the file
    $myFile = fopen($target_path, 'w') or die("can't open file");
    fwrite($myFile, $strJSON);
    fclose($myFile);
    
    // Save File to DB
}
 
/*
function saveFileToDataBase($file) 
{
    $activities_collection.save($file);
}
*/
?>