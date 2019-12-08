jQuery(function ($) {

    $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
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




		$('#stop_record_clip_button').hide()

		$("#requestLocationList").click(requestLocationList)

		$("#requestClipNotPublished").click(requestClipNotPublished)

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

				//var file = $( '#fileTag' )[0].files[0]

				navigator.mediaDevices.getUserMedia({ audio: true }).then(
					stream => {
						const mediaRecorder = new MediaRecorder(stream)
						mediaRecorder.start()


						$('#record_clip_button').hide()
						$('#stop_record_clip_button').show()
						$("#audio_record_div").html("<img id='recording' class='img_btn' alt='RECORDING' title='RECORDING' src='png/mic.gif'>\t\tRecording...")

						$('#stop_record_clip_button').click(
							function(){
								mediaRecorder.stop()
							}
						)

						const audioChunks = []
						mediaRecorder.addEventListener("dataavailable", event => {
								audioChunks.push(event.data)
							}
						)

						mediaRecorder.addEventListener("stop", () => {
							const audioBlob = new Blob(audioChunks)
							const audioUrl = URL.createObjectURL(audioBlob)

							$('#stop_record_clip_button').hide()
							$('#record_clip_button').show()
							$('#record_clip_button').text('Cancella e registra')
							$("#record_clip_button").attr('new-clip', 1)
							$("#audio_record_div").html("<audio id='audio_record' src='"+audioUrl+"' controls>Your browser does not support the audio element.</audio>")
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

		//submit del form di cariamento clip
		$("#myForm").submit(
			function (event){
				//raccoglie tutti i dati del form
				//controlla che ci sia l'audio
        //
				//creazione json da inviare al server
				var formData = new FormData(myForm)	// La forma di .append e' ( chiave, valore )

				//i metadativanno inviati in ogni caso
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

				if(formData.get('published')=="published"){
					formData.set('published', '1')
				}
				else
					formData.append('published', '0')

				if($("#record_clip_button").attr('new-clip')==1){
					if($("#record_clip_button").attr('data-link')){ //caso in cui ho modificato la clip. elimino la precedente e carico la nuova clip
						formData.append('link', $("#record_clip_button").attr('data-link'))
					}
					//caso in cui sto creando una nuova clip. la carico
					//formData.append( 'uploaded-file', $('#audio_record').attr('src') )


					var xhr = new XMLHttpRequest()
					xhr.open('GET', $('#audio_record').attr('src'), true)
					xhr.responseType = 'blob'
					xhr.onload = function(e) {
						console.log(this.status);
						if (this.status == 200) {
							var myBlob = this.response
							// myBlob is now the blob that the object URL pointed to
							formData.append( 'uploaded-file', myBlob )
						}
					}
					xhr.send()




				}
				else{ //caso in cui ho modificato i metadati ma non la clip. aggiorno i metadati alla clip precedente
					formData.append('link', $("#record_clip_button").attr('data-link'))
				}

				// Invio tutto il contenuto con AJAX.
				// Se il json contiene:
				// 		-Metadati + Link + File: Elimino precedente clip(Link) + Carico nuova clip(File + Metadati)
				//		-Metadati + Link (NO File): Aggiorno Metadati a precedente clip (Link + Metadati)
				//		-Metadati + File (NO Link): Carico nuova clip (File + Metadati)

				ajaxSendData(formData, '') //inserire link del server (Funzione: uploadClip)

			}
		)

		$("#creator").attr("value","Qui bisogna inserire la mail dell'utente")

		$("#create_clip").click(
			function(){
				cleanForm()
			}
		)

		$("#buttonWhereAmI").click(
			function(){
				printWhereAmI(clip_list_json_global)
			}
		)

		$('#modalWhereAmI').on('hidden.bs.modal', function () {
			$('#_modal-body-whereAmI').html('')
		})





});


var map,mpos, markers=[];

function init(){





    map = L.map('map');
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 0,
        maxZoom: 16
    }).addTo(map);




    /*
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        window.alert("Geolocation is not supported by this browser.");
      }
    }

    function showPosition(position) {
        map.addLayer(createPositionMarker({lat: position.coords.latitude, lng: position.coords.longitude}));

    }*/



    //map.on('locationfound', onLocationFound);
	//map.on('locationerror', onLocationError);
	map.locate({
        setView: true,
        maxZoom: 16
    }).on("locationfound", e => {
            map.addLayer(createPositionMarker(e.latlng));






    }).on("locationerror", error => {
            console.log("Errore");
    });





    //var mark = createPositionMarker();
    //console.log(mark._id);

    //map.addControl( new L.Control.Gps({marker:mark,autoCenter:true,maxZoom: 16}) );
    //console.log(position_Marker(mark));


    //map.addControl( new L.Control.Gps({autoCenter:true,maxZoom: 16}) )
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
    });


    printLocation()

}


