// Setup user cache used to use for global variables
var propertyK2Server = 'k2server';
var propertyAADTenant = 'aadTenant';
var propertyRefreshInterval = 'refreshInterval';
var propertySelectedItemType = 'selectedItemType';
var propertySelectedItemId = 'selectedItemId';
var propertySerialNumber = 'serialNumber';
var AddOnCache = getCache();
AddOnCache.oAuthService = getOAuthService();

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
      Drive.Properties.pa
    }
    catch(e) {
      serialNumber = null;
     }
   }
   console.log("File Id: " + fileId);
   console.log("Serial Number: " + serialNumber);
   return createCardDebug(fileId, serialNumber);
  }

function onDriveItemSelected(e) {
  // Get File.Id from the event arguments
  var fileId = e.drive.activeCursorItem.id;
  console.log("Selected Item - Type: Drive; Id: " + fileId);
  saveSelectedItemToCache("Drive", fileId);
  
  // TODO #8: implement more elegant solution for try/catch/if/else
  // Permission Required: https://www.googleapis.com/auth/drive.metadata.readonly
  // Look for K2 serial number in file properties
  try {
    var serialNumber = Drive.Properties.get(fileId,'SN',{'visibility':'PUBLIC'}).value; 
    console.log("Serial Number: " + serialNumber);
    saveSerialNumberToCache(serialNumber);
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
  console.log("Selected Item - Type: Gmail; Id: " + messageId);
  saveSelectedItemToCache("Gmail", messageId);

  // Get an access token scoped to the current message and use it for GmailApp calls.
  var accessToken = e.messageMetadata.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);

  // TODO #8: implement more elegant solution for try/catch/if/else
  // Look for a K2 Serial Number in the message body
  try {
    var message = GmailApp.getMessageById(messageId);
    var body = message.getBody();
    var serialNumber = findSerialNumber(body);
    console.log("Serial Number: " + serialNumber);
    saveSerialNumberToCache(serialNumber);

    if(serialNumber) {
      console.log("Serial Number (" + serialNumber + ") found. Show Task Card.");
      return createCardTask(serialNumber);
    }
    else {
      // TODO #7: create a more dynamic createCardWorkflow to handle messageId (gmail) and fileId (drive)
      console.log("No Serial Number found. Show Workflow Card.");
      return createCardWorkflow();
    }
  }
  catch(e) {
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

function getCache()
{
  var cache = {};
  
  //Setup K2 Server
  if (PropertiesService.getUserProperties().getProperty(propertyK2Server) == null)
  {
    PropertiesService.getUserProperties().setProperty(propertyK2Server,'');
  }
  else
  {
    cache.K2Server = PropertiesService.getUserProperties().getProperty(propertyK2Server);
  }

  //Setup AAD Tenant
  if (PropertiesService.getUserProperties().getProperty(propertyAADTenant) == null)
  {
    PropertiesService.getUserProperties().setProperty(propertyAADTenant,'');
  }
  else
  {
    cache.AADTenant = PropertiesService.getUserProperties().getProperty(propertyAADTenant);
  }

  //Setup Refresh Interval
  if (PropertiesService.getUserProperties().getProperty(propertyRefreshInterval) == null)
  {
    PropertiesService.getUserProperties().setProperty(propertyRefreshInterval, 30);
  }
  else
  {
    cache.RefreshInterval = PropertiesService.getUserProperties().getProperty(propertyRefreshInterval);
  }

  //Setup Selected Item Type
  if (PropertiesService.getUserProperties().getProperty(propertySelectedItemType) == null)
  {
    PropertiesService.getUserProperties().setProperty(propertySelectedItemType, '');
  }
  else
  {
    cache.SelectedItemType = PropertiesService.getUserProperties().getProperty(propertySelectedItemType);
  }
  
  //Setup Selected Item Id
  if (PropertiesService.getUserProperties().getProperty(propertySelectedItemId) == null)
  {
    PropertiesService.getUserProperties().setProperty(propertySelectedItemId, '');
  }
  else
  {
    cache.SelectedItemId = PropertiesService.getUserProperties().getProperty(propertySelectedItemId);
  }

  //Setup Serial Number
  if (PropertiesService.getUserProperties().getProperty(propertySerialNumber) == null)
  {
    PropertiesService.getUserProperties().setProperty(propertySerialNumber, '');
  }
  else
  {
    cache.SerialNumber = PropertiesService.getUserProperties().getProperty(propertySerialNumber);
  }

  return cache;

}

function saveSerialNumberToCache(serialNumber)
{
  console.log("AddOnCache Before:" + AddOnCache.SerialNumber);
  AddOnCache.SerialNumber = serialNumber;
  console.log("AddOnCache After:" + AddOnCache.SerialNumber);

  var userProperties = PropertiesService.getUserProperties();

  userProperties.setProperty(propertySerialNumber, AddOnCache.SerialNumber);
}

function saveSelectedItemToCache(selectedItemType, selectedItemId)
{
  console.log("AddOnCache Before:" + AddOnCache.SelectedItemType + ',' + AddOnCache.SelectedItemId);
  AddOnCache.SelectedItemType = selectedItemType;
  AddOnCache.SelectedItemId = selectedItemId;
  console.log("AddOnCache After:" + AddOnCache.SelectedItemType + ',' + AddOnCache.SelectedItemId);

  var userProperties = PropertiesService.getUserProperties();

  userProperties.setProperty(propertySelectedItemType, AddOnCache.SelectedItemType);
  userProperties.setProperty(propertySelectedItemId, AddOnCache.SelectedItemId);
}

function saveSettingsToCache(e)
{
  console.log("AddOnCache Before:" + AddOnCache);
  AddOnCache.K2Server = e.formInputs.textK2Server[0];
  AddOnCache.AADTenant = e.formInputs.textAADTenant[0];
  AddOnCache.RefreshInterval = e.formInputs.textRefreshInterval[0];
  console.log("AddOnCache After:" + AddOnCache);

  var userProperties = PropertiesService.getUserProperties();

  userProperties.setProperty(propertyK2Server, AddOnCache.K2Server);
  userProperties.setProperty(propertyAADTenant, AddOnCache.AADTenant);
  userProperties.setProperty(propertyRefreshInterval, AddOnCache.RefreshInterval);
  
  console.log(e.formInputs);

  AddOnCache.oAuthService = getOAuthService();

  return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
          .setText("Settings Updated")
          .setType(CardService.NotificationType.INFO))
      .build();     
}