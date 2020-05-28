$(function () {
    var reRoom = /^#?room\/([A-Za-z0-9\-_\.@]+)$/;
    window.remoteVideoWidth = 0;
    window.remoteVideoHeight = 0;
    // grab the room from the URL
    var room = (location.hash.match(reRoom) || 0)[1] || '';
    $localVideo = $("#localVideo")
    console.log(room)
    // create our webrtc connection
    var webrtc = new SimpleWebRTC({
        // the id/element dom element that will hold "our" video
        localVideoEl: 'localVideo',
        // the id/element dom element that will hold remote videos
        remoteVideosEl: 'remotes',
        // immediately ask for camera access
        autoRequestMedia: true,
        url: '/contact',
        adjustPeerVolume: false,
        peerVolumeWhenSpeaking: 1,
        media: {
            audio: {
                optional: [
                    //{sourceId: audio_source},
                    {googAutoGainControl: false},
                    {googAutoGainControl2: false},
                    {googEchoCancellation: false},
                    {googEchoCancellation2: false},
                    {googNoiseSuppression: false},
                    {googNoiseSuppression2: false},
                    {googHighpassFilter: false},
                    {googTypingNoiseDetection: false},
                    {googAudioMirroring: false}
                ]
            },
            video: {
                optional: [
                    //{sourceId: video_source}
                ]
            }
        }
    });

    webrtc.on('readyToCall', function () {
        $localVideo.fadeIn();
    });

    webrtc.on('*', function (name, event) {

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
    window.onmessage = function (e) {
        console.log(e)
        if (e.data === "refresh") {
            window.location.reload();

        }
    }

});
function resizeContent() {
    if (window.remoteVideoHeight > 0 && window.remoteVideoHeight > 0) {
        var bottom = Math.max((window.innerHeight - window.remoteVideoHeight * window.innerWidth / window.remoteVideoWidth) / 2, 0)
        var right = Math.max((window.innerWidth - window.remoteVideoWidth * window.innerHeight / window.remoteVideoHeight) / 2, 0)

        $("#localVideo").css({
            right: right + 'px',
            bottom: bottom + 'px'
        })
    }
}