//http://www.fromtexttospeech.com/

jQuery(function ($) {
	
	$('#close_menu').click(
      function(){
        $('#wrapper').addClass('toggled')
        $('#page-content-wrapper, .leaflet-control, .leaflet-marker-icon.leaflet-interactive').css('pointer-events','auto')
        $('#page-content-wrapper').fadeTo(250, 1)
		printLocation()
      }
    )
	
	$('#languageMenu').click(
      function(){
		printLocation()
      }
    )

	var array = new Array();
	$("#content").change(function() {
		$(this).find("option:selected")
		if ($(this).find("option:selected").length > 3) {
			$(this).find("option").removeAttr("selected");
			$(this).val(array);
			alert("Puoi selezionare al massimo 3 campi!")
		}
		else {
			array = new Array();
			$(this).find("option:selected").each(function(index, item) {
				array.push($(item).val());
			});
		}
	});


    $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
	  $('#page-content-wrapper, .leaflet-control, .leaflet-marker-icon.leaflet-interactive').css('pointer-events','none')
        $('#page-content-wrapper').fadeTo(250, 0.6)
    });


	function toggleSignUp(e){
		e.preventDefault();
		$('#container-forms .form-signin').toggle(); // display:block or none
		$('#container-forms .form-signup').toggle(); // display:block or none
	}

	$(()=>{
		// Login Register Form
		$('#container-forms #btn-signup').click(toggleSignUp);
		$('#container-forms #cancel_signup').click(toggleSignUp);
	})

    var audioBlob = new Blob()

    $('#save_clip').prop('disabled', true)

    $('#create_clip').hide()

    $('#notPublishedList').hide()

		$('#stop_record_clip_button').hide()

		$("#notPublishedList").click(notPublishedList)

		$("#published_checkbox").click(
			function(){
				if($("#save_clip").attr('value')=="Salva la clip"){
					$("#save_clip").attr('value', "Salva e pubblica la clip")
				}
				else{
					$("#save_clip").attr('value', "Salva la clip")
				}
			}
		)

		$("#published_label").click(
			function(){
				if($("#save_clip").attr('value')=="Salva la clip"){
					$("#published_checkbox").prop("checked", true)
					$("#save_clip").attr('value', "Salva e pubblica la clip")
				}
				else{
					$("#published_checkbox").prop("checked", false)
					$("#save_clip").attr('value', "Salva la clip")
				}
			}
		)

		$("#purpose_what").click(
			function(){
				$("#purpose input[value='what']").prop("checked", true)
			}
		)

		$("#purpose_how").click(
			function(){
				$("#purpose input[value='how']").prop("checked", true)
			}
		)

		$("#purpose_why").click(
			function(){
				$("#purpose input[value='why']").prop("checked", true)
			}
		)

		$("#record_clip_button").click(
			function(){

				navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(
					stream => {
						var mediaRecorder = new MediaRecorder(stream)
						mediaRecorder.start()


						$('#record_clip_button').hide()
						$('#stop_record_clip_button').show()
						$("#audio_record_div").html("<img id='recording' class='img_btn' alt='RECORDING' title='RECORDING' src='asset/img/mic.gif'>\t\tRecording...")
            $('#save_clip').prop('disabled', true)

						$('#stop_record_clip_button').click(
							function(){
                $("#stop_record_clip_button").prop("onclick", null).off("click")
								mediaRecorder.stop()
							}
						)

						var audioChunks = []
						mediaRecorder.addEventListener("dataavailable", event => {
								audioChunks.push(event.data)
							}
						)

						mediaRecorder.addEventListener("stop", () => {
							audioBlob = new Blob(audioChunks,{type:'video/mp4'})
							const audioUrl = URL.createObjectURL(audioBlob)
							console.log(audioUrl)

              audioBlob.lastModifiedDate = new Date();

                $('#stop_record_clip_button').hide()
  							$('#record_clip_button').show()
  							$('#record_clip_button').text('Cancella e registra')
  							$("#record_clip_button").attr('new-clip', 1)
  							$("#audio_record_div").html("<audio id='audio_record' src='"+audioUrl+"' controls>Your browser does not support the audio element.</audio>")
                $('#save_clip').prop('disabled', false)


						})


					}
				)

			}

		)

		$("#content option[value!='none']").click(
			function(){
				var selection=$(this).text()
				var selection_value=$(this).attr('value')
				if($("#contentOption").text().indexOf(selection)==-1){
					if($("#contentOption div").first().attr('value')=='oth')
						$("#contentOption div").first().remove()
					if($("#contentOption div").length>=3)
						$("#contentOption div").first().remove()
					$("#contentOption").append("<div value='"+selection_value+"' class='alert alert-info _alert'><a href='#' class='close _close' data-dismiss='alert' aria-label='close'>&times;</a>"+selection+"</div>")
				}
			}
		)

		$("#content option[value='none']").click(
			function(){
				$("#contentOption").html("")
			}
		)

		$("#content option[value='oth']").click(
			function(){
				$("#contentOption").html("<div value='oth' class='alert alert-info _alert'><a href='#' class='close _close' data-dismiss='alert' aria-label='close'>&times;</a>Altro</div>")
			}
		)

		var elimina=0
		//submit del form di cariamento clip
		$("#myForm").submit(
      // Se il json contiene:
      // 		-Metadati + Id + File: Elimino precedente clip(Id) + Carico nuova clip(File + Metadati)
      //		-Metadati + Id (NO File): Aggiorno Metadati a precedente clip (Id + Metadati)
      //		-Metadati + File (NO Id): Carico nuova clip (File + Metadati)



			function (event){
				event.preventDefault()

				//raccoglie tutti i dati del form
				//controlla che ci sia l'audio

				//creazione json da inviare al server
				var formData = new FormData(myForm)	// La forma di .append e' ( chiave, valore )
				formData.set('geoloc','wai:'+formData.get('geoloc'))

				//i metadativanno inviati in ogni caso
				function isMobileDevice() {
					return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
				};

				if(isMobileDevice()){
					formData.set('content', $('#content').val())
				}
				else{
					var arrayContent=[]
					var i=1
					$("._alert").each(
						function(){
							arrayContent.push($(this).attr('value'))
							i++
						}
					)
					if(i==1) arrayContent.push('none')
					formData.set('content', '['+arrayContent+']')
				}
				
				

				if(formData.get('published')=="published"){
					formData.set('published', '1')
				}
				else
					formData.append('published', '0')

				if($("#record_clip_button").attr('new-clip')==1){
					
					audioBlob.name = 'file.mp4';
					//console.log(audioBlob)
					
					if($("#record_clip_button").attr('data-id')){
						// Metadati + Id + File: Carico nuova clip(File + Metadati) + Elimino precedente clip(Id)
						formData.append('id', $("#record_clip_button").attr('data-id'))
						elimina=1
					}

					// Metadati + File (NO Id): Carico nuova clip (File + Metadati)
					uploadVideo(audioBlob, formData, elimina)

				}
				else{
					// Metadati + Id (NO File): Aggiorno Metadati a precedente clip (Id + Metadati)
					formData.append('id', $("#record_clip_button").attr('data-id'))
					updateVideo(formData)
				}
				
		  audioBlob = new Blob()
		  $("#modalNewClip").modal('hide')

		  }
		)



