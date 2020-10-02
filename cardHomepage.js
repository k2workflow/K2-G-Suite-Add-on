// Card Literals
var actionTextGmail = 'Select or Open a K2 task notification email to begin.';
var actionTextDrive = 'Open a file to perform K2 actions or start a workflow for the selected item.';
var actionTextDefault = 'Open an email or file to perform K2 actions or start a workflow for the selected item.';
var textHomeWelcome = 'Welcome to the K2 G Suite Add-on';
var urlK2LogoSettings = 'http://contentus.blob.core.windows.net/images/k2_logo_settings.png';

// Create Homepage card
function createCardHomepage(service) {  
    console.log("createCardHomepage");
  
  //var actionText = null;
  switch(service) {
    case 'gmail':
        var actionText = actionTextGmail;
        break;
    case 'drive':
        var actionText = actionTextDrive;
      break;
    default:
        var actionText = actionTextDefault;
  }
  // Mimic K2 Workspace mobile app login experience
  var imageK2Logo = CardService.newImage().setAltText('K2 Logo').setImageUrl(urlK2LogoSettings);

  var textParagraphWelcome = CardService.newTextParagraph()
    .setText('<b>' + textHomeWelcome + '</b><br><br>');
  var textParagraphAction = CardService.newTextParagraph()
    .setText(actionText);

  // Assemble the widgets and return the card.
  var sectionHomepage = CardService.newCardSection()
    .addWidget(imageK2Logo)
    .addWidget(textParagraphWelcome)
    .addWidget(textParagraphAction);
    
  var card = CardService.newCardBuilder()
    .setName('Home')
    .addSection(sectionHomepage)
  return card.build();
}