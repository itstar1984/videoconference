$(function () {
    var reRoom = /^#?room\/([A-Za-z0-9\-_\.@]+)$/;
    window.remoteVideoWidth = 0;
	window.remoteVideoHeight = 0;
    // grab the room from the URL
    var room = (location.hash.match(reRoom) || 0)[1] || '';

    var $startbtn = $('#starticon'),
		$stopbtn = $('#stopicon'),
        $status = $('#status'),
		$comment = $('#comment').hide(),
		$remotes = $('#remotes')
		$bottombar = $('#bottombar').hide(),
		$localVideo = $('#localVideo').hide();
		
    $startbtn.click(function () {
		$remotes.fadeIn();
		var name = prompt('Change room', room) || '';
		name = name.toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-\.]/g, '');

		webrtc.leaveRoom();
		webrtc.joinRoom(name, function () {
			location.hash = 'room/' + name;
			room = name;
			$comment.fadeOut();
		});
    });

    $stopbtn.click(function () {
		webrtc.leaveRoom();
		$comment.fadeIn();
	});

	var barstatus = false;
	$remotes.click(function () {
		if(barstatus===false){
//			barstatus = true;
//			$bottombar.fadeIn();
		}else{
//			$bottombar.fadeOut();		
//			barstatus = false;
		}
	});
	$comment.click(function () {
		if(barstatus===false){
			barstatus = true;
			$bottombar.fadeIn();
		}else{
			$bottombar.fadeOut();		
			barstatus = false;
		}
	});

    // create our webrtc connection
    var webrtc = new SimpleWebRTC({
        // the id/element dom element that will hold "our" video
        localVideoEl: '',
        // the id/element dom element that will hold remote videos
        remoteVideosEl: 'remotes',
        // immediately ask for camera access
        autoRequestMedia: true,
        url: '/contact'
    });

    webrtc.on('readyToCall', function () {
        $localVideo.fadeIn();
		$comment.fadeIn();
    });

    webrtc.on('*', function (name, event) {
        $status.text(name);
    });

    webrtc.webrtc.on('*', function (name, event) {
        $status.text(name);
    });

    if (!room) {
        return;
    }

    // when it's ready, join if we got a room from the URL
    webrtc.on('readyToCall', function () {
        // you can name it anything
        webrtc.joinRoom(room);
    });
	$(window).resize(resizeContent)

});
function resizeContent(){

}