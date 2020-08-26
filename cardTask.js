// Create Task Card
function createCardTask(serialNumber) {
  console.log("Create Task Card");
  var viewflowURL = buildK2ViewflowURL(findProcessInstId(serialNumber));
  var formURL = buildK2FormUrl(serialNumber);

  var buttonViewFlow = CardService.newTextButton()
      .setText("<font color=\"#1FA9F2\">View Workflow</font>")
      .setOpenLink(CardService.newOpenLink().setUrl(viewflowURL));
  
  var buttonOpenForm = CardService.newTextButton()
      .setText("<font color=\"#1FA9F2\">Open Form</font>")
      .setOpenLink(CardService.newOpenLink().setUrl(formURL));
  
  var buttonSetViewFlow = CardService.newButtonSet().addButton(buttonViewFlow);
  var buttonSetOpenForm = CardService.newButtonSet().addButton(buttonOpenForm);
  var sectionLinks = CardService.newCardSection().addWidget(CardService.newTextParagraph().setText('Links'))
      .addWidget(buttonSetViewFlow)
      .addWidget(buttonSetOpenForm);
  
  var card = CardService.newCardBuilder().setName(serialNumber)
    .setHeader(CardService.newCardHeader()
      .setTitle('Task')
      .setImageStyle(CardService.ImageStyle.SQUARE)
      .setImageUrl(urlHeaderTask))
      .addSection(populateButtonTasks(serialNumber))
      .addSection(sectionLinks);
  return card.build();
}

function populateButtonTasks(serialNumber) {
  console.log("populateButtonTasks");
  var url = buildK2TaskActionsURL(serialNumber);
  console.log ("Actions URL: " + url);
  try
  {
    var response = accessProtectedResource(url,httpMethods.GET);
    var json = JSON.parse(response.getContentText());
    var actionCount = json.batchableActions.length;
    console.log ("JSON Response Actions: " + json);
  }
  catch(e)
  {
    // NOTE: The error usually in retrieving tasks, which is correct so simply set tasks to 0 to show the standard 'no tasks' card
    //  "Message": "Task could not be retrieved. Either access denied or not found."
    actionCount = 0;
    console.log(e);
  }
  console.log(actionCount);

  if (actionCount && actionCount > 0) {
    console.log('Actions:');
    var sectionActions = CardService.newCardSection().addWidget(CardService.newTextParagraph().setText('Actions'))

    json.batchableActions.forEach(function(action) {
      console.log('%s (%s)', action, serialNumber);
        var buttonAction = CardService.newTextButton()
            .setText(action)
            .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
            .setBackgroundColor('#1FA9F2')
            .setOnClickAction(CardService.newAction()
                .setFunctionName('onTaskAction')
                .setParameters({customAction: action, serialNumber: serialNumber}));
                var buttonSet = CardService.newButtonSet()
                    .addButton(buttonAction);
        sectionActions.addWidget(buttonSet);
    })
  } else {
    var sectionActions = CardService.newCardSection().addWidget(CardService.newTextParagraph().setText('No Actions available.'))
    console.log('No Actions available.');
  }
  return sectionActions;    
}

function actionK2Task(customAction, serialNumber) {
  console.log('Function: ActionK2Task - Serial Number: ' + serialNumber + ' Custom Action: ' + customAction);

  var request = {
      "xmlFields": [],
      "itemReferences": {},
      "dataFields": {}
    };
  
  var url = buildK2TaskActionURL(serialNumber, customAction);
  var response = accessProtectedResource(url,httpMethods.POST, request);

  return createCardTask(serialNumber);
}
  
function onTaskAction(e)
{
    console.log('onTaskAction');
    console.log('Custom Action: ' + e.parameters.customAction);
    console.log('Serial Number: ' + e.parameters.serialNumber);
    console.log('Process Inst Id: ' + findProcessInstId(e.parameters.serialNumber));
  return actionK2Task(e.parameters.customAction,e.parameters.serialNumber);
}