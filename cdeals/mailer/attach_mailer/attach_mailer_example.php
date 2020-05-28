<?php

error_reporting(E_ALL);
require("attach_mailer_class.php");

$test = new attach_mailer($name = "Olaf", $from = "ikrunal83@gmail.com", $to = "ikrunal83@gmail.com", $cc = "", $bcc = "", $subject = "Test text email with attachments");
$test->text_body = "...Some body text\n\n the admin";
//$test->add_attach_file("image.gif");
//$test->add_attach_file("ip2nation.zip");
$test->process_mail();


$to = 'krunal48@gmail.com';
$subject = 'the subject';
$message = 'hello';
$headers = 'From: krunal48@gmail.com' . "\r\n" .
        'Reply-To: krunal48@gmail.com' . "\r\n" .
        'X-Mailer: PHP/' . phpversion();

mail($to, $subject, $message, $headers);
?>
