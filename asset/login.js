var GoogleAuth;
  var current_email;
  var SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/userinfo.email';
  function handleClientLoad() {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', initClient);
  }

  function initClient() {
	
    // Retrieve the discovery document for version 3 of YouTube Data API.
    // In practice, your app can retrieve one or more discovery documents.
    var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest';

    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    gapi.client.init({
        'apiKey': 'AIzaSyBjqg6UbFyTH2gfunOzkGQj4CUriNY7C3A',
        'discoveryDocs': [discoveryUrl],
        'clientId': '983224150687-snddjh3mhkvskm9e7qhham6it8rebrni.apps.googleusercontent.com',
        'scope': 'https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.upload'
    }).then(function () {
      GoogleAuth = gapi.auth2.getAuthInstance();

      // Listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(updateSigninStatus);

      // Handle initial sign-in state. (Determine if user is already signed in.)
      user = GoogleAuth.currentUser.get();
	  setSigninStatus();
	  console.log()

      // Call handleAuthClick function when user clicks on
      //      "Sign In/Authorize" button.
      $('#sign-in-or-out-button').click(function() {
		event.preventDefault()
        handleAuthClick();
      });
	  $('#revoke-access-button').click(function() {
        revokeAccess();
      });
    });
  }

  function handleAuthClick() {
      if (GoogleAuth.isSignedIn.get()) {
      // User is authorized and has clicked 'Sign out' button.
      GoogleAuth.signOut();
    } else {
      // User is not signed in. Start Google auth flow.
      GoogleAuth.signIn();
    }
  }

	function revokeAccess() {
		GoogleAuth.disconnect();
	}


  function setSigninStatus(isSignedIn) {
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {
			alert("Stai utilizzando l'applicazione in modalità Editor!");
			$('#signin h1').html('Logout');
			$('#sign-in-or-out-button').html('Logout');
			$('#revoke-access-button').css('display', 'inline-block');
			//$('#container-forms').html('');
			//$('#container-forms').css('margin', '0');
			current_email=user.getBasicProfile().getEmail()
			$('#now_editor').html("<b>"+current_email+"<br>You are now an EDITOR!</b><br><br><br>");
			$("#now_editor").attr('email', current_email)
			$('#create_clip').show();
			$('#notPublishedList').show();
			$("#creator").attr('value', $('#now_editor').attr('email'));
    } else {
		alert("Stai utilizzando l'applicazione in modalità Browser!");
		$('#signin h1').html('Login');
		$('#sign-in-or-out-button').html('Login with Google');
		$('#revoke-access-button').css('display', 'none');
		$('#sign-in-or-out-button').html('Login with Google');
		$('#now_editor').html('');
		$('#create_clip').hide();
		$('#notPublishedList').hide();
    }
  }

  function updateSigninStatus(isSignedIn) {
    setSigninStatus();
  }