/*
//submit del form di Login editor
$('#signin').submit(function (event) {
	event.preventDefault()

	//raccoglie tutti i dati del form
	//creazione json da inviare al server
	//ricevo un email.json
	var email = $('#inputEmail').val();
	var password = $('#inputPassword').val();
	// var formData = new FormData(signin);

	$.ajax({
		//url: "email.json", //inserire link del server (Funzione: sign_in)
		url: 'users/login',
		dataType: 'json',
		type: 'POST',
		data: {
			email: email,
			password: password
		},
		processData: false,	// Evita che Jquery faccia operazioni sui dati.
		contentType: false	// Evita che Jquery faccia operazioni sui dati.
	}).done(function(data){
		if(data.success){
			alert('Login eseguito con successo!');
			$('#container-forms').html('');
			$('#container-forms').css('margin', '0');
			$('#formLanguage').append(`<br><br><br><h5 id="now_editor" email = '${email}' class="text-white"><b>'${email}'<br>You are now an EDITOR!</b></h5><br>`);
			$('#create_clip').show();
			$('#notPublishedList').show();
			$("#creator").attr('value', $('#now_editor').attr('email'));
		} else {
			alert(data.message);
		}
	}).fail(function(jqXhr, status, error){
		// Gestione dell'errore AJAX.
	});
});

//submit del form di Sign up editor
$('#signup').submit(function (event){
	event.preventDefault()

	//raccoglie tutti i dati del form
	//creazione json da inviare al server
//ricevo un email.json
	var email = $('#user-email').val();
	var password = $('#user-pass').val();
	var r_password = $('#user-repeatpass').val();
	if(password==r_password){
		$.ajax({
			//url: "email.json", //inserire link del server (Funzione: sign_up)
			url: 'users',
			dataType: 'json',
			type: 'PUT',
			data: {
				email: email,
				password: password
			},
			processData: false,	// Evita che Jquery faccia operazioni sui dati.
			contentType: false	// Evita che Jquery faccia operazioni sui dati.
		}).done(function(data) {
			if(data.success){
				alert('Registrazione avvenuta con successo!')
				$('#container-forms').html('')
				$('#container-forms').css('margin', '0')
				$('#formLanguage').append('<br><br><br><h5 class="text-white"><b>You are now an EDITOR!</b></h5><br>')
				$('#create_clip').show()
				$('#notPublishedList').show()
				$("#creator").attr('value', $('#now_editor').attr('email'))
			} else{
				alert(data.message);
			}
		}).fail(function(jqXhr, status, error){
			console.log(error)
			// Gestione dell'errore AJAX.
		});
	}
	else
		alert('Password non corrispondenti!')

});*/

		$("#create_clip").click(
			function(){
				cleanForm()
			$("#geoloc").attr('value',  getMarkerYourPosition());
				}
		)

		$("#buttonWhereAmI").click(
			function(){
				printLocation(printWhereAmI)
			}
		)
		
		$("#locationList").click(
			function(){
				printLocation(locationList)
			}
		)

		$('#modalWhereAmI').on('hidden.bs.modal', function () {
			//printLocation()
			$('#_modal-body-whereAmI').html('')
		})

    $('#modalNewClip').on('hidden.bs.modal', function () {
			cleanForm()
		})





});


var map,mpos, markers=[];

function init(){

    if (map != undefined) { map.remove(); }

    map = L.map('map');
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 8,
        maxZoom: 19
    }).addTo(map);




	 map.locate({
        setView: true,
        minZoom: 16,
        maxZoom: 16
    }).on("locationfound", e => {
            map.addLayer(createPositionMarker(e.latlng));
            //printLocation()



    }).on("locationerror", error => {
            console.log("Errore");
    });



    var gps = new L.Control.Gps({autoCenter:true,maxZoom: 16}).addTo(map);
    var searchControl = new L.esri.Controls.Geosearch().addTo(map);
    var results = new L.LayerGroup().addTo(map);



    searchControl.on('results', function(data){

        clearMarker(1);
        var m;
        for (var i = data.results.length - 1; i >= 0; i--) {
            m =createPositionMarker(data.results[i].latlng);
            results.addLayer(m);
        }
        printLocation()
    });

    clip_visited_before=[]

	//printLocation()

}


/* Markers functions */

function printMarker(olc, title, color){
  var mark = L.marker(OLC_Coords(olc),{icon:iconPoint(color),autoPan:true});
  mark._id = olc;
  markers.push(mark);
  map.addLayer(mark);
  $(mark).click(
    function(){
      highlight(olc, title)
    }
  )

}

