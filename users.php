<?php
header('Content-Type: application/json');

// DB connection
$conn = new mysqli("localhost", "root", "", "smarthealthcare");
if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'DB connection failed: ' . $conn->connect_error]);
    exit;
}

// Get and sanitize POST data
$full_name = isset($_POST['full_name']) ? trim($_POST['full_name']) : '';
$role = isset($_POST['role']) ? trim($_POST['role']) : '';




// Insert new user
$stmt = $conn->prepare("INSERT INTO users (full_name, role) VALUES (?, ?)");
$stmt->bind_param("ss", $full_name, $role);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'User registered successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Registration failed: ' . $stmt->error]);
}

$stmt->close();
$conn->close();

