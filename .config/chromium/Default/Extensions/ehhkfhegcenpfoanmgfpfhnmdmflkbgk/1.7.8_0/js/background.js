//console.profile();
//setTimeout(function ( ){ console.profileEnd(); }, 10000)
var g_update_time = Math.max(+new Date, 1480599068000);
var homeTabId;
var return_to_home_hook;
var apps;
var stored = localStorage;
var ordered = [];
var isMac =  /mac/i.test(navigator.userAgent);

var custom_apps = {};
try {  // id -> bool (enabled state)
  if (stored.custom_apps) custom_apps = JSON.parse(stored.custom_apps);
} catch (e) {
  logError(new Error("ERROR: stored custom_apps has invalid JSON: "));
  console.log('ERROR: stored custom_apps has invalid JSON: ' + stored.custom_apps);
  // throw new Error('...');
}

var user_apps = {};
try {  // id -> bool (enabled state)
  if (stored.user_apps) user_apps = JSON.parse(stored.user_apps);
} catch (e) {
  logError(new Error('ERROR: stored user_apps has invalid JSON: '));
  console.log('ERROR: stored user_apps has invalid JSON: ' + stored.user_apps);
  // throw new Error('...');
}

if (null == stored.user_app_id_inc) stored.user_app_id_inc = 0;
if (null == stored.user_app_ids) stored.user_app_ids = '';

function save_options() {
  try {
    stored.settings = JSON.stringify(settings);
  } catch(e) {
    /// TODO: log error
    // throw new Error('...');
  } 
}

// stored.user_app_ids list of user app IDs
// stored.user_app_id_inc auto increment index
// stored.user_app_<ID> => { ... }

localStorage.install_time || (localStorage.install_time = g_update_time);

function return_to_home() {

  if (!return_to_home_hook) {
     chrome.tabs.update(homeTabId, {active: true});
     return;
  }
  chrome.tabs.captureVisibleTab(null, {
    //format: "jpeg"
    //,quality: 100
  }, function(dataUrl) {
    /*
    console.log(dataUrl.length);
    var img = document.createElement("img");
    img.src = dataUrl;
    document.body.appendChild(img);
    */
    return_to_home_hook(dataUrl, function(){
      chrome.tabs.update(homeTabId, {active: true});
    });
  });
}

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    if (request.name == "get-home-tab-id") {
      sendResponse(homeTabId);
    } else if (request.name == "return-to-home") {
      return_to_home();
    }
  });




// INSTALL & ENABLE

function remove_custom_app() {

}

chrome.management.onInstalled.addListener(function(app) {
  ///stored.icons_order += "," + app.id;

  if (!app.isApp) return;

  apps[app.id] = app;

  // all views should update the UI
  chrome.extension.sendMessage({ name: "add_new_app", id: app.id });

  // active view should scroll to show the newly installed app
  chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {name: "go_last_page"})
  });
});

chrome.management.onEnabled.addListener(function(app) {
  if (app.isApp)
    stored.icons_order += "," + app.id;
});


// UNINSTALL & DISABLE
function removeAppFromIcons(id) {
  var ordered = stored.icons_order.split(',');
  for (var i = 0; i < ordered.length; i++)
    if (ordered[i] == id)
      ordered.splice(i, 1);
  stored.icons_order = ordered.join(',');
  if (id.indexOf('user_app') == 0)
    remove_user_app(id);
}

function onUninstalled(id) {
  removeAppFromIcons(id);
  if (custom_apps[id]) {
    apps[id].enabled = false;
    custom_apps[id] = false;
    stored.custom_apps = JSON.stringify(custom_apps);
  }
}

function onDisabled(id) {
  removeAppFromIcons(id);
  apps[id].enabled = false;
}

// callded in main.js because of custom apps
///chrome.management.onUninstalled.addListener(onUninstalled);

chrome.management.onDisabled.addListener(function(app) {
  if (app.isApp) onDisabled(app.id);
});

var settings = default_settings;
try {  // default.js
  if (stored.settings) settings = JSON.parse(stored.settings);
  settings.notifications = settings.notifications || {};
} catch (e) {
  logError(new Error('ERROR: stored settings has invalid JSON: '));
  console.log('ERROR: stored settings has invalid JSON: ' + stored.settings);
  // throw new Error('...');
}

