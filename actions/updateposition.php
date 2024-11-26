<?php
require '../db/index.php';

if (isset($_POST['itemPosition'])) {
    $order = $_POST['itemPosition'];
    $orderArray = explode(',', $order);

    // Looping through the IDs and update their positions
    $position = 1;
    foreach ($orderArray as $itemId) {
        $itemId = str_replace('todo_', '', $itemId);

        if (is_numeric($itemId)) {
            $update = $conn->query("UPDATE list SET ItemPosition=$position WHERE id=$itemId");

            if (!$update) {
                echo json_encode(['success' => false, 'message' => 'Error updating position for item ID ' . $itemId]);
                exit;
            }

            $position++;
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid ID format: ' . $itemId]);
            exit;
        }
    }

    echo json_encode(['success' => true, 'message' => 'Positions updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'No order data provided']);
}
?>
