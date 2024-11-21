<?php
require '../db/index.php';
$get_all_list = "SELECT id, description, isDone, ItemPosition, color FROM list";
$get = $conn->query($get_all_list);
if ($get) {
    $data = [];
    while ($row = $get->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode(['data' => $data, 'succes' => true]);
} else {
    echo json_encode(['message' => 'Error: ' . mysqli_error($conn)]);
}
?>