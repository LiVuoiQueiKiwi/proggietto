var express = require('express');
var session = require('express-session');
var db = require('./mongodb.js');

/*
 * Import dell'oggetto di risposta delle API.
 */
var ApiResponse = require('./apiResponse.js');

/*
 * Import delle funzioni di utilita'.
 */
var util = require('./util.js');

/*****/var testPage = require('./jqueryTestPage.js');

/**
 * Percorso relativo della cartella in cui si trovano i documenti HTML.
 * @const {string}
 */
const DOC_FOLDER = 'htdocs';

/**
 * Porta di ascolto del server.
 * @const {int}
 */
const SERVER_PORT = 8000;


var app = express();

/*
 * Inizializzo il cookie per la sessione.
 */
app.use(session({secret: 'NODE_JS_SESSION'}));

/*
 * Inizializzo il parsing da testo in JSON delle risposte.
 */
app.use(express.json());

/*
 * Inizializzo il parsing del testo in URL encoded data (per i dati inviati da
 * form HTML).
 */
app.use(express.urlencoded({extended: true}));

app.use(function(request, response, next) {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


/**
 * Variabile per la gestione della sessione con il client.
 * @var {object}
 */
var sess;



/**
 * Messaggio per l'accesso non autorizzato.
 * @const {string}
 */
const NO_AUTH_MESSAGE = 'Accesso API non autorizzato';

// app.get('/',function(req,res){
//     sess=req.session;
//     /*
//     * Here we have assign the 'session' to 'sess'.
//     * Now we can create any number of session variable we want.
//     * in PHP we do as $_SESSION['var name'].
//     * Here we do like this.
//     */
//     sess.email; // equivalent to $_SESSION['email'] in PHP.
//     sess.username; // equivalent to $_SESSION['username'] in PHP.
// });


app.get('/', function(request, response) {
	response.send(testPage);
    util.logSuccess('Pagina principale inviata.');
});



// #############################################################################
//   SEZIONE PER GLI UTENTI.
// #############################################################################


app.post('/users/login', function(request, response) {

    util.terminal('>>> Begin of login section.');

    /*
     * Inizializzo la sessione.
     */
    sess = request.session;
    util.terminal('Retriving session object');

    /*
     * Prelevo gli argomenti della richiesta.
     */
    var email = request.body.email;
    var password = request.body.password;

    util.terminal('Retriving email argument from request object');
    util.terminal('Retriving password argument from request object');

    /*
     * Inizializzo la risposta.
     */
    var serverResponse = new ApiResponse
    util.terminal('Initializing API response object');

    /*
     * Eseguo l'operazione richiesta.
     */
    util.terminal('Performing database query.');
    db.getUser(email).then(function(result) {
        /*
         * Controllo se e' stato trovato un account
         */
        if (result.success) {

            var userData = result.content[0];

            /*
             * Controllo se le due password coincidono.
             */
            if (userData.password == db.sha1(password)) {
                serverResponse.setSuccess();

                /*
                 * Memorizzo nella sessione il fatto che l'utente si sia
                 * autenticato e la sua password.
                 */
                sess.userIsLogged = 1;
                sess.userId = userData._id;
                sess.userEmail = email;
            } else {
                serverResponse.message = 'Password errata';
            }
        } else {
            serverResponse.message = 'Non esiste alcun account con questa email.';
        }

        // Rispondo al client con il risultato.
        sendToClient(response, serverResponse);
    }, util.handlePromiseRejection);
});



/*
 * Gestione API per l'aggiunta di un nuovo utente.
 */
app.put('/users', function(request, response) {
    /*
     * Prelevo gli argomenti della richiesta.
     */
    var email = request.body.email;
    var password = request.body.password;

    util.logSuccess(`Richiesta PUT ricevuta. Inserimento di un utente con email ${email} e password: ********`);

    /*
     * Eseguo l'operazione richiesta.
     */
    db.insertUser(email, password).then(function(result) {
        /*
         * Rispondo al client con il risultato.
         */
        sendToClient(response, result);
    }, util.handlePromiseRejection);
});


/*****/
// SOLO PER TESTING.
/*****/
app.get('/users', function(request, response) {

    util.logSuccess(`Richiesta GET ricevuta. Ricerca di tutti gli utenti`);

    /*
     * Eseguo l'operazione richiesta.
     */
    db.getUsers().then(function(result) {
        /*
         * Rispondo al client con il risultato.
         */
        sendToClient(response, result);
    }, util.handlePromiseRejection);
});
/*****/


app.get('/users/:email', function(request, response) {
    /*
     * Prelevo gli argomenti della richiesta.
     */
    var email = request.params.email;

    util.logSuccess(`Richiesta GET ricevuta. Ricerca dell'utente: ${email}`);

    // Eseguo l'operazione richiesta.
    db.getUser(email).then(function(result) {
        // Rispondo al client con il risultato.
        sendToClient(response, result);
    }, util.handlePromiseRejection);
});



/**
 * TODO: Da aggiungere il controllo sulla sessione se l'utente che accede
 * all'API e' lo stesso (stessa email eliminata) ed e' loggato.
 */
app.delete('/users/:email', function(request, response) {

    /*
     * Inizializzo la sessione.
     */
    sess = request.session;

    /*
     * Inizializzo la risposta.
     */
    var serverResponse = new ApiResponse();

    /*
     * Prelevo gli argomenti della richiesta.
     */
    var email = request.params.email;

    /*
     * Solo un utente autenticato puo' eliminare il proprio account.
     */
    if (isUserLogged(sess) && email == sess.userEmail) {
        util.logSuccess(`Richiesta DELETE ricevuta. Eliminazione dell'utente: ${email}`);

        /*
         * Eseguo l'operazione richiesta.
         */
        db.deleteUser(email).then(function(result) {
            /*
             * Rispondo al client con il risultato.
             */
            sendToClient(response, result);
        }, util.handlePromiseRejection);
    } else {
        serverResponse.message = NO_AUTH_MESSAGE;
    }

    sendToClient(response, serverResponse);
});



// #############################################################################
//   SEZIONE DELLE CLIP.
// #############################################################################



app.put('/clips', function(request, response) {
    /*
     * Inizializzo la sessione.
     */
    sess = request.session;

    /*
     * Inizializzo la risposta.
     */
    var serverResponse = new ApiResponse();

    /*
     * Prelevo gli argomenti della richiesta.
     */
    var clip = request.body.clip;

    /*
     * Controllo se l'utente e' loggato.
     */
    if (isUserLogged(sess)) {

        util.logSuccess(`Richiesta PUT ricevuta. Inserimento di una nuova clip per ${sess.userEmail}`);

        /*
         * Aggiungo all'oggetto della clip, l'ID dell'utente.
         */
        clip.userId = sess.userId;

        /*
         * Eseguo l'operazione richiesta.
         */
        db.putClip(clip).then(function(result) {
            /*
             * Rispondo al client con il risultato.
             */
            sendToClient(response, result);
        }, util.handlePromiseRejection);
    } else {
        serverResponse.message = NO_AUTH_MESSAGE;
        sendToClient(response, serverResponse);
    }
});



app.post('/clips', function(request, response) {
    /*
     * Inizializzo la sessione.
     */
    sess = request.session;

    /*
     * Inizializzo la risposta.
     */
    var serverResponse = new ApiResponse();

    /*
     * Prelevo gli argomenti della richiesta.
     */
    var clip = request.body.clip;

    /*
     * Controllo se l'utente e' loggato.
     */
    if (isUserLogged(sess)) {

        util.logSuccess(`Richiesta UPDATE ricevuta. Aggiornamento della clip [${clip._id}] per ${sess.userEmail}`);

        /*
         * Aggiungo all'oggetto della clip, l'ID dell'utente.
         */
        clip.userId = sess.userId;

        /*
         * Eseguo l'operazione richiesta.
         */
        db.updateClip(clip).then(function(result) {
            /*
             * Rispondo al client con il risultato.
             */
            sendToClient(response, result);
        }, util.handlePromiseRejection);
    } else {
        serverResponse.message = NO_AUTH_MESSAGE;
        sendToClient(response, serverResponse);
    }
});



/*
 * Restituisce al client UNA singola clip avente l'ID in input
 */
app.get('/clips/:clipId', function(request, response) {
    /*
     * Inizializzo la sessione.
     */
    sess = request.session;

    /*
     * Inizializzo la risposta.
     */
    var serverResponse = new ApiResponse();

    /*
     * Prelevo gli argomenti della richiesta.
     */
    var clipId = parseInt(request.params.clipId);

    /*
     * Solo un utente autenticato puo' eliminare il proprio account.
     */
    if (isUserLogged(sess)) {
        util.logSuccess(`Richiesta GET ricevuta. Prelievo una clip con id ${clipId} per l'utente ${sess.userEmail}`);

        /*
         * Eseguo l'operazione richiesta.
         */
        db.getClip(sess.userId, clipId).then(function(result) {
            /*
             * Rispondo al client con il risultato.
             */
            sendToClient(response, result);
        }, util.handlePromiseRejection);
    } else {
        serverResponse.message = NO_AUTH_MESSAGE;
        sendToClient(response, serverResponse);
    }
});


/*
 * Restituisce TUTTE le clip di un utente.
 */
app.get('/clips', function(request, response) {
    /*
     * Inizializzo la sessione.
     */
    sess = request.session;

    /*
     * Inizializzo la risposta.
     */
    var serverResponse = new ApiResponse();

    /*
     * Solo un utente autenticato puo' eliminare il proprio account.
     */
    if (isUserLogged(sess)) {
        util.logSuccess(`Richiesta GET ricevuta. Prelievo TUTTE le clip con per l'utente ${sess.userEmail}`);

        /*
         * Eseguo l'operazione richiesta.
         */
        db.getClips(sess.userId).then(function(result) {
            /*
             * Rispondo al client con il risultato.
             */
            sendToClient(response, result);
        }, util.handlePromiseRejection);
    } else {
        serverResponse.message = NO_AUTH_MESSAGE;
        sendToClient(response, serverResponse);
    }
});



/*
 * Restituisce TUTTE le clip PUBBLICATE di un utente.
 */
app.get('/public', function(request, response) {
    /*
     * Inizializzo la sessione.
     */
    sess = request.session;

    /*
     * Inizializzo la risposta.
     */
    var serverResponse = new ApiResponse();

    /*
     * Solo un utente autenticato puo' eliminare il proprio account.
     */
    if (isUserLogged(sess)) {
        util.logSuccess(`Richiesta GET ricevuta. Prelievo le clip PUBBLICHE per l'utente ${sess.userEmail}`);

        /*
         * Eseguo l'operazione richiesta.
         */
        db.getClips(sess.userId, 1).then(function(result) {
            /*
             * Rispondo al client con il risultato.
             */
            sendToClient(response, result);
        }, util.handlePromiseRejection);
    } else {
        serverResponse.message = NO_AUTH_MESSAGE;
        sendToClient(response, serverResponse);
    }
});



/*
 * Restituisce TUTTE le clip PRIVATE di un utente.
 */
app.get('/private', function(request, response) {
    /*
     * Inizializzo la sessione.
     */
    sess = request.session;

    /*
     * Inizializzo la risposta.
     */
    var serverResponse = new ApiResponse();

    /*
     * Solo un utente autenticato puo' eliminare il proprio account.
     */
    if (isUserLogged(sess)) {
        util.logSuccess(`Richiesta GET ricevuta. Prelievo le clip PRIVATE per l'utente ${sess.userEmail}`);

        /*
         * Eseguo l'operazione richiesta.
         */
        db.getClips(sess.userId, 0).then(function(result) {
            /*
             * Rispondo al client con il risultato.
             */
            sendToClient(response, result);
        }, util.handlePromiseRejection);
    } else {
        serverResponse.message = NO_AUTH_MESSAGE;
        sendToClient(response, serverResponse);
    }
});



/*
 * Restituisce le clip piu' vicine all'utente.
 */
// app.get('/nearest/:location', function(request, response) {
//     /*
//      * Inizializzo la sessione.
//      */
//     sess = request.session;
//
//     /*
//      * Inizializzo la risposta.
//      */
//     var serverResponse = new ApiResponse();
//
//     /*
//      * Prelevo gli argomenti della richiesta.
//      */
//     var location = request.params.location;
//
//     /*
//      * Solo un utente autenticato puo' eliminare il proprio account.
//      */
//     if (isUserLogged(sess)) {
//         util.logSuccess(`Richiesta GET ricevuta. Prelievo le clip piu' vicine a [${location}] all'utente ${sess.userEmail}`);
//
//         /*
//          * Inizializzo il risultato.
//          */
//         var filteredClips = [];
//
//         /*
//          * Prelievo tutte le clip.
//          */
//         db.getClips(sess.userId).then(function(result) {
//
//             /*****/ util.debug(result);
//
//             if (result.success) {
//                 result.content.forEach(function(clip) {
//                     // if (util.getDistance(location, clip.geoloc)) {
//                         clip.TEST = util.getDistance(location, clip.geoloc);
//                         filteredClips.push(clip);
//                     // }
//                 });
//
//                 result.content = filteredClips;
//             } else {
//                 /*
//                  * Rispondo al client con il risultato (errore).
//                  */
//                 sendToClient(response, result);
//             }
//         }, util.handlePromiseRejection);
//     } else {
//         serverResponse.message = NO_AUTH_MESSAGE;
//         sendToClient(response, serverResponse);
//     }
// });



app.delete('/clips/:id', function(request, response) {
    /*
     * Inizializzo la sessione.
     */
    sess = request.session;

    /*
     * Inizializzo la risposta.
     */
    var serverResponse = new ApiResponse();

    /*
     * Prelevo gli argomenti della richiesta.
     */
    var id = request.params.id;

    /*
     * Solo un utente autenticato puo' eliminare il proprio account.
     */
    if (isUserLogged(sess) && email == sess.userEmail) {
        util.logSuccess(`Richiesta DELETE ricevuta. Elimino la clip con id ${id} per l'utente ${sess.userEmail}`);

        /*
         * Eseguo l'operazione richiesta.
         */
        db.deleteClip(id).then(function(result) {
            /*
             * Rispondo al client con il risultato.
             */
            sendToClient(response, result);
        }, util.handlePromiseRejection);
    } else {
        serverResponse.message = NO_AUTH_MESSAGE;
        sendToClient(response, serverResponse);
    }
});



app.get('/fs', function(request, response) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, 'fsTest.html');

    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
        if (!err) {
            util.debug(data);
            var singleLine = data.replace(/(\r\n|\n|\r)/gm, '');
            util.logSuccess(singleLine);
            sendToClient(response, singleLine);
        } else {
            util.logFail(err);
        }
    });


});




