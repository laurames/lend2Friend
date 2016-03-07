window.fbAsyncInit = function() {
  FB.init({
    appId      : '188943924806923',
    cookie     : true,  // enable cookies to allow the server to access
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.5' // use graph api version 2.5
  });

  // FB.getLoginStatus() checks the state of the
  // person visiting this page and can return one of three states.
  // They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  if(window.location.href === "http://lauramk.me/booklend/mybooks.html"){
    console.log("i am at http://lauramk.me/booklend/mybooks.html");
    checkCookie();
  }else{
    console.log("self executing ELSE");
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }
};

// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

/*
GLOBAL VARIABLES
*/
var globalcname;
var globalcvalue;

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
  console.log('statusChangeCallback');
  console.log(JSON.stringify(response));
  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  if (response.status === 'connected') {
    // Logged into your app and Facebook.
    console.log("i am connected");
    globalcname = response.authResponse.userID;
    globalcvalue = "status: " + response.status + ", accessToken: " + response.authResponse.accessToken + ", userId: " + response.authResponse.userID + ", signedRequest: " + response.authResponse.signedRequest;
    testAPI();
  } else if (response.status === 'not_authorized') {
    // The person is logged into Facebook, but not your app.
    console.log("not authorized");
  } else {
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    /*document.getElementById('status').innerHTML = 'Please log ' +
      'into Facebook.';*/
    console.log("not logged in");
    login();
  }
}

function login() {
  FB.login(function(response) {
   // Person is now logged in
   statusChangeCallback(response);
 }, {scope: 'public_profile,email'});
}

function logout() {
  FB.logout(function(response) {
   // Person is now logged out
   eraseCookie(globalcname);
   statusChangeCallback(response);
  });
}

// Here we run a very simple test of the Graph API after login is
/* successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me', function(response) {
    console.log('Successful login for: ' + response.name);
    globalcvalue = globalcvalue + ", name: " + response.name;
    setCookie(globalcname, globalcvalue, 1);
    console.log(document.cookie);
    console.log(getCookie(globalcname));
  });
}*/

/*
If inside app then use this:
*/
function testAPI() {
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me', function(response) {
    fbinfo = new Array();
    document.getElementById("profileImage").setAttribute("src", "http://graph.facebook.com/" + globalcname + "/picture?type=normal");
    console.log('Successful login for: ' + response.name);
    globalcvalue = globalcvalue + ", name: " + response.name;
    setCookie(globalcname, globalcvalue, 1);
    console.log(document.cookie);
    console.log(getCookie(globalcname));
  });
}

function setAllProfileData (arrayOfElements, arrayOfData){
  for(i=0; i < arrayOfElements.length; i++){
    for(y=0; y < arrayOfData.length; y++){
      document.getElementById([y]).setAttribute("src", "http://graph.facebook.com/" + globalcname + "/picture?type=normal");  
    }
  }
}
/*
COOKIE FUNCTIONS
*/
function setCookie(cname, cvalue, exdays){
  var d = new Date();
  console.log(d)
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1);
      if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
  }
  return "";
}

function eraseCookie(name) {
  setCookie(name,"",-1);
}
function eraseAllCookies(){
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++)
    eraseCookie(cookies[i].split("=")[0]);
}

function checkCookie() {
  var userId=getCookie(globalcname);
  if (userId!="") {
    alert("Welcome again " + userId);
  }else{
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }
}
