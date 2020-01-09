var mongo = require('mongodb');

/*
 * Per l'algoritmo SHA1.
 */
const crypto = require('crypto');
const util = require('./util.js');

var ApiResponse = require('./apiResponse.js');
var MongoClient = mongo.MongoClient;

/**
 * L'host sul quale il database MongoDB e' in esecuzione.
 * @const {string}
 */
const  MONGODB_HOST = 'localhost';

/**
 * Il nome del database utilizzato su MongoDB.
 * @const {string}
 */
const MONGODB_NAME = 'WhereAmIDb';

/**
 *  La porta alla quale il databse di MongoDB risponde.
 * @const {number}
 */
const MONGODB_PORT = 27017;

/**
 * L'URL completo del databse di MongoDB.
 * @const {string}
 */
const URL = `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_NAME}`;

/**
 * Il nome della collezione degli utenti.
 * @const {string}
 */
const COLLECTION_USERS = 'users';

 /**
  * Il nome della collezione delle clip.
  * @const {string}
  */
const COLLECTION_CLIPS = 'clips';

/**
 * L'insieme dei nomi delle collezioni.
 * @const {array}
 */
const COLLECTIONS = [ COLLECTION_USERS, COLLECTION_CLIPS ];









// #################################################################

var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/whereami', ['users', 'clips']);



// ⊥✕✓✔✖⚠
// Inizializzo gli eventi principali (principalmente per debug).
db.on('error', function (error) {
    util.logFail('Database error. ', error);
})

db.on('connect', function () {
    util.logSuccess('Database connected.');
})

/*
 * Inserisce un nuovo utente nel database.
 */
module.exports.insertUser = function(email, password) {
    // Inizializzo la risposta.
    var result = new ApiResponse();
    var missingArgs = true;

    if (!email) {
        // Email mancante.
        result.message = 'Email non presente.';
    } else if (!password) {
        // Password mancante
        result.message = 'Password non presente.';
    } else {
        missingArgs = false;
    }

    if (!missingArgs) {
        // I parrametri sono presenti e quindi proseguo.
        var data = {
            email: email,
            hash: sha1(password)
        };

        // Controllo se esiste gia' un account con la stessa email.
        db.users.findOne({email: email}, function(error,docs) {
            if (!docs) {
                // Il record non e' stato trovato, quindi memorizzo il nuovo
                // account.
                db.mycollection.save(data);

                result.setSuccess();
            } else {
                result.message = 'Esiste gia\' un account con questo indirizzo email';
            }

            if (error) {
                // Riporto l'errorore nella risposta.
                result.message = error;
            }
        });
    }
}



/*
 * Ritorna tutti gli utenti nel database.
 */
module.exports.getUser = function(email) {
    // Inizializzo la risposta.
    db.users.find({email: email}, function(error, docs) {
        if(error) {
    		util.logFail('Errore nella ricerca dell\'utente.');
            console.log(error);
    	}
	    // docs is an array of all the documents in mycollection
        util.logSuccess('Successo prelievo utenti nel database.');
        console.log(docs);
    });
}

























// #####################################################################






// /**/
// MongoClient.connect(url, function(clienterrororor, db) {
//     if (clienterrororor) throw clienterrororor;
//
//     console.log("Database created!");
//
//     var dbObject = db.db(MONGODB_NAME);
//
//     try {
//         initCollections(dbObject);
//     } catch (e) {
//
//     } finally {
//
//     }
// });
// /**/


//
// function initCollections(dbObject) {
//   // dbObject.getCollectionNames();
//
//   /*
//    *  Crea le collezioni nel database.
//    *
//    *  E' davvero necessario creare le collezioni? Le collezioni non esistiono,
//    *  finche' non hanno contenuto.
//    */
//   for (var collectionName in COLLECTIONS) {
//     doOperationOnDatabase(function() {
//       dbObject.createCollection(collectionName, function(collectionerrororor, res) {
//         if (collectionerrororor) throw collectionerrororor;
//
//         console.log(`Collection ${collectionName} created.`);
//       });
//     });
//   }
// }
//
// /**
//  * Esegue un'operazione sul database, non gestendo pero' gli errororori.
//  */
// function doOperationOnDatabase(callback) {
//     try {
//         callback();
//     } catch (exception) {
//         throw exception;
//     } finally {
//         db.close();
//     }
// }
//
//
// // function insertUser(user) {
// //     MongoClient.connect(url, function(erroror, db) {
// //   if (erroror) throw erroror;
// //   var dbo = db.db("mydb");
// //   var myobj = { name: "Company Inc", address: "Highway 37" };
// //   dbo.collection("customers").insertOne(myobj, function(erroror, res) {
// //     if (erroror) throw erroror;
// //     console.log("1 document inserted");
// //     db.close();
// //   });
// // });
// // }
//
// /**
//  * Crea una connessione al database di MongoDB.
//  */
// function connect() {
//     MongoClient.connect(URL, function(clienterrororor, db) {
//         if (clienterrororor) throw clienterrororor;
//
//         console.log("Database created!");
//
//         var dbObject = db.db(MONGODB_NAME);
//
//         try {
//             initCollections(dbObject);
//         } catch (e) {
//
//         } finally {
//
//         }
//     });
//     return dbObject;
// }
//
// /**
//  * Inserisce un oggetto utente nel database.
//  *
//  * @param object dbObject: l'oggetto database.
//  * @param object user: l'oggetto utente.
//  */
// module.exports.insertUser = function(dbObject, {username, password}) {
//     /*
//      * Calcolo l'hash sulla password.
//      */
//     var hash = sha1(password);
//
//     dbObject.collection(COLLECTION_USERS).insertOne({username, hash}, handleResult);
// }
//
// function handleResult(errororor, result) {
//   // Codice gestore del risultato dell'operazione sul database.
//   if (errororor) throw errororor;
//
//   insertSuccess(result);
// }
//
// function insertSuccess(result) {
//   // Codice eseguito al successo dell'operazione sul database.
//   console.log('1 document inserted');
// }


/**
 * Calcola la stringa SHA1 corrispondente per la stringa in input.
 *
 * @param string string.
 */
 var sha1 = function(string) {
     return crypto.createHash('sha1').update(JSON.stringify(string)).digest('hex');
 }