/* temporary fix for old settings */

if (settings.fetch_interval < 5) {
  settings.fetch_interval = 5;
  save_options();
}

if ("undefined" != typeof settings.showClear) {
  settings = default_settings;
}

try { 
  stored.settings = JSON.stringify(settings); 
} catch (e) {
  //throw new Error('problem with stringify settings');
}


var FETCH_INTERVAL = settings.fetch_interval ? settings.fetch_interval*MINUTES : 5*MINUTES;
var ITEM_SEPARATOR = "\\c";
var FIELD_SEPARATOR = "\\a";
var MAX_NOTIFICATIONS = 10; // shown / stored

var ICONS = {
  'tweet':      'icons/twitter.png',/// TODO remove later
  'twitter':    'icons/twitter.png',
  'mail':       'icons/mail.png',
  'gmail':      'icons/gmail.png',
  'yahoo-mail': 'icons/yahoo-mail.png',
  'hotmail':    'icons/hotmail.png',
  'news':       'icons/news.png',
  'facebook':   'icons/facebook.png'
};

var indicators = {
  'pjkljhegncpnkpknbcohdijeoejaedia': 'gmail',
  'pjjhlfkghdhmijklfnahfkpgmhcmfgcm': 'greader',
  'dlppkpafhbajpcmmoheippocdidnckmm': 'gplus',
  'yahoo-mail': 'yahoo-mail',
  'hotmail':    'hotmail',
  'facebook':   'facebook'
};

stored.notifications || (stored.notifications = "");


function set_indicator(id, count) {
  // broadcast indicator change
  chrome.extension.sendMessage({
    name: "set_indicator",
    args: [id, count],
    type: "rpc",
  });
  // store indicator change
  var key = "indicator-" + id;
  stored[key] = count;
}

function is_notification_enabled(i) {
  return ("undefined" == typeof settings.notifications[i] || settings.notifications[i]);
}

function create_notification(icon, title, body) {

  if (!icon || !title) return;

  if (icon == 'gmail'      && !is_notification_enabled('pjkljhegncpnkpknbcohdijeoejaedia')) return;
  if (icon == 'news'       && !is_notification_enabled('pjjhlfkghdhmijklfnahfkpgmhcmfgcm')) return;
  if (icon == 'yahoo-mail' && !is_notification_enabled('yahoo-mail')) return;
  if (icon == 'hotmail'    && !is_notification_enabled('hotmail')) return;
  if (icon == 'facebook'   && !is_notification_enabled('facebook')) return;
  if (icon == 'twitter'    && !is_notification_enabled('twitter')) return;

  // broadcast new notification
  chrome.extension.sendMessage({
    name: "create_notification",
    args: [icon, title, body],
    type: "rpc",
  });

  /*
  if (icon == 'tweet' && +new Date - last_sound > 1000)  {
    last_sound = +new Date;
    byId('twittersound', bg.document).currentTime = 0;
    byId('twittersound', bg.document).play();
  }
  */

  icon = ICONS[icon] || icon;
  var new_item = icon + FIELD_SEPARATOR + title + FIELD_SEPARATOR + body;

  // fetch stored notifications and refresh list
  var notifications = stored.notifications ? stored.notifications.split(ITEM_SEPARATOR) : [];
  notifications.unshift(new_item);
  if (notifications.length > MAX_NOTIFICATIONS) {
    notifications.pop();
  }

  // update storage
  stored.notifications = notifications.join(ITEM_SEPARATOR);
}

function play_notification_sound(type) {
}


function include_js(url, callback) {
  var script = document.createElement('script');
  script.onload = callback;
  script.src = url;
  document.head.appendChild(script);
}


