<?php
/**
 * Genera analytics-cache.json a partir de la API de GoatCounter.
 * Ús: GET /admin/fetch-analytics.php?token=llumatics
 * Requereix: PHP + cURL + permisos d'escriptura al directori /admin/
 */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
set_time_limit(90);

$token = trim($_GET['token'] ?? '');
if ($token !== 'LinuxBCN2026') {
    http_response_code(403);
    echo json_encode(['error' => 'Accés denegat']);
    exit;
}

if (!function_exists('curl_init')) {
    http_response_code(500);
    echo json_encode(['error' => 'cURL no disponible al servidor']);
    exit;
}

define('GC_TOKEN',  '1ocyv2uxc6caw1toqjtd0pqw231vj8tb843vpx611u5b0wkzm7dn');
define('GC_BASE',   'https://llumatics.goatcounter.com/api/v0');
define('CACHE_FILE', __DIR__ . '/analytics-cache.json');

function gc_fetch(string $path, array $params = []): ?array {
    $url = GC_BASE . $path;
    if ($params) $url .= '?' . http_build_query($params);
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 25,
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . GC_TOKEN,
            'Accept: application/json',
        ],
    ]);
    $body   = curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err    = curl_error($ch);
    curl_close($ch);
    if ($body === false || $err || $status >= 400) return null;
    $decoded = json_decode($body, true);
    return is_array($decoded) ? $decoded : null;
}

function extract_lang(string $path): string {
    $parts = array_values(array_filter(explode('/', $path)));
    foreach ($parts as $p) {
        if (in_array($p, ['ca', 'en', 'es'], true)) return $p;
    }
    return 'ca';
}

function extract_section(string $path): string {
    $parts    = array_values(array_filter(explode('/', $path)));
    $lang_idx = -1;
    foreach ($parts as $i => $p) {
        if (in_array($p, ['ca', 'en', 'es'], true)) { $lang_idx = $i; break; }
    }
    $after = $lang_idx >= 0 ? array_slice($parts, $lang_idx + 1) : $parts;
    return $after[0] ?? 'inici';
}

function norm_items(array $items, string $name_field): array {
    $out = [];
    foreach ($items as $item) {
        // GoatCounter API v0: {name, id, count}. Per sizes, name pot ser buit, usar id.
        $name = $item['name'] ?? '';
        if ($name === '') $name = $item['id'] ?? $item[$name_field] ?? 'Desconegut';
        if ($name === '') $name = 'Desconegut';
        $count = (int)($item['count'] ?? 0);
        if (!$count) {
            if (isset($item['stats']) && is_array($item['stats'])) {
                foreach ($item['stats'] as $s) $count += (int)($s['daily'] ?? $s['count'] ?? 0);
            }
        }
        if (!$count) $count = (int)($item['total'] ?? 0);
        if ($count > 0) $out[] = ['name' => $name, 'id' => $item['id'] ?? $name, 'count' => $count];
    }
    usort($out, fn($a, $b) => $b['count'] - $a['count']);
    return $out;
}

// ── Fetch ────────────────────────────────────────────────────────────────────
$end         = date('Y-m-d');
$start       = date('Y-m-d', strtotime('-365 days'));
$base_params = ['start' => $start, 'end' => $end, 'limit' => 200];

$hits_raw = gc_fetch('/stats/hits',      $base_params); usleep(400000);
$refs_raw = gc_fetch('/stats/toprefs',   array_merge($base_params, ['limit' => 20])); usleep(400000);
$brow_raw = gc_fetch('/stats/browsers',  array_merge($base_params, ['limit' => 10])); usleep(400000);
$sys_raw  = gc_fetch('/stats/systems',   array_merge($base_params, ['limit' => 10])); usleep(400000);
$size_raw = gc_fetch('/stats/sizes',     array_merge($base_params, ['limit' => 10])); usleep(400000);
$loc_raw  = gc_fetch('/stats/locations', array_merge($base_params, ['limit' => 20]));

// ── Processa hits ─────────────────────────────────────────────────────────────
$hits_by_day  = [];
$by_lang      = [];
$by_section   = [];
$hits_list    = [];
$total        = 0;
$total_unique = 0;

foreach (($hits_raw['hits'] ?? []) as $path_item) {
    $path = (string)($path_item['path'] ?? '');
    if (str_starts_with($path, '/admin') || str_ends_with($path, '.php')) continue;

    $lang        = extract_lang($path);
    $section     = extract_section($path);
    $path_total  = 0;
    $path_unique = (int)($path_item['total_unique'] ?? 0);

    foreach (($path_item['stats'] ?? []) as $stat) {
        $date  = substr((string)($stat['day'] ?? ''), 0, 10);
        $count = (int)($stat['daily'] ?? 0);
        if (!$count || strlen($date) !== 10) continue;
        $total               += $count;
        $path_total          += $count;
        $by_lang[$lang]       = ($by_lang[$lang] ?? 0) + $count;
        $by_section[$section] = ($by_section[$section] ?? 0) + $count;
        $hits_by_day[$date]   = ($hits_by_day[$date] ?? 0) + $count;
    }
    $total_unique += $path_unique;
    if ($path_total > 0) {
        $hits_list[] = ['path' => $path, 'count' => $path_total, 'count_unique' => $path_unique];
    }
}

ksort($hits_by_day);
arsort($by_lang);
arsort($by_section);
usort($hits_list, fn($a, $b) => $b['count'] - $a['count']);

$hbd_arr = [];
foreach ($hits_by_day as $date => $count) {
    $hbd_arr[] = ['date' => $date, 'count' => $count];
}

// ── Processa refs ─────────────────────────────────────────────────────────────
$refs_list = [];
foreach (($refs_raw['stats'] ?? []) as $ref) {
    $count = (int)($ref['count'] ?? 0);
    if ($count > 0) $refs_list[] = ['name' => $ref['name'] ?? $ref['id'] ?? '(directe)', 'count' => $count, 'id' => $ref['id'] ?? ''];
}

// ── Sortida ───────────────────────────────────────────────────────────────────
$output = [
    'generated'    => gmdate('Y-m-d\TH:i:s\Z'),
    'period'       => ['start' => $start, 'end' => $end],
    'total'        => $total,
    'total_unique' => $total_unique,
    'hits_by_day'  => $hbd_arr,
    'hits'         => array_slice($hits_list, 0, 50),
    'by_lang'      => $by_lang,
    'by_section'   => $by_section,
    'refs'         => $refs_list,
    'locations'    => norm_items($loc_raw['stats']  ?? [], 'location'),
    'browsers'     => norm_items($brow_raw['stats'] ?? [], 'browser'),
    'systems'      => norm_items($sys_raw['stats']  ?? [], 'system'),
    'sizes'        => norm_items($size_raw['stats'] ?? [], 'size'),
];

$json = json_encode($output, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

if (file_put_contents(CACHE_FILE, $json) === false) {
    http_response_code(500);
    echo json_encode(['error' => 'No s\'ha pogut escriure analytics-cache.json. Comprova els permisos del directori /admin/.']);
    exit;
}

echo json_encode([
    'status'    => 'ok',
    'total'     => $total,
    'generated' => $output['generated'],
    'period'    => $output['period'],
]);
