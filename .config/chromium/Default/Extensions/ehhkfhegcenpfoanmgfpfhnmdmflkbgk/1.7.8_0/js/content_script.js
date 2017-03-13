
var SPACE = 32;
var HOME = 36;

window.DEV = (chrome.runtime.id != 'ehhkfhegcenpfoanmgfpfhnmdmflkbgk');

if (document.URL == 'http://www.homenewtab.com/welcome.html' && !window.DEV) {
  var timer = setInterval(function(){
    if (!document.head) return;
    clearInterval(timer);
    var el = document.createElement('link');
    el.id = 'ehhkfhegcenpfoanmgfpfhnmdmflkbgk-installed';
    document.head.appendChild(el);
  }, 10);
}



/*
window.addEventListener("keydown", function(e){
  if ((e.ctrlKey && e.keyCode == SPACE) || e.keyCode == HOME) {
    chrome.extension.sendRequest({name: "return-to-home"});
    e.preventDefault();
    return false;
  }
}, true);
*/
