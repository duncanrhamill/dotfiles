(function(a){a.getBackgroundInterface=function(){var a=null;return function(l){null===a&&(l=l||{},l.source=window,l.direct=!0,a=Interfaces.createInstance(Interfaces.BackgroundInterface,l));return a}}()})(LPPlatform);
(function(a,m){a.getFavicon=function(b){b.callback&&b.callback(null)};a.once=function(b,a,c){if(b)var e=b(function(){e();a.apply(c,arguments)})};a.getBigIcons=function(b,a){var c=(a||"big")+"icons",e=opendb();createDataTable(e);if(e){var g=function(d,a){b(0<a.rows.length&&null!==a.rows.item(0).data?a.rows.item(0).data:"")};if(g_indexeddb){var h={rows:{item:function(d){return this[d]},length:0}};e.transaction("LastPassData","readonly").objectStore("LastPassData").openCursor(IDBKeyRange.only(db_prepend(g_username_hash)+
"_"+c)).onsuccess=function(d){(d=d.target.result)?(h.rows[h.rows.length]=d.value,h.rows.length++,d["continue"]()):g(null,h)}}else e.transaction(function(d){d.executeSql("SELECT * FROM LastPassData WHERE username_hash=? AND type=?",[db_prepend(g_username_hash),c],g,function(d,b){console_log(b)})})}};a.saveBigIcons=function(b,a){var c=(a||"big")+"icons",e=opendb();createDataTable(e);e&&(g_indexeddb?e.transaction("LastPassData","readwrite").objectStore("LastPassData").put({username_hash:db_prepend(g_username_hash),
type:c,data:b,usertype:db_prepend(g_username_hash)+"_"+c}):e.transaction(function(a){a.executeSql("REPLACE INTO LastPassData (username_hash, type, data) VALUES (?, ?, ?)",[db_prepend(g_username_hash),c,b],function(a,b){console_log("server.js : inserted")},function(a,b){console_log(b)})}))};a.updateBigIcons=function(){};var l=function(b,a){for(var c in b){var e=a[c];e&&(e.group=b[c])}};a.refreshGroupNames=function(a){a&&(l(a.sites,g_sites),l(a.notes,g_securenotes),l(a.applications,g_applications))};
a.useDialogWindows=function(){return Preferences.get("htmlindialog")};(function(){var b={},n=function(a,b){return function(){a.apply(this,arguments);b.apply(this,arguments)}};a.openTabDialog=function(c,e){var g={createAccountSimple:!0,siteTutorial:!0},h=c+(e?"-"+JSON.stringify(e):""),d=b[h];if(d)d.activate();else{var f={dialogWindow:a.useDialogWindows()&&!(e&&e.virtualKeyboard)},d={url:getchromeurl("tabDialog.html?dialog="+c),loadHandler:function(a){a.getTop().LPTabDialog.openDialog(c,e,f);b[h]=a},
closeHandler:function(){delete b[h]},tabId:e&&e.tabId?e.tabId:void 0};if(d.tabId)a.navigateTab(d);else if(f.dialogWindow&&!g[c]){var k=Preferences.get("dialogSizePrefs"),g=k[c];d.features={height:g?g.height:600,width:g?g.width:800,left:g?g.left:0,top:g?g.top:0};d.features.width>window.screen.availWidth&&(d.features.width=window.screen.availWidth,d.features.left=0);d.features.height>window.screen.availHeight&&(d.features.height=window.screen.availHeight,d.features.top=0);d.closeHandler=n(d.closeHandler,
function(a){k[c]={height:a.outerHeight,width:a.outerWidth,left:a.screenLeft||a.screenX,top:a.screenTop||a.screenY};Preferences.set("dialogSizePrefs",k);delete b[h]});a.openDialogWindow(d)}else if(g[c])a.openTab(d);else switch(Preferences.get("openpref")){case "tabs":a.openTab(d);break;case "windows":a.openWindow(d);break;case "same":a.openSame(d)}}}})();a.stringifyFeatures=function(a){var b=[],c;for(c in a)b.push(c+"="+a[c]);return b.join(",")};a.doAjax=function(a){LPServer.ajax(a)};a.ajax=function(b){isOffline()?
b.error&&b.error(null,null,"offline"):a.doAjax(b)};a.isEdge=function(){return is_edge()};a.copyDataIfEdge=function(b){return a.isEdge()&&"undefined"!==typeof b?JSON.parse(JSON.stringify(b)):b};a.setUserPreference=function(a){return function(b,c){a(b,c);g_userprefs_changed[b]=c}}(a.setUserPreference);a.setGlobalPreference=function(a){return function(b,c){a(b,c);g_gblprefs_changed[b]=c}}(a.setGlobalPreference);a.writePreferences=function(){lpWriteAllPrefs()};a.closePopovers=function(){};(function(){var b=
{},l={},c={},e={},g={};m.LPTabs={get:function(a){if(a["interface"]){var b=[],f;for(f in e)e[f].tabDetails.interfaceName===a["interface"]&&b.push(e[f]);return b}if("undefined"!==typeof a.tabID){if(b=e[a.tabID])return a.callback&&a.callback(b),b;a.callback&&((b=c[a.tabID])||(b=c[a.tabID]=[]),b.push(a.callback))}}};a.getUnavailablePreferences=function(){return{clearClipboardSecsVal:!can_clear_clipboard(),openpopoverHk:!1,pollServerVal:g_nopoll,storeLostOTP:"0"===g_prefoverrides.account_recovery,showvault:g_hidevault||
g_hideshowvault,homeHk:g_hidevault||g_hideshowvault,saveallHk:g_hidesaedhotkey,searchHk:g_hidesearch,usepopupfill:!g_offer_popupfill,recentUsedCount:g_hiderecentlyusedlistsize,searchNotes:g_hidenotes,idleLogoffVal:!(g_is_win||g_is_mac||g_is_linux),enablenamedpipes:lppassusernamehash||!(g_is_win||g_is_mac||g_is_linux)||is_chrome_portable(),enablenewlogin:!0}};a.initializeRequestFramework=function(a){var d=null,f={tabURL:a.tabURL,tabID:a.tabID,windowID:a.windowID},k=LPMessaging.getNewMessageSourceID(),
h=!1,p=a.frameIdentity,t=!1,r=function(b){try{var d=!t;return d?(b.frameID=k,a.sendContentScript(b)):d}catch(v){return!1}},m=function(a){return r({type:"backgroundResponse",data:a})},n=function(c){d=e[a.tabID];h=c.top;"undefined"!==typeof f.tabID&&(h&&(l[f.tabID]=k),c.frameIdentity&&(p=f.tabID+"-"+c.frameIdentity));r({type:"initialization",data:{tabID:f.tabID,frameID:k,topFrameID:l[f.tabID],request:c}});if(c.extendFrame){var q=g[p].frameID,v=b[q];b[q]=function(a){r(a);v(a)}}else b[k]=r;if(c.interfaceName&&
Interfaces.hasOwnProperty(c.interfaceName)){f.interfaceName||(f.interfaceName=c.interfaceName);var q=function(a){return LPMessaging.makeRequest(r,{type:"contentScriptRequest",sourceFrameID:0,data:a})},m=Interfaces.createInstance(Interfaces[c.interfaceName],{instance:c.extendFrame?g[p]["interface"]:null,direct:!1,context:a.context||"background",requestFunction:q});if(p){var n=g[p];n&&n.frameID!==k&&n.disconnect();g[p]={"interface":m,disconnect:u,frameID:k}}"number"!==typeof f.tabID&&!f.tabID||c.interfaceName!==
f.interfaceName||c.extendFrame||(d||(d=e[f.tabID]=new LPTab(f)),d.addFrame(m,{topWindow:h,frameID:k,contentScriptRequester:q,childFrameCount:c.childFrameCount}));a.callback&&a.callback(m)}},u=function(){if(!t){t=!0;delete b[k];delete g[p];var c=e[f.tabID];c&&(c.removeFrame(k),c.isEmpty()&&(delete e[f.tabID],delete l[f.tabID]));if(a.onDisconnect)a.onDisconnect()}};return{frameID:k,requestHandler:function(a){switch(a.type){case "backgroundRequest":LPMessaging.handleRequest(Interfaces.BackgroundInterface,
a.data,m,{additionalArguments:{tabURL:f.tabURL,tabID:f.tabID,windowID:f.windowID,frameID:k,top:h}});break;case "contentScriptRequest":case "contentScriptResponse":if(0===a.frameID)LPMessaging.handleResponse(a.data);else if(a.frameID){var e=b[a.frameID];e&&e(a)}break;case "initialize":n(a.data);break;case "disconnect":u();break;case "initialized":h&&c[f.tabID]&&(c[f.tabID].forEach(function(a){a(d)}),delete c[f.tabID])}},disconnectHandler:u}}})()})(LPPlatform,this);