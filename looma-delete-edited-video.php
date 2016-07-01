<!doctype html>
<!--
Name: Connor
Email: skip@stritter.com
Owner: VillageTech Solutions (villagetechsolutions.org)
Date: 2016 07
Revision: Looma Video Editor 0.1
File: looma-delete-edited-video.php
Description: When called it deletes the edited video file passed to it
-->
<?php
    $file = $_REQUEST["fileSrc"];
    $file = substr($file, 0, strlen($file) - 4) . '.txt';
    unlink($file);
?>