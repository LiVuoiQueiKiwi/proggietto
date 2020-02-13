/**
 * L'host sul quale il database MongoDB e' in esecuzione.
 * @const {string}
 */
// const MONGO_HOST = 'localhost';
const MONGO_HOST = 'mongo_site181971'

/**
 * Username per il database.
 * @const {string}
 */
const MONGO_USER = 'site181971';

/**
 * Password per il database.
 */
const MONGO_PSW = 'ahQuah7d';

/**
 * Il nome del database utilizzato su MongoDB.
 * @const {string}
 */
// const MONGO_NAME = 'WhereAmIDb';

/**
 *  La porta alla quale il databse di MongoDB risponde.
 * @const {number}
 */
// const MONGO_PORT = 27017;

/**
 * L'URL completo del databse di MongoDB.
 * @const {string}
 */
// const URL = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_NAME}`;
const URL = `${MONGO_USER}:${MONGO_PSW}@${MONGO_HOST}`;

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



/*
 * Per l'utilizzo del database.
 */
var mongo = require('mongodb');

/*
 * Per l'algoritmo SHA1.
 */
const crypto = require('crypto');

/*
 * Per le operazioni sul database MongoDb.
 */
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/whereami', COLLECTIONS);

/*
 * Per l'utilizzo di funzioni generali.
 */
const util = require('./util.js');

/*
 * Classe per risposte API.
 */
var ApiResponse = require('./apiResponse.js');






/*
 * Inizializzo gli eventi principali (principalmente per debug).
 */
db.on('error', function (error) {
    util.logFail('Database error. ');
	util.debug(error);
})

db.on('connect', function () {
    util.logSuccess('Database connected.');
})



/*
 * Inserisce un nuovo utente nel database.
 */
module.exports.putUser = function(email, password) {
    return new Promise(function(resolve, reject) {
        /*
         * Inizializzo la risposta.
         */
        var result = new ApiResponse();
        var missingArgs = 1;

        if (!email) {
            // Email mancante.
            result.message = 'Email non presente.';
        } else if (!password) {
            // Password mancante
            result.message = 'Password non presente.';
        } else {
            missingArgs = 0;
        }

        if(!missingArgs) {
            // I parrametri sono presenti e quindi proseguo.
            var data = {
                email: email,
                password: sha1(password)
            };

            // Controllo se esiste gia' un account con la stessa email.
            db.users.findOne({email: email}, function(error,docs) {
                if (!docs) {
                    // Il record non e' stato trovato, quindi memorizzo il nuovo
                    // account.
                    db.users.insert(data);

                    result.setSuccess();
                    result.message = 'Utente inserito correttamente.';
                } else {
                    result.message = 'Esiste gia\' un account con questo indirizzo email.';
                }

                if (error) {
                    // Riporto l'errorore nella risposta.
                    result.message = error;
                    reject(result.message);
                }

                resolve(result);
            });
        } else {
            reject(result.message);
        }
    });
}



/**
 * Ritorna un utente avente una email specifica.
 */
module.exports.getUser = function(email) {
    return new Promise(function(resolve, reject) {
        /*
         * Inizializzo la risposta.
         */
        var result = new ApiResponse();
        var missingArgs = 1;

        if (!email) {
            // Email mancante.
            result.message = 'Email non presente.';

        }  else {
            missingArgs = 0;
        }

        if(!missingArgs) {
            db.users.find({email: email}, function(error, docs) {
                if(error) {
            		// util.logFail('Errore nella ricerca dell\'utente.');
                    // console.log(error);
                    result.message = `Errore nella ricerca dell\'utente. ${error}`;
                    reject(result.message);
            	} else {
                    util.logSuccess('Successo prelievo utente nel database.');
                    util.debug(docs);

                    result.setSuccess();
                    result.content = docs;
                }

                resolve(result);
            });
        } else {
            resolve(result);
        }
    });
}



/**
 *  Ritorna tutti gli utenti presenti nel database.
 */
module.exports.getUsers = function() {
    return new Promise(function(resolve, reject) {
        /*
         * Inizializzo la risposta.
         */
        var result = new ApiResponse();

        db.users.find(function(error, docs) {
            if(error) {
        		// util.logFail('Errore nella ricerca degli utente.');
                // console.log(error);
                result.message = `Errore nella ricerca dell\'utente. ${error}`;
                reject(result.message);
        	} else {
                util.logSuccess('Successo prelievo utenti nel database.');
                util.debug(docs);

                result.setSuccess();
                result.content = docs;
            }

            reject(result.message);
        });
    });
}



/**
 * Elimina un utente con una specifica email.
 */
module.exports.deleteUser = function(email) {
    return new Promise(function(resolve, reject) {
        /*
         * Inizializzo la risposta.
         */
        var result = new ApiResponse();
        var missingArgs = 1;

        if (!email) {
            // Email mancante.
            result.message = 'Email non presente.';

        }  else {
            missingArgs = 0;
        }

        if(!missingArgs) {
            db.users.remove({email: email}, function(error, docs) {
                if(error) {
            		// util.logFail('Errore nella rimozione dell\'utente.');
                    // console.log(error);
                    result.message = `Errore nella rimozione dell\'utente. ${error}`;
                    reject(result.message);
            	} else {
                    util.logSuccess('Successo rimozione utente nel database.');
                    util.debug(docs);
                    result.setSuccess();
					resolve(result);
                }
            });
        } else {
            reject(result.message);
        }
    });
}



