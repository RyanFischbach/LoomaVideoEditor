<!doctype html>

<?php

    $imagePath = '../content/pictures/';
    
    if (is_dir($imagePath))
    {
        //$imageNameArr = scandir($imagePath);
        $imageArr = glob($imagePath . "*.{jpg,jpeg,gif,png}", GLOB_BRACE);
    }
    

    // Need to create a table with max buttons = 3

    for ($i = 0; $i < count($imageArr); $i++)
    {
        /*echo '<input class="imageOption" id="' . $imageNameArr[$i] . '" type="image" src="' . $imagePath . $imageNameArr[$i] . '" width="100" height="100" />';*/
        echo '<input class="imageOption" id="' . $imageArr[$i] . '" type="image" src="' . $imageArr[$i] . '" width="150" height="90" />';
    }
?>