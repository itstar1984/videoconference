<?php

include 'sendmail/class.phpmailer.php';
include 'attach_mailer/attach_mailer_class.php';

function send_email($to, $cc, $bcc, $subject, $message, $attachments) {
    $_mailer = new PHPMailer();
    $_mailer->Host = "ssl://smtp.gmail.com";
    $_mailer->From = "enquiries@cdeals.co.uk";
    $_mailer->FromName = "Cdeals";

    $_mailer->AddAddress($to);

    if ($cc != "") {
        $_mailer->AddCC($cc);
    }

    if ($bcc != "") {
        $_mailer->AddBCC('outsourcing.quality@gmail.com');
        # $_mailer->AddBCC('devika.gajaraj@mpro.co');
    }

    $_mailer->SMTPAuth = "true";
    $_mailer->Username = "enquiries@cdeals.co.uk";
    $_mailer->Password = "ieSD3kK3";
    $_mailer->Port = "465";

    $_mailer->Subject = $subject;
    $_mailer->IsHTML(true);
    $_mailer->Body = $message;
    $_mailer->WordWrap = 50;
    $_mailer->AddAttachment($attachments);
    if (!$_mailer->Send()) {
        echo 'Message was not sent.';
        echo 'Mailer error: ' . $_mailer->ErrorInfo;
    } else {
        echo 'Message was sent.';
    }
}

$attachments = $_SERVER['DOCUMENT_ROOT'] . '/cdeals/assets/pdf/CIDD.pdf';
$post_data = file_get_contents("php://input");
$data = json_decode($post_data);
$to_email = $data->to;

$email_message = "<p>Hi <b>". $data->userName. "</b></p>".
                "<p>Thanks for signing up with Cdeals, You have logined in on <a target='_blank' href='https://www.cdeals.co.uk'>https://www.cdeals.co.uk</a> from Ip address ".$data->ip.", We are sending you your CIDD Agreement on attachement. </p>".
                "<p>Please review it, if any question let us know.</p>".
                "<p>Regards</p>".
                "<p><b>Cdeals Consultants</b></p>";

return send_email($to_email, '', 'outsourcing.quality@gmail.com', 'CIDD Documents', $email_message, $attachments);
