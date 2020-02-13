

function uploadVideo(file, metadata) {
	user = GoogleAuth.currentUser.get();
	if(user.hasGrantedScopes('https://www.googleapis.com/auth/youtube.upload')){
		if(file==null){
            alert("Nessun file");
        }
		else{
			  description=metadata.get('geoloc')+":"+metadata.get('purpose')+":"+metadata.get('language')+":"+metadata.get('content')
			  if(metadata.get('audience')!='')
				description+=":"+metadata.get('audience')
			  if(metadata.get('detail')!='')
				description+=":"+metadata.get('detail')
			  privacy="private"
			  if(metadata.get('public')==1)
				privacy="public"

			  var metadata_formatted=
			  {
				"kind": 'youtube#video',
				"snippet": {
				  "categoryId": "22",
				  "description": description,
				  "title": metadata.get('title')
				},
				"status": {
				  "privacyStatus": privacy,
				  "embeddable": true
				}
			  }
			  //alert(metadata_formatted.snippet.description)

			//gapi.auth2.init()
			var auth = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
			//alert(auth)
			//var auth = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token
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
				alert('ok')
			  //uploadVideoSuccess(data, metadata)
			},
				error: function(error){
				alert(error)
			}
			})
		}
	}
}

function uploadVideoSuccess(idVideo, formData){

    formData.append('idVideo', idVideo)
    $.ajax(
      {
        url: 'clips', //inserire link del server (Funzione: uploadClip)
        type: 'PUT',
        dataType: 'json',
        data: formData,
        processData: false,	// Evita che Jquery faccia operazioni sui dati.
        contentType: false	// Evita che Jquery faccia operazioni sui dati.
      }).done(function(data) {
			if(data.success){
				alert('Video caricato con successo!')
			} else{
				alert(data.message);
			}
		}).fail(function(jqXhr, status, error){
			console.log(error)
			// Gestione dell'errore AJAX.
		});
}



function deleteVideo(id) {


// GESTIONE ELIMINAZIONE VIDEO DA YOUTUBE SAPENDO L'ID DEL VIDEO
	var auth = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

	$.ajax({
		url: 'https://www.googleapis.com/youtube/v3/videos?id='+id+'&access_token='+ encodeURIComponent(auth),
		method: 'DELETE',
		success: function(data){
      deleteVideoSuccess(id)
    },
		error: function(error){
        alert(error)
    }
	})
}

function deleteVideoSuccess(id){

    $.ajax(
      {
        url: 'clips/:'+id, //inserire link del server (Funzione: deleteClip)
        type: 'DELETE',
        dataType: 'json',
        processData: false,	// Evita che Jquery faccia operazioni sui dati.
        contentType: false	// Evita che Jquery faccia operazioni sui dati.
      }
    ).done(function(data) {
		if(data.success){
			alert('Video eliminato con successo!')
		} else{
			alert(data.message);
		}
	}).fail(function(jqXhr, status, error){
		console.log(error)
		// Gestione dell'errore AJAX.
	});
}



function updateVideo(formData) {


  description=metadata.get('geoloc')+":"+metadata.get('purpose')+":"+metadata.get('language')+":"+metadata.get('content')
  if(metadata.get('audience')!='')
    description+=":"+metadata.get('audience')
  if(metadata.get('detail')!='')
    description+=":"+metadata.get('detail')
  if(metadata.get('public')==1)
    privacy="public"

  metadata_formatted=
  {
    "id": formData.get('id'),
    "snippet": {
      "categoryId": "22",
      "description": description,
      "title": metadata.get('title')
    },
    "status": {
      "privacyStatus": privacy
    }
  }


// GESTIONE AGGIORNAMENTO VIDEO DA YOUTUBE SAPENDO L'ID DEL VIDEO
	var auth = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;


	$.ajax({
		url: 'https://www.googleapis.com/youtube/v3/videos?access_token='+ encodeURIComponent(auth) + '&part=snippet,status,localizations',
		data: metadata_formatted,
		cache: false,
		contentType: false,
		processData: false,
		method: 'PUT',
		success: function(data){
      updateVideoSuccess(formData)
    },
		error: function(error){
        alert(error)
    }
	})
}

function updateVideoSuccess(formData){

    $.ajax(
      {
        url: 'clips', //inserire link del server (Funzione: updateClip)
        type: 'UPDATE',
        dataType: 'json',
        data: formData,
        processData: false,	// Evita che Jquery faccia operazioni sui dati.
        contentType: false	// Evita che Jquery faccia operazioni sui dati.
      }
    ).done(function(data) {
		if(data.success){
			alert('Video modificato con successo!')
		} else{
			alert(data.message);
		}
	}).fail(function(jqXhr, status, error){
		console.log(error)
		// Gestione dell'errore AJAX.
	});
}


function publishVideo(id, title) {

  metadata_formatted=
  {
    "id": id,
    "snippet": {
      "categoryId": "22",
      "title": title
    },
    "status": {
      "privacyStatus": "public"
    }
  }


// GESTIONE PUBBLICAZIONE VIDEO DA YOUTUBE SAPENDO L'ID DEL VIDEO
	var auth = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;


	$.ajax({
		url: 'https://www.googleapis.com/youtube/v3/videos?access_token='+ encodeURIComponent(auth) + '&part=snippet,status,localizations',
		data: metadata_formatted,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		success: function(data){
        publishVideoSuccess(id)
    },
		error: function(error){
        alert(error)
    }
	})
}

function publishVideoSuccess(id){
	formData=new formData()
	formData.append("published", "1")
	formData.append("id", id)
    $.ajax(
      {
        url: '', //inserire link del server (Funzione: setClipPublished)
        type: 'UPDATE',
        dataType: 'json',
        data: formData,
        processData: false,	// Evita che Jquery faccia operazioni sui dati.
        contentType: false	// Evita che Jquery faccia operazioni sui dati.
      }
    ).done(function(data) {
		if(data.success){
			alert('Video pubblicato con successo!')
		} else{
			alert(data.message);
		}
	}).fail(function(jqXhr, status, error){
		console.log(error)
		// Gestione dell'errore AJAX.
	});
}
