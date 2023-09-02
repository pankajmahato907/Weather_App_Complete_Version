<?php
// Include connection
include 'connection.php';

// Get data from POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // City name from url
    $jsonData = file_get_contents("php://input");
    if ($jsonData === false) {
        throw new Exception("Error reading input data");
    }

    $data = json_decode($jsonData, true);
    if ($data === null) {
        throw new Exception("Error decoding JSON data");
    }
    $city = $data['city'];
    
    // SQL query
    $query = "SELECT 
                MAX(id) as id, city, country, temperature, weather_condition, humidity, pressure, wind, date_accessed
            FROM 
            weather
            WHERE 
                city = '$city' AND date_accessed >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
            GROUP BY 
                DATE(date_accessed)
            ORDER BY 
                date_accessed DESC;";
    
    // Query execution
    $sql = mysqli_query($connect, $query);
    $data = array(); // Initialize the data array

    // Collecting rows
    while ($row = mysqli_fetch_assoc($sql)) {
        $data[] = $row; // Append each row to the data array
    }

    // Send data back as JSON
    header('Content-Type: application/json');
    echo json_encode($data); // Encode the entire data array as JSON

    $connect->close();
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Only POST requests are allowed']);
}
?>
