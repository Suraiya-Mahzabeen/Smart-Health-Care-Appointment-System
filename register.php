<?php
// Set header to return JSON response
header('Content-Type: application/json');

// Database connection details
// NOTE: This assumes your database is named 'smarthealthcare'
$conn = new mysqli("localhost", "root", "", "smarthealthcare");

// Check for database connection errors
if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Sanitize and get POST data
$full_name = trim($_POST['full_name']);
$email = trim($_POST['email']);
$password = trim($_POST['password']);
$confirm_password = trim($_POST['confirm_password']);
$role = trim($_POST['role']);

// Check if passwords match
if ($password !== $confirm_password) {
    echo json_encode(['status' => 'error', 'message' => 'Passwords do not match']);
    exit;
}

// Hash the password for security
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Use a prepared statement to prevent SQL injection
$stmt = $conn->prepare("INSERT INTO register (full_name, email, password, role) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $full_name, $email, $hashedPassword, $role);

// Execute the statement and check for success
if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Registration successful!']);
} else {
    // Check for a duplicate entry error (error code 1062)
    if ($conn->errno === 1062) {
        echo json_encode(['status' => 'error', 'message' => 'Email already registered']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Registration failed: ' . $stmt->error]);
    }
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>
