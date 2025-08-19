<?php
header('Content-Type: application/json');

function sendJsonResponse($success, $message) {
    echo json_encode(['success' => $success, 'message' => $message]);
    exit();
}

// Database credentials
$servername = "localhost";
$username = "root"; // Update with your database username
$password = ""; // Update with your database password
$dbname = "smarthealthcare";

// Create a new mysqli connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    sendJsonResponse(false, 'Database connection failed: ' . $conn->connect_error);
}

// Get and sanitize form data
$patientName = $_POST['patientName'] ?? null;
$doctorSelect = $_POST['doctorSelect'] ?? null;
$appointmentDate = $_POST['appointmentDate'] ?? null;
$appointmentTime = $_POST['appointmentTime'] ?? null;
$reasonForVisit = $_POST['reasonForVisit'] ?? null;

if (empty($patientName) || empty($doctorSelect) || empty($appointmentDate) || empty($appointmentTime)) {
    sendJsonResponse(false, 'Please fill in all required fields.');
}

$sql = "INSERT INTO appointments (patient_name, doctor_select, appointment_date, appointment_time, reason_for_visit) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    sendJsonResponse(false, 'Failed to prepare the statement: ' . $conn->error);
}

$stmt->bind_param("sssss", $patientName, $doctorSelect, $appointmentDate, $appointmentTime, $reasonForVisit);

if ($stmt->execute()) {
    sendJsonResponse(true, 'Appointment booked successfully!');
} else {
    sendJsonResponse(false, 'Failed to book appointment: ' . $stmt->error);
}

$stmt->close();
$conn->close();
?>

