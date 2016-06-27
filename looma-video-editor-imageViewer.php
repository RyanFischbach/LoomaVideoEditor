<!doctype html>

<?php

    $imagePath = '../content/pictures/';
    $dirImageArr = array();
    $imageArr = array();
    
    if (is_dir($imagePath))
    {
        //$imageArr = scandir($imagePath);
        $dirImageArr = glob($imagePath . "*.{jpg,jpeg,gif,png}", GLOB_BRACE);
    }

    // Remove all thumbnails from array of image previews
    for ($i = 0; $i < count($dirImageArr); $i++)
    {
        if (strrpos($dirImageArr[$i], "_thumb") == false)
        {
            array_push($imageArr, $dirImageArr[$i]);
        }
    }
    

    // Need to create a table with max buttons = 3

    for ($i = 0; $i < count($imageArr); $i++)
    {
        /*echo '<input class="imageOption" id="' . $imageArr[$i] . '" type="image" src="' . $imageArr[$i] . '" width="150" height="90" />';*/
        echo '<div class="img"><input class="image-option" type="image" src="' . $imageArr[$i] . '" /></div>';
    }
?>