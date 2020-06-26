// TODO: need to manage moving to Task card as well
// TODO: need to manage getting Authorization on different cards if we don't have it
// TODO: need to implement global menus for Authorize / Logout

//Global Settings
var AddOnSettings = getSettings();
AddOnSettings.oAuthService = getOAuthService();


/**
 * Callbacks for rendering the homepage and trigger card.
 * @return {CardService.Card} The card to show to the user.
 */
function onHomepage() {
    return createCardHomepage();
}

function onSettings() {
  return createCardSettings();
}

function onDebug(e) {
  var fileId = null;
  var serialNumber = null;
  // Selected File
  try {
    fileId = e.drive.activeCursorItem.id;
  }
  catch(e) {
    fileId = null;
  }
   // Serial Number
   if(fileId){
    try {
      serialNumber = Drive.Properties.get(fileId,'SN',{'visibility':'PUBLIC'}).value; 
    }
    catch(e) {
      serialNumber = null;
     }
   }
   console.log("File Id: " + fileId);
   console.log("Serial Number: " + serialNumber);
   return createCardDebug(fileId, serialNumber);
  }

// TODO (SCOTT): we need to get the 'selected item' to the workflow card, but don't want to mess up the logic for reloading

function onDriveItemSelected(e) {
  // Get File.Id from the event arguments
  var fileId = e.drive.activeCursorItem.id;
  // TODO: try/catch/if/else can be more elegant/efficient
  // Permission Required: https://www.googleapis.com/auth/drive.metadata.readonly
  try {
    var serialNumber = Drive.Properties.get(fileId,'SN',{'visibility':'PUBLIC'}).value; 
    if(serialNumber)
    {
      console.log("Serial Number (" + serialNumber + ") found. Show Task Card.");
      return createCardTask(serialNumber);
    }
    else
    {
      console.log("No Serial Number found. Show Workflow Card.");
      // TODO: need to update CardWorkflow details
      return createCardWorkflow();
    }
  }
  catch(e) {
    console.log("No Serial Number found. Show Workflow Card.");
    return createCardWorkflow();
   }
}


/**
 * Callback for rendering the card for a specific Gmail message.
 * @param {Object} e The event object, documented {@link
 *     https://developers.google.com/gmail/add-ons/concepts/actions#action_event_objects
 *     here}.
 * @return {CardService.Card} The card to show to the user.
 */
function onGmailMessageSelected(e) {
  // Get the ID of the message the user has open.
  var messageId = e.messageMetadata.messageId;

  // Get an access token scoped to the current message and use it for GmailApp calls.
  var accessToken = e.messageMetadata.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);

  // Look for a K2 Serial Number in the message body
  var message = GmailApp.getMessageById(messageId);
  var body = message.getBody();
  var serialNumber = findSerialNumber(body);
  if(serialNumber) {
    console.log("Serial Number (" + serialNumber + ") found. Show Task Card.");
    return createCardTask(serialNumber);
  }
  else {
    // TODO: need to create more dynamic createCardWorkflow to handle messageId (gmail) and fileId (drive)
    console.log("No Serial Number found. Show Workflow Card.");
    return createCardWorkflow();
  }
}

// Regex to find Serial Number in email body
function findSerialNumber(text) {
  console.log(text);
  const serialNumberRegex = /(SN=)(\d+_\d+)/;
  var match = serialNumberRegex.exec(text);
  if (match === null || match.length !== 3) return null;
  console.log(match[2]);
  return match[2];
}

// Regex to return just the Process Instance ID from the Serial Number
function findProcessInstId(text) {
  console.log('findProcessInstId string: ' + text);
  const processInstIdRegex = /[^_]*/;
  var match = processInstIdRegex.exec(text);
  if (match === null || match.length !== 1) return null;
  console.log('matches: ' + match);
  return match;
}