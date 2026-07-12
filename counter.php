<?php
// counter.php
// 简单、轻量级的本地文件访问量统计脚本 (基于 IP 防刷)

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$dataFile = 'counter.json';
$ipFile = 'ip_records.json';

// 获取当前用户真实的 IP
function getUserIP() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) return $_SERVER['HTTP_CLIENT_IP'];
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) return $_SERVER['HTTP_X_FORWARDED_FOR'];
    return $_SERVER['REMOTE_ADDR'];
}

$userIP = getUserIP();
$todayDate = date('Y-m-d');
$yesterdayDate = date('Y-m-d', strtotime('-1 day'));

// 1. 读取基础数据
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([
        "total" => 0,
        "today" => 0,
        "yesterday" => 0,
        "last_date" => $todayDate
    ]));
}
$data = json_decode(file_get_contents($dataFile), true);

// 2. 读取 IP 记录 (用于防刷，保证一天一个IP只算一次)
if (!file_exists($ipFile)) {
    file_put_contents($ipFile, json_encode([]));
}
$ips = json_decode(file_get_contents($ipFile), true);

// 3. 日期跨天重置逻辑
if ($data['last_date'] !== $todayDate) {
    if ($data['last_date'] === $yesterdayDate) {
        $data['yesterday'] = $data['today']; // 昨天的数据继承
    } else {
        $data['yesterday'] = 0; // 断更了，昨天就是 0
    }
    $data['today'] = 0;
    $data['last_date'] = $todayDate;
    
    // 清空 IP 记录
    $ips = [];
}

// 4. 统计逻辑：如果今天该 IP 没有访问过，则增加数值
if (!in_array($userIP, $ips)) {
    $ips[] = $userIP;
    $data['today'] += 1;
    $data['total'] += 1;
    
    // 保存回文件
    file_put_contents($dataFile, json_encode($data));
    file_put_contents($ipFile, json_encode($ips));
}

// 5. 输出结果给前端
echo json_encode([
    "success" => true,
    "total" => $data['total'],
    "today" => $data['today'],
    "yesterday" => $data['yesterday']
]);
?>
