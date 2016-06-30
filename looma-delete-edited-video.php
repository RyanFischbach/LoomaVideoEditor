<!doctype html>
<?php
    $file = $_REQUEST["fileSrc"];
    $file = substr($file, 0, strlen($file) - 4) . '.txt';
    unlink($file);
?>