<?php

require '../db/index.php';
$id = $_GET['id'];
$id_check_query = $conn->query("SELECT id FROM list WHERE id=$id");
if (mysqli_num_rows($id_check_query) > 0) {
    $delete_query = $conn->query("DELETE FROM list WHERE id=$id");
    if ($delete_query) {
        echo json_encode(['message' => 'Deleted successfully', 'success' => true]);
    } else {
        echo json_encode(['message' => 'Error: ' . mysqli_error($conn), 'success' => false]);
    }
} else {
    echo json_encode(['message' => 'No data with the given id', 'success' => false]);
}
?>