function markerPos(marker){

        marker.on('dragend', function(event){
            markers.forEach(function(marker) {
            if (marker._id != 1){
                clearMarker(marker._id);
                console.log(markers);
            }
        });
            printLocation();

        });

}

function createPositionMarker(coords){
    markers.forEach(function(marker) {
        if (marker._id == 1){
            clearMarker(1);

        }
    });

    var mark = L.marker(coords,{draggable:'true',autoPan:true});
    mark._id = 1;
    markers.push(mark);
    markerPos(mark);
    return mark;
}

function clearMarker(id) {

    var new_markers = [];
    markers.forEach(function(marker) {
        if (marker._id == id) map.removeLayer(marker);
        else new_markers.push(marker);
    });
  markers = new_markers;
}

function setDragMarker(marker){
    marker.on('dragend', function(event){
    var marker = event.target;
    var position = marker.getLatLng();
    marker.setLatLng(new L.LatLng(position.lat, position.lng),{draggable:'true'});
    map.panTo(new L.LatLng(position.lat, position.lng))
  });
  map.addLayer(marker);
}

function iconPoint(color){
    return L.icon({iconUrl: color});
}

function highlight(olc, title){

    markers.forEach(function(marker) {

        if(marker._id == olc) {

            var popup = L.popup().setContent(title);
            marker.bindPopup(popup).openPopup();
            var olc_coord=OLC_Coords(olc)
            olc_coord.lat=parseFloat((olc_coord.lat-0.001).toFixed(9))
            map.setView(olc_coord,16);
            //setCenterView(olc_coord)
            marker.unbindPopup();
        }
    });
}



function getOfflinePosition(){
    var center
     markers.forEach(function(marker) {
        if (marker._id == 1){
            center = marker.getLatLng();
            }
    });
    setCenterView(center);
    printLocation();
}

function positionMarker(marker){
    return Coords_OLC(marker.getLatLng().lat, marker.getLatLng().lng);
}

function getMarkerYourPosition(){
    var pos;
    markers.forEach(function(marker) {
        if (marker._id==1){
            pos= positionMarker(marker);}
    });
    return pos;
}

/* Utilities Functions */

function Coords_OLC(lat,lon){
    return OpenLocationCode.encode(lat, lon);
}

function OLC_Coords(olc){
    return {lat: OpenLocationCode.decode(olc).latitudeCenter , lng: OpenLocationCode.decode(olc).longitudeCenter };
}

function getDistance(origin, destination) {
    // return distance in meters

    var lon1 = toRadian(OLC_Coords(origin).lng),
        lat1 = toRadian(OLC_Coords(origin).lat),
        lon2 = toRadian(OLC_Coords(destination).lng),
        lat2 = toRadian(OLC_Coords(destination).lat);

    var deltaLat = lat2 - lat1;
    var deltaLon = lon2 - lon1;



    var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var EARTH_RADIUS = 6371;
    return c * EARTH_RADIUS * 1000;
}
function toRadian(degree) {
    return degree*Math.PI/180; // rad= deg * pi /180 ---> deg = rad * 180 /pi
}

function toDeg(rad){
    return rad * 180 / Math.PI;
}

function midPoint(origin,destination){

    var lon1 = toRadian(OLC_Coords(origin).lng),
        lat1 = toRadian(OLC_Coords(origin).lat),
        lon2 = toRadian(OLC_Coords(destination).lng),
        lat2 = toRadian(OLC_Coords(destination).lat);

    var dLon = lon2 - lon1;

    var x = Math.cos(lat2) * Math.cos(dLon);
    var y = Math.cos(lat2) * Math.sin(dLon);

    var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1)+x)*(Math.cos(lat1)+x)) + y*y);
    var lon3 = lon1 + Math.atan2(y, Math.cos(lat1)+x);

    return {lat: toDeg(lat3) , lng: toDeg(lon3)};

}

function setCenterView(coords){
    map.panTo( new L.LatLng(coords.lat,coords.lng));
}


/* Buttons and Ajax Calls Functions*/







var dict={"ita": "Italiano", "eng": "English", "deu": "Deutsch", "fra": "Français", "esp": "Español", "what": "What", "how": "How", "why": "Why", "gen": "Pubblico Generico", "pre": "Pre-Scuola", "elm": "Scuola Primaria", "mid": "Scuola Media", "scl": "Specialisti del Settore", "none": "Nessuno...", "nat": "Natura", "art": "Arte", "his": "Storia", "flk": "Folklore", "mod": "Cultura Moderna", "rel": "Religione", "cui": "Cucina e Drink", "spo": "Sport", "mus": "Musica", "mov": "Film", "fas": "Moda", "shp": "Shopping", "tec": "Tecnologia", "pop": "Cultura Pop e Gossip", "prs": "Esperienze Personali", "oth": "Altro"}

var clip_list_global;
var clip_near_list_global, clip_far_list_global, clip_visited_before



/**
 * Raggio minimo delle clip visualizzabili (in metri).
 * @const {int}
 * @author Simone Grillini <grillini.simo@gmail.com>
 */
var MIN_CLIP_RANGE = 50;



/**
 * Funzione che confronta la distanza di due oggetti.
 * @param a {Object}. Il primo oggetto con campo 'distance' da confrontare
 * @param b {Object}. Il secondo oggetto con campo 'distance' da confrontare
 * @return {int}
 * @author Simone Grillini <grillini.simo@gmail.com>
 */
function compareDistances(a,b) {
	return a.distance < b.distance ? -1: (a.distance > b.distance ? 1 : 0);
}



/**
 * Funzione che restituisce una lista delle clip filtrate per lingua.
 * @param language {string}. La lingua da filtrare..
 * @param clips {Array}. La lista di tutte le clip dell'utente.
 * @return {Array}
 * @author Simone Grillini <grillini.simo@gmail.com>
 */
