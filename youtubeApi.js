function uploadVideo(file, metadata) {

  //metadata_formatted= Formattazione corretta di metadata
      var print=''
      for (var pair of metadata.entries()) {
        print+=(pair[0]+ ' - ' + pair[1]);
        print+='\n'
      }
      alert(print)
      description=metadata.get('geoloc')+":"+metadata.get('purpose')+":"+metadata.get('language')+":"
      for(i=0; i<(metadata.get('content')).length; i++)
        description+=metadata.content[i]
      if(metadata.get('audience')!='')
        description+=":"+metadata.get('audience')
      if((metadata.get('detail')!='')
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
      alert(metadata_formatted)


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



function deleteVideo(link) {

    /*  var print=''
      for (var pair of metadata.entries()) {
        print+=(pair[0]+ ' - ' + pair[1]);
        print+='\n'
      }
      alert(print)*/
/* GESTIONE ELIMINAZIONE VIDEO DA YOUTUBE SAPENDO IL LINK DEL VIDEO
	var auth = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;


	$.ajax({
		url: 'https://www.googleapis.com/upload/youtube/v3/videos?access_token='+ encodeURIComponent(auth) + '&part=snippet,status',
		data: form,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		success: function(data){
      deleteVideoSuccess(link)
    },
		error: function(error){
        alert(error)
    }
	})*/
}

function deleteVideoSuccess(link){

    $.ajax(
      {
        url: '', //inserire link del server (Funzione: deleteClip)
        type: 'POST',
        dataType: 'json',
        data: link,
        processData: false,	// Evita che Jquery faccia operazioni sui dati.
        contentType: false	// Evita che Jquery faccia operazioni sui dati.
      }
    )
}



function updateVideo(formData) {

    /*  var print=''
      for (var pair of metadata.entries()) {
        print+=(pair[0]+ ' - ' + pair[1]);
        print+='\n'
      }
      alert(print)*/
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
