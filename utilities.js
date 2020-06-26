function isNullorEmpty(value)
{
    console.log("Is Null or Empty");
    
    if (value == null)
    {
        console.log("Value was null.");
        return true;
    }

    if (value == 'undefined')
    {
        console.log("Value was undefined.");
        return true;
    }

    if (value == '')
    {
        console.log("Value was empty.");
        return true;
    }

    return false;
}

function HttpClientGet(url, enableExceptions){
    return UrlFetchApp.fetch(url, {
        method: 'get',
        headers: {
            Authorization: 'Bearer ' + AddOnSettings.oAuthService.getAccessToken()
        },
        muteHttpExceptions: enableExceptions
    });
}

function HttpClientPost(url,payload,enableExceptions){
   return UrlFetchApp.fetch(url, {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify(payload),
        headers: {
            Authorization: 'Bearer ' + AddOnSettings.oAuthService.getAccessToken()
        },
        muteHttpExceptions: enableExceptions
    });
}

function buildK2TaskActionURL(serialNumber, customAction){
    return httpScheme + AddOnSettings.K2Server + '/Api/Workflow/V1/tasks/' + serialNumber + '/actions/' + customAction;
}

function buildK2TaskActionsURL(serialNumber){
    return httpScheme + AddOnSettings.K2Server + '/Api/Workflow/V1/tasks/' + serialNumber + '/actions';
}

function buildK2WorkflowsURL(){
    return httpScheme + AddOnSettings.K2Server + '/Api/Workflow/V1/workflows?type=startable';
}

function buildK2StartWorkflowURL(procId){
    return httpScheme + AddOnSettings.K2Server + '/Api/Workflow/V1/workflows/' + procId;
}

function buildK2ViewflowURL(procInstId){
    return httpScheme + AddOnSettings.K2Server + '/Designer/K2Workflow/Viewflow.aspx?procInstId=' + procInstId;
}

function buildK2FormUrl(serialNumber){
    return httpScheme + AddOnSettings.K2Server + '/Runtime/Runtime/Form/com.K2.System.Workflow.Form.BasicTask/?SN=' + serialNumber + '&_title=&_url=&_embed=';
}



