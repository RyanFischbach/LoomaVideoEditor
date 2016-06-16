<!doctype html>

<?php

include ('includes/mongo-connect.php');

function writeJSONStringToFile($videoTitle, $timeArr, $textArr) {
    writeToFile($videoTitle, $timeArr, $textArr);
}

function writeToFile($videoTitle, $timeArr, $textArr) {
    
    $this_dir = dirname(__FILE__);

    // admin's parent dir path can be represented by admin/..
    $parent_dir = realpath($this_dir . '/..');

    // concatenate the target path from the parent dir path
    $target_path = $parent_dir . '/content/videos/' . $videoTitle . '.txt'; 
    
    $txt = "";
    
    // start loop at 1 because element at index 0 is the video name
    for ($x = 0; $x < count($timeArr); $x++) {
        $txt .= $timeArr[$x] . " " . $textArr[$x] . "\n";
    }
    
    // open the file
    $myFile = fopen($target_path, 'w') or die("can't open file");
    fwrite($myFile, $txt);
    fclose($myFile);
    
    // save file - saveFileToDatabase($myFile);
}

function saveFileToDataBase($file) {
    $activities_collection.save($file);
}


?>
