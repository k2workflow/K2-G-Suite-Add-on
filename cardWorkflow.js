// TODO #3 (Google): get examples from Google for selecting an item in a dropdown

// Card Literals
var titleWorkflow = 'Workflow';
var titleStartWorkflow = 'Start Workflow';
var urlWorkflowAssignment = 'http://contentus.blob.core.windows.net/images/outline_assignment_black_48dp.png';

// Create Workflow Card
function createCardWorkflow(addViewFlow, procInstId) {
  
  console.log('K2 Server:' + AddOnCache.K2Server);
  console.log('File Id:' + AddOnCache.SelectedItemId)

  // Create the Card Section with our dropdown and button
  var section = CardService.newCardSection();
  var fixedFooter = CardService.newFixedFooter();
  var header = CardService.newCardHeader()
  .setImageStyle(CardService.ImageStyle.SQUARE)
  .setImageUrl(urlWorkflowAssignment);  

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

// TODO #4: look at different ways to handle the list of available workflows including, no workflows, searching, validating data fields and item references and refreshing the list.

function populateDropdownWorkflows() {
  
  var url = buildK2WorkflowsURL();
  var response = accessProtectedResource(url, "GET");

  var json = JSON.parse(response.getContentText());
  var itemCount = json.itemCount;
  var workflows = json.workflows;
  console.log('Item count: ' + itemCount);

  var dropdownWorkflow = CardService.newSelectionInput()
    .setFieldName('dropdownWorkflow')
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setTitle(titleWorkflow);
    // .setOnChangeAction(CardService.newAction()
    // .setFunctionName("onChangedDropdownWorkflow"));

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
  return dropdownWorkflow;
}

//TODO #5: look at parsing and handling an async response when starting workflows

/* 
NOTE: this is the selected Workflow ID and NOT the Process Instance ID. We need to build the card dynamically a few different times
1) get list of items. then in the 'start' workflow button, we need to read the global variable for the workflow you just selected (set that here)
2) we then need to light up the view flow butoton with some helper text that says success/failure and link to View Flow on success.
*/
function onClickStartWorkflow(e) {
  console.log('onClickStartWorkflow');
  var id = parseInt(e.formInput.dropdownWorkflow);
  console.log("Selected Workflow Id: " + id);
  console.log('Selected Item Id: ' + AddOnCache.SelectedItemId)
  
  var fileId = AddOnCache.SelectedItemId;

  var request = {
    "xmlFields": [],
    "itemReferences": {},
    "dataFields": {"File Id":fileId}
  };
  var url = buildK2StartWorkflowURL(id);
  var response = accessProtectedResource(url, "POST",request);
  
  var procInstId = parseInt(JSON.parse(response.getContentText()));
  console.log(procInstId);
  
  var card = createCardWorkflow(true, procInstId);
  var nav = CardService.newNavigation().updateCard(card);

  return CardService.newActionResponseBuilder()
  .setNavigation(nav)
  // An example of using a Toast for notificaiton. This isn't needed in current implementation.
  //.setNotification(CardService.newNotification()
  //    .setText("Workflow Started: " + procInstId)
  //    .setType(CardService.NotificationType.INFO))
  .build(); 
}

/*
  A helper function for building dropdown widgets
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