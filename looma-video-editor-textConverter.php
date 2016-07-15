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
        
//$name = $_REQUEST['videoName'];
$dn = $_REQUEST['location'];
$strJSON = json_encode($_REQUEST['info']);

$this_dir = dirname(__FILE__);

// admin's parent dir path can be represented by admin/..
$parent_dir = realpath($this_dir . '/..');

// concatenate the target path from the parent dir path
$target_path = $parent_dir . '/content/videos/' . $dn . '.txt';
    
// open the file
$myFile = fopen($target_path, 'w') or die("can't open file");
fwrite($myFile, $strJSON);
fclose($myFile);
    
// Save File to DB
/*
if (isset($dn)) {
    $activities_collection->insert(array("test" => "count"));
    $toinsert = array(
        "ft" => "txt",
        "dn" => $dn,
        "fn" => $dn + ".txt");
    if (isset($_POST["_id"])) {
        $id = new MongoID($_POST["_id"]);
        $collection->update(array("_id" => $id), $toinsert, array("upsert"=>"true"));
    }
    else
    {
        // Saving new file
        $id = new MongoID();
        $toinsert["_id"] = $id;
        $collection->insert($toinsert);
    }
    echo $id;
}
else if (isset($_GET)) {
    echo $collection->findOne(array("ft" => "pp", "dn" => $_GET["dn"]))["_id"];
}
*/

?>