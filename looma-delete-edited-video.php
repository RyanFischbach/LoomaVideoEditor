<!doctype html>
<!--
Name: Connor
Email: skip@stritter.com
Owner: VillageTech Solutions (villagetechsolutions.org)
Date: 2016 07
Revision: Looma Video Editor 1.0
File: looma-delete-edited-video.php
Description: When called it deletes the edited video file passed to it
-->
<?php
    include ('includes/mongo-connect.php');
    $array = $edited_videos_collection->remove(array('dn' => $_REQUEST['displayName']));
?>