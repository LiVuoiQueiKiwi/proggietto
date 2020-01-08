// Load the http module to create an http server.
var http = require( 'http' );
var fs = require( 'fs' );
var url = require( 'url' );

var express = require('express');
const session = require('express-session');

const db = require('./mongodb.js');


const DOC_FOLDER = 'htdocs';
const SERVER_PORT = 8000;


var app = express();

// Inizializzo il cookie per la sessione.
app.use(session({secret: 'NODE_JS_SESSION'}));
var sess;

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
	response.send('Hello World');
});

app.get('/users', function(request, response) {
	response.send('Users!');
});

app.post('/users/add', function(request, response) {
	console.log(request.body);

    db.insertUser({
        request.body.username,
        password: request.body.password
    });
});

app.get('/users/get', function(request, response) {
	console.log(request.body);

    db.getUser();
});

app.listen(SERVER_PORT, function() {
	console.log(`Server started on port ${SERVER_PORT}`);
});

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
