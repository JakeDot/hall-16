<?php

declare(strict_types=1);

require_once __DIR__ . '/StripeBackendWrapper.php';

use HospitalCare\StripeBackendWrapper;

header('Content-Type: application/json');

$action = $_GET['action'] ?? $_POST['action'] ?? 'catalog';
$wrapper = new StripeBackendWrapper();

try {
    switch ($action) {
        case 'catalog':
            echo json_encode([
                'success' => true,
                'php_version' => PHP_VERSION,
                'catalog' => $wrapper->getStoreCatalog()
            ], JSON_PRETTY_PRINT);
            break;

        case 'create_checkout':
            $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
            $itemId = $input['itemId'] ?? 'boost_redbull';
            $successUrl = $input['successUrl'] ?? 'http://localhost:3000/?status=success';
            $cancelUrl = $input['cancelUrl'] ?? 'http://localhost:3000/?status=cancel';

            $response = $wrapper->createCheckoutSession($itemId, $successUrl, $cancelUrl);
            echo json_encode([
                'success' => true,
                'checkout' => $response
            ], JSON_PRETTY_PRINT);
            break;

        default:
            echo json_encode([
                'success' => false,
                'error' => 'Unknown action: ' . $action
            ], 400);
            break;
    }
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
