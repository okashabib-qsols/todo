<?php

require '../db/index.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $description = $_POST['description'];
    if (trim($description) == "") {
        echo json_encode(['message' => 'Please write description', 'success' => false]);
        return;
    }
    $query_insert = "INSERT INTO list (description, isDone, ItemPosition, color) VALUES ('$description', 0, 3, 1)";
    $insert = $conn->query($query_insert);
    if ($insert) {
        echo json_encode(['desc' => $description, 'success' => true, 'message' => 'Added Successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . mysqli_error($conn)]);
    }
}

?>