function build_apps_list(apps_arr) {
  ///bench('build start');///

  // save default custom apps' states upon first launch
  if ("undefined" == typeof custom_apps["webstore"]) {
    custom_apps = {"contacts":true,"webstore":true,"yahoo-mail":true,"hotmail":true,"facebook":true,"twitter":true};
    stored.custom_apps = JSON.stringify(custom_apps);
  }

  if (apps_arr) {
    if (custom_apps["contacts"])
    apps_arr.unshift({
      name: "Contacts",
      id:   "contacts",
      icons: [{size: 128, url: "icons/app/contacts-128.png"}],
      appLaunchUrl: "https://www.google.com/contacts/#contacts",
      isApp:   true,
      enabled: custom_apps["contacts"]
    });

    if (custom_apps["webstore"])
    apps_arr.unshift({
      name: "Store",
      id:   "webstore",
      icons: [{size: 128, url: "chrome://extension-icon/ahfgeienlihckogmohjhadlkjgocpleb/128/0"}],
      appLaunchUrl: "https://chrome.google.com/webstore/category/popular",
      isApp:   true,
      enabled: custom_apps["webstore"]
    });

    if (custom_apps["yahoo-mail"])
    apps_arr.push({
      name: "Yahoo! Mail",
      id:   "yahoo-mail",
      icons: [{size: 128, url: "icons/app/yahoo-mail-128.png"}],
      appLaunchUrl: "http://us.mg40.mail.yahoo.com/neo/launch?.rand=" + (+new Date),
      isApp:   true,
      enabled: custom_apps["yahoo-mail"]
    });

    if (custom_apps["hotmail"])
    apps_arr.push({
      name: "Hotmail",
      id:   "hotmail",
      icons: [{size: 128, url: "icons/app/hotmail-128.png"}],
      appLaunchUrl: "http://mail.live.com/default.aspx?rru=inbox", /// http vs https
      optionsUrl: "https://mail.live.com/P.mvc#!/mail/options.aspx",
      isApp:   true,
      enabled: custom_apps["hotmail"]
    });

    if (custom_apps["facebook"])
    apps_arr.push({
      name: "Facebook",
      id:   "facebook",
      icons: [{size: 128, url: "icons/app/facebook-128.png"}],
      appLaunchUrl: "https://www.facebook.com/",
      optionsUrl: "https://www.facebook.com/settings",
      isApp:   true,
      enabled: custom_apps["facebook"]
    });

    if (custom_apps["twitter"])
    apps_arr.push({
      name: "Twitter",
      id:   "twitter",
      icons: [{size: 128, url: "icons/app/twitter-128.png"}],
      appLaunchUrl: "https://twitter.com/",
      optionsUrl: "https://twitter.com/settings/account",
      isApp:   true,
      enabled: custom_apps["twitter"]
    });

  }

  var in_ordered = {};

  // stored list of apps in custom order
  ///
  /*for (var i = 0; i < ordered.length; i++) {
    for (var j = 0; j < ordered[i].length; j++) {
      in_ordered[ordered[i][j]] = true;
    }
  }*/
  for (var j = 0; j < ordered.length; j++) {
    in_ordered[ordered[j]] = true;
  }

  apps = {};

  // check for missing apps (recently added)
  for (var i = 0; i < apps_arr.length; i++) {
    var app = apps_arr[i];
    if (!app.isApp) continue;
    apps[app.id] = app;
    if (!in_ordered[app.id] && app.enabled)
      ///push_to_empty_index(ordered, app.id);
      ordered.push(app.id);
  }

  // check for missing user apps (after purge)
  var user_app_ids = stored.user_app_ids.split(',');
  for (var j = 0; j < user_app_ids.length; j++) {
    var id = user_app_ids[j];
    if (!id) continue;
    if (!stored[id]) continue;
    if (in_ordered[id]) continue;
    ordered.push(id);
  }

  // user apps data
  for (var j = 0; j < ordered.length; j++) {
    var id = ordered[j];
    if (id.indexOf('user_app') != 0) 
      continue;
    if (!stored[id]) 
      continue;
    try { 
      apps[id] = JSON.parse(stored[id]); 
    } catch(e) {
        logError(new Error('ERROR: stored app has invalid JSON: ' + id));
    }
  }

  stored.icons_order = ordered.join(',')///JSON.stringify(ordered);
}


if (stored.icons_order) {
  ordered = stored.icons_order.split(',');//JSON.parse(stored.icons_order);
}


chrome.management.getAll(function(array) {
    build_apps_list(array);
    include_3rd_party_services();
});


