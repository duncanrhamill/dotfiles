!function(){"use strict";function e(e){var t="https://carlosjeurissen.com/"+r+"/",n=-1!==e.join("").indexOf("update");t+=n?"updated":"installed",n?(chrome.notifications.onClicked.addListener(function(e){chrome.tabs.create({url:t}),chrome.notifications.clear(e)}),chrome.notifications.create(null,{type:"basic",requireInteraction:!0,title:"Ink for Google has been updated",message:"Click to view changelog",iconUrl:"images/notification.png"},function(){})):chrome.tabs.create({url:t})}function t(e){localStorage.versionNumber=e}function n(e){var t=e.split(".");return t[0]+"."+t[1]}function o(e,t){return n(e)!==n(t)}function i(){var n=localStorage.versionNumber,i=chrome.runtime.getManifest().version;"string"!=typeof n?(t(i),e(["installed"])):o(n,i)&&(localStorage.lastUpdated=Date.now(),t(i),e(["updated"]))}var r="ink-for-google";i()}();