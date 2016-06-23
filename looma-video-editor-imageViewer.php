<!doctype html>

<?php

    $imagePath = '../content/pictures/';
    $imageArr = array();
    
    if (is_dir($imagePath))
    {
        //$imageArr = scandir($imagePath);
        $imageArr = glob($imagePath . "*.{jpg,jpeg,gif,png}", GLOB_BRACE);
    }

    // Remove all thumbnails from array of image previews
    for ($i = 0; $i < count($imageArr); $i++)
    {
        if (strpos($imageArr[$i], "_thumb"))
        {
            array_splice($imageArr, $i, 1);
        }
    }
    

    // Need to create a table with max buttons = 3

    for ($i = 0; $i < count($imageArr); $i++)
    {
        echo '<input class="imageOption" id="' . $imageArr[$i] . '" type="image" src="' . $imageArr[$i] . '" width="150" height="90" />';
    }
?>