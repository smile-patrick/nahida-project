<?php
// counter.php
// 简单的文本文件统计脚本

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
error_reporting(0); // Suppress any warnings (like permission denied) to ensure valid JSON output
ini_set('display_errors', 0);

$dataFile = 'counter.json';
$ipFile = 'ip_records.json';

function getUserIP() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) return $_SERVER['HTTP_CLIENT_IP'];
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) return $_SERVER['HTTP_X_FORWARDED_FOR'];
    return $_SERVER['REMOTE_ADDR'];
}

$userIP = getUserIP();
$todayDate = date('Y-m-d');
$yesterdayDate = date('Y-m-d', strtotime('-1 day'));

// 1. 读取统计数据
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([
        "total" => 0,
        "today" => 0,
        "yesterday" => 0,
        "last_date" => $todayDate
    ]));
}
$data = json_decode(file_get_contents($dataFile), true);
if (!is_array($data)) {
    $data = [
        "total" => 0,
        "today" => 0,
        "yesterday" => 0,
        "last_date" => $todayDate
    ];
}

// 2. 读取今日IP记录
if (!file_exists($ipFile)) {
    file_put_contents($ipFile, json_encode([]));
}
$ips = json_decode(file_get_contents($ipFile), true);
if (!is_array($ips)) {
    $ips = [];
}

// 3. 日期跨越逻辑
if ($data['last_date'] !== $todayDate) {
    if ($data['last_date'] === $yesterdayDate) {
        $data['yesterday'] = $data['today']; // 昨日继承
    } else {
        $data['yesterday'] = 0; // 跨天断层
    }
    $data['today'] = 0;
    $data['last_date'] = $todayDate;
    
    // 清空IP记录
    $ips = [];
}

// 4. 统计逻辑：同一IP今日只算一次
if (!in_array($userIP, $ips)) {
    $ips[] = $userIP;
    $data['today'] += 1;
    $data['total'] += 1;
    
    // 写入文件
    file_put_contents($dataFile, json_encode($data));
    file_put_contents($ipFile, json_encode($ips));
}

// 5. 返回当前数据
echo json_encode([
    "success" => true,
    "total" => $data['total'],
    "today" => $data['today'],
    "yesterday" => $data['yesterday']
]);
?>