function filterClipsByLanguage(language, clips) {
	/*
	 * La lista delle clip con la lingua richiesta.
	 */
	var filteredClips = [];

	/*
	 * Scansiono tutte le clip in input.
	 */
	clips.forEach(function(clip) {
		//console.log(clip.language+language)
		if (clip.language == language) {
			filteredClips.push(clip);
			//console.log(filteredClips)
		}
	});

	return filteredClips;
}



/**
 * Funzione che restituisce una lista delle clip entro una distanza.
 * @param referenceLocation {string}. La coordinata di riferimento nel
 * formato OLC.
 * @param clips {Array}. La lista di tutte le clip dell'utente.
 * @return {Array}
 * @author Simone Grillini <grillini.simo@gmail.com>
 */
function getRangeClips(referenceLocation, rangeDistance, clips) {
	/*
	 * La lista delle clip entro la massima distanza visualizzabile.
	 */
	var filteredClips = [];

	/*
	 * Scansiono tutte le clip in input.
	 */
	 //console.log(clips)
	 clips.forEach(function(clip) {
		
		/*
		 * Memorizzo le coordinate della clip e calcolo la distanza.
		 */
		var clipLocation = clip.geoloc;
		clip.distance = getDistance(referenceLocation, clipLocation);
		console.log(referenceLocation)
		console.log(clipLocation)
		console.log(clip.distance)

		if (clip.distance <= rangeDistance) {
			
			/*
			 * La clip e' nel raggio desiderato e quindi la memorizzo
			 * nell'output..
			 */
			filteredClips.push(clip);
		}
	});

	/*
	 * Ordino le clip per distanza.
	 */
	filteredClips.sort(compareDistances);

	return filteredClips;
}



/**
 * Funzione che restituisce la differenza tra array.
 * @param array {Array}. L'array da sottrarre.
 * @return {Array}.
 * @author Simone Grillini <grillini.simo@gmail.com>
 */
Array.prototype.diff = function(array) {
	/*
	 * Se l'array in input e' un valore 'falsy', ritorno la copia di questo
	 * array.
	 */
    if (!array || !Array.prototype.isPrototypeOf(array)) {
        return this.slice(0);
    }
	return this.filter(x => !array.includes(x));
}



function printLocation(callback) {
	var actualUserLocation = getMarkerYourPosition();
	var olc = actualUserLocation.slice(0,8);
	
	gapi.client.setApiKey("AIzaSyBjqg6UbFyTH2gfunOzkGQj4CUriNY7C3A");
	gapi.client.youtube.search.list({
      "part": "snippet",
      "maxResults": 30,
	  "type": "video",
      "q": 'wai:'+olc
    }).then(
		function(response) {
			console.log("Response", response);
			console.log(olc);
			
			// Handle the results here (response.result has the parsed body).
			var clips={"content":[]}
			var clip={}
			//console.log(olc)
			//console.log(response.result.items)
			
			response.result.items.forEach(function(item){
				if(item.snippet.description.slice(4,12)==olc){
					var app=item.snippet.description.substring(0, item.snippet.description.length - 1);
					array_meta=app.split(":")
					clip=
						{
							"link": "https://www.youtube.com/watch?v="+item.id.videoId,
							"id": item.id.videoId,
							"title": item.snippet.title,
							"geoloc": array_meta[1],
							"language": array_meta[3],
							"purpose": array_meta[2],
							"content": array_meta[4],
							"distance": ""
						}
						//console.log(array_meta)
						
					clip.audience= ''
					clip.detail = ''
					if (array_meta.length>5)
						if (array_meta[5].length==3){
							clip.audience= array_meta[5]
							if (array_meta.length>6)
								clip.detail = array_meta[6]
						}
						else
							clip.detail = array_meta[5]
					//console.log(clip)
				}
				clips.content.push(clip)
			})
			
			console.log('1')
			console.log(clips.content)
			
			var language = $('#languageMenu option:selected').val();
			clips.content = filterClipsByLanguage(language, clips.content);
			
			console.log('2')
			console.log(clips.content)
			
			clip_near_list_global = getRangeClips(actualUserLocation, MIN_CLIP_RANGE, clips.content);
			console.log('3')
			console.log(clip_near_list_global)
			clip_far_list_global = clips.content.diff(clip_near_list_global);

			console.log('near')
			console.log(clip_near_list_global)
			console.log('far')
			console.log(clip_far_list_global)
			
			
			markers.forEach(function(marker) {
				if (marker._id != 1){
					clearMarker(marker._id);
				}
			})
			for(var i=0; i<(clip_near_list_global.length); i++){
				printMarker(clip_near_list_global[i].geoloc, clip_near_list_global[i].title, 'asset/img/marker-point-near.png')
			}

			for(var i=0; i<(clip_far_list_global.length); i++){
				printMarker(clip_far_list_global[i].geoloc, clip_far_list_global[i].title, 'asset/img/marker-point.png')
			}
			if (callback) callback();

			
			
		},

		function(err) { 
			alert('Errore di comunicazione con Youtube!\nSuperato limite massimo di richieste!')
			console.error("Execute error", err); }
	);
	
	
	
	
	
	
  //richiesta al server della lista delle clip dell'utente
  //ricevo un clip_list.json
  /*$.ajax(
    {
      //url: "clip_list.json",
      url: 'all_clips',
      dataType: "json",
      success: function(data){
        if(data.success){

			/*
			 * Filtro subito le clip in base alla lingua.
			 *//*
			var language = $('#language option:selected').val();
			var clips = filterClipsByLanguage(language, data.content);

          /*!!!!!!!!!!!!!!!!!!!!!!!
          CHIAMARE SU data.content FUNZIONE CHE SELEZIONA LE CLIP ENTRO 100 METRI E ORDINA LE CLIP IN BASE ALLA DISTANZA
          IN clip_near_list_global METTO L CLIP FINO A 50 METRI, IN clip_far_list_global LE ALTRE
          //la prima clip della lista è il luogo di interesse
          !!!!!!!!!!!!!!!!!!!!!!!*/


			/* TEST *//*
			var actualUserLocation = getMarkerYourPosition();

      //console.log(actualUserLocation)
			clip_near_list_global = getRangeClips(actualUserLocation, MIN_CLIP_RANGE, clips);
            clip_far_list_global = getRangeClips(actualUserLocation, MAX_CLIP_RANGE, clips).diff(clip_near_list_global);
			/*****//*

          //alert(JSON.stringify(data))
          // clip_near_list_global=data.content
          // clip_far_list_global=data.content
          //alert(clip_list_json_global.clip_near.length)


          markers.forEach(function(marker) {
            if (marker._id != 1){
                clearMarker(marker._id);
            }
          })
          for(var i=0; i<(clip_near_list_global.length); i++){
            printMarker(clip_near_list_global[i].geoloc, clip_near_list_global[i].title, 'asset/img/marker-point-near.png')
          }

          for(var i=0; i<(clip_far_list_global.length); i++){
            printMarker(clip_far_list_global[i].geoloc, clip_far_list_global[i].title, 'asset/img/marker-point.png')
          }
          if (callback) callback();
        }
        else{
          alert(data.message)
        }
      }
    }
  )*/
}

