

function uploadVideo(file, metadata, flag_elimina) {
	user = GoogleAuth.currentUser.get();
	if(user.hasGrantedScopes('https://www.googleapis.com/auth/youtube.upload')){

		  description=metadata.get('geoloc')+":"+metadata.get('purpose')+":"+metadata.get('language')+":"+metadata.get('content')
		  if(metadata.get('audience')!='')
			description+=":"+metadata.get('audience')
		  if(metadata.get('detail')!='')
			description+=":"+metadata.get('detail')
		  privacy="private"
		  if(metadata.get('published')==1)
			privacy="public"
		else{
			privacy="private"
			description+=":private"
		}

		  var metadata_formatted

		metadata_formatted=
			{
				/*"kind": 'youtube#video',*/
				"snippet": {
					"categoryId": "22",
					"description": description,
					"title": metadata.get('title')
				},
				"status": {
					"embeddable": true,
					"privacyStatus": privacy
				}
			}


		//gapi.auth2.init()
		var auth = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
		//alert(auth)
		//var auth = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token
		var new_form = new FormData();
		console.log(metadata_formatted)
		var video_meta = new Blob([JSON.stringify(metadata_formatted)], {type: 'application/json'});

		new_form.append('video', video_meta);
		new_form.append('mediaBody', file);
		console.log(file)
		console.log(video_meta)
		console.log(new_form)
		
		
		$.ajax({
			url: 'https://www.googleapis.com/upload/youtube/v3/videos?access_token='+ encodeURIComponent(auth) + '&part=snippet,status&key=AIzaSyBjqg6UbFyTH2gfunOzkGQj4CUriNY7C3A',
			data: new_form,
			cache: false,
			contentType: false,
			processData: false,
			method: 'POST'
		}).done(function(response){
				console.log("Caricamento ok: "+ response)
				alert('Video caricato con successo!')
				//uploadVideoSuccess(response, metadata)
				if(flag_elimina==1){
					deleteVideo(metadata.get('id'))
				}
			}
		).fail(function(response){
				var errors=response.responseJSON.error.errors[0];
				alert("Errore caricamento: "+ errors.message)
				console.log("Errore caricamento: "+ errors.message)
				console.log("Response: "+ response)
			}
		)

	}
	else{
		alert("Impossibile continuare senza consentire tutte le autorizzazioni richieste!")
	}
}
/*
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
}*/



function deleteVideo(id) {
	user = GoogleAuth.currentUser.get();
	if(user.hasGrantedScopes('https://www.googleapis.com/auth/youtube.force-ssl')){
		// GESTIONE ELIMINAZIONE VIDEO DA YOUTUBE SAPENDO L'ID DEL VIDEO
		var auth = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

		$.ajax({
			url: 'https://www.googleapis.com/youtube/v3/videos?id='+id+'&access_token='+ encodeURIComponent(auth)+'&key=AIzaSyBjqg6UbFyTH2gfunOzkGQj4CUriNY7C3A',
			method: 'DELETE'
			}).done(function(response){
					console.log("Cancellazione ok: "+ response)
					//alert('Video eliminato con successo!')
					//deleteVideoSuccess(id)
				}
			).fail(function(response){
					var errors=response.responseJSON.error.errors[0];
					//alert("Errore cancellazione: "+ errors.message)
					console.log("Errore cancellazione: "+ errors.message)
					console.log("Response: "+ response)
				}
			)
	}
	else{
		alert("Impossibile continuare senza consentire tutte le autorizzazioni richieste!")
	}
	
}
/*
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
}*/



function updateVideo(metadata) {

	user = GoogleAuth.currentUser.get();
	if(user.hasGrantedScopes('https://www.googleapis.com/auth/youtube.force-ssl')){
		
		description=metadata.get('geoloc')+":"+metadata.get('purpose')+":"+metadata.get('language')+":"+metadata.get('content')
		if(metadata.get('audience')!='')
			description+=":"+metadata.get('audience')
		if(metadata.get('detail')!='')
			description+=":"+metadata.get('detail')
		privacy="private"
		  if(metadata.get('published')==1)
			privacy="public"
		else{
			privacy="private"
			description+=":private"
		}

		metadata_formatted=
		{
			"id": metadata.get('id'),
			"snippet": {
				"categoryId": 22,
				"description": description,
				"title": metadata.get('title')
			},
			"status": {
				"privacyStatus": privacy
			}
		}
		

	// GESTIONE AGGIORNAMENTO VIDEO DA YOUTUBE SAPENDO L'ID DEL VIDEO
		var auth = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
		
		metadata_formatted_update=JSON.stringify(metadata_formatted)

		$.ajax({
			url: 'https://www.googleapis.com/youtube/v3/videos?access_token='+ encodeURIComponent(auth) + '&part=snippet,status&key=AIzaSyBjqg6UbFyTH2gfunOzkGQj4CUriNY7C3A',
			data: metadata_formatted_update,
			cache: false,
			contentType: "application/json",
			processData: false,
			method: 'PUT'
			}).done(function(response){
					console.log("Aggiornamento ok: "+ response)
					alert('Video modificato con successo!')
					//updateVideoSuccess(formData)
				}
			).fail(function(response){
					var errors=response.responseJSON.error.errors[0];
					alert("Errore aggiornamento: "+ errors.message)
					console.log("Errore aggiornamento: "+ errors.message)
					console.log("Response: "+ response)
				}
			)
	}
	else{
		alert("Impossibile continuare senza consentire tutte le autorizzazioni richieste!")
	}
}
/*
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
}*/


function publishVideo(id, title, description) {

	user = GoogleAuth.currentUser.get();

	if(user.hasGrantedScopes('https://www.googleapis.com/auth/youtube.force-ssl')){
	  metadata_formatted=
	  {
		"id": id,
		"snippet": {
		  "categoryId": 22,
		  "title": title,
		  "description": description		  
		},
		"status": {
			"privacyStatus": "public"
		}
	  }

	//console.log(metadata_formatted)



	// GESTIONE PUBBLICAZIONE VIDEO DA YOUTUBE SAPENDO L'ID DEL VIDEO
		var auth = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

		metadata_formatted_update=JSON.stringify(metadata_formatted)
		
		$.ajax({
			url: 'https://www.googleapis.com/youtube/v3/videos?access_token='+ encodeURIComponent(auth) + '&part=snippet,status&key=AIzaSyBjqg6UbFyTH2gfunOzkGQj4CUriNY7C3A',
			data: metadata_formatted_update,
			cache: false,
			contentType: "application/json",
			processData: false,
			method: 'PUT'
			}).done(function(response){
					console.log("Pubblica ok: "+ response)
					alert('Video pubblicato con successo!')
					//publishVideoSuccess(id)
				}
			).fail(function(response){
					var errors=response.responseJSON.error.errors[0];
					alert("Errore pubblica: "+ errors.message)
					console.log(errors)
					console.log(errors.message)
					console.log(response)
				})
			
	}
	else{
		alert("Impossibile continuare senza consentire tutte le autorizzazioni richieste!")
	}
}
/*
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
}*/







// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;

function addVideo(div_id, id) {
  player = new YT.Player(div_id, {
  height: '0',
  width: '0',
  playerVars: { autoplay: 1},
  videoId: id,
});
}


function stopVideo(playerN) {
	playerN.stopVideo();
}

function play(playerN) {
	playerN.playVideo();
}

function pause(playerN) {
	playerN.pauseVideo();
}