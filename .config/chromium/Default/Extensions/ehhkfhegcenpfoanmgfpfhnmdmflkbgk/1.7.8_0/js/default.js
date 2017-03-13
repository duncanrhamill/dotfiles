var default_settings = {
  fetch_interval:     '5',
  time_format:        '24',
  background_image:    '../img/backgrounds/34.jpg',
  background_style:    'stretch',
  background_gradient: true,
  background_fadein:   true,
  notifications:       {},
  search_bar:          true,
  search_fullscreen:   true
}

var manifest = chrome.runtime.getManifest();

window.APP_ID = chrome.runtime.id;
window.APP_NAME = manifest.name;
window.APP_VERSION = manifest.version;
window.DEV = (window.APP_ID != 'ehhkfhegcenpfoanmgfpfhnmdmflkbgk');
window.SEARCH_ORIGIN = 'http://www.homenewtab.com';
//window.SEARCH_ORIGIN = 'http://homenewtab.com.s3-website-us-east-1.amazonaws.com';///
window.SEARCH_URL    = window.SEARCH_ORIGIN + "/search/?instant";

if (localStorage.cf_test_review == 'true') {
  window.SEARCH_URL = window.SEARCH_ORIGIN + "/search/cf/?instant";
}

var SECONDS = 1000;
var MINUTES = 60*SECONDS;
var HOURS   = 60*MINUTES;
var DAYS    = 24*HOURS;

var stored = localStorage;
var settings = {};
try {
  if (stored.settings) settings = JSON.parse(stored.settings);
} catch (e) {
  console.log('ERROR: settings has invalid JSON: ' + stored.settings);
  // throw new Error('...');
}
defaults(settings, default_settings);

if (window.location.pathname == '/background.html') {

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  if (window.DEV) window['ga-disable-UA-2437922-29'] = true;
  //function ga() { if (!window.DEV) return ga_real.apply(this, arguments); }

  ga('create', 'UA-2437922-29', { 'anonymizeIp': true });
  ga('set', 'checkProtocolTask', null); // ext context
  ga('set', {
    'appName'    : window.APP_NAME,
    'appId'      : window.APP_ID,
    'appVersion' : window.APP_VERSION
  });
  ga('send', 'pageview', { page: 'background.html' });

} else {
  window.ga = function () {
    chrome.runtime.sendMessage({ 
      name: 'ga', 
      arguments: [].slice.call(arguments) 
    });
  }
}

function save_options() {
  stored.settings = JSON.stringify(settings);
}

function defaults(a, b) {
  for (var i in b)
    if (!a.hasOwnProperty(i) && b.hasOwnProperty(i))
      a[i] = b[i];
  return a;
}
