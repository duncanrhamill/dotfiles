/*
 g_searchhasfocus &&*/
var g_current_version=0;function onLoad(a){if(a){a=document.location.href.indexOf("?searchstr=");if(-1!=a){a=document.location.href.substring(a+11);var c=a.indexOf("&");-1!=c&&(a=a.substring(0,c));document.getElementById("searchbox").value=decodeURIComponent(a)}populate();document.getElementById("searchbox").focus();window.addEventListener("keydown",function(a){handle_keydown(a)},!1);setTimeout(function(){checkVersion()},500)}else get_data("vault",function(){onLoad(!0)})}
function onResize(){document.getElementById("gridsite")&&(document.getElementById("gridsite").style.height=document.body.clientHeight-document.getElementById("gridsite").offsetTop+"px")}var g_selectedrow=-1,g_searchhasfocus=!1;
function handle_keydown(a){a=0!=a.keyCode?a.keyCode:a.charCode;40==a||38==a?(a=40==a?g_selectedrow+1:-1==g_selectedrow?g_ids.length:g_selectedrow-1,a+1>g_ids.length||0>a||(-1!=g_selectedrow&&(document.getElementById("site"+g_ids[g_selectedrow]).className="site"),g_selectedrow=a,document.getElementById("site"+g_ids[g_selectedrow]).className="site focus")):13==a&&-1!=g_selectedrow&&ls(g_ids[g_selectedrow])}
function clearkeyboardnav(){-1!=g_selectedrow&&(document.getElementById("site"+g_ids[g_selectedrow]).className="site",g_selectedrow=-1)}var g_ids=[],g_lastsearch=null;
function populate(){var a=getBG(),c=document.getElementById("searchbox").value.toLowerCase();g_lastsearch=c;var g=a.g_prompts.edit_sn_prompt?!1:a.get_searchNotesPref(),c=search_results(c,g,"gridsite");"undefined"!==typeof c&&c.sort(a.lp_sort_case_insensitive_name);s=[];g_ids=[];g_selectedrow=-1;event_handlers={};for(var f in c)g_ids.push(get_record_id(c[f])),s.push(getsitehtml(c,f));f=document.createElement("div");f.id="gridclear";f.className="clear";s.push(f);LP_decimate_children(document.getElementById("gridsite"));
for(f=0;f<s.length;f++)document.getElementById("gridsite").appendChild(s[f]);for(f in event_handlers)document.getElementById(f).onclick=event_handlers[f];s=null;document.getElementById("gridsite").style.height=document.body.clientHeight-document.getElementById("gridsite").offsetTop+"px";g_current_version=a.g_local_accts_version;0<c.length&&(g_selectedrow=0,document.getElementById("site"+g_ids[0]).className="site focus")}
function checkVersion(a){(g_issafari||g_isopera||g_ismaxthon||g_isfirefoxsdk)&&!a?getBG().update_state("search"):(a=getBG(),a.lploggedin&&g_current_version==a.g_local_accts_version||populate(),setTimeout(function(){checkVersion()},500))}function search_go(){populate()}function search_clear(){document.getElementById("searchbox").value="";populate()}
function sp(a,c,g){if(get_innertext(a)==gs("Show")){var f=getBG(),b=get_record(c);null!=b.sharedfromaid&&""!=b.sharedfromaid&&"0"!=b.sharedfromaid&&"null"!=b.sharedfromaid?alert(gs("This is a shared site. You are not permitted to view the password.")):g||!b.pwprotect&&!f.g_prompts.view_pw_prompt?set_innertext(a,f.getpasswordfromacct(get_record(c))):f.security_prompt(function(){sp(a,c,!0)})}else set_innertext(a,gs("Show"))}
function os(a){var c=getBG();c.editAid(a,window);is_in_panel()&&c.closecurrenttab("home.html");return!1}function ds(a){getBG().deleteAid(a,window);return!1}function ls(a){var c=getBG();c.launch(a);setTimeout(function(){window_close("home.html")},0);is_in_panel()&&c.closecurrenttab("home.html");return!1}
function search_keyup(a,c){var g=a.charCode?a.charCode:a.keyCode?a.keyCode:a.which?a.which:0,f=document.getElementById("searchbox").value;g_searchhasfocus&&40!=g&&38!=g&&13!=g&&2<f.length&&populate()}var MAX_GROUPNAME_LEN=80,MAX_SITENAME_LEN=30,MAX_SITEUSERNAME_LEN=15;
function getsitehtml(a,c,g){id=get_record_id(a[c]);name=trunc(a[c].name,MAX_SITENAME_LEN);username="undefined"!=typeof a[c].unencryptedUsername?trunc(a[c].unencryptedUsername,MAX_SITEUSERNAME_LEN):"";event_handlers["launch"+id]=function(){return ls(this.id.substring(6))};event_handlers["show"+id]=function(){return sp(this,this.id.substring(4))};event_handlers["edit"+id]=function(){return os(this.id.substring(4))};event_handlers["delete"+id]=function(){return ds(this.id.substring(6))};g=document.createElement("div");
g.className="site";g.id="site"+id;var f=document.createElement("div");f.className="border";var b=document.createElement("div");b.className="sitename";var e=document.createElement("span");e.className="content";e.appendChild(sprite_gethtmlfromrecord(a[c]));var d=document.createElement("a");d.setAttribute("target","_blank");d.setAttribute("href","#");d.id="launch"+id;set_innertext(d,name);e.appendChild(d);b.appendChild(e);f.appendChild(b);b=document.createElement("div");b.className="siteusername";e=
document.createElement("span");e.className="content";set_innertext(e,username);b.appendChild(e);f.appendChild(b);b=document.createElement("div");b.className="sitepassword";e=document.createElement("span");e.className="content";d=document.createElement("a");d.setAttribute("href","#");d.id="show"+id;set_innertext(d,gs("Show"));e.appendChild(d);b.appendChild(e);f.appendChild(b);b=document.createElement("div");b.className="sitefavorite";e=document.createElement("span");e.className="content";"1"==a[c].fav&&
(d=document.createElement("img"),d.setAttribute("src","images/icon_favorite.png"),e.appendChild(d));b.appendChild(e);f.appendChild(b);b=document.createElement("div");b.className="sitenote";e=document.createElement("span");e.className="content";""!=a[c].extra&&(d=document.createElement("img"),d.setAttribute("src","images/icon_note.png"),e.appendChild(d));b.appendChild(e);f.appendChild(b);b=document.createElement("div");b.className="siteprotected";e=document.createElement("span");e.className="content";
a[c].pwprotect&&(d=document.createElement("img"),d.setAttribute("src","images/icon_protected.png"),e.appendChild(d));b.appendChild(e);f.appendChild(b);b=document.createElement("div");b.className="siteautologin";e=document.createElement("span");e.className="content";a[c].autologin&&(d=document.createElement("img"),d.setAttribute("src","images/icon_autologin.png"),e.appendChild(d));b.appendChild(e);f.appendChild(b);b=document.createElement("div");b.className="siteaction";d=document.createElement("a");
d.setAttribute("href","#");d.id="edit"+id;set_innertext(d,gs("Edit"));b.appendChild(d);e=document.createElement("span");set_innertext(e,"|");b.appendChild(e);d=document.createElement("a");d.setAttribute("href","#");d.id="delete"+id;set_innertext(d,gs("Delete"));b.appendChild(d);b.appendChild(document.createTextNode("\u00a0\u00a0\u00a0"));f.appendChild(b);g.appendChild(f);return g}function sprite_gethtmlfromrecord(a){return getBG().geticonhtmlfromrecord(a,document)}
function trunc(a,c){a||(a="");return a.length<=c?a:a.substr(0,c)+"..."};
