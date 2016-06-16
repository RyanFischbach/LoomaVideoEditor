<!doctype html>

<?php
function getTime() {
    // Do something with ryan's code
    $time = 5;
    //print "<h1>Hellooooooooooooooooooooooooooooooooo</h1>";
    //return $time;
}

/**
 * writeTextFile write data to file on hard drive
 * @param  string  filepath   Path to file on hard drive
 * @param  sring   output     Data to be written
 */
function writeToFile($time, $insertedFile, $fileName) {
    $myfile = fopen($fileName . "Edited.txt", "w") or die("Unable to open file!");
    $txt = "$time\n";
    fwrite($myfile, $txt);
    $txt = "$insertedFile\n";
    fwrite($myfile, $txt);
    fclose($myfile);
 }
?>
