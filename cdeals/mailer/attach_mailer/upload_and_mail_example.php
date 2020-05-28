<?php
require("attach_mailer_class.php");
//include ("classes/upload/upload_class.php");
// this class is used for the file upload, download at http://www.finalwebsites.com/snippets.php?id=7
// if you need assisstance about using this upload class, check the provided documentation

$msg = "";
$max_size = 1024 * 250; // the max. size for uploading
//$my_upload = new file_upload;

if (isset($_POST['Submit'])) {
    $my_mail = new attach_mailer($name = $_POST['from_name'], $from = $_POST['from_email'], $to = $_POST['mail_to'], $cc = "", $bcc = "", $subject = $_POST['mail_subject']);
    $my_mail->text_body = $_POST['mail_body'];
    $full_path = 'image.gif';
    $my_mail->add_attach_file($full_path);
    $my_mail->process_mail();
//    // upload part
//    $my_upload->the_temp_file = $_FILES['upload']['tmp_name'];
//    $my_upload->the_file = $_FILES['upload']['name'];
//    $my_upload->http_error = $_FILES['upload']['error'];
//    if ($my_upload->upload()) {
//        $full_path = $my_upload->upload_dir . $my_upload->file_copy;
//        $my_mail->add_attach_file($full_path);
//        $my_mail->process_mail();
//        $my_upload->del_temp_file($full_path); // the file is not needed anymore
//    }
    $msg .= $my_mail->get_msg_str();
}
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
        <title>Attachment (FORM) Mailer example</title>
        <style type="text/css">
            <!--
            label {
                float:left;
                display:block;
                width:150px;
            }
            input {
                float:left;
            }
            -->
        </style>
    </head>

    <body>
        <h2>Send an e-mail with   (an uploaded) attachment</h2>
        <p>This is a simple example of how to use this class while uploading a file with a form and send this file by mail as an attachment. To create this online mail application you need an php upload script. I used the <a href="http://www.finalwebsites.com/snippets.php?id=7">Easy PHP Upload</a> from finalwebsites.com</p>
        <p style="color:#FF0000;"><?php echo $msg; ?></p>

        <p>Max. filesize = <?php echo $max_size; ?> bytes.</p>
        <form name="form1" enctype="multipart/form-data" method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
            <input type="hidden" name="MAX_FILE_SIZE" value="<?php echo $max_size; ?>"><br>
            <label for="upload">Select a attachment file</label>
            <input type="file" name="upload" size="30">
            <br clear="all">
            <label for="from_name">From: (name) </label>
            <input name="from_name" type="text" id="from_name" size="30" value="<?php if (isset($_POST['from_name'])) echo $_POST['from_name']; ?>">
            <br clear="all">
            <label for="from_email">From: (email) </label>
            <input name="from_email" type="text" id="from_email" size="30" value="<?php if (isset($_POST['from_email'])) echo $_POST['from_email']; ?>">
            <br clear="all">
            <label for="mail_to"><b>Mail to: </b></label>
            <input name="mail_to" type="text" id="mail_to" size="30" style="font-weight:bold;" value="<?php if (isset($_POST['mail_to'])) echo $_POST['mail_to']; ?>">
            <br clear="all">
            <label for="mail_subject">Mail subject:</label>
            <input name="mail_subject" type="text" id="mail_subject" size="50" value="<?php if (isset($_POST['mail_subject'])) echo $_POST['mail_subject']; ?>">
            <br clear="all">
            <label for="mail_body">Your message:</label>
            <textarea name="mail_body" cols="50" rows="5"><?php if (isset($_POST['mail_body'])) echo $_POST['mail_body']; ?></textarea>
            <br clear="all">
            <input style="margin-left:150px;" type="submit" name="Submit" value="Submit">
        </form>

    </body>
</html>
