<?php
include_once($_SERVER['DOCUMENT_ROOT']."/classes/upload/upload_class.php");
include_once($_SERVER['DOCUMENT_ROOT']."/classes/attach_mailer/attach_mailer_class.php");

$error = '';
		
if(isset($_POST['Submit'], $_FILES['upload'])) {
	$my_mail = new attach_mailer('MyName', 'mail@me.com', 'olaf@mail.nl', '', '', 'test mail multi att.');
	$my_mail->text_body = 'Hello World';
	$num_files = count($_FILES['upload']['name']);
	for ($i = 0; $i < $num_files; $i++) {
		if ($_FILES['upload']['name'][$i] != '') {

			$my_upload = new file_upload;
			$my_upload->upload_dir = $_SERVER['DOCUMENT_ROOT']."/files/multi/"; 
			$my_upload->extensions = array(".png", ".jpg", ".gif"); 
			$my_upload->the_temp_file = $_FILES['upload']['tmp_name'][$i];
			$my_upload->the_file = $_FILES['upload']['name'][$i];
			$my_upload->http_error = $_FILES['upload']['error'][$i];
			$my_upload->replace = "n"; 
			if ($my_upload->upload()) { 
				$full_path = $my_upload->upload_dir.$my_upload->file_copy;
				$my_mail->add_attach_file($full_path);
				$error .= 'File &quot;'.$my_upload->file_copy.'&quot; uploaded<br />';
			} else {
				break;
				$error = 'Error uploading file(s)';
			}
		}
	}
	if ($my_mail->process_mail()) {
		$error .= 'Mail send!';
	} else {
		$error .= 'Error sending mail';
	}
}
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>Multi upload and mail example</title>

</head>

<body>
<h3>(multiple) File upload/mail script:</h3>

<form  action="<?php echo $_SERVER['PHP_SELF']; ?>" enctype="multipart/form-data" method="post">
  <label for="upload[]">File 1:</label>
  <input type="file" name="upload[]" size="30"><br>
  <label for="upload[]">File 2:</label>
  <input type="file" name="upload[]" size="30"><br>
  <label for="upload[]">File 3:</label>
  <input type="file" name="upload[]" size="30"><br>
  <!-- Add here more file fields if you need. -->
  <input type="submit" name="Submit" value="Submit">
</form>
<p><?php echo $error; ?></p>
</body>
</html>
