<!doctype html>

<?php
    $newName = $_REQUEST['newPath'];
    $oldName = $_REQUEST['oldPath'];

    $newName = str_replace(' ', '_', $newName);

    $this_dir = dirname(__FILE__);

    // admin's parent dir path can be represented by admin/..
    $parent_dir = realpath($this_dir . '/..');

    // concatenate the target path from the parent dir path
    $oldPath = $parent_dir . '/content/videos/' . $oldName . '.txt';
    $newPath = $parent_dir . '/content/videos/' . $newName . '.txt';
    
    if (rename($oldPath, $newPath))
    {
        print "renamed to " . $newPath;
    }
?>