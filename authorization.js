// Authorization functions were based on the guidance from the Google documentation https://developers.google.com/gsuite/add-ons/how-tos/non-google-services

function getOAuthService() {
    // Create a new service with the given name. The name will be used when persisting the authorized token, 
    // so ensure it is unique within the scope of the property store.
    // Reference Article: https://developers.google.com/gsuite/add-ons/how-tos/non-google-services
    // Reference Repository: https://github.com/gsuitedevs/apps-script-oauth2
    var loginHint = Session.getActiveUser().getEmail();
    console.log("Active User Email: " + loginHint);
  
    // Azure B2C requires us to pass the AAD Tenant Domain in in the URLs. Otherwise we can just use common.
    console.log('AAD Tenant: ' + AddOnSettings.AADTenant);
    var authorizationUrl = 'https://login.microsoftonline.com/' + AddOnSettings.AADTenant + '/oauth2/authorize?resource=https://api.k2.com/';
    var tokenUrl = 'https://login.microsoftonline.com/' + AddOnSettings.AADTenant + '/oauth2/token';
   
    console.log("Authorization URL: " + authorizationUrl);
    console.log("Token URL: " + tokenUrl);

    return OAuth2.createService('K2')
      // Set the endpoint URLs
      .setAuthorizationBaseUrl(authorizationUrl)
      .setTokenUrl(tokenUrl)
  
      // Set the client ID and secret, from Azure multi-tenant app "K2 G Suite Add-on"
      // Redirect URI: https://script.google.com/macros/d/1mFk0pv9pbKjhO_Ue2zbxT_0dR-S8O4J9rizLebVK97ERIPzGW5lWVwaX/usercallback
      // Format: https://script.google.com/macros/d/{SCRIPT ID}/usercallback
      .setClientId(oAuthClientID)
      .setClientSecret(oAuthClientSecret)
  
      // Set the name of the callback function in the script referenced above that should be invoked to complete the OAuth flow.
      .setCallbackFunction('authCallback')
  
      // Set the property store where authorized tokens should be persisted.
      .setCache(CacheService.getUserCache())
      .setPropertyStore(PropertiesService.getUserProperties())
  
      // Set the scopes to request, not necessary for Azure as we use the ?resource parameter on the Authorization request
      //.setScope('https://api.k2.com/')
  
      // Sets the login hint, which will prevent the account chooser screen from being shown to users logged in with multiple accounts.
      //.setParam('login_hint', loginHint)
  
      // Requests offline access.
      .setParam('access_type', 'offline');
  
      // Forces the approval prompt every time. This is useful for testing, but not desirable in a production application.
      // .setParam('approval_prompt', 'force');
  }

// Google OAuth flow will invoke this function which is used to store the Authorization in the current user session 
function authCallback(callbackRequest) {
    console.info('authCallback');
    var isAuthorized = AddOnSettings.oAuthService.handleCallback(callbackRequest);
    console.log('isAuthorized: ' + isAuthorized);
    if (isAuthorized) {
      return HtmlService.createHtmlOutput('Success! You can close this tab. <script>setTimeout(function() { top.window.close() }, 1);</script>');
    } else {
      return HtmlService.createHtmlOutput('Denied. You can close this tab');
    }
  }

// Clear the current user's OAuth token
function onClickSignOut(e) {
  AddOnSettings.oAuthService.reset();

  var nav = CardService.newNavigation().popToRoot();
  return CardService.newActionResponseBuilder()
      .setNavigation(nav)
      .build();
}

// Helper function to that will invoke Google's OAuth flow if we don't have a valid user token
function accessProtectedResource(url, method, request) {
  var maybeAuthorized = AddOnSettings.oAuthService.hasAccess();
  if (maybeAuthorized) {
    switch(method) {
      case httpMethods.GET:
        var resp = HttpClientGet(url, true);
        break;
      case httpMethods.POST:
        var resp = HttpClientPost(url, request, true)
        break;
      default:
        throw ("Unsupported Http Verb: " + method);
    }
   
    var code = resp.getResponseCode();
    if (code >= 200 && code < 300) {
      return resp; // Success
    } else if (code == 401 || code == 403) {
        // Not fully authorized for this action.
        maybeAuthorized = false;
    } else {
        // Handle other response codes by logging them and throwing an
        // exception.
        console.error("Backend server error (%s): %s", code.toString(),
                      resp.getContentText("utf-8"));
        throw ("Backend server error: " + code);
    }
  }

  if (!maybeAuthorized) {
    CardService.newAuthorizationException()
    .setAuthorizationUrl(AddOnSettings.oAuthService.getAuthorizationUrl())
    .setResourceDisplayName("Display name to show to the user")
    .setCustomUiCallback('createCardSettings')
    .throwException();
  }
}