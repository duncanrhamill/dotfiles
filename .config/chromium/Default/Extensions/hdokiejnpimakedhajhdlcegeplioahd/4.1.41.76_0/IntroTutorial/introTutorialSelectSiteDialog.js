var IntroTutorialSelectSiteDialog=function(b){Dialog.call(this,b,{closeButtonEnabled:!1,maximizeButtonEnabled:!1,dynamicHeight:!0,hideHeader:!0,hideButtons:!0,confirmOnClose:!1})};IntroTutorialSelectSiteDialog.prototype=Object.create(Dialog.prototype);IntroTutorialSelectSiteDialog.prototype.constructor=IntroTutorialSelectSiteDialog;
(function(b){IntroTutorialSelectSiteDialog.prototype.getBigIcon=function(a){var c=null;b&&(c=b.getImage(a.toLowerCase(),"large"));return c};IntroTutorialSelectSiteDialog.prototype.initialize=function(a){Dialog.prototype.initialize.apply(this,arguments);(function(b){function d(a,b,c,f){LPProxy.getSiteMeta(f,function(e){if(e&&1==e.length){e=e[0];var d=a.find(b+" .bigIcon"),g=a.find(b+" .launchButton"),h=IntroTutorialSelectSiteDialog.prototype.getBigIcon(c);d.attr("src",h?h:"data:image/gif;base64,"+
e.favicon);"netflix.com"===f&&(e.url="https://www.netflix.com/SignOut");g.attr("href",e.url);g.click(e.url,function(a){a.preventDefault();bg.sendLpImprove("onboardingtour::selected",{action:f.charAt(0),version:"sso"});bg.IntroTutorial.setState({enabled:!0,domain:f,name:c,tile:f.charAt(0)});window.location=a.data})}});var d=a.find(b+" .name"),g=a.find(b+" .overlayHelpText");d.text(c);g.text(g.text()+" "+c)}var c=a.find("#btnClose");d(a,"#tile1","Google","google.com");d(a,"#tile2","Facebook","facebook.com");
d(a,"#tile3","Amazon","amazon.com");d(a,"#tile4","Netflix","netflix.com");c.bind("click",function(a){a.preventDefault();b.close(!0);LPVault.openTour()})})(this)};IntroTutorialSelectSiteDialog.prototype.close=function(a){a?(bg.sendLpImprove("onboardingtour::selected",{action:"nothanks",version:"sso"}),Dialog.prototype.close.call(this,a)):dialogs.confirmation.open({title:Strings.translateString("Close"),text:Strings.translateString("Are you sure You'd like to exit the tutorial?"),handler:this.createHandler(this.close,
!0)})}})(IntroTutorialImages);