// #############################################################################
//   ALTRO.
// #############################################################################


/*
 * Il web server rimane in ascolto sulla porta specificata.
 */
app.listen(SERVER_PORT, function() {
	console.log(`Server started on port ${SERVER_PORT}`);
});



/**
 * Invia al client un oggetto in formato JSON testuale.
 * @param {object} response.
 * @param {object} data.
 */
var sendToClient = function(response, data) {
    /*
     * Esueguo il parsing sul risultato.
     */
    var stringOutput = toJson(data);

    /*
     * Rispondo al client con il risultato.
     */
    response.send(stringOutput);
}



/**
 * Converte un oggetto in JSON.
 * @param {object} data.
 */
var toJson = function(data) {
    return JSON.stringify(data);
}



/**
 * Controlla se l'utente e' autenticato.
 * @param {object} session.
 * @return {bool}
 */
var isUserLogged = function(session) {
    return session.userIsLogged && session.userEmail;
}




//
// // Configure our HTTP server to respond with Hello World to all requests.
// var server = http.createServer(function(request, response) {
// 	// var parameters = url.parse( response.url, true );
// 	// fs.readFile
// 	// (
// 	// 	'index.html',
// 	// 	function( error, data )
// 	// 	{
// 	// 		response.writeHead( 200, { 'Content-Type': 'text/html' } );
// 	// 		response.write( data );
// 	// 		response.end();
// 	// 	}
// 	// );
//
// 	var example_url = 'https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash';
// 	var parsed_url = url.parse( request.url, true );
// 	var splittedUrl = parsed_url.pathname.split( '/' );
//
//
// 	var final_content =
// 	{
// 		agent: "NODE SERVER",
// 		content:
// 		{
// 			requestURL: request.url,
// 			//requestURL: example_url,
// 			parseRequest: parsed_url,
// 			splittedURL: splittedUrl
// 			//parseRequest: url.parse( example_url, true )
// 		}
// 	};
//
// 	//response.writeHead( 200, { 'Content-Type': 'application/json' } );
// 	//response.end( JSON.stringify( final_content ) );
//
//
//
// 	// Esamino gli elementi dell'URL splittati.
// 	if (splittedUrl.length >= 2) {
// 		// In questo caso e' stato inserito un percorso composto dopo l'host.
// 		if (!is_undefined(splittedUrl[1])) {
// 			switch (splittedUrl[1]) {
// 				case '':
// 				case 'index':
// 					response_with_index( response );
// 					break;
//
// 				case 'test':
// 					break;
//
// 				default:
// 					response_with_error( response, 'An error occured parsing the URL string.' );
// 			}
// 		}
// 	} else {
// 		// In questo caso l'URL e' quello di base e quindi restituisco l'index.html
// 		response_with_index( response );
// 	}
//
//
// });
//
// // Listen on port 8000, IP defaults to 127.0.0.1
// server.listen( SERVER_PORT );
//
// // Put a friendly message on the terminal
// console.log( `Server running at http://127.0.0.1:${ SERVER_PORT }/` );
//
//
// function response_with_index ( response )
// {
// 	require( 'fs' ).readFile
// 	(
// 		`${ DOC_FOLDER }/index.html`,
// 		function( error, data )
// 		{
// 			response.writeHead( 200, { 'Content-Type': 'text/html' } );
// 			response.write( data, function ( error ) { response.end(); } );
// 			response.end();
// 		}
// 	);
// }
//
//
//
// function response_with_error ( response, errorMessage )
// {
// 	response.writeHead( 200, { 'Content-Type': 'text/html' } );
// 	response.write(
// 		`<!DOCTYPE html>
// 		<html>
// 			<head>
// 				<title>Where am I?</title>
// 			</head>
// 			<body>
// 				<style>
// 				html, body { width: 100vw; height: 100vh; margin: 0; padding: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
// 				img { width: 100%; }
// 				</style>
// 				<h1>${errorMessage}</h1>
// 			</body>
// 		</html>`,
// 		function(error) {
//             response.end();
//         }
//     );
// 	response.end();
// }
//
//
//
// function failed_to_write ( error )
// {
//
// }
//
//
// function is_undefined ( variable )
// {
// 	return null == variable;
// }


//  https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.shitpostbot.com%2Fimg%2Fsourceimages%2Fjohnny-sins-with-a-moustache-57fcd536bedcb.png&f=1&nofb=1











/*

ESEMPIO fs.appendFile()

fs.appendFile('mynewfile1.txt', 'Hello content!', function (err) {
  if (err) throw err;
  console.log('Saved!');
});



ESEMPIO fs.open()

fs.open('mynewfile2.txt', 'w', function (err, file) {
  if (err) throw err;
  console.log('Saved!');
});



ESEMPIO fs.writeFile()

fs.writeFile('mynewfile3.txt', 'Hello content!', function (err) {
  if (err) throw err;
  console.log('Saved!');
});



ESEMPIO fs.unlink()

fs.unlink('mynewfile2.txt', function (err) {
  if (err) throw err;
  console.log('File deleted!');
});


ESEMPIO fs.rename()

fs.rename('mynewfile1.txt', 'myrenamedfile.txt', function (err) {
  if (err) throw err;
  console.log('File Renamed!');
});

*/
