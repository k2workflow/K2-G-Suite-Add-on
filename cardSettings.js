// TODO #6 (Google): enhance text boxes with suggestions cache, need to first get examples from Google for wiring up more than one text box

// Create Settings Card
function createCardSettings() {

  var textK2Server = CardService.newTextInput()
    .setFieldName('textK2Server')
    .setTitle('Tenant')
    .setValue(AddOnSettings.K2Server);
      
  // Create an input to capture AAD Tenant (required for External Users)
  var textAADTenant = CardService.newTextInput()
    .setFieldName('textAADTenant')
    .setTitle('AAD Domain (External Users)')
    .setValue(AddOnSettings.AADTenant);
  
  var textRefreshInterval = CardService.newTextInput()
    .setFieldName('textRefreshInterval')
    .setTitle('Refresh Interval')
    .setValue(AddOnSettings.RefreshInterval)
  

  var authButton = CardService.newTextButton();
  var authSection = CardService.newCardSection().setHeader("Authorization");    

  if (AddOnSettings.oAuthService.hasAccess())
  {
    authButton.setText("<font color=\"#1FA9F2\">SIGN OUT</font>")
      .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
      .setOnClickAction(CardService.newAction().setFunctionName("onClickSignOut"));
  }
  else
  {
    var authorizationUrl = AddOnSettings.oAuthService.getAuthorizationUrl(); 
    
    authButton.setText("<font color=\"#1FA9F2\">SIGN IN</font>")
      .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
      .setAuthorizationAction(CardService.newAuthorizationAction()
            .setAuthorizationUrl(authorizationUrl));
    
    var promptText = 
        'To show you information from K2 Cloud' +
        ' this add-on needs authorization' +
        ' to perform suchtasks as listing workflows, actioning tasks, starting a workflow.';

    authSection.addWidget(CardService.newTextParagraph().setText(promptText))         
  }

  authSection.addWidget(textAADTenant)
             .addWidget(CardService.newButtonSet().addButton(authButton));
  
  // Create the Card Section with our text box and buttons
  var sectionSettings = CardService.newCardSection()
    .setHeader('K2 Cloud')
    .addWidget(textK2Server)
    .addWidget(textRefreshInterval);

  var fixedFooter = CardService.newFixedFooter()
  .setPrimaryButton(CardService.newTextButton()
  .setText("save")
  .setOnClickAction(
      CardService.newAction()
          .setFunctionName("saveSettings"))
      )
  .setSecondaryButton(CardService.newTextButton()
  .setText("help")
  .setOpenLink(CardService.newOpenLink()
      .setUrl("https://help.k2.com/")));


  // Create the Card with our Sections
  var card = CardService.newCardBuilder().setName('Settings')
    .setHeader(CardService.newCardHeader()
      .setTitle(cardSettingsTitle)
      .setSubtitle(cardSettingsSubTitle)
      .setImageStyle(CardService.ImageStyle.SQUARE)
      .setImageUrl(urlK2LogoSidebar))
    .addSection(sectionSettings)
    .addSection(authSection)
    .setFixedFooter(fixedFooter)
    .build();

  return card;
}

function getSettings()
{
  var settings = {};
  
  //Setup K2 Server Setting Value
  if (PropertiesService.getUserProperties().getProperty(propertyK2Server) == null)
  {
    PropertiesService.getUserProperties().setProperty(propertyK2Server,'');
  }
  else
  {
    settings.K2Server = PropertiesService.getUserProperties().getProperty(propertyK2Server);
  }

  //Setup AAD Tenant Value
  if (PropertiesService.getUserProperties().getProperty(propertyAADTenant) == null)
  {
    PropertiesService.getUserProperties().setProperty(propertyAADTenant,'');
  }
  else
  {
    settings.AADTenant = PropertiesService.getUserProperties().getProperty(propertyAADTenant);
  }

  //Setup Refresh Interval
  if (PropertiesService.getUserProperties().getProperty(propertyRefreshInterval) == null)
  {
    PropertiesService.getUserProperties().setProperty(propertyRefreshInterval, 30);
  }
  else
  {
    settings.RefreshInterval = PropertiesService.getUserProperties().getProperty(propertyRefreshInterval);
  }

  return settings;

}

function saveSettings(e)
{
  console.log("AddOnSettings Before:" + AddOnSettings);
  AddOnSettings.K2Server = e.formInputs.textK2Server[0];
  AddOnSettings.AADTenant = e.formInputs.textAADTenant[0];
  AddOnSettings.RefreshInterval = e.formInputs.textRefreshInterval[0];
  console.log("AddOnSettings After:" + AddOnSettings);

  var userProperties = PropertiesService.getUserProperties();

  userProperties.setProperty(propertyK2Server, AddOnSettings.K2Server);
  userProperties.setProperty(propertyAADTenant, AddOnSettings.AADTenant);
  userProperties.setProperty(propertyRefreshInterval, AddOnSettings.RefreshInterval);
  
  console.log(e.formInputs);

  AddOnSettings.oAuthService = getOAuthService();

  return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
          .setText("Settings Updated")
          .setType(CardService.NotificationType.INFO))
      .build();     
}