<!doctype html>

<?php
    $imageName = 'Wet_Bee';
    $imageExt = '.png';

    $this_dir = dirname(__FILE__);
    $parent_dir = realpath($this_dir . '/..');
    $imagePath = '/../content/pictures/';

    echo '<input class="imageOption" id="' . $imageName . '" type="image" src="' . $imagePath . $imageName . $imageExt . '" width="100" height="100" />'

    //echo	'<img src="' . $imagePath . $imageName . '">'
?>