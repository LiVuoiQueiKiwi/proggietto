function uploadVideo(file, metadata) {

      description=metadata.get('geoloc')+":"+metadata.get('purpose')+":"+metadata.get('language')+":"+metadata.get('content')
      if(metadata.get('audience')!='')
        description+=":"+metadata.get('audience')
      if(metadata.get('detail')!='')
        description+=":"+metadata.get('detail')

      metadata_formatted=
      {
        "snippet": {
          "categoryId": "22",
          "description": description,
          "title": metadata.get('title')
        },
        "status": {
          "privacyStatus": "private"
        }
      }
      //alert(metadata_formatted.snippet.description)


	var auth = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
	var form = new FormData();
	var video_meta = new Blob([JSON.stringify(metadata_formatted)], {type: 'application/json'});

	form.append('video', video_meta);
	form.append('mediaBody', file);

	$.ajax({
		url: 'https://www.googleapis.com/upload/youtube/v3/videos?access_token='+ encodeURIComponent(auth) + '&part=snippet,status',
		data: form,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		success: function(data){
      uploadVideoSuccess(data, metadata)
    },
		error: function(error){
        alert(error)
    }
	})
}

function uploadVideoSuccess(idVideo, formData){

    formData.append('idVideo', idVideo)
    $.ajax(
      {
        url: '', //inserire link del server (Funzione: uploadClip)
        type: 'POST',
        dataType: 'json',
        data: formData,
        processData: false,	// Evita che Jquery faccia operazioni sui dati.
        contentType: false	// Evita che Jquery faccia operazioni sui dati.
      }
    )
}



function deleteVideo(id) {


/* GESTIONE ELIMINAZIONE VIDEO DA YOUTUBE SAPENDO L'ID DEL VIDEO
	var auth = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

	$.ajax({
		url: 'https://www.googleapis.com/upload/youtube/v3/videos?access_token='+ encodeURIComponent(auth) + '&part=snippet,status',
		data: form,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		success: function(data){
      deleteVideoSuccess(id)
    },
		error: function(error){
        alert(error)
    }
	})*/
}

function deleteVideoSuccess(id){

    $.ajax(
      {
        url: '', //inserire link del server (Funzione: deleteClip)
        type: 'POST',
        dataType: 'json',
        data: id,
        processData: false,	// Evita che Jquery faccia operazioni sui dati.
        contentType: false	// Evita che Jquery faccia operazioni sui dati.
      }
    )
}



function updateVideo(formData) {

  
/* GESTIONE AGGIORNAMENTO VIDEO DA YOUTUBE SAPENDO IL LINK DEL VIDEO
	var auth = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;


	$.ajax({
		url: 'https://www.googleapis.com/upload/youtube/v3/videos?access_token='+ encodeURIComponent(auth) + '&part=snippet,status',
		data: form,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		success: function(data){
      updateVideoSuccess(link)
    },
		error: function(error){
        alert(error)
    }
	})*/
}

function updateVideoSuccess(formData){

    $.ajax(
      {
        url: '', //inserire link del server (Funzione: updateClip)
        type: 'POST',
        dataType: 'json',
        data: formData,
        processData: false,	// Evita che Jquery faccia operazioni sui dati.
        contentType: false	// Evita che Jquery faccia operazioni sui dati.
      }
    )
}
