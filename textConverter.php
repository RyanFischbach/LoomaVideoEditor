<!doctype html>

<?php

include ('includes/mongo-connect.php');

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

function writeToFile($videoTitle, $timeArr, $typeArr, $filePathArr, $textArr) 
{
    
    $this_dir = dirname(__FILE__);

    // admin's parent dir path can be represented by admin/..
    $parent_dir = realpath($this_dir . '/..');

    // concatenate the target path from the parent dir path
    $target_path = $parent_dir . '/content/videos/' . $videoTitle . '.txt'; 
    
    $txt = "";
    $textArrCount = 0;
    $filePathArrCount = 0;
    
    for ($x = 0; $x < count($timeArr); $x++) 
    {
        if ($typeArr[$x] == "text") 
        {
            $numWords = getNumWords($textArr[$textArrCount]);
            $txt .= $timeArr[$x] . " " . $typeArr . " $numWords" . $textArr[$textArrCount] . "\n";
        }
        else
        {
            $txt .= $timeArr[$x] . " " . $typeArr . " " . $filePathArr[$filePathArrCount] . "\n";
        }
    }
    
    // open the file
    $myFile = fopen($target_path, 'w') or die("can't open file");
    fwrite($myFile, $txt);
    fclose($myFile);
    
    // save file - saveFileToDatabase($myFile);
}

function getNumWords($str) 
{
    $numWords = 0;
    
    for ($i = 0; $i < strlen($str); $i++) 
    {
        if ($str[$i] == " " && $i != strlen($str) - 1 && $i != 0)
        {
            $numWords++;
        }
    }
    
    // Fixes counting by spaces error
    if ($numWords > 0)
    {
        $numWords++;
    }
    
    return $numWords;
}

function saveFileToDataBase($file) 
{
    $activities_collection.save($file);
}


?>