/**
 * Messaggi di errore per le operazioni sulle clip.
 * @const {string}
 */
const CLIPS_ERR_GET    = 'Errore nella ricerca delle clip.';
const CLIPS_ERR_DELETE = 'Errore nella ricerca dell\'utente.';



/*
 * Inserisce un nuovo oggetto 'clip' nella collezione.
 */
module.exports.putClip = function(clip) {
    return new Promise(function(resolve, reject) {
        /*
         * Inizializzo la risposta.
         */
        var result = new ApiResponse();
        var missingArgs = 1;

        if (!clip) {
            result.message = 'Clip non presente.';
        } else {
            missingArgs = 0;
        }

        if(!missingArgs) {
            db.clips.insert(clip);
            result.setSuccess();
            result.message = 'Clip inserita correttamente.';
			resolve(result);
        } else {
        	reject(result.message);
        }
    });
}



/*
 * Aggiorna un oggetto 'clip' nella collezione.
 */
module.exports.updateClip = function(clip) {
    return new Promise(function(resolve, reject) {
        /*
         * Inizializzo la risposta.
         */
        var result = new ApiResponse();
        var missingArgs = 1;

        if (!clip) {
            result.message = 'Clip non presente.';
        } else {
            missingArgs = 0;
        }

        if(!missingArgs) {
            db.clips.update({_id: clip._id}, {$set: clip});
            result.setSuccess();
            result.message = 'Clip aggiornata correttamente.';
			resolve(result);
        } else {
        	reject(result.message);
        }
    });
}



/**
 * Preleva una clip dal database con un ID specifico.
 * @param {int} userId.
 * @param {int} clipId.
 * @return {Promise}
 */
module.exports.getClip = function(userId, clipId) {
    return new Promise(function(resolve, reject) {
        /*
         * Inizializzo la risposta.
         */
        var result = new ApiResponse();
        var missingArgs = 1;

        if (!userId) {
            result.message = 'User ID non presente.';
        } if (!clipId) {
            result.message = 'Clip ID non presente.';
        } else {
            missingArgs = 0;
        }

        if(!missingArgs) {
            db.clips.find({userId: userId, _id: clipId}, function(error, docs) {
                if(error) {
            		// util.logFail(CLIPS_ERR_GET);
                    // console.log(error);
                    result.message = CLIPS_ERR_GET + ' ' + error;
                    reject(result.message);
            	} else {
                    util.logSuccess('Successo prelievo della clip nel database.');
                    util.debug(docs);
                    result.setSuccess();
                    result.content = docs;
					resolve(result);
                }
            });
        } else {
            reject(result.message);
        }
    });
}



/**
 * Preleva tutte clip dal database di un utente.
 * @param {int} userId.
 * @param {int} published.
 * @return {Promise}
 */
module.exports.getClips = function({userId, published, all}) {
    return new Promise(function(resolve, reject) {
        /*
         * Inizializzo la risposta.
         */
        var result = new ApiResponse();
        var missingArgs = 1;



        /*
         * Controllo se si vogliono estrarre tutte le clip, quelle pubblicate o
         * quelle non pubblicate.
         */
		if (all) {
			missingArgs = 0;

			var dataFilter = {
				published: 1
			};
		} else {
			if (!userId) {
	            result.message = 'User ID non presente.';
	        }  else {
	            missingArgs = 0;
	        }

			if (published === -1 || published === null) {
		        var dataFilter = {
		            userId: userId
		        };
		    } else if (published) {
		        var dataFilter = {
		            userId: userId,
		            published: 1
		        };
		    } else {
		        var dataFilter = {
		            userId: userId,
		            published: 0
		        };
		    }
		}

        if(!missingArgs) {
            db.clips.find(dataFilter, function(error, docs) {
                if(error) {
            		// util.logFail(CLIPS_ERR_GET);
                    // console.log(error);
                    result.message = CLIPS_ERR_GET + ' ' + error;
                    reject(result.message);
            	} else {
                    util.logSuccess('Successo prelievo clip dal database.');
                    util.debug(docs);
                    result.setSuccess();
                    result.content = docs;
					resolve(result);
                }
            });
        } else {
            reject(result.message);
        }
    });
}



/*
 * Elimina una clip dal database con un ID specifico.
 */
module.exports.deleteClip = function(clipId) {
    return new Promise(function(resolve, reject) {
        /*
         * Inizializzo la risposta.
         */
        var result = new ApiResponse();
        var missingArgs = 1;

        if (!clipId) {
            result.message = 'Clip ID non presente.';
        } else {
            missingArgs = 0;
        }

        if(!missingArgs) {
            db.clips.remove({_id: clipId}, function(error, docs) {
                if(error) {
            		// util.logFail(CLIPS_ERR_DELETE);
                    // util.debug(error);
                    result.message = CLIPS_ERR_DELETE + ' ' + error;
                    reject(result.message);
            	} else {
                    util.logSuccess(`Successo rimozione della clip [${clipId}] dal database.`);
                    util.debug(docs);
                    result.setSuccess();
					resolve(result);
                }
            });
        } else {
            reject(result.message);
        }
    });
}



/**
 * Calcola la stringa SHA1 corrispondente per la stringa in input.
 *
 * @param string string.
 */
var sha1 = function(string) {
     return crypto.createHash('sha1').update(JSON.stringify(string)).digest('hex');
}



module.exports.sha1 = sha1;
