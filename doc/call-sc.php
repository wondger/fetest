<?php
/**
 * call nsf serviceCenterWeb sample
 * by houkun 2011-12
 */

$to=iconv('GBK','UTF-8','侯昆');
$subject=iconv('GBK','UTF-8','测试中文abc');
$content=iconv('GBK','UTF-8','测试中文abc');
$data=json_encode(array('subject'=>$subject,'content'=>$content));
$query='from=null&parameters=null&data='.urlencode($data);

//set your auth and template
$query=$query.'&source=justTest&authkey=888AA2D7AF920184AF60EC2A17D66E3D&templateKey=aliway';
//email
$query=$query.'&to=houkun@taobao.com&way=3';
//aliw
//$query=$query.'&to='.urlencode($to).'&way=2';

echo 'data-json:<br/>'.$data.'<br/>';
echo 'query:<br/>'.$query.'<br/>';

$ch=curl_init();

//echo page for test
curl_setopt($ch,CURLOPT_URL,'http://10.13.23.2:1234/debug/echo');
//curl_setopt($ch,CURLOPT_URL,'http://sc.wf.taobao.org/Taobao.Facades.INotifyService/Notify');

curl_setopt($ch,CURLOPT_RETURNTRANSFER,0);
curl_setopt($ch,CURLOPT_POST,6);//query kv count
curl_setopt($ch,CURLOPT_POSTFIELDS,$query);

$result=curl_exec($ch);
$curl_code=curl_getinfo($ch,CURLINFO_HTTP_CODE);

curl_close($ch);
echo 'code:'.$curl_code.'<br/>';