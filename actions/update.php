<?php
require '../db/index.php';
$id = $_GET['id'];
$id_check_query = $conn->query("SELECT id FROM list WHERE id=$id");
if (mysqli_num_rows($id_check_query) > 0) {
    $update_fields = [];

    if (isset($_POST['description'])) {
        $description = $_POST['description'];
        $update_fields[] = "description='$description'";
    }
    if (isset($_POST['isDone'])) {
        $isDone = $_POST['isDone'];
        $update_fields[] = "isDone='$isDone'";
    }
    if (isset($_POST['color'])) {
        $color = $_POST['color'];
        $update_fields[] = "color='$color'";
    }

    $update = $conn->query("UPDATE list SET " . implode(", ", $update_fields) . " WHERE id='$id'");
    if ($update) {
        echo json_encode(['id' => $id, 'data' => $_POST, 'success' => true, 'message' => "Updated"]);
    } else {
        echo json_encode((["success" => false, "message" => "Error: " . mysqli_error($conn)]));
    }
} else {
    echo json_encode(['message' => 'No data found with the provided id', 'success' => false]);
}

?>