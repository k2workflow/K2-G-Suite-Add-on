// TODO (design): update the welcome page with nicer text/

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
    //.setImageUrl(urlHeaderPerson);
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