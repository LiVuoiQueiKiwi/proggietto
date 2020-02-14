

function uploadVideo(file, metadata) {
	user = GoogleAuth.currentUser.get();
	if(user.hasGrantedScopes('https://www.googleapis.com/auth/youtube.upload')){

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
			/*"kind": 'youtube#video',*/
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
		var new_form = new FormData();
		var print=''
          console.log(metadata_formatted)
		var video_meta = new Blob([JSON.stringify(metadata_formatted)], {type: 'application/json'});

		new_form.append('video', video_meta);
		new_form.append('mediaBody', file);
		console.log(file)
		console.log(video_meta)
		console.log(new_form)
		
		var print=''
          for (var pair of new_form.entries()) {
            print+=(pair[0]+ ' - ' + pair[1]);
            print+='\n'
          }
          alert(print)
		
		
		$.ajax({
			url: 'https://www.googleapis.com/upload/youtube/v3/videos?access_token='+ encodeURIComponent(auth) + '&part=snippet,status&key=AIzaSyBjqg6UbFyTH2gfunOzkGQj4CUriNY7C3A',
			data: new_form,
			cache: false,
			contentType: false,
			processData: false,
			method: 'POST'
		}).done(function(response){
				console.log("Caricamento ok: "+ response)
				uploadVideoSuccess(data, metadata)
			}
		).fail(function(response){
				var errors=response.responseJSON.error.errors[0];
				console.log("Errore caricamento: "+ errors)
				console.log("Response: "+ response)
			}
		)

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
		method: 'DELETE'
		}).done(function(response){
				console.log("Cancellazione ok: "+ response)
				deleteVideoSuccess(id)
			}
		).fail(function(response){
				var errors=response.responseJSON.error.errors[0];
				console.log("Errore cancellazione: "+ errors)
				console.log("Response: "+ response)
			}
		)
		
	
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
		method: 'PUT'
		}).done(function(response){
				console.log("Aggiornamento ok: "+ response)
				updateVideoSuccess(formData)
			}
		).fail(function(response){
				var errors=response.responseJSON.error.errors[0];
				console.log("Errore aggiornamento: "+ errors)
				console.log("Response: "+ response)
			}
		)
		
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
		method: 'POST'
		}).done(function(response){
				console.log("Pubblica ok: "+ response)
				publishVideoSuccess(id)
			}
		).fail(function(response){
				var errors=response.responseJSON.error.errors[0];
				console.log("Errore pubblica: "+ errors)
				console.log("Response: "+ response)
			}
		)
		
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