function printWhereAmI(){
	//stampa della lista di clip (la prima è il luogo di interesse) e i bottoni di whereAmI

	var html=''
	var array_content
	
	if((clip_near_list_global).length==0){
			html="<div class='_empty_json'><h5>Nessun luogo nelle vicinanze</h5></div><div style='display: none;'>"
		if((clip_far_list_global).length!=0)
		  html+="<audio autoplay src='asset/audio/Per_ascoltare_una.mp3' controls>Your browser does not support the audio element.</audio><div style='display: none;'>"
		else
		  html+="<audio autoplay src='asset/audio/Non_sono_presenti.mp3' controls>Your browser does not support the audio element.</audio><div style='display: none;'>"
			$('#_modal-body-whereAmI').html(html)
	}
	else{
		console.log(clip_near_list_global[0])
		html+=	"<h5 class='_modalOverflow m-0'><b>"+clip_near_list_global[0].title+"</b></h5><div class='left _modalOverflow m-2'><b>Lingua:</b> "+dict[clip_near_list_global[0].language]+
				"<br><b>Scopo:</b> "+dict[clip_near_list_global[0].purpose]+"<br><b>Pubblico:</b> "
		if(clip_near_list_global[0].audience!='') html+=dict[clip_near_list_global[0].audience]
		html+="<br><b>Dettaglio:</b> "+clip_near_list_global[0].detail+"<br><b>Contenuto:</b> "

		clip_near_list_global[0].content=clip_near_list_global[0].content.replace("[","")
		clip_near_list_global[0].content=clip_near_list_global[0].content.replace("]","")
		array_content=clip_near_list_global[0].content.split(',')
		for(var j=0; j<(array_content).length; j++){
			//alert(array_content[j])
			html+=dict[array_content[j]]
			if(j+1!=(array_content).length)
				html+=", "
		}

		html+="<br></div><div id='_modal-body-whereAmI_player'></div>"

		
		
		html+="<div class='_flex_center'>"+
				"<button class='_arrow btn btn_round bg-tranparent'><img id='stop' class='img_btn _poiter' alt='Stop' title='Stop' src='asset/img/041-stop.png'></button>"+
				"<button class='_arrow btn btn_round bg-tranparent'><img id='play' class='img_btn' alt='Play' title='Play' src='asset/img/022-play.png'></button>"+
				"<button class='_arrow btn btn_round bg-tranparent'><img id='pause' class='img_btn _poiter' alt='Pause' title='Pause' src='asset/img/020-pause.png'></button>"+
				"</div>"

		html+="<div class='_flex_center'>"+
					"<button class='_arrow btn btn_round bg-tranparent'><img id='previous' class='img_btn img_disable' alt='PREVIOUS location' title='PREVIOUS location' src='asset/img/014-left_arrow.png'></button>"+
					"<button class='_arrow btn btn_round bg-tranparent'><img id='more' class='img_btn _poiter' alt='MORE about this place' title='MORE about this place' src='asset/img/009-next.png'></button>"+
					"<button class='_arrow btn btn_round bg-tranparent'><img id='next' class='img_btn _poiter' alt='NEXT location' title='NEXT location' src='asset/img/031-right_arrow.png'></button>"+
					"</div>"


		$('#_modal-body-whereAmI').html(html)
		addVideo('_modal-body-whereAmI_player', clip_near_list_global[0].id)
		
		$("#stop").click(
			function(){
				stopVideo(player)
			}
		)
		$("#play").click(
			function(){
				play(player)
			}
		)
		$("#pause").click(
			function(){
				pause(player)
			}
		)

		if(clip_near_list_global.length==0)
			$('#more').addClass('img_disable')
		else{
			$('#more').removeClass('img_disable')
			$('#more').click(
				function(){
					clip_visited_before.push(clip_near_list_global[0])
					clip_near_list_global.shift()
					printWhereAmI()
				}
			)
		}

		if(clip_far_list_global[0]==undefined)
			$('#next').addClass('img_disable')
		  else{
			$('#next').removeClass('img_disable')
			$('#next').click(
					function(){
						clip_visited_before.push(clip_near_list_global[0])
						audio_add="<div style='display: none;'><audio src='asset/audio/Raggiungi_il_punto.mp3' autoplay></audio></div>"
						$("#modalWhereAmI").modal('hide')
						$('body').append(audio_add)
						highlight(clip_far_list_global[0].geoloc, clip_far_list_global[0].title)
					}
				)
		  }

      if(clip_visited_before.length==0)
  			$('#previous').addClass('img_disable')
        else{
          $('#previous').removeClass('img_disable')
          $('#previous').click(
      			function(){
					printLocation(previousClip)
      			}
      		)
        }


		//alert(clip_near_list_global[0].geoloc)
		highlight(clip_near_list_global[0].geoloc, clip_near_list_global[0].title)
	}

}

