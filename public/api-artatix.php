<?php
/**
 * api-artatix.php
 * Lightweight cPanel reverse proxy for Artatix Customer Ticket API.
 * Solves cross-origin CORS limitations when deployed on Apache/PHP servers.
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$targetUrl = 'https://api.artatix.co.id/api/v1/customer/ticket/swear_in_continental?isTicketExclusive=0&isMerch=0';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $targetUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 8);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json, text/plain, */*',
    'Origin: https://artatix.co.id',
    'Referer: https://artatix.co.id/'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr = curl_error($ch);
unset($ch);

if ($response !== false && $httpCode === 200) {
    echo $response;
} else {
    http_response_code($httpCode ?: 502);
    echo json_encode([
        'message' => 'Failed to proxy Artatix API',
        'code' => $httpCode,
        'error' => $curlErr
    ]);
}
