<?php
ini_set('display_errors',1);
error_reporting(E_ALL);
header('Content-Type: application/json; charset=utf-8');

function sanitize($d){ return htmlspecialchars(trim($d),ENT_QUOTES,'UTF-8'); }

function respond($status,$message){
  echo json_encode(['status'=>$status,'message'=>$message], JSON_UNESCAPED_UNICODE);
  exit;
}

$honeypot=$_POST['website']??'';
if($honeypot!=='') respond('error','Spam detected (honeypot)');

$form_time=(int)($_POST['form_time']??0);
if($form_time && time()-$form_time<3) respond('error','Spam detected (too fast)');

$name=sanitize($_POST['user_name']??'');
$phone=sanitize($_POST['user_phone']??'');
$message=sanitize($_POST['user_message']??'');
$page_url = sanitize($_POST['page_url'] ?? '');
$time_on_page = sanitize($_POST['time_on_page'] ?? '');

$spam=['seo','marketing','promotion','video','backlinks','traffic'];
$all=strtolower($name.$phone.$message);
foreach($spam as $w){ if(strpos($all,$w)!==false) respond('error','Spam detected (keyword)'); }

if(!$name && !$phone && !$message) respond('error','Форма не заповнена.');

function getIP(){
 if(!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) return $_SERVER['HTTP_CF_CONNECTING_IP'];
 if(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) return trim(explode(',',$_SERVER['HTTP_X_FORWARDED_FOR'])[0]);
 return $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
}
$ip=getIP();
$ua=$_SERVER['HTTP_USER_AGENT']??'';

function os($ua){
 foreach([
  'Windows NT'=>'Windows','Android'=>'Android','iPhone'=>'iPhone',
  'iPad'=>'iPad','Mac OS X'=>'macOS','Linux'=>'Linux'
 ] as $k=>$v){ if(stripos($ua,$k)!==false) return $v; }
 return 'Невідомо';
}
function device($ua){
 if(stripos($ua,'Mobile')!==false||stripos($ua,'Android')!==false||stripos($ua,'iPhone')!==false) return 'Смартфон';
 if(stripos($ua,'iPad')!==false||stripos($ua,'Tablet')!==false) return 'Планшет';
 return 'ПК';
}
function browser($ua){
 if(preg_match('/Edg\/([\d\.]+)/',$ua,$m)) return 'Edge '.$m[1];
 if(preg_match('/Chrome\/([\d\.]+)/',$ua,$m)) return 'Chrome '.$m[1];
 if(preg_match('/Firefox\/([\d\.]+)/',$ua,$m)) return 'Firefox '.$m[1];
 if(preg_match('/Version\/([\d\.]+).*Safari/',$ua,$m)) return 'Safari '.$m[1];
 return 'Невідомо';
}

$country='Невідомо'; $city='Невідомо'; $isp='Невідомо';
$ch=curl_init("https://ipwho.is/".$ip);
curl_setopt_array($ch,[CURLOPT_RETURNTRANSFER=>true,CURLOPT_TIMEOUT=>8]);
$res=curl_exec($ch);
curl_close($ch);
if($res){
 $g=json_decode($res,true);
 if(!empty($g['success'])){
   $country=$g['country']??$country;
   $city=$g['city']??$city;
   $isp=$g['connection']['isp']??$isp;
 }
}

date_default_timezone_set('Europe/Kyiv');
$time=date('d.m.Y H:i');

$token = "8328352877:AAGGDQx9GUeSeGQDt7ply6swkNCRc0TS7Gc";
$chat_id = "-1003789979524";

$txt="📥 <b>Нова заявка</b>\n\n";
$txt.="👤 <b>Ім'я:</b> $name\n";
$txt.="☎️ <b>Телефон:</b> $phone\n\n";
$txt.="💌 <b>Питання:</b>\n$message\n\n";
$txt.="━━━━━━━━━━━━━━\n\n";
$txt.="🌍 <b>Країна:</b> $country\n";
$txt.="🏙 <b>Місто:</b> $city\n";
$txt.="📡 <b>Провайдер:</b> $isp\n";
$txt.="🌐 <b>IP:</b> $ip\n";
$txt.="💻 <b>Тип:</b> ".device($ua)."\n";
$txt.="📱 <b>ОС:</b> ".os($ua)."\n";
$txt.="🖥 <b>Браузер:</b> ".browser($ua)."\n\n";
if (!empty($page_url)) {
  $txt .= "📄 <b>Сторінка:</b> $page_url\n";
}
if (!empty($time_on_page)) {
  $txt .= "⏱ <b>На сторінці:</b> $time_on_page\n\n";
}
$txt.="🕒 <b>Час:</b> $time";

$ch=curl_init("https://api.telegram.org/bot{$token}/sendMessage");
curl_setopt_array($ch,[
 CURLOPT_POST=>true,
 CURLOPT_POSTFIELDS=>[
  'chat_id'=>$chat_id,
  'parse_mode'=>'HTML',
  'text'=>$txt
 ],
 CURLOPT_RETURNTRANSFER=>true
]);
$r=curl_exec($ch);
$e=curl_error($ch);
curl_close($ch);

if($r){
  respond('success','Дякуємо! Ваша заявка надіслана.');
} else {
  respond('error','Помилка відправки: '.$e);
}