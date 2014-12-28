<?php

$id = intval(@$_GET['id']);
//here we go
$db = pg_connect('host=host dbname=db user=postgres password=password');
if (!$db) {
  die('Could not connect: ' . pg_last_error());
}
$query="SELECT id, name FROM directories WHERE parent_id = '".$id."';";
$result = pg_query($db, $query);
if (!$result) {
            echo "Problem with query " . $query . "<br/>";
            echo pg_last_error();
            exit();
        }

$node = array();

for( $count_row = 0; $count_row<pg_num_rows($result); $count_row++ ){
     $data[]=pg_fetch_array($result, $count_row, PGSQL_ASSOC);
}

$earray[]=NULL;

foreach( $data as $row ) {
    $idnum = $row['id'];
    $queryhachild = "SELECT id, name FROM directories WHERE parent_id = '".$idnum."';";
    $result2 = pg_query($db, $queryhachild);
    $data2[]=pg_fetch_array($result2);
    if($data2 == $earray){
        $isFolder = 0;
    } else {
        $isFolder = 1;
    }
    unset($data2);

    $name = $row['name'];
    $node[] = "{ id: $idnum , title: '$name', isFolder: $isFolder}";
}

pg_close($db);
echo '['.implode(',',$node).']';
?>
