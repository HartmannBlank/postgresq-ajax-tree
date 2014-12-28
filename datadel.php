<?php

$id = intval(@$_GET['q']);
$db = pg_connect('host=host dbname=db user=postgres password=password');
if (!$db) {
  die('Could not connect: ' . pg_last_error());
}
var_dump($id);
$query="DELETE FROM directories WHERE id = '".$id."' OR parent_id = '".$id."';";
var_dump($query);
$result = pg_query($db, $query);
if (!$result) {
            echo "Problem with query " . $query . "<br/>";
            echo pg_last_error();
            exit();
        }

pg_close($db);

?>

