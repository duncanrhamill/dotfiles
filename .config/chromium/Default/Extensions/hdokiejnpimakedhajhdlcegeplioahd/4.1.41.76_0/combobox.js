var KEY_UP=38,KEY_DOWN=40,KEY_ENTER=13,ELEMENT_NODE=1,KEY_ESCAPE=27,KEY_F4=115;function openCombo(b,a,c){b=document.getElementById(a);b.disabled||(c=gComboEx=document.getElementById(c),"block"!=c.style.display?showCombo(b,c):setStyle(c,"display","none",""),gItemNum=-1,gFocusItem=b,setTimeout(function(){doFocus()},0))}var g_iField=null,g_cb=null;function showCombo(b,a){g_iField=b;g_cb=a;b.addEventListener("move",function(a){realShowCombo()},!1);realShowCombo()}
function getY(b){for(var a=0;null!=b;)a+=b.offsetTop,b=b.offsetParent;return a}function getX(b){for(var a=0;null!=b;)a+=b.offsetLeft,b=b.offsetParent;return a}function realShowCombo(){var b=getY(g_iField),a=getX(g_iField),b=b+g_iField.offsetHeight+"px",a=a+"px";g_cb.style.minWidth=g_iField.offsetWidth+"px";setStyle(g_cb,"top",b,"");setStyle(g_cb,"left",a,"");setStyle(g_cb,"display","block","")}var gItemNum=0,gComboEx=null;
function focusCombo(b,a,c){b=b.keyCode;var d=!0;c=gComboEx=document.getElementById(c);if(b==KEY_DOWN||b==KEY_F4){d=!1;"block"!=c.getAttribute("style.display")&&showCombo(a,c);a=c.childNodes;c=a.length;for(b=0;null!=a[b]&&b<c;){if(a[b].nodeType==ELEMENT_NODE&&"item"==a[b].className){gFocusItem=a[b];break}b++}gItemNum=0;setTimeout(function(){doFocus()},0);d=!1}else b!=KEY_ENTER&&b==KEY_ESCAPE&&(null!=a.val&&0<a.val.length?d=!0:(d=!1,setStyle(gComboEx,"display","none",""),gItemNum=-1));return d}
function focusItem(b,a,c){b=c.val;for(var d=null,e=getItems(a),f=e.length,h=!1,g=0;g<f;g++)if(e[g].hasChildNodes()&&e[g].firstChild.nodeValue==b){h=!0;d=e[g];gItemNum=g;break}h||(d=addItem(a,b,e.length),gItemNum=e.length);null!=d&&(gFocusItem=d,"block"!=gComboEx.getAttribute("style.display")?(b=c.offsetLeft+"px",setStyle(a,"top",c.offsetTop+c.offsetHeight+"px",""),setStyle(a,"left",b,"")):setStyle(a,"display","none",""),setStyle(a,"display","block",""),setTimeout(function(){doFocus()},0))}
function addItem(b,a,c,d){d||(d=document);var e=d.createElement("div"),f="undefined"!=typeof a.label?a.label:a;e.val="undefined"!=typeof a.label?a.value:a;e.label=f;if("undefined"!=typeof a.label&&(e.label=a.label,"undefined"!=typeof a.image)){var h=d.createElement("img");h.src=a.image;h.style.paddingRight="15px";e.appendChild(h);e.img=h.src}a=d.createTextNode(f);e.appendChild(a);e.setAttribute("tabindex","-1");e.setAttribute("class","item");e.setAttribute("data-lpcount",c);e.addEventListener("click",
function(){gItemNum=this.getAttribute("data-lpcount")});e.addEventListener("mouseover",function(){gFocusItem=this;doFocus()});e.setAttribute("role","listitem");e.style.overflow="hidden";b.appendChild(e);return e}
function doComboNav(b,a,c){var d=b.keyCode,e=!0;null==gComboEx&&(gComboEx=a);if(d==KEY_UP||d==KEY_DOWN){e=!1;b=0;a=getItems(gComboEx);var f=a.length;d==KEY_UP?b=gItemNum-1:(b=gItemNum+1,b==f&&(b=-1));gItemNum=b;gFocusItem=-1==gItemNum?document.getElementById(c):a[b];setTimeout(function(){doFocus()},0)}else if(d==KEY_ENTER||!b.keyCode&&0<=b.button){if(a=getItems(gComboEx),d=a[gItemNum],null!=d&&"true"!=d.getAttribute("aria-disabled")){b=d.label;a=d.val;c=document.getElementById(c);c.value=b;c.val=
a;"undefined"!=typeof d.img&&(c.style.background="url("+d.img+") no-repeat 2px 5px",c.style.paddingLeft="25px");if(c.onchange)c.onchange();setStyle(gComboEx,"display","none","");gItemNum=0;gFocusItem=c;setTimeout(function(){doFocus()},0)}}else d==KEY_ESCAPE&&(e=!1,setStyle(a,"display","none",""),gItemNum=0,gFocusItem=document.getElementById(c),setTimeout(function(){doFocus()},0));return e}
function getItems(b){var a;a=[];b=b.childNodes;for(var c=b.length,d=0;d<c;d++)b[d].nodeType!=ELEMENT_NODE||"item"!=b[d].getAttribute("class")&&"item focus"!=b[d].getAttribute("class")||(a[a.length]=b[d]);return a}function setStyle(b,a,c,d){var e=!1;try{b.style&&b.style.setProperty&&(b.style.setProperty(a,c,d),e=!0)}catch(f){alert("exception caught setting style: "+f.message)}if(!e)try{b.style[a]=c,e=!0}catch(f){alert("exception caught setting direct style: "+f.message)}return e}
var gFocusItem=null,gLastFocusItem=null;function doFocus(){null!=gFocusItem&&(gFocusItem.focus(),gLastFocusItem&&"item focus"==gLastFocusItem.className&&(gLastFocusItem.className="item"),gFocusItem&&"item"==gFocusItem.className&&(gFocusItem.className="item focus"),gLastFocusItem=gFocusItem,gFocusItem=null)}
function create_combo(b,a,c,d,e){d||(d=document);e||(e="");var f=d.getElementById(b),h=b+"_combo";if(!d.getElementById(h)){f.onkeydown=function(a){return focusCombo(a,this,this.id+"_combo")};f.setAttribute("role","textfield");f.setAttribute("aria-haspopup","true");f.setAttribute("autocomplete","off");f.style.marginRight="0px";var g=f.style.width.replace(/px/,"");if(""==g)try{g=f.ownerDocument.defaultView.getComputedStyle(f,"").width.replace(/px/,"")}catch(k){}g=d.createElement(e+"div");g.setAttribute("role",
"list");g.style.display="none";g.setAttribute("id",h);g.setAttribute("class","dropStyle");g.onkeydown=function(a){return doComboNav(a,this,this.id.substring(0,this.id.length-6))};g.addEventListener("click",function(a){doComboNav(a,this,this.id.substring(0,this.id.length-6))});g.style.paddingLeft="6px";g.style.paddingRight="6px";g.style.position="absolute";"undefined"!=typeof d.body&&d.body?d.body.appendChild(g):d.getElementById("main").appendChild(g);f.ownerDocument.defaultView.addEventListener("click",
function(){close_combo(b,d)},!1);for(h=0;h<a.length;h++)addItem(g,a[h],h,d);a=d.createElement(e+"img");a.id=b+"_button";a.onclick=function(a){openCombo(a,this.id.substring(0,this.id.length-7),this.id.substring(0,this.id.length-7)+"_combo");a.cancelBubble=!0};e=("undefined"==typeof gLocalBaseUrl?"":gLocalBaseUrl)+"images/pwdrop.png";"undefined"!=typeof g_isie&&g_isie&&(e="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyNzRGRTU3Q0E0MEExMUUwOTJDNjk3MDYyMDFDNUI4RSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyNzRGRTU3REE0MEExMUUwOTJDNjk3MDYyMDFDNUI4RSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjVFMTE0Q0M3QTQwOTExRTA5MkM2OTcwNjIwMUM1QjhFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjVFMTE0Q0M4QTQwOTExRTA5MkM2OTcwNjIwMUM1QjhFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+I6ppiQAAAZhJREFUeNq0lc8rhEEcxve1m4sfB+IgFFk32oui9kDZiz1Jb36Ui4MLOSgcnNQWN7LlKJSD9kI4yUnKCVc54B/YZLc44PWZmrfeppl53zb71KfpffvO8z47890Zx/O8WDWUCD4UCgVdTQMMwCykoA3e4RXO4RJerMYadcMhDCq1rdALo7AmOYEfv6DGYroIT5C2BBDz2+EYzqA5zHgFdiP8oqCycmnqTcbDsAVOBXs2BHs6Y2F2FLJEYZqGjGowAR3/0GkLCc2GBVWEpOu6RZMLLdrH8ADxwOsRNXFSeW6CXEjCTcVUqFE1rtNMnCdVypA2K7tB24dhEmnyGtNahp2YpcGDKhnq0hjNKO+WoSeq8bMleU6mFGlbGNYttR+qcd5S3CVTCm34/zCDrp3gsSlPtzfoNEwow5Q8F+KGml8Y022eWMtvwySR8sJiKrQPVzrjW1iFSm6AG1gSqU3ttg1z8BXR0JPnsejpz7A+PoB+OPWLDYaPMCkPn1LUG0S037jcTPGRjFxnsUF3cC9ryupEp1qX6Z8AAwCnLFoADB2D+gAAAABJRU5ErkJggg==");
a.setAttribute("src",e);a.setAttribute("valign","middle");"undefined"!=typeof g_isopera&&g_isopera&&(a.style.position="relative",a.style.top="7px");f.nextSibling?f.parentNode.insertBefore(a,f.nextSibling):f.parentNode.appendChild(a);c&&"undefined"!=typeof getAbsolutePos&&(c=getAbsolutePos(d,f),null!=c&&0<c.left&&0<c.top&&(e=c.left+c.width-2-22,a.style.left=e+"px",a.style.position="absolute"),e=Math.floor((22-c.height)/2),1<=e&&22>c.height&&(a.style.height=c.height+"px",a.style.width=c.height+"px",
a.style.top=c.top+e+"px",e=c.left+c.width-2-22+e,a.style.left=e+"px"),e=Math.round((c.height-22)/2),22<c.height&&(a.style.top=c.top+e+"px"),f.style.paddingRight="24px",f.style.textOverflow="ellipsis",f.style.whiteSpace="nowrap",f.style.overflow="hidden")}}
function delete_combo_item(b,a){var c=document.getElementById(b+"_combo");if(c)for(var d=getItems(c),e=0;e<d.length;e++)if(d[e].innerHTML==a){for(d.splice(e,1);c.hasChildNodes();)c.removeChild(c.firstChild);for(e=0;e<d.length;e++)addItem(c,d[e].innerHTML,e);break}}function close_combo(b,a){a||(a=document);var c=a.getElementById(b+"_combo");c&&"block"==c.style.display&&(setStyle(c,"display","none",""),gItemNum=-1)}
function repopulate_combo(b,a,c){c||(c=document);if(b=c.getElementById(b+"_combo")){for(;b.hasChildNodes();)b.removeChild(b.firstChild);for(var d=0;d<a.length;d++)addItem(b,a[d],d,c)}}
function destroy_combo(b,a){a||(a=document);if(!(null==b||0>=b.length))try{var c=a.getElementById(b+"_combo");if(c){for(;c.hasChildNodes();)c.removeChild(c.firstChild);c.parentNode.removeChild(c)}var d=a.getElementById(b+"_button");d&&d.parentNode.removeChild(d)}catch(e){console.log("destroy_combo error: "+e.message)}};