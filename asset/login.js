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
	var colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
					'#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
					'#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
					'#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
					'#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
					'#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
					'#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
					'#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
					'#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
					'#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF']; 
    if (isAuthorized) {
			alert("Stai utilizzando l'applicazione in modalità Editor!");
			$('#signin h1').html('Logout');
			$('#sign-in-or-out-button').html('<i class="fa fa-google pt-1"></i> Logout from Google');
			$('#revoke-access-button').css('display', 'inline-block');
			//$('#container-forms').html('');
			//$('#container-forms').css('margin', '0');
			current_email=user.getBasicProfile().getEmail()
			init_letter=current_email.charAt(0);
			randomColor = colorArray[Math.floor(Math.random() * colorArray.length)];
			$('#container-letter').css('background-color', randomColor);
			$('#user-letter').html(init_letter);
			$('#user-gmail').html(current_email);
			$("#user-gmail").attr('email', current_email);
			$('#user-mode').html("Editor");
			$('#create_clip').show();
			$('#notPublishedList').show();
			$("#creator").attr('value', current_email);
    } else {
			alert("Stai utilizzando l'applicazione in modalità Browser!");
			$('#signin h1').html('Login');
			$('#sign-in-or-out-button').html('<i class="fa fa-google pt-1"></i> Login with Google');
			$('#revoke-access-button').css('display', 'none');
			$('#sign-in-or-out-button').html('<i class="fa fa-google pt-1"></i> Login with Google');
			randomColor = colorArray[Math.floor(Math.random() * colorArray.length)];
			$('#container-letter').css('background-color', randomColor);
			$('#user-letter').html("B");
			$('#user-gmail').html('');
			$('#user-mode').html("Browser");
			$('#create_clip').hide();
			$('#notPublishedList').hide();
    }
  }

  function updateSigninStatus(isSignedIn) {
    setSigninStatus();
  }