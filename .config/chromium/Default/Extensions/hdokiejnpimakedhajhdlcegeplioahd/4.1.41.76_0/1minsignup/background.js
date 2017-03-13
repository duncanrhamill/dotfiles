(function(){function u(a){a.data&&a.data.forEach(function(b){var c=d.getTabPropertiesByAppId(b.appId);c.currentState!==g.done&&oneMinuteSignup.MessageService.sendLog(c.appId,c.type,"Script running not in done state");c.setState(g.running);c.setTimeout(v);c.appLoginUrl=b.appLoginUrl||b.url;c.appName=b.appName;c.url=b.url;c.username=b.username;c.activeScript=b.script;if(a.type===f.ResetRequestScript)c.type=h.request,c.activeTriggerScript=oneMinuteSignup.AppService.getTriggerScript(h.request,b.username);
else if(a.type===f.ResetScript){c.type=h.change;var l=oneMinuteSignup.AppService.generatePassword(b.passwordPolicy);console.log(b.url,l);c.newPassword=l;c.activeTriggerScript=oneMinuteSignup.AppService.getTriggerScript(h.change,l)}else a.type===f.LogoutScript&&(c.type=h.logout,c.activeTriggerScript=oneMinuteSignup.AppService.getTriggerScript(h.logout));console.log("App: "+c.appId+" Clear cookies");b.url?d.createTabOrNavigate(c,function(a){}):q({error:Error("No "+b.scriptType+"url found on "+b.appName)},
c)})}function w(a){a=d.getTabPropertiesByAppId(a.appId);oneMinuteSignup.ExtensionProxyService.focusTabById(a.tabId)}function x(a){a&&(a.currentState===g.done?oneMinuteSignup.MessageService.sendLog(a.appId,a.type,"Script done but got UseInfoNeeded"):(a.clearTimeout(),a.setState(g.suspended),oneMinuteSignup.MessageService.sendUserInfoNeeded(a.appId,a.type)))}function y(a){a&&(a.clearTimeout(),a.currentState===g.done?oneMinuteSignup.MessageService.sendLog(a.appId,a.type,"Script running already in done state"):
(a.currentState===g.suspended&&oneMinuteSignup.ExtensionProxyService.focusTabById(m),a.setState(g.done),d.closeTab(a),oneMinuteSignup.MessageService.sendDone(a.appId,a.type),a.type===h.change&&z(a.appName,a.appId,a.appLoginUrl,a.username,a.newPassword)))}function q(a,b){b&&(b.currentState===g.done?oneMinuteSignup.MessageService.sendLog(b.appId,b.type,"Script done but got Error"):(b.setState(g.done),d.closeTab(b),a&&a.error&&(a.error.message=JSON.stringify({exception:a.error.message,loginUrl:b.appLoginUrl,
appName:b.appName,appId:b.appId,scriptType:b.type,url:b.url})),oneMinuteSignup.MessageService.sendError(a||{},b.appId,b.url,b.type)))}function A(a){a=d.getTabPropertiesByAppId(a.appId);d.closeTab(a)}function B(a,b){r=b;d.createTab({url:a.url},function(a){p=a;d.focusTabById(a)})}function C(a){oneMinuteSignup.ExtensionProxyService.focusTabById(r);oneMinuteSignup.MessageService.sendOauthToken(a.token,a.state);d.closeTab({tabId:p})}function z(a,b,c,l,f){var d=get_default_group(c);a={url:c,formdata2:"",
group:d&&!g_nofolder_feature_enabled?d:"(none)",name:a,username:l,password:f,notes:"",orig_username:l,orig_password:f};if(!lploggedin)return null;c=punycode.URLToASCII(a.url);var g=a.formdata2,k=a.name,h=a.group,m=a.username;f=a.password;var q=a.orig_username,r=a.orig_password;l=null!=g&&0<g.length?!0:!1;d=issharedfolder(g_shares,h);if(!checkreadonly(d))return{error:gs("Sorry, this shared folder is read-only.")};var n=0==d?g_local_key:d.sharekey,e=createNewAcct(),t=lp_gettld_url(AES._utf8_encode(c));
e.genpw=!1;e.name=k;e.group=h;e.url=AES._utf8_encode(c);e.tld=t;e.unencryptedUsername=m;e.username=lpmenc(m,!0,n);e.password=lpmenc(f,!0,n);e.extra="";e.fav=0;e.autologin=0;e.never_autofill=0;e.pwprotect=0;e.aid="0";0!=d&&(e.sharefolderid=d.id,0==d.give&&(e.sharedfromaid=1));var p=h;d&&(p=h.substr(d.decsharename.length+1));e.fields=[];e.save_all=a.save_all?1:0;t=[];g=updateAndEncryptData(g,e.fields,t,e,n,{save_all:0,username:q,password:r,new_username:m,new_password:f,fromiframe:1});k="name="+en(lpenc(k,
n))+"&grouping="+en(lpenc(p,n))+"&data="+en(bin2hex(g))+"&extra="+en(lpenc("",n));k=k+"&extjs=1&localupdate=1"+(0==d?"":"&sharedfolderid="+en(d.id));e.newvalues=t;l?k+="&ref="+en(AES.url2hex(c)):(k=k+"&aid=0"+("&url="+en(AES.url2hex(c))),k=k+"&openid_url="+("&username="+en(crypto_btoa(e.username))),k+="&password="+en(crypto_btoa(e.password)),k+="&auto=1"+get_identity_param(),c=is_application(e),l=function(a,c){var d=a.responseXML.documentElement.getElementsByTagName("result")[0];d&&"added"===d.getAttribute("action")&&
(d=d.getAttribute("aid"),oneMinuteSignup.MessageService.sendSavedToVault(b,h,f,d))},lpMakeRequest(base_url+(c?"addapp.php":"show.php"),k,l,l,a))}function v(a){a.setState(g.done);d.closeTab(a);var b=Error("Script timeout"),b={error:{name:b.name,stack:b.stack,message:JSON.stringify({exception:"Script timeout",loginUrl:a.appLoginUrl,appName:a.appName,appId:a.appId,scriptType:a.type,url:a.url})},type:oneMinuteSignup.MessageType.Error,appId:"",scriptType:""};oneMinuteSignup.MessageService.sendError(b,
a.appId,a.url,a.type)}var f=oneMinuteSignup.MessageType,g=oneMinuteSignup.ScriptState,h=oneMinuteSignup.ScriptType,d=new oneMinuteSignup.TabService,m=null,p=null,r=null;oneMinuteSignup.ExtensionProxyService.onMessage(function(a,b,c){var g=d.getTabPropertiesByTabId(b);switch(a.type){case f.ResetRequestScript:case f.ResetScript:case f.LogoutScript:m=b;oneMinuteSignup.MessageService.tabId=b;u(a);c();break;case f.Done:console.log("DONE APP",g,b);y(g);c();break;case f.Error:q(a,g);c();break;case f.NavigateToTab:w(a);
c();break;case f.UserInformationNeeded:x(g);c();break;case f.GetToken:m=b;oneMinuteSignup.MessageService.tabId=b;oneMinuteSignup.MessageService.sendToken();c();break;case f.LaunchApplication:oneMinuteSignup.ExtensionProxyService.createTab(a.data.url,!0,function(){});c();break;case f.CloseTab:A(a);c();break;case f.GetOauthToken:m=b;oneMinuteSignup.MessageService.tabId=b;B(a,b);c();break;case f.ReceivedOauthToken:C(a),c()}});oneMinuteSignup.ExtensionProxyService.onUpdateTab(function(a,b){var c=d.getTabPropertiesByTabId(a);
c&&(console.log("App: "+c.appId+" Change url",b),c.currentState!==oneMinuteSignup.ScriptState.done&&(console.log("App: "+c.appId+" Execute script"),oneMinuteSignup.ExtensionProxyService.executeScriptWithFrameWork(c)))})})();