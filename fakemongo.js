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
 * Per l'algoritmo SHA1.
 */
const crypto = require('crypto');

/*
 * Per le operazioni sul filesystem.
 */
var fs = require('fs');

/*
 * Per l'utilizzo di funzioni generali.
 */
const util = require('./util.js');

/*
 * Classe per risposte API.
 */
var ApiResponse = require('./apiResponse.js');

var fs = require('fs');


/*
 * Il contenuto del file JSON.
 */
var data;


/*
 * Preleva il contenuto del file JSON con i dati.
 */
module.exports.init = function() {
	fs.readFile('records.json', 'utf8', function (error, data) {
		if (error) throw error;
		try {
			global.data = JSON.parse(data);

			util.debug(global.data);
		} catch (exception) {
			util.debug(exception);
		}
	});
}

/*
 * Scrive i records nel file JSON.
 */
function writeData() {
	fs.writeFile('records.json', JSON.stringify(global.data), function (error) {
	  if (error) throw error;
	  util.logSuccess('Record salvato');
	});
}







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

		util.debug(global.data);

		if (!global.data.users) {
			result.message = 'Records assenti.';
		} else if (!email) {
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
			// Setto come Id l'hash del timestamp di inserimento.
			var id = sha1(Date.now());
			var psw = sha1(password);

			// Controllo se esiste gia' un account con la stessa email.
			if (!global.data.users[email]) {
				// Il record non e' stato trovato, quindi memorizzo il nuovo
				// account.
				global.data.users[email] = {_id: id, password: psw};

				result.setSuccess();
				result.message = 'Utente inserito correttamente.';
				writeData();
			} else {
				result.message = 'Esiste gia\' un account con questo indirizzo email.';
			}

			resolve(result);
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

		if (!global.data.users) {
			result.message = 'Records assenti.';
		} else if (!email) {
            // Email mancante.
            result.message = 'Email non presente.';

        }  else {
            missingArgs = 0;
        }

        if(!missingArgs) {
			if (global.data.users[email]) {
				util.logSuccess('Successo prelievo utente nel database.');
				result.setSuccess();
				result.content = [global.data.users[email]];
				resolve(result);
			} else {
				result.message = `Errore nella ricerca dell\'utente. Utente non trovato.`;
				reject(result.message);
			}
        } else {
            reject(result.message);
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
		var missingArgs = 1;

		if (!global.data.users) {
			result.message = 'Records assenti.';
		} else {
            missingArgs = 0;
        }

		if(!missingArgs) {
			util.logSuccess('Successo prelievo utenti nel database.');
			result.setSuccess();
			result.content = [global.data.users];
			resolve(result);
        } else {
            reject(result.message);
        }
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

		if (!global.data.users) {
			result.message = 'Records assenti.';
		} else if (!email) {
            // Email mancante.
            result.message = 'Email non presente.';

        }  else {
            missingArgs = 0;
        }

        if(!missingArgs) {
			delete global.data.users[email];

			util.logSuccess('Successo rimozione utente nel database.');
			result.setSuccess();
			resolve(result);

			writeData();
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


		if (!global.data.clips) {
			result.message = 'Records assenti.';
		} else if (!clip) {
            result.message = 'Clip non presente.';
        } else {
            missingArgs = 0;

			// Setto come Id l'hash del timestamp di inserimento.
			clip._id = sha1(Date.now());
        }

        if(!missingArgs) {
            global.data.clips.push(clip);
            result.setSuccess();
            result.message = 'Clip inserita correttamente.';
			resolve(result);
			writeData();
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

		if (!global.data.clips) {
			result.message = 'Records assenti.';
		} else if (!clip) {
            result.message = 'Clip non presente.';
        } else {
            missingArgs = 0;
        }

        if(!missingArgs) {
			var clipToUpdate = findByField(global.data.clips, '_id', clip._id);
            copyClip(clip, clipToUpdate);
            result.setSuccess();
            result.message = 'Clip aggiornata correttamente.';
			resolve(result);
			writeData();
        } else {
        	reject(result.message);
        }
    });
}


/**
 * Copia i dati di una clip in un'altra.
 * @param {Object} source
 * @param {Object} target
 */
function copyClip(source, target) {
	Object.keys(source).iter(function(key) {
		target[key] = source[key];
	})
}

/**
 * Ritorna l'oggetto desiderato da una collezione, avente un campo con un
 * determinato valore.
 * @param {Array} collection
 * @param {string} fieldName
 * @param {any} value
 */
function findByField(collection, fieldName, value) {
	var i = 0;
	var length = collection.length;
	for (; i < length; i++) {
		if (collection[i][filename] == value) {
			return collection[i];
		}
	}
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

		if (!global.data.clips) {
			result.message = 'Records assenti.';
		} else if (!userId) {
            result.message = 'User ID non presente.';
        } if (!clipId) {
            result.message = 'Clip ID non presente.';
        } else {
            missingArgs = 0;
        }

        if(!missingArgs) {
			// Cerco la clip.
			var i = 0;
			var length = global.data.clips.length;
			var foundClip = null;
			for (; i < length; i++) {
				if (global.data.clips[i].userId == userId && global.data.clips[i]._id == clipId) {
					foundClip = global.data.clips[i];
				}
			}

			if (!foundClip) {
				util.logSuccess('Successo prelievo della clip nel database.');
				result.setSuccess();
				result.content = docs;
				resolve(result);
			} else {
				result.message = CLIPS_ERR_GET;
				reject(result.message);
			}
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




		if (!global.data.clips) {
 			result.message = 'Records assenti.';
 		} else if (!userId) {
			result.message = 'User ID non presente.';
		}  else {
			missingArgs = 0;
		}


        if(!missingArgs) {
			var clipsFound = [];
			var i = 0;
			var length = global.data.clips.length;

			if (all) {
				// Restituisco tutte le clip pubbliche del db.
				for (; i < length; i++) {
					if (global.data.clips[i].published) {
						clipsFound.push(global.data.clips[i]);
					}
				}
			} else if (published < 0 || published === null) {
		    	// Restituisco tutte le clip dell'utente.
				for (; i < length; i++) {
					if (global.data.clips[i].userId == userId) {
						clipsFound.push(global.data.clips[i]);
					}
				}
		    } else if (published) {
		    	// Restituisco tutte le clip pubbliche dell'utente.
				for (; i < length; i++) {
					if (global.data.clips[i].published && global.data.clips[i].userId == userId) {
						clipsFound.push(global.data.clips[i]);
					}
				}
		    } else {
		        // Restituisco tutte le clip private dell'utente.
				for (; i < length; i++) {
					if (!global.data.clips[i].published && global.data.clips[i].userId == userId) {
						clipsFound.push(global.data.clips[i]);
					}
				}
		    }

			util.logSuccess('Successo prelievo delle clip dal database.');
			util.debug(clipsFound);
			result.setSuccess();
			result.content = clipsFound;
			resolve(result);
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

		if (!global.data.clips) {
 			result.message = 'Records assenti.';
 		} else if (!clipId) {
            result.message = 'Clip ID non presente.';
        } else {
            missingArgs = 0;
        }

        if(!missingArgs) {
			delete findByField(global.data.clips, '_id', clipId);

			util.logSuccess(`Successo rimozione della clip [${clipId}] dal database.`);
			result.setSuccess();
			resolve(result);
			writeData();
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
