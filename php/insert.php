<?php
    // Include connection
    include 'connection.php';

    try {
        // Get data from POST
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $jsonData = file_get_contents("php://input");
            // If no JSON
            if ($jsonData === false) {
                throw new Exception("Error reading input data");
            }
            // Unparse data
            $data = json_decode($jsonData, true);
            if ($data === null) {
                throw new Exception("Error decoding JSON data");
            }
            // SQL query
            $date = date("Y-m-d");
            $sql = "INSERT INTO weather(city, country, temperature, humidity, wind, pressure, weather_condition,
                    date_accessed) VALUES (
                    '{$data['name']}',
                    '{$data['sys']['country']}',
                    '{$data['main']['temp']}',
                    '{$data['main']['humidity']}',
                    '{$data['wind']['speed']}',
                    '{$data['main']['pressure']}',
                    '{$data['weather'][0]['description']}',
                    '$date')";
            if ($connect->query($sql) === TRUE) {
                // If successful, send True
                header('Content-Type: application/json');
                echo json_encode(['success' => true, 'message' => 'Data processed successfully']);
            } else {
                // If unsuccessful, send False
                throw new Exception("Error inserting data: " . $connect->error);
            }
            $connect->close();
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Only POST requests are allowed']);
        }
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
?>