function add_user_app(name, url, icons) {
  var id = 'user_app_' + stored.user_app_id_inc++;
  stored.icons_order += "," + id;
  apps[id] = {
      name: name,
      id: id,
      icons: icons,
      appLaunchUrl: url,
      isApp: true,
      enabled: true
  };
  stored[id] = JSON.stringify(apps[id]);
  stored.user_app_ids += id + ',';
  chrome.runtime.sendMessage({name: 'add_new_app', id:id});
  // active view should scroll to show the newly installed app
  chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {name: "go_last_page"})
  });
}

function edit_user_app(id, name, url, icons) {
  apps[id] = {
      name: name,
      id: id,
      icons: icons,
      appLaunchUrl: url,
      isApp: true,
      enabled: true
  };
  stored[id] = JSON.stringify(apps[id]);
  chrome.runtime.sendMessage({name: 'edit_app', id:id});
}

function remove_user_app(id) {
  var user_app_ids = stored.user_app_ids.split(',');
  for (var i = 0; i < user_app_ids.length; i++)
    if (user_app_ids[i] == id)
      user_app_ids.splice(i, 1);
  stored.user_app_ids = user_app_ids.join(',');
  delete stored[id];
  apps[id].icons.forEach(function (icon) {
    remove_file(extract_filename(icon.url));
  });
}


function save_new_background(url, callback) {
  imageURLToBlob(url, function (blob) {
    save_file_blob('/background.jpg', blob, callback);
    var protocol = 'filesystem:chrome-extension://';
    var url = protocol + window.APP_ID + '/persistent/background.jpg';
    settings.background_image = url;
    save_options();
  });
}

function include_3rd_party_services() {

    include_js("3rd-party/closed-tab/bg.js");

    // TODO: check settings.notifications['facebook'] etc.

    // optional services

    if (apps['pjkljhegncpnkpknbcohdijeoejaedia'] &&
        apps['pjkljhegncpnkpknbcohdijeoejaedia'].enabled) {
      include_js("3rd-party/gmail/gmail.js");
    }

    //if (apps['dlppkpafhbajpcmmoheippocdidnckmm'] &&
    //    apps['dlppkpafhbajpcmmoheippocdidnckmm'].enabled) {
    //  include_js("3rd-party/gplus/gplus.js");
    //}

    if (apps['yahoo-mail'].enabled) {
      include_js("3rd-party/yahoo-mail/yahoo-mail.js");
    }

    if (apps['facebook'].enabled) {
      include_js("3rd-party/facebook/facebook.js");
    }

    if (apps['hotmail'].enabled) {
      include_js("3rd-party/hotmail/hotmail.js");
    }

    //if (apps['ejjicmeblgpmajnghnpcppodonldlgfn'] &&
    //    apps['ejjicmeblgpmajnghnpcppodonldlgfn'].enabled) {
    // onload=GCAL_checkAuth
      window.GCAL_LOADED = function() {
        include_js("3rd-party/gcalendar/gcalendar.js", function () {
          window.GCAL_checkAuth();
        });
      };
      include_js("https://apis.google.com/js/client.js?onload=GCAL_LOADED");
    //}  
}

// temporary force update
var hotmail_html = stored.app_html_hotmail
if (hotmail_html && hotmail_html.indexOf('col002') > -1) {
  delete stored.app_html_hotmail;
}

if (chrome.runtime.setUninstallURL && !window.DEV) 
  chrome.runtime.setUninstallURL("http://www.homenewtab.com/farewell.html");

chrome.extension.onMessage.addListener(
  function(message, sender, sendResponse) {
    //if (window.DEV) return;
    if (message.name == "ga" && message.arguments) {
      ga.apply(window, message.arguments);
    } else if (message.name == "pageview") {
      ga('set',  'dimension1', settings.search_bar);
      ga('set',  'dimension2', settings.search_bar ? settings.search_fullscreen : -1); 
      ga('set',  'dimension4', isMac ? stored.SS_discrete_mouse_wheel == 'true' : -1); 
      ga('send', 'pageview', { page: message.page || 'main.html' });
    } else if (message.name == "search-event") {
      ga('send', 'event', 'search', 'click');
    } else if (message.name == "search-timeout") {
      ga('send', 'event', 'search', 'timeout');
    } else if (message.name == "search-slow") {
      ga('send', 'event', 'search', 'slow');
    }  else if (message.name == "search-event-url") {
      ga('send', 'event', 'search', 'url');
    } else if (message.name == "search-event-url-suggested") {
      ga('send', 'event', 'search', 'url-suggested');
    } else if (message.name == "new-tab-exception") {
      gaException(message.message, message.file, message.line, message.stack);
    }
  });

