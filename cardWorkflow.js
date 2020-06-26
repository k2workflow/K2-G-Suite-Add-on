// TODO (Remy): how do I select a dropdown value?

// Create Workflow Card
function createCardWorkflow(addViewFlow, procInstId) {
  
  console.log('K2 Server:' + AddOnSettings.K2Server);
 
  // Create the Card Section with our dropdown and button
  var section = CardService.newCardSection();
  var fixedFooter = CardService.newFixedFooter();
  var header = CardService.newCardHeader()
  .setImageStyle(CardService.ImageStyle.SQUARE)
  .setImageUrl(urlworkflowAssignment);  

  if (addViewFlow)
  {
    header.setTitle("Workflow Started");
    
    section.addWidget(CardService.newTextParagraph().setText("Your Process was started with ID: " + procInstId + "<br /><br />To get more details, click on the View Flow button below."));

    var openLink = CardService.newOpenLink()
    .setUrl(buildK2ViewflowURL(procInstId))
    .setOpenAs(CardService.OpenAs.OVERLAY);

    fixedFooter.setPrimaryButton(CardService.newTextButton()
    .setText("View Flow")
    .setOpenLink(openLink)   
    );
  }
  else
  {
    header.setTitle(titleWorkflow);

    section.addWidget(populateDropdownWorkflows());

    fixedFooter.setPrimaryButton(CardService.newTextButton()
    .setText("start")
    .setOnClickAction(
        CardService.newAction()
            .setFunctionName("onClickStartWorkflow"))
    );    
  }

  // Create the Card with our Sections
  var card = CardService.newCardBuilder()
    .setName(titleWorkflow)
    .setHeader(header)  
    .addSection(section)
    .setFixedFooter(fixedFooter)
    .build();
  
    return card;
}


function populateDropdownWorkflows() {
  
  var url = buildK2WorkflowsURL();
  var response = accessProtectedResource(url, httpMethods.GET);

  var json = JSON.parse(response.getContentText());
  var itemCount = json.itemCount;
  var workflows = json.workflows;
  console.log('Item count: ' + itemCount);

  var dropdownWorkflow = CardService.newSelectionInput()
    .setFieldName('dropdownWorkflow')
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setTitle(titleWorkflow);
    // .setOnChangeAction(CardService.newAction()
    //   .setFunctionName("onChangedDropdownWorkflow"));

  if (itemCount && itemCount > 0) {
    console.log('Workflows:');
      json.workflows.forEach(function(workflow) {
        console.log('%s (%s)', workflow.name, workflow.id);
        dropdownWorkflow.addItem(workflow.name, workflow.id, false);
      });
  } else {
    console.log('No workflows available to start.');
    dropdownWorkflow.addItem("<No workflows found>", "0", false);
  }
  // TODO: need to handle no workflows found better
  // do something with the 0 value - grey out the 'start button'
  // implement a 'get workflows' button or a 'refresh' button
  // implement a 'search'
  return dropdownWorkflow;
}

/* 

TODO: this is the selected Workflow ID and NOT the Process Instance ID. We need to build the card dynamically a few different times
1) get list of items. then in the 'start' workflow button, we need to read the global variable for the workflow you just selected (set that here)
2) we then need to light up the view flow butoton with some helper text that says success/failure and link to View Flow on success.
TODO: need to parse and handle the response should we manage the async nature? look for examples 

*/
function onClickStartWorkflow(e) {
  console.log('onClickStartWorkflow');
  var id = parseInt(e.formInput.dropdownWorkflow);
  console.log("Selected Workflow Id: " + id);
  
  console.log("K2 Server: " + AddOnSettings.K2Server);

  console.log('Access Token: ' + AddOnSettings.oAuthService.getAccessToken());
  var request = {
    "xmlFields": [],
    "itemReferences": {},
    "dataFields": {}
  };
  var url = buildK2StartWorkflowURL(id);
  var response = accessProtectedResource(url,httpMethods.POST,request);
  
  var procInstId = parseInt(JSON.parse(response.getContentText()));
  console.log(procInstId);
  
  var card = createCardWorkflow(true, procInstId);
  var nav = CardService.newNavigation().updateCard(card);

  return CardService.newActionResponseBuilder()
  .setNavigation(nav)
  .setNotification(CardService.newNotification()
      .setText("Workflow Started: " + procInstId)
      .setType(CardService.NotificationType.INFO))
  .build(); 
}

/**
 * A helper function for building dropdown widgets
 */
function buildDropdownWidget(key, title, items, selected) {

  var widget = CardService.newSelectionInput()
     .setType(CardService.SelectionInputType.DROPDOWN)
     .setTitle(title)
     .setFieldName(key)

  for(var i = 0; i < items.length; i++) {
    var itemSelected = selected === items[i].value
    widget.addItem(items[i].text, items[i].value, itemSelected)
  }

  return widget
}

// function onChangeddropdownWorkflow(e) {
//   var id = parseInt(e.formInput.dropdownWorkflows);
//   console.log("Selected Workflow Id: " + id);
//   var card = createCardWorkflow(true, id);
//   // TODO: this is the selected Workflow ID and NOT the Process Instance ID. We need to build the card dynamically a few different times
//   // 1) get list of items. then in the 'start' workflow button, we need to read the global variable for the workflow you just selected (set that here)
//   // 2) we then need to light up the view flow butoton with some helper text that says success/failure and link to View Flow on success.

//   return CardService.newActionResponseBuilder().setNavigation(CardService.newNavigation().updateCard(card)).build()
//   // A button that opens as a link in an overlay and
// // // requires a reload when closed.
// // var button = CardService.newTextButton()
// //   .setText("This button opens a link in an overlay window")
// //   .setOpenLink(CardService.newOpenLink()
// //   .setUrl("https://www.google.com")
// //   .setOpenAs(CardService.OpenAs.OVERLAY)
// //   .setOnClose(CardService.OnClose.RELOAD_ADD_ON));

// // // An action response that opens a link in full screen and
// // // requires no action when closed.
// // var actionResponse = CardService.newActionResponseBuilder()
// //   .setOpenLink(CardService.newOpenLink()
// //   .setUrl("https://www.google.com")
// //   .setOpenAs(CardService.OpenAs.FULL_SIZE)
// //   .setOnClose(CardService.OnClose.NOTHING))
// //   .build();
// }