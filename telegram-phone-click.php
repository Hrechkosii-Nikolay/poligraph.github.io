<?php
ini_set('display_errors',1);
error_reporting(E_ALL);
header('Content-Type: application/json; charset=utf-8');

function sanitize($d){ return htmlspecialchars(trim($d),ENT_QUOTES,'UTF-8'); }

$page_url = sanitize($_POST['page_url'] ?? '');
$phone_clicked = sanitize($_POST['phone_clicked'] ?? '');

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

$country='Невідомо'; $city='Невідомо';
$ch=curl_init("https://ipwho.is/".$ip);
curl_setopt_array($ch,[CURLOPT_RETURNTRANSFER=>true,CURLOPT_TIMEOUT=>5]);
$res=curl_exec($ch);
curl_close($ch);
if($res){
 $g=json_decode($res,true);
 if(!empty($g['success'])){
   $country=$g['country']??$country;
   $city=$g['city']??$city;
 }
}

date_default_timezone_set('Europe/Kyiv');
$time=date('d.m.Y H:i');

$token = "8328352877:AAGGDQx9GUeSeGQDt7ply6swkNCRc0TS7Gc";
$chat_id = "-1003789979524";

$txt="📞 <b>Клік по номеру телефону</b>\n\n";
$txt.="☎️ <b>Номер:</b> $phone_clicked\n\n";
$txt.="🌍 <b>Країна:</b> $country\n";
$txt.="🏙 <b>Місто:</b> $city\n";
$txt.="🌐 <b>IP:</b> $ip\n";
$txt.="💻 <b>Тип:</b> ".device($ua)."\n";
$txt.="📱 <b>ОС:</b> ".os($ua)."\n\n";
if (!empty($page_url)) {
  $txt .= "📄 <b>Сторінка:</b> $page_url\n";
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
 CURLOPT_RETURNTRANSFER=>true,
 CURLOPT_TIMEOUT=>5
]);
curl_exec($ch);
curl_close($ch);

echo json_encode(['status'=>'ok']);