chrome.runtime.onInstalled.addListener(function (details) {
  //if (window.DEV) return;
  if ('install' == details.reason) {
    ga('send', 'pageview', { page: 'install.html' });
    ga('send', 'event', 'install', 'install');
    localStorage.install_time = g_update_time;
    checkInstallConversion();
  } else if ('update' == details.reason) {
    var version = chrome.runtime.getManifest().version;
    ga('send', 'event', 'update', 'update', version);
  }
});

// check for connection errors
function testConnectionToSearch() {
  if (!navigator.onLine) return;
  if (Math.random() > 0.01) return; // 20% chance
  var img = new Image();
  var start = Date.now();
  var searchErrorTimeout;
  searchErrorTimeout = setTimeout(function () {
    ga('send', 'event', 'test-connection', 'failed', '');
  }, 5*SECONDS);
  img.onerror = function () {
    ga('send', 'event', 'test-connection', 'failed', '');
    clearTimeout(searchErrorTimeout);
  };
  img.onload = function () {
    ga('send', 'event', 'test-connection', 'passed', '', Date.now()-start);
    clearTimeout(searchErrorTimeout);
  };
  img.src = window.SEARCH_ORIGIN + '/blank.gif';
}

window.DEV ? testConnectionToSearch()
           : setTimeout(testConnectionToSearch, 10*SECONDS);

function checkInstallConversion() {
  if (!chrome.cookies) return;
  var url = "https://chrome.google.com/webstore/"; // detail/ehhkfhegcenpfoanmgfpfhnmdmflkbgk
  //"73091649.1441531513.921.486.utmcsr=sscr|utmccn=sscr-cmp|utmcmd=(not%20set)"
  var map = {'utmcsr': 'source', 'utmccn': 'name', 'utmcmd': 'medium'};
  chrome.cookies.get({ url: url, name: "__utmz" }, function (cookie) { 
    if (!cookie) return;
    cookie = cookie.value;
    cookie = cookie.slice(cookie.indexOf('utm'));
    var conversion = {};
    var parts = cookie.split('|');
    parts.forEach(function (part) {
      var key   = part.split('=')[0];
      var value = part.split('=')[1];
      conversion[map[key]] = decodeURIComponent(value);
    });
    ga('send', 'event', 'conversion', 'install', conversion.source);
  });
}

window.is_notification_enabled = is_notification_enabled;


chrome.runtime.onInstalled.addListener(function (details) {
  if ('install' == details.reason)
    stored.TEST_search_fullscreen = true;
});

if (/mac/i.test(navigator.userAgent)) {
  chrome.webNavigation.onCompleted.addListener(function(details) {
    if (!/^https?:\/\/www\.google\./.test(details.url)) return;
    chrome.tabs.executeScript(details.tabId, { file: "/js/temp/sscr_detect.js" });
  });
  chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.to != 'bg') return;
    if (msg.name == "SS_discreteMouseWheel") {
      stored.SS_discrete_mouse_wheel = true;
    }
  });
}


// hostPrefix



/*
if (chrome.idle)
chrome.idle.onStateChanged.addListener(onIdleStateChanged);
function onIdleStateChanged(newState) {
  if (newState == "idle") {
    chrome.runtime.sendMessage({"action": "idle"});
  }
}
*/


/// TEMPORARY CODE ////////////////////////////////////////////////
// migrate to new background logic
/*
(function migrate_background_image() {
if (!fs) {
  setTimeout(migrate_background_image, 50);
  return;
}
if (settings.background_image.indexOf('persistent/background.jpg') == -1) {
  save_new_background(settings.background_image);
}
})();
*/
///////////////////////////////////////////////////////////////////