function previousClip(){
	console.log('clip_visited_before')
	console.log(clip_visited_before)
	var clipBefore=clip_visited_before.pop()
	console.log('clipBefore')
	console.log(clipBefore)
	console.log('clip_visited_before')
	console.log(clip_visited_before)
	console.log('clip_near_list_global')
	console.log(clip_near_list_global)
	
	
	
	var indexOfClip=clip_near_list_global.map(function(e) { return e.id; }).indexOf(clipBefore.id);
	console.log(indexOfClip)
	if (indexOfClip!=-1){
		clip_near_list_global.splice(indexOfClip,1)
		clip_near_list_global.unshift(clipBefore)
		printWhereAmI()
	}
	else{
		audio_add="<div style='display: none;'><audio src='asset/audio/Raggiungi_il_punto.mp3' autoplay></audio></div>"
		$("#modalWhereAmI").modal('hide')
		$('body').append(audio_add)
		highlight(clipBefore.geoloc, clipBefore.title)
	}
}

function locationList(){
  
	var html=''
	if(clip_far_list_global.length==0 && clip_near_list_global.length==0){
		html="<div class='_empty_json'><h5>Nessun luogo da visitare nei dintorni</h5></div>"
	}
	else{
    //aggiungo (nel DOM) la location alla lista. on click chiamo la funzione che mi evidenzia il luogo sulla mappa, passandogli la geoloc
    html+="<h5 class='text-center'><b>Nelle vicinanze</b></h5>"
    for(var i=0; i<clip_near_list_global.length; i++){
			html+="<div class='_modalList _pointer' data-location='" + clip_near_list_global[i].geoloc + "'><h5 class='_modalh5'>"+clip_near_list_global[i].title+"</h5></div>";
		}
    html+="<br><h5 class='text-center'><b>Nei dintorni</b></h5>"
    for(var i=0; i<clip_far_list_global.length; i++){
			html+="<div class='_modalList _pointer' data-location='" + clip_far_list_global[i].geoloc + "'><h5 class='_modalh5'>"+clip_far_list_global[i].title+"</h5></div>";
		}
  }
	$("#_modal-body-location-list").html(html)
	$("._modalList").click(
		function(){
			var location=$(this).attr('data-location'); //nella var location ho il metadato geoloc, col quale posso andare a cercare il lugoo da evidenziare sulla mappa
      var name=$(this).text();
      //alert(location)
      $("#modalLocationList").modal('hide')
			highlight(location, name)
		}
	)
}

