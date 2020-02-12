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
 * Percorso relativo della pagina principale del sito.
 * @const {string}
 */
const MAIN_PAGE_RELATIVE_PATH = 'main.html';

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
  response.setHeader('Access-Control-Allow-Methods', 'POST, PUT, OPTIONS, DELETE, GET');
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






app.get('/', sendMainPage);

app.get('/index', sendMainPage);

app.get('/test', function(request, response) {
	response.send(testPage);
});

/*##### Prova per la gestionde delle risorse #####*/
/**
 * Percorso web relativo alla richiesta degli asset del sito.
 * @const {string}
 */
const ASSET_URL = 'asset';

/**
 * Path relativo alla cartella degli asset del sito.
 * @const {string}
 */
const ASSET_PATH = 'asset';



// app.get(`/${ASSET_URL}/:filename((.)*)`, function(request, response) {
app.get(/asset\/(.)*/, function(request, response) {
	var asset = (request.url).replace(`/${ASSET_PATH}/`, '');
	response.sendFile(`${__dirname}/${ASSET_PATH}/${asset}`);
});
/*#####*/


/**
 * Funzione che invia al client la pagina principale.
 * @param {Object} request
 * @param {Object} response
 * @author Simone Grillini <grillini.simo@gmail.com>
 */
function sendMainPage(request, response) {
	response.sendFile(`${__dirname}/${MAIN_PAGE_RELATIVE_PATH}`);
	util.logSuccess('Pagina principale inviata.');
}



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
/*       SOLO PER TESTING. */
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
