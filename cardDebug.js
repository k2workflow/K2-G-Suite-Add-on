// Create card for debugging setting/getting Serial Number property on files in Drive
function createCardDebug(fileId, serialNumber){
  console.log("createCardDebug");
  
  // Create input to capture File Id
  var textFileId = CardService.newTextInput()
    .setFieldName('textFileId')
    .setTitle('File Id');
    if(fileId) {
      textFileId.setValue(fileId); 
    }
  
  // Create input to capture the Serial Number
  var textSerialNumber = CardService.newTextInput()
    .setFieldName('textSerialNumber')
    .setTitle('Serial Number');
    if(serialNumber) {
      textSerialNumber.setValue(serialNumber); 
    }

  // Create a button to set the Serial Number property (SN)
  var buttonSetSerialNumber = CardService.newTextButton()
    .setText("Set Serial Number")
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
    .setBackgroundColor('#1FA9F2')
    .setOnClickAction(CardService.newAction()
      .setFunctionName("onClickSetSerialNumber"));

  // Create a button to set the Serial Number property (SN)
  var buttonGetSerialNumber = CardService.newTextButton()
    .setText("Get Serial Number")
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
    .setBackgroundColor('#1FA9F2')
    .setOnClickAction(CardService.newAction()
      .setFunctionName("onClickGetSerialNumber"));

  var buttonSetSerialNumbers = CardService.newButtonSet()
    .addButton(buttonSetSerialNumber)
    .addButton(buttonGetSerialNumber);
  
  // Create the Card Section with our text box and buttons
  var sectionDebug = CardService.newCardSection()
    .addWidget(textFileId)
    .addWidget(textSerialNumber)
    .addWidget(buttonSetSerialNumbers);
      
  var card = CardService.newCardBuilder()
      .addSection(sectionDebug)
  return card.build();
}

function onClickSetSerialNumber(e) {
  console.log(e.formInput);
  var fileId = e.formInput.textFileId;
  var serialNumber = e.formInput.textSerialNumber;
  var property = {
    key: 'SN',
    value: serialNumber,
    visibility: 'PUBLIC'
  };
  Drive.Properties.insert(property, fileId);
}

function onClickGetSerialNumber(e) {
  console.log(e.formInput);
  var fileId = e.formInput.textFileId;
  var serialNumber = Drive.Properties.get(fileId,'SN',{'visibility':'PUBLIC'}).value; 
  console.log("File ID: " + fileId);
  console.log("Serial Number: " + serialNumber);
  return createCardDebug(fileId, serialNumber);

  // note: returning the card is not the most elegant way to do this as you will end up nesting cards. but it's only for debug so leave it for now.
}