//String Literals 
//Use of 'const' avoided due to concerns about Google ECMAScript 6 support which introduced const.

//Image Urls for Icons
// var urlK2LogoSettings = 'http://contentus.blob.core.windows.net/images/k2_logo_settings.png';
// var urlK2LogoSidebar = 'http://contentus.blob.core.windows.net/images/k2_logo_sidebar.png';
// var urlHeaderTask = 'http://contentus.blob.core.windows.net/images/header_task.png';
// var urlHeaderPerson = 'http://contentus.blob.core.windows.net/images/header_person.png';
// var urlworkflowAssignment = 'http://contentus.blob.core.windows.net/images/outline_assignment_black_48dp.png';
var urlK2LogoSettings = 'https://github.com/k2workflow/K2-G-Suite-Add-on/raw/master/images/k2_logo_settings.png';
var urlK2LogoSidebar = 'https://github.com/k2workflow/K2-G-Suite-Add-on/raw/master/images/k2_logo_sidebar.png';
var urlHeaderTask = 'https://github.com/k2workflow/K2-G-Suite-Add-on/raw/master/images/header_task.png';
var urlHeaderPerson = 'https://github.com/k2workflow/K2-G-Suite-Add-on/raw/master/images/header_person.png';
var urlworkflowAssignment = 'https://github.com/k2workflow/K2-G-Suite-Add-on/raw/master/images/outline_assignment_black_48dp.png';

//UI Style Values
var backgroundColor = '#1FA9F2';

//Card Literals
var titleWorkflow = 'Workflow';
var titleStartWorkflow = 'Start Workflow';

//Home Card
var actionTextGmail = 'Select or Open a K2 task notification email to begin.';
var actionTextDrive = 'Open a file to perform K2 actions or start a workflow for the selected item.';
var actionTextDefault = 'Open an email or file to perform K2 actions or start a workflow for the selected item.';
var textHomeWelcome = 'Welcome to K2 for G Suite.';

//Settings Card
var cardSettingsTitle = 'Settings';
var cardSettingsSubTitle = 'Configure Add-On for K2';

//Property Service Keys
var propertyK2Server = 'k2server';
var propertyAADTenant = 'aadTenant';
var propertyRefreshInterval = 'refreshInterval';
var propertyClientID = 'clientID';
var propertyClientSecret = 'clientSecret';

//Authentication
// TODO: Add your client id and client secret here
var oAuthClientID = '';
var oAuthClientSecret = '';

//Fetch Settings
var httpScheme = 'https://';
var httpMethods = {
    GET: 'get',
    POST: 'post'
}