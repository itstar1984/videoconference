$(function () {
    var reRoom = /^#?conf\/([A-Za-z0-9\-_\.@]+)$/;
    var mainReRoom = /^#?main\/([A-Za-z0-9\-_\.@]+)$/;



    // grab the room from the URL

	var room = (location.hash.match(reRoom) || 0)[1] || '';
	var mainRoom = (location.hash.match(mainReRoom) || 0)[1] || '';
	var hash = location.hash;
    window.isVoice = location.pathname === '/voice/'?true:false;
	console.log(window.isVoice)

	if(hash.charAt(1)=='#')
	{
		hash = hash.slice(2,hash.length);
		room = '';
		mainRoom = hash.split('/')[0];
		window.name = hash.split('/')[1];

	}
	else{

		hash = hash.slice(1,hash.length);
		mainRoom = '';
		room = hash.split('/')[0];
		window.name = hash.split('/')[1];

	}
	if (!room && !mainRoom) {
		return;
	}
	if(mainRoom)
	{
		 window.main = true;

	}


    // create our webrtc connection
    var webrtc = new SimpleWebRTC({
        // the id/element dom element that will hold "our" video
        localVideoEl: 'mainVideo',
        // the id/element dom element that will hold remote videos
        remoteVideosEl: 'remotes',
        // immediately ask for camera access
        autoRequestMedia: true,
        url: '/contact'
    });

    webrtc.on('readyToCall', function () {
      //  $localVideo.fadeIn();
		///$comment.fadeIn();
    });

    webrtc.on('*', function (name, event) {
      //$status.text(name);
    });

    webrtc.webrtc.on('*', function (name, event) {
       // $status.text(name);
    });


    // when it's ready, join if we got a room from the URL
    webrtc.on('readyToCall', function () {
        // you can name it anything

        webrtc.joinConf(room,mainRoom);
    });
	$(window).resize(function(){
		resizeContent();
	})
});
function resizeContent()
{
	var height = window.innerHeight ;
	var width = window.innerWidth ;
	var count = Math.floor(window.count /3);
	var row = count + 1;
	var col = count +2;
	var marginLeft = Math.max(0,(width - height* col/row)/2);
	var marginTop = Math.max(0,(height - width* row/col)/2);
	var cellWidth = (width - marginLeft*2 ) /col;
	var left = marginLeft + cellWidth;
	var top;
	{
		$("#container_mainVideo").css({ left:left +1+ 'px',top:marginTop+1 +'px',width:cellWidth*count -1 + 'px',height:cellWidth*count -1 + 'px'});
	}

	for(var i = 0 ; i < window.subvideos.length ; i ++)
	{
       var ID = window.subvideos[i];
		var  W = cellWidth - 4;
		var H = cellWidth -4 ;
	   if( i < count +1)
	   {
		   left = marginLeft + 1;
		   top = marginTop + cellWidth* i + 1 ;
		   $("#" + ID).css({ left:left + 'px',top: top +'px',width:W + 'px',height:H+ 'px'});
	   }
		else if( i > count  && i < count*2 + 2)
		{
			left = marginLeft + (i - count)*cellWidth + 1;
			top = marginTop + cellWidth* count + 1;
			$("#" + ID).css({ left:left + 'px',top: top  +'px',width:W + 'px',height:H + 'px'});
		}
	   else
	   {
		   left = marginLeft + (1 + count)*cellWidth + 1;
		   top = marginTop + (window.count -1 - i)*cellWidth + 1;
		   $("#" + ID).css({ left:left + 'px',top: top +'px',width:W + 'px',height:H + 'px'});
	   }


	}
}