/* Markers functions */

function printMarker(olc, color){
  var mark = L.marker(OLC_Coords(olc),{icon:iconPoint(color),autoPan:true});
  mark._id = olc;
  markers.push(mark);
  map.addLayer(mark);

}

function markerPos(marker){

        marker.on('dragend', function(event){
            markers.forEach(function(marker) {
            if (marker._id != 1){
                clearMarker(marker._id);
                console.log(markers);
            }
        });
            addMarker();

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

function addMarker(){

    var mark= L.marker(L.latLng(map.getCenter()),{icon:iconPoint()}); // draggable:true
    mark._id= Coords_OLC(mark.getLatLng().lat,mark.getLatLng().lng);
    mark.on('click',function(event){
        var m= L.marker([midPoint( getMarkerYourPosition(),event.target._id).lat,midPoint( getMarkerYourPosition(),event.target._id).lng],{icon:iconPoint()});
        m.addTo(map);
        highlight(event.target._id);
    });
    markers.push(mark);
    mark.addTo(map);
}

function highlight(olc){

    markers.forEach(function(marker) {

        if(marker._id == olc) {

            var popup = L.popup().setContent("Highlight");
            marker.bindPopup(popup).openPopup();
            setCenterView(midPoint(getMarkerYourPosition(),olc));
            map.fitBounds([
                OLC_Coords(getMarkerYourPosition()),
                marker.getLatLng()
            ]);
            marker.unbindPopup();
        }
    });
}

/* Handle Position Functions */

/*
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    window.alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
    map.addLayer(createPositionMarker({lat: position.coords.latitude, lng: position.coords.longitude}));

}*/

function getOfflinePosition(){
    var center
     markers.forEach(function(marker) {
        if (marker._id == 1){
            center = marker.getLatLng();
            }
    });
    setCenterView(center);
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

var clip_list_json_global

function printLocation() {
  //richiesta al server della lista delle clip vicine, IN ORDINE DI DISTANZA (!!!QUINDI SOLO DELLE CLIP ENTRO I 50 METRI DI DISTANZA!!!)
  //la prima clip della lista è il luogo di interesse (DA VISUALIZZARE COME LUOGO PRINCIPALE)
  //mando la posizione attuale e ricevo un clip_list.json
  //la posizione viene mandata tramite indirizzo url
  //inserire link del server (Funzione: getClip)

  $.ajax(
    {
      url: "clip_list.json",
      dataType: "json",
      success: function(receiveData){

        //STAMPA DEL JSON
        //alert(JSON.stringify(receiveData))

        clip_list_json_global=receiveData
        //alert(clip_list_json_global.clip_near.length)

        markers.forEach(function(marker) {
          if (marker._id != 1){
              clearMarker(marker._id);
              console.log(markers);
          }
        })
        for(var i=0; i<(clip_list_json_global.clip_near.length); i++){
          printMarker(clip_list_json_global.clip_near[i].geoloc, 'img/marker-point-near.png')
        }

        for(var i=0; i<(clip_list_json_global.clip_far.length); i++){
          printMarker(clip_list_json_global.clip_far[i].geoloc, 'img/marker-point.png')
        }

      }
    }
  )
}



function ajaxSendData(dataToSend, url){
	/*$.ajax(
		{
			url: url,
			type: 'POST',
			dataType: 'json',
			data: dataToSend,
			processData: false,	// Evita che Jquery faccia operazioni sui dati.
			contentType: false	// Evita che Jquery faccia operazioni sui dati.
		}
	)*/

	//STAMPA DEL JSON
	var print=''
	for (var pair of dataToSend.entries()) {
		print+=(pair[0]+ ' - ' + pair[1]);
		print+='\n'
	}
	alert(print)
}

function ajaxReceiveData(urlData, func){
	$.ajax(
		{
			url: urlData,
			dataType: "json",
			success: function(receiveData){

				//STAMPA DEL JSON
				//alert(JSON.stringify(receiveData))

				func(receiveData)
			}
		}
	)
}

function printWhereAmI(clipList){
	//stampa della lista di clip (la prima è il luogo di interesse) e i bottoni di whereAmI

	var html=''
	if((clipList.clip_near).length==1){
		html="<div class='_empty_json'><h5>Nessun luogo nelle vicinanze</h5></div><audio autoplay src='' controls>Your browser does not support the audio element.</audio>"
		//L'audio inserito deve dire "Raggiungi un punto di interesse indicato sulla mappa"
		$('#_modal-body-whereAmI').html(html)
	}
	else{
		html+=	"<h5 class='_modalOverflow m-0'><b>"+clipList.clip_near[0].title+"</b></h5><div class='left _modalOverflow m-2'><b>Lingua:</b> "+dict[clipList.clip_near[0].language]+
				"<br><b>Scopo:</b> "+dict[clipList.clip_near[0].purpose]+"<br><b>Pubblico:</b> "+dict[clipList.clip_near[0].audience]+
				"<br><b>Dettaglio:</b> "+clipList.clip_near[0].detail+"<br><b>Contenuto:</b> "

		for(var j=0; j<(clipList.clip_near[0].content).length; j++){
			html+=dict[clipList.clip_near[0].content[j]]
			if(j+1!=(clipList.clip_near[0].content).length)
				html+=", "
		}

		html+="<br></div>"

		html+="	<audio src='"+clipList.clip_near[0].audio_file+"' class='_clipNotPublished' autoplay controls>Your browser does not support the audio element.</audio>"+
				"<div class='_flex_center'>"+
				"<button class='_arrow btn btn_round bg-tranparent'><img id='previous' class='img_btn img_disable' alt='PREVIOUS location' title='PREVIOUS location' src='png/014-left arrow.png'></button>"+
				"<button class='_arrow btn btn_round bg-tranparent'><img id='more' class='img_btn _poiter' alt='MORE about this place' title='MORE about this place' src='png/009-next.png'></button>"+
				"<button class='_arrow btn btn_round bg-tranparent'><img id='next' class='img_btn _poiter' alt='NEXT location' title='NEXT location' src='png/031-right arrow.png'></button>"+
				"</div>"


		$('#_modal-body-whereAmI').html(html)

		if(clipList.clip_near.length==1)
			$('#more').addClass('img_disable')
		else{
			$('#more').click(
				function(){
					printWhereAmI(clipList)
				}
			)
		}

		$('#next').click(
			function(){
				//richiesta al server della lista delle clip tra i 50 e i 100 metri, IN ORDINE DI DISTANZA
				//mando la posizione attuale e ricevo un clip_list.json
				//la posizione viene mandata tramite indirizzo url
				ajaxReceiveData("clip_list.json", nextClip) //inserire link del server (Funzione: getFarClip)
			}
		)

		alert(clipList.clip_near[0].geoloc)
		//highlightLocation(clipList.clip_near[0].geoloc)
	}

}

function nextClip(clipList){

	//$('#previous').removeClass('img_disable')
	//printWhereAmI(clipList)

}

function requestLocationList(){
	//richiesta al server della lista dei luoghi nei dintorni (!!!QUINDI SOLO DEI LUOGHI TRA I 50 E I 100 METRI DI DISTANZA!!!)
	//mando la posizione attuale e ricevo un location_list.json
	//la posizione viene mandata tramite indirizzo url
	ajaxReceiveData("location_list.json", nearLocationList) //inserire link del server (Funzione: getNearLocation)

}

function nearLocationList(locationList){
	var html=''
	if((locationList.location_list).length==0){
		html="<div class='_empty_json'><h5>Nessun luogo da visitare nei dintorni</h5></div>"
	}
	else{
		for(var i=0; i<(locationList.location_list).length; i++){
			//aggiungo (nel DOM) la location alla lista. on click chiamo la funzione che mi evidenzia il luogo sulla mappa, passandogli la geoloc
			html+="<div class='_modalList _pointer' data-location='" + locationList.location_list[i].geoloc + "'><h5 class='_modalh5'>"+locationList.location_list[i].name+"</h5></div>";
		}
	}
	$("#_modal-body-location-list").html(html)
	$("._modalList").click(
		function(){
			var location=$(this).attr('data-location'); //nella var location ho il metadato geoloc, col quale posso andare a cercare il lugoo da evidenziare sulla mappa
			alert(location)
			//highlightLocation(location)
		}
	)
}

function requestClipNotPublished() {
	//richiesta al server della lista delle clip salvate ma non pubblicate (quindi salvate su youtube con il metadato published=0)
	//mando la email dell'utente e ricevo un clip_list.json
	//la email dell'utente viene mandata tramite indirizzo url
	ajaxReceiveData("clip_list.json", notPublishedList) //inserire link del server (Funzione: getNotPublishedClip)
}

function notPublishedList(clipList){
	var html=''
	if((clipList.clip_list).length==0){
		html="<div class='_empty_json'><h5>Non hai nessuna clip salvata e non pubblicata</h5></div>"
	}
	else{
		//lista di clip con nome, metadati, traccia
		for(var i=0; i<(clipList.clip_list).length; i++){
			//aggiungo (nel DOM) le clip
			html+=	"<div class='_modalList'><h5 class='_modalOverflow'><b>Titolo:</b> "+clipList.clip_list[i].title+"</h5><audio src='"+clipList.clip_list[i].audio_file+
					"' class='_clipNotPublished' controls>Your browser does not support the audio element.</audio><div class='left _modalOverflow'><b>Geolocalizzazione:</b> "+clipList.clip_list[i].geoloc+
					"<br><b>Lingua:</b> "+dict[clipList.clip_list[i].language]+"<br><b>Scopo:</b> "+dict[clipList.clip_list[i].purpose]+"<br><b>Pubblico:</b> "+dict[clipList.clip_list[i].audience]+
					"<br><b>Dettaglio:</b> "+clipList.clip_list[i].detail+"<br><b>Contenuto:</b> ";

			for(var j=0; j<(clipList.clip_list[i].content).length; j++){
				html+=dict[clipList.clip_list[i].content[j]]
				if(j+1!=(clipList.clip_list[i].content).length)
					html+=", "
			}
			html+=	"<br></div><div class='_flex_wrap_space'>"+
					"<button data-link='"+clipList.clip_list[i].link+"' data-title='"+clipList.clip_list[i].title+"' data-audio='"+clipList.clip_list[i].audio_file+"' data-geoloc='"+clipList.clip_list[i].geoloc+"' data-language='"+clipList.clip_list[i].language+"' data-purpose='"+clipList.clip_list[i].purpose+"' data-audience='"+clipList.clip_list[i].audience+"' data-detail='"+clipList.clip_list[i].detail+"' data-content='"+clipList.clip_list[i].content+"' class='modify_clip btn btn-primary _btn_mod'>Modifica la clip</button>"+
					"<button data-link='"+clipList.clip_list[i].link+"' class='publish_clip btn btn-primary _btn_mod'>Pubblica la clip</button></div></div>";
		}
	}

	$("#_modal-body-clip-not-published").html(html)

	$(".publish_clip").click(
		function(){ //rende pubblica la clip
			var updateData = new FormData()
			updateData.append('data-link', $(this).attr('data-link'))
			ajaxSendData(updateData, '') //inserire link del server (Funzione: setClipPublished)
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
			$("#audio_record_div").html("<audio src='"+$(this).attr('data-audio')+"' id='audio_record' controls>Your browser does not support the audio element.</audio>")
			$("#record_clip_button").attr('new-clip', 0)
			$("#record_clip_button").attr('data-link', $(this).attr('data-link'))
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

function cleanForm(){

	$("#record_clip_button").removeAttr('data-link')
	$("#title").attr('value', '')
	$("#geoloc").attr('value', '')
	$("#myForm option").removeAttr('selected')
	$("#language option[value='ita']").attr('selected', 'selected')
	$("#purpose input[value='what']").attr('checked', true)
	$("#audience option[value='']").attr('selected', 'selected')
	$("#detail").attr('value', '')
	$("#published_checkbox").attr('checked', false)
	$("#link_checkbox").attr('checked', false)

	$('#myForm')[0].reset()
	$("#audio_record_div").html('')
	$("#contentOption").html('')
	$("#back_form_div").html('')
	$("#save_clip").attr('value', "Salva la clip")
	$("#record_clip_button").text("Registra")
}
