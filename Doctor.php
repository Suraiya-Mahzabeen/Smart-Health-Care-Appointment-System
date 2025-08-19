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



// Optional: check if user already exists (same full_name + role)
$check = $conn->prepare("SELECT id FROM users WHERE full_name = ? AND role = ?");
$check->bind_param("ss", $full_name, $role);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode(['status' => 'error', 'message' => 'User with this name and role already exists']);
    $check->close();
    $conn->close();
    exit;
}
$check->close();

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

