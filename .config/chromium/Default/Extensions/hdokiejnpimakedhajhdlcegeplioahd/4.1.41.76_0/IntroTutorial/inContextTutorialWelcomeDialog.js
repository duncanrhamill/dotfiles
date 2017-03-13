var InContextTutorialWelcomeDialog=function(f){Dialog.call(this,f,{closeButtonEnabled:!1,maximizeButtonEnabled:!1,dynamicHeight:!1,hideHeader:!0,hideButtons:!0,confirmOnClose:!1})};InContextTutorialWelcomeDialog.prototype=Object.create(Dialog.prototype);InContextTutorialWelcomeDialog.prototype.constructor=InContextTutorialWelcomeDialog;
(function(f){function d(c,d,b,e,a,g){b=new lpTile({id:b,name:e,tileClass:"tile-sm",iconSrc:IntroTutorialImages.getImage(e.toLowerCase(),"square"),clickHandler:function(b){b.preventDefault();c.close(!0);bg.sendLpImprove("onboardingtour::selected",{action:a.charAt(0),version:"incontext"});bg.IntroTutorial.setState({enabled:!0,domain:a,name:e,tile:a.charAt(0),isInContext:!0});bg.LPPlatform.openSame({url:g})}});d.append(b.$tileEl)}InContextTutorialWelcomeDialog.prototype.initialize=function(c){function f(a){a.preventDefault();
bg.sendLpImprove("onboardingtour::selected",{action:"nothanks",version:"incontext"});LPProxy.setPreferences("ShowIntroTutorial",!1);b.close(!0)}Dialog.prototype.initialize.apply(this,arguments);var b=this;d(b,c.find("#tileContainer"),"#tile1","Google","google.com","https://accounts.google.com/ServiceLogin");d(b,c.find("#tileContainer"),"#tile2","Facebook","facebook.com","https://www.facebook.com/login.php");d(b,c.find("#tileContainer"),"#tile3","Amazon","amazon.com","https://www.amazon.com/ap/signin?_encoding=UTF8&openid.assoc_handle=usflex&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fyourstore%2Fhome%3Fie%3DUTF8%26ref_%3Dnav_ya_signin");
d(b,c.find("#tileContainer"),"#tile4","Netflix","netflix.com","https://www.netflix.com/logout");var e=!0,a=LPProxy.getPreference("ShowIntroTutorialLater",null);a&&Date.now()>=new Date(a)&&(e=!1);var a=c.find("#showLater"),g=c.find("#noThanks");e?(g.hide(),a.show(),a.bind("click",function(a){a.preventDefault();bg.sendLpImprove("onboardingtour::selected",{action:"later",version:"incontext"});a=new Date;a.setDate(a.getDate()+3);LPProxy.setPreferences("ShowIntroTutorialLater",a.toString());b.close(!0)})):
(a.hide(),g.show(),g.bind("click",f));c.find("#btnClose").bind("click",f);bg.sendLpImprove("onboardingtour::seen",{version:"incontext"})};InContextTutorialWelcomeDialog.prototype.getSize=function(){return{"max-height":"100%","max-width":"100%"}}})(jQuery);