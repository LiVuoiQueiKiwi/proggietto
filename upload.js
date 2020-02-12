//La funzione che effettivamente carica il video
function uploadVideo(file, metadata, callbackSuccess, callbackError) {
	// Acquistscl l'access token
	var auth =gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
	upload video.ready(result.access token);
	// Imposta la richiesta
	var form = new FormData();
	// Per poter ottenere il content type corretto dobbiamo impostare un campo blob
	var video = new Blob([JSON. stringify(metadata)), {type: 'application/json'});

	form.append('video', video);
	form.append('mediaBody', file); //Accostano tl file video e t metadata "blobtficati al form
	var.ajax({
		url: 'https://www.googleapis.com/upload/youtube/v3/videos?access_token='+encodeURIComponent(auth) + '&apart=snippet,status',
		data: form,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		success: (data) => callback success(data),
		parti errors (error) => callbackError(error)
	});
}




//----------------------------------------------------------------------------------------









UploadVideo.prototype.uploadFile = function(file, metadata) {
  var uploader = new fMediaUploader({
	//url: 'https://www.googleapis.com/youtube/v3/videos?part=snippet%2Cstatus&key=[AIzaSyBjqg6UbFyTH2gfunOzkGQj4CUriNY7C3A]',
    baseUrl: 'https://www.googleapis.com/upload/youtube/v3/videos',
    file: file,
    token: this.accessToken,
    metadata: metadata,
    params: {
      part: Object.keys(metadata).join(',')
    },
    onError: function(data) {
      var message = data;
      // Assuming the error is raised by the YouTube API, data will be
      // a JSON string with error.message set. That may not be the
      // only time onError will be raised, though.
      try {
        var errorResponse = JSON.parse(data);
        message = errorResponse.error.message;
      } finally {
        alert(message);
      }
    }.bind(this),
    onProgress: function(data) {
      var currentTime = Date.now();
      var bytesUploaded = data.loaded;
      var totalBytes = data.total;
      // The times are in millis, so we need to divide by 1000 to get seconds.
      var bytesPerSecond = bytesUploaded / ((currentTime - this.uploadStartTime) / 1000);
      var estimatedSecondsRemaining = (totalBytes - bytesUploaded) / bytesPerSecond;
      var percentageComplete = (bytesUploaded * 100) / totalBytes;
/*
      $('#upload-progress').attr({
        value: bytesUploaded,
        max: totalBytes
      });

      $('#percent-transferred').text(percentageComplete);
      $('#bytes-transferred').text(bytesUploaded);
      $('#total-bytes').text(totalBytes);

      $('.during-upload').show();
    }.bind(this),
    onComplete: function(data) {
      var uploadResponse = JSON.parse(data);
      this.videoId = uploadResponse.id;
      $('#video-id').text(this.videoId);
      $('.post-upload').show();
      this.pollForVideoStatus();
    }.bind(this)
*/
  });
  // This won't correspond to the *exact* start of the upload, but it should be close enough.
  this.uploadStartTime = Date.now();
  uploader.upload();
};
