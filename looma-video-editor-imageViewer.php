<!doctype html>

<?php

    //$this_dir = dirname(__FILE__);
    //$parent_dir = realpath($this_dir . '/..');
    $imagePath = '../content/pictures/';
    //print ($is)
    //$imagePath = $parent_dir . '/content/pictures/';
    //$dir = "/images/";

    $imageNameArr = array();
    print count($imageNameArr);

    // Open a directory, and read its contents
    if (is_dir($imagePath))
    {
        if ($dh = opendir($imagePath))
        {
            while (($file = readdir($dh)) !== false)
            {
                array_push($imageNameArr, $file);
            }
            closedir($dh);
        }
    }

    //print realpath($imagePath);
    print count($imageNameArr);

    //$imageExt = '.png';


    // Create a table with max buttons = 3

    for ($i = 0; $i < count($imageNameArr); $i++)
    {
        echo '<input class="imageOption" id="' . $imageNameArr[$i] . '" type="image" src="' . $imagePath . $imageNameArr[$i] . '" width="100" height="100" />';
    }
?>