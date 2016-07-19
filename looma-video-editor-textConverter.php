<!doctype html>
<!--
Name: Aaron, Connor, Ryan
Email: skip@stritter.com
Owner: VillageTech Solutions (villagetechsolutions.org)
Date: 2016 07
Revision: Looma Video Editor 0.1
File: looma-video-editor-textConverter.php
Description: Converts edit information into a txt file for the video editor
-->

<?php

include ('includes/mongo-connect.php');
        
$fileName = $_REQUEST['location'];
$strJSON = json_encode($_REQUEST['info']);
$fileDoesExist = $_REQUEST['doesExist'];

$this_dir = dirname(__FILE__);

// admin's parent dir path can be represented by admin/..
$parent_dir = realpath($this_dir . '/..');

// concatenate the target path from the parent dir path
$target_path = $parent_dir . '/content/videos/' . $fileName . '.txt';
   
// open the file
$myFile = fopen($target_path, 'w') or die("can't open file");
fwrite($myFile, $strJSON);
fclose($myFile);

// Save File to DB
$dn = str_replace('_', ' ', $fileName . "_Edited");

if ($fileDoesExist == "true")
{
    $query = array("dn" => $dn);
    $fileToUpdate = $edited_videos_collection->findOne($query);
    $fieldsToUpdate = array(
        "dn" => $dn,
        "fn" => $fileName,
        "JSON" => $strJSON
    );
    $edited_videos_collection->update($fileToUpdate, $fieldsToUpdate);
}
else
{
    print ("ELSE");
    // Create new entry
    $toInsert = array(
        "ft" => "txt",
        "dn" => $dn,
        "fn" => $fileName,
        "JSON" => $strJSON
    );
    $edited_videos_collection->insert($toInsert);
}


/*
if ()
{
    $toInsert = array(
        "ft" => "txt",
        "dn" => $dn,
        "fn" => $fileName,
        "JSON" => $strJSON,
    );
    $activities_collection->insert($toInsert);
}

$activities_collection.update(
    {"dn": $dn},
    $toInsert,
    {
        upsert: true
    }   
);
*/

?>