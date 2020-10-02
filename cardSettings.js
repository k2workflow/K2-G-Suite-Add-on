// TODO #6 (Google): enhance text boxes with suggestions cache, need to first get examples from Google for wiring up more than one text box

// Card Literals
var cardSettingsTitle = 'Settings';
var cardSettingsSubTitle = 'Configure Add-On for K2';
var urlK2LogoSidebar = 'http://contentus.blob.core.windows.net/images/k2_logo_sidebar.png';

// Create Settings Card
function createCardSettings() {

  var textK2Server = CardService.newTextInput()
    .setFieldName('textK2Server')
    .setTitle('Tenant')
    .setValue(AddOnCache.K2Server);
      
  // Create an input to capture AAD Tenant (required for External Users)
  var textAADTenant = CardService.newTextInput()
    .setFieldName('textAADTenant')
    .setTitle('AAD Domain (External Users)')
    .setValue(AddOnCache.AADTenant);
  
  var textRefreshInterval = CardService.newTextInput()
    .setFieldName('textRefreshInterval')
    .setTitle('Refresh Interval')
    .setValue(AddOnCache.RefreshInterval)
  

  var authButton = CardService.newTextButton();
  var authSection = CardService.newCardSection().setHeader("Authorization");    

  if (AddOnCache.oAuthService.hasAccess())
  {
    authButton.setText("<font color=\"#1FA9F2\">SIGN OUT</font>")
      .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
      .setOnClickAction(CardService.newAction().setFunctionName("onClickSignOut"));
  }
  else
  {
    var authorizationUrl = AddOnCache.oAuthService.getAuthorizationUrl(); 
    
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
          .setFunctionName("saveSettingsToCache"))
      )
  .setSecondaryButton(CardService.newTextButton()
  .setText("help")
  .setOpenLink(CardService.newOpenLink()
      .setUrl("https://github.com/k2workflow/K2-G-Suite-Add-on")));


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