function notPublishedList(){
  //richiesta della lista delle clip salvate ma non pubblicate (quindi salvate su youtube con il metadato published=0)
	
	gapi.auth2.getAuthInstance()//.currentUser.get().getAuthResponse().access_token;
	gapi.client.setApiKey("AIzaSyBjqg6UbFyTH2gfunOzkGQj4CUriNY7C3A");
	gapi.client.youtube.search.list({
      "part": "snippet",
	  "type": "video",
	  "maxResults": 50,
	  "forMine": true,
	  "privacyStatus": "private",
	  
    }).then(
		function(response){
			
			
			var html = "";
			var i=0;
		console.log(response)
			//lista di clip con nome, metadati, traccia	
			$("#_modal-body-clip-not-published").html("")
			response.result.items.forEach(function(item){
				var app=item.snippet.description//.substring(0, item.snippet.description.length - 1);
				array_meta=app.split(":")
				if(array_meta[array_meta.length-1]=='private'){
					array_meta.pop()
					clip=
						{
							"link": "https://www.youtube.com/watch?v="+item.id.videoId,
							"id": item.id.videoId,
							"title": item.snippet.title,
							"geoloc": array_meta[1],
							"language": array_meta[3],
							"purpose": array_meta[2],
							"content": array_meta[4],
							"distance": ""
						}
						//console.log(array_meta)
						
					clip.audience= ''
					clip.detail = ''
					if (array_meta.length>5)
						if (array_meta[5].length==3){
							clip.audience= array_meta[5]
							if (array_meta.length>6)
								clip.detail = array_meta[6]
						}
						else
							clip.detail = array_meta[5]
					//console.log(clip)

        			//aggiungo (nel DOM) le clip

        			html = "<div class='_modalList' id='_modalList"+i+"'><h5 class='_modalOverflow'><b>Titolo:</b> " + clip.title + "</h5>";
					
				//DA CONTROLLARE
					html += "<div class='privateVideo' id='privateVideo"+i+"'></div>"
					
					html+="<div class='_flex_center'>"+
						"<button class='_arrow btn btn_round bg-tranparent'><img id='stop"+i+"' class='img_btn _poiter' alt='Stop' title='Stop' src='asset/img/041-stop.png'></button>"+
						"<button class='_arrow btn btn_round bg-tranparent'><img id='play"+i+"' class='img_btn' alt='Play' title='Play' src='asset/img/022-play.png'></button>"+
						"<button class='_arrow btn btn_round bg-tranparent'><img id='pause"+i+"' class='img_btn _poiter' alt='Pause' title='Pause' src='asset/img/020-pause.png'></button>"+
						"</div></div>"
					$("#_modal-body-clip-not-published").append(html)
					
					var thisPlayer = new YT.Player('privateVideo'+i, {
						height: '0',
						width: '0',
						playerVars: { autoplay: 0},
						videoId: clip.id,
					})
					$("#stop"+i).click(
						function(){
							stopVideo(thisPlayer)
						}
					)
					$("#play"+i).click(
						function(){
							play(thisPlayer)
						}
					)
					$("#pause"+i).click(
						function(){
							pause(thisPlayer)
						}
					)

					html = "<div class='left _modalOverflow'><b>Geolocalizzazione:</b> " + clip.geoloc +
								"<br><b>Lingua:</b> " + dict[clip.language] + "<br><b>Scopo:</b> " + dict[clip.purpose] + "<br><b>Pubblico:</b> " + dict[clip.audience] +
								"<br><b>Dettaglio:</b> " + clip.detail + "<br><b>Contenuto:</b> ";


					clip.content=clip.content.replace("[","")
					clip.content=clip.content.replace("]","")
					array_app=clip.content.split(',')
        			 for (var j = 0; j < (array_app).length; j++){
        			 	html+=dict[array_app[j]]
        			 	if(j+1!=(array_app).length)
        			 		html+=", "
        			 }

        			html +=	"<br></div><div class='_flex_wrap_space'>" +
        					"<button data-description='"+item.snippet.description.substring(0, item.snippet.description.length - 8)+"' data-id='" + clip.id + "' data-title='"+clip.title + "' data-audio='" + clip.link + "' data-geoloc='" + clip.geoloc+"' data-language='" + clip.language+"' data-purpose='" + clip.purpose + "' data-audience='" + clip.audience+"' data-detail='"+clip.detail + "' data-content='" + clip.content+"' class='modify_clip btn btn-primary _btn_mod'>Modifica la clip</button>" +
        					"<button data-description='"+item.snippet.description.substring(0, item.snippet.description.length - 8)+"' data-id='" + clip.id + "' data-title='"+clip.title + "' class='publish_clip btn btn-primary _btn_mod'>Pubblica la clip</button></div>";
					
					$("#_modalList"+i).append(html)
					i++
				}
        	})
			
			$('#_modal-body-clip-not-published').attr('num-clip', i)
			
			if(html=='') $("#_modal-body-clip-not-published").html("<div class='_empty_json'><h5>Non hai nessuna clip salvata e non pubblicata</h5></div>")

        	$(".publish_clip").click(
        		function(){ //rende pubblica la clip
					var i=$('#_modal-body-clip-not-published').attr('num-clip')
				//DA CONTROLLARE
					publishVideo($(this).attr('data-id'), $(this).attr('data-title'), $(this).attr('data-description'))

					for(j=0; j<i; j++) stopVideo(YT.get('privateVideo'+j));
					$("#modalClipNotPublished").modal('hide')
        		}
        	)

        	$(".modify_clip").click(
        		function(){
        			cleanForm()
					
					var i=$('#_modal-body-clip-not-published').attr('num-clip')
				//DA CONTROLLARE
					//var sounds = $('.privateVideo');
					//console.log(i)
					for(j=0; j<i; j++){
						stopVideo(YT.get('privateVideo'+j));
						/*console.log('privateVideo'+j)
						console.log(YT.get('privateVideo'+j))*/
					}						
					$("#modalClipNotPublished").modal('hide')

        			$("#title").attr('value', ($(this).attr('data-title')))
        			$("#geoloc").attr('value', ($(this).attr('data-geoloc')))
        			if($(this).attr('data-language')!='')
        				$("#language option[value="+$(this).attr('data-language')+"]").attr('selected', 'selected')
        			else
        				$("#language option[value='ita'").attr('selected', 'selected')
        			if($(this).attr('data-purpose')!='')
        				$("#purpose input[value="+$(this).attr('data-purpose')+"]").prop('checked', true)
        			else
        				$("#purpose input[value='what']").prop('checked', true)
        			$("#audience option[value='"+$(this).attr('data-audience')+"']").attr('selected', 'selected')
        			$("#detail").attr('value', ($(this).attr('data-detail')))
        			var html=''
        			var contentArray=$(this).attr('data-content').split(',')
        			for(var i=0; i<contentArray.length; i++){
        				html+= "<div value='"+contentArray[i]+"' class='alert alert-info _alert'><a href='#' class='close _close' data-dismiss='alert' aria-label='close'>&times;</a>"+dict[contentArray[i]]+"</div>"
        			}
        			$("#contentOption").html(html)
        			$("#record_clip_button").text("Cancella e registra un'altra clip")
        			
					
				//DA CONTROLLARE	
					html2="<div id='clipToModify'></div>"
					 
					html2+="<div>"+
						"<button class='_arrow btn btn_round bg-tranparent'><img id='new_stop"+i+"' class='img_btn _poiter' alt='Stop' title='Stop' src='asset/img/041-stop.png'></button>"+
						"<button class='_arrow btn btn_round bg-tranparent'><img id='new_play"+i+"' class='img_btn' alt='Play' title='Play' src='asset/img/022-play.png'></button>"+
						"<button class='_arrow btn btn_round bg-tranparent'><img id='new_pause"+i+"' class='img_btn _poiter' alt='Pause' title='Pause' src='asset/img/020-pause.png'></button>"+
						"</div>"
					$("#audio_record_div").html(html2)
					
					var newPlayer = new YT.Player('clipToModify', {
						height: '0',
						width: '0',
						playerVars: { autoplay: 0},
						videoId: $(this).attr('data-id'),
					})
					$("#new_stop"+i).click(
						function(e){
							e.preventDefault()
							stopVideo(newPlayer)
						}
					)
					$("#new_play"+i).click(
						function(e){
							e.preventDefault()
							play(newPlayer)
						}
					)
					$("#new_pause"+i).click(
						function(e){
							e.preventDefault()
							pause(newPlayer)
						}
					)
					
					
					$('#save_clip').prop('disabled', false)
        			$("#record_clip_button").attr('new-clip', 0)
        			$("#record_clip_button").attr('data-id', $(this).attr('data-id'))
        			$("#back_form_div").html("<button type='button' id='back_form' class='btn btn-primary'>Indietro</button>")

        			$("#back_form").click(
        				function(){
        					$("#modalNewClip").modal('hide')
        					$("#modalClipNotPublished").modal('show')
        				}
        			)

        			$("#modalNewClip").modal('show')

        		}
        	)
		},

		function(err) { 
			$('#_modal-body-clip-not-published').html("<div class='_empty_json'><h5>Impossibile collegarsi a Youtube!</h5></div>")
			console.error("Execute error", err); }

	)

}
	
	
	
	

  /*$.ajax(
    {
      //url: "clip_not_published.json",
	    url: 'clips/private',
      dataType: "json",
      success: function(data) {
        if(data.success){

			var clipList = data.content;
			var html = '';

        	// if((clipList.clip_list).length==0){
			if (!clipList.length) {
        		html = "<div class='_empty_json'><h5>Non hai nessuna clip salvata e non pubblicata</h5></div>";
        	} else {
        		//lista di clip con nome, metadati, traccia
        		for (var i = 0; i < clipList.length; i++) {
        			//aggiungo (nel DOM) le clip

        			html += "<div class='_modalList'><h5 class='_modalOverflow'><b>Titolo:</b> " + clipList[i].title + "</h5>";

					if (clipList[i].link == "") {
						html+="<div class='_empty_json border rounded border-dark'><h5>Caricamento clip fallito</h5></div>";
					} else {
						html += "<iframe class='frame' width='250' height='80' src='" + clipList[i].link + "'></iframe>";
					}

					html += "<div class='left _modalOverflow'><b>Geolocalizzazione:</b> " + clipList[i].geoloc +
								"<br><b>Lingua:</b> " + dict[clipList[i].language] + "<br><b>Scopo:</b> " + dict[clipList[i].purpose] + "<br><b>Pubblico:</b> " + dict[clipList[i].audience] +
								"<br><b>Dettaglio:</b> " + clipList[i].detail + "<br><b>Contenuto:</b> ";



        			 for (var j = 0; j < (clipList[i].content).length; j++){
        			 	html+=dict[clipList[i].content[j]]
        			 	if(j+1!=(clipList[i].content).length)
        			 		html+=", "
        			 }

        			html +=	"<br></div><div class='_flex_wrap_space'>" +
        					"<button data-id='" + clipList[i].id + "' data-title='"+clipList[i].title + "' data-audio='" + clipList[i].link + "' data-geoloc='" + clipList[i].geoloc+"' data-language='" + clipList[i].language+"' data-purpose='" + clipList[i].purpose + "' data-audience='" + clipList[i].audience+"' data-detail='"+clipList[i].detail + "' data-content='" + clipList[i].content+"' class='modify_clip btn btn-primary _btn_mod'>Modifica la clip</button>" +
        					"<button data-id='" + clipList[i].id + "' data-title='"+clipList[i].title + "' class='publish_clip btn btn-primary _btn_mod'>Pubblica la clip</button></div></div>";
        		}
        	}

        	$("#_modal-body-clip-not-published").html(html)

        	$(".publish_clip").click(
        		function(){ //rende pubblica la clip

              publishVideo($(this).attr('data-id'), $(this).attr('data-title'))

        			$("#modalClipNotPublished").modal('hide')
        		}
        	)

        	$(".modify_clip").click(
        		function(){
        			cleanForm()
        			$("#modalClipNotPublished").modal('hide')

        			$("#title").attr('value', ($(this).attr('data-title')))
        			$("#geoloc").attr('value', ($(this).attr('data-geoloc')))
        			if($(this).attr('data-language')!='')
        				$("#language option[value="+$(this).attr('data-language')+"]").attr('selected', 'selected')
        			else
        				$("#language option[value='ita'").attr('selected', 'selected')
        			if($(this).attr('data-purpose')!='')
        				$("#purpose input[value="+$(this).attr('data-purpose')+"]").prop('checked', true)
        			else
        				$("#purpose input[value='what']").prop('checked', true)
        			$("#audience option[value='"+$(this).attr('data-audience')+"']").attr('selected', 'selected')
        			$("#detail").attr('value', ($(this).attr('data-detail')))
        			var html=''
        			var contentArray=$(this).attr('data-content').split(',')
        			for(var i=0; i<contentArray.length; i++){
        				html+= "<div value='"+contentArray[i]+"' class='alert alert-info _alert'><a href='#' class='close _close' data-dismiss='alert' aria-label='close'>&times;</a>"+dict[contentArray[i]]+"</div>"
        			}
        			$("#contentOption").html(html)
        			$("#record_clip_button").text("Cancella e registra un'altra clip")
        			$("#audio_record_div").html("<iframe class='frame' width='250' height='80' src='" + $(this).attr('data-audio') + "'></iframe>")
					$('#save_clip').prop('disabled', false)
        			$("#record_clip_button").attr('new-clip', 0)
        			$("#record_clip_button").attr('data-id', $(this).attr('data-id'))
        			$("#back_form_div").html("<button type='button' id='back_form' class='btn btn-primary'>Indietro</button>")

        			$("#back_form").click(
        				function(){
        					$("#modalNewClip").modal('hide')
        					$("#modalClipNotPublished").modal('show')
        				}
        			)

        			$("#modalNewClip").modal('show')

        		}
        	)

        }
        else{
          alert(clipList.message)
        }
      }
    }
  )*/


function cleanForm(){

	$("#record_clip_button").removeAttr('data-id')
	$("#title").attr('value', '')
	$("#myForm option").removeAttr('selected')
	$("#language option[value='ita']").attr('selected', 'selected')
	$("#purpose input[value='what']").attr('checked', true)
	$("#audience option[value='']").attr('selected', 'selected')
	$("#detail").attr('value', '')
	$("#published_checkbox").attr('checked', false)
	$("#link_checkbox").attr('checked', false)

	$('#myForm')[0].reset()
	$("#audio_record_div").html('')
	$('#save_clip').prop('disabled', true)
	$("#contentOption").html('')
	$("#back_form_div").html('')
	$("#save_clip").attr('value', "Salva la clip")
	$("#record_clip_button").text("Registra")
}

/*      STAMPA DI UN JSON
          var print=''
          for (var pair of dataToSend.entries()) {
            print+=(pair[0]+ ' - ' + pair[1]);
            print+='\n'
          }
          alert(print)*/
