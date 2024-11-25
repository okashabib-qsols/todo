<?php
require '../db/index.php';
$get_all_list = "SELECT id, description, isDone, ItemPosition, color FROM list ORDER by ItemPosition ASC";
$get = $conn->query($get_all_list);
if ($get) {
    $data = [];
    if (mysqli_num_rows($get) > 0) {
        while ($row = $get->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode(['data' => $data, 'success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No data found!']);
    }
} else {
    echo json_encode(['message' => 'Error: ' . mysqli_error($conn), 'success' => false]);
}
?>