<?php
use Aws\S3\S3Client;
use Aws\S3\Exception\S3Exception;

require __DIR__ . '/vendor/autoload.php';


if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header('HTTP/1.1 200 Success');
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(array('message' => "Hello, Sammy!"));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $s3 = new S3Client([
        'region' => 'us-east-1',
        'version' => '2006-03-01',
        'endpoint' => getenv('spaces_endpoint'),
        'credentials' => [
            'key' => getenv('spaces_key'),
            'secret' => getenv('spaces_secret')
        ],
        'use_path_style_endpoint' => true
    ]);

    try {
        $params = $_POST;
        $drone = key_exists('drone-id', $params) ? $params['drone-id'] : 'sammybot';
        $timestamp = key_exists('timestamp', $params) ? $params['timestamp'] : time();
        $key = sprintf( '%s-%s.txt' , $drone, strval($timestamp));
        $result = $s3->putObject([
            'Bucket' => getenv("spaces_bucket"),
            'Key'    => $key,
            'Body'   => print_r($params,true),
            'ACL'    => 'public-read'
        ]);
        
        header('HTTP/1.1 200 Success');
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(200);
        echo json_encode(array('message' => $result['ObjectURL']));
        exit;

    } catch (S3Exception $e) {

        header('HTTP/1.1 500 Failure');
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(500);
        echo json_encode(array('message' => $e->getMessage()));
        exit;
    }
}