var mongo = require('mongodb');
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
const = COLLECTION_USERS = 'users';

 /**
  * Il nome della collezione delle clip.
  * @const {string}
  */
const = COLLECTION_CLIPS = 'clips';

/**
 * L'insieme dei nomi delle collezioni.
 * @const {array}
 */
const COLLECTIONS = [ COLLECTION_USERS, COLLECTION_CLIPS ];


/**/
MongoClient.connect(url, function(clientError, db) {
    if (clientError) throw clientError;

    console.log("Database created!");

    var dbObject = db.db(MONGODB_NAME);

    try {
        initCollections(dbObject);
    } catch (e) {

    } finally {

    }
});
/**/



function initCollections(dbObject) {
  // dbObject.getCollectionNames();

  /*
   *  Crea le collezioni nel database.
   *
   *  E' davvero necessario creare le collezioni? Le collezioni non esistiono,
   *  finche' non hanno contenuto.
   */
  for (var collectionName in COLLECTIONS) {
    doOperationOnDatabase(function() {
      dbObject.createCollection(collectionName, function(collectionError, res) {
        if (collectionError) throw collectionError;

        console.log(`Collection ${collectionName} created.`);
      });
    });
  }
}

/**
 * Esegue un'operazione sul database, non gestendo pero' gli errori.
 */
function doOperationOnDatabase(callback) {
    try {
        callback();
    } catch (exception) {
        throw exception;
    } finally {
        db.close();
    }
}


function insertUser(user) {
    MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var myobj = { name: "Company Inc", address: "Highway 37" };
  dbo.collection("customers").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});
}

/**
 * Crea una connessione al database di MongoDB.
 */
function connect() {
    MongoClient.connect(URL, function(clientError, db) {
        if (clientError) throw clientError;

        console.log("Database created!");

        var dbObject = db.db(MONGODB_NAME);

        try {
            initCollections(dbObject);
        } catch (e) {

        } finally {

        }
    });
    return dbObject;
}

/**
 * Inserisce un oggetto utente nel database.
 *
 * @param object dbObject: l'oggetto database.
 * @param object user: l'oggetto utente.
 */
module.exports.insertUser = function(dbObject, user) {
    dbObject.collection(COLLECTION_USERS).insertOne(myobj, handleResult);
}

function handleResult(error, result) {
  // Codice gestore del risultato dell'operazione sul database.
  if (error) throw error;

  insertSuccess(result);
}

function insertSuccess(result) {
  // Codice eseguito al successo dell'operazione sul database.
  console.log('1 document inserted');
}
