SiteLaunchObserver=function(f){function k(){this.acc=null;this.hasFormWithPassword=this.userInteraction=this.formSubmitted=this.launchedSite=!1;this.formData=null;this.formDisappeared=!1;this.timeout=null;this.timedout=!1}function g(a,d,b){c[a]&&!c[a].launchedSite&&(clearTimeout(c[a].timeout),delete c[a]);c[a]=new k;c[a].acc=d;c[a].timeout=setTimeout(function(){var b=c[a];b&&(b.formSubmitted?(b.formDisappeared=!0,e(a,"Form disappeared")):(b.timedout=!0,e(a,"Timeout")))},1E3*b)}function e(a,d){var b=
c[a];b&&(b.launchedSite?f("SiteLaunchAttempt",{URL:b.acc.url,DOMAIN:b.acc.tld,FORM_FOUND:b.hasFormWithPassword,FORM_SUBMITTED:b.formSubmitted,USER_SUBMIT:b.userInteraction,FORM_DISAPPEARED:b.formDisappeared,TIMEDOUT:b.timedout}):f("infield_login_attempt",{url:b.acc.url,domain:b.acc.tld,form_found:b.hasFormWithPassword,form_submitted:b.formSubmitted,form_disappeared:b.formDisappeared,timedout:b.timedout}),b.hasFormWithPassword=!!b.formData||b.hasFormWithPassword,clearTimeout(b.timeout),delete c[a])}
function h(a){var d=c[a.tabID];d&&LPTabs.get({tabID:a.tabID}).forEachWindow({each:function(b,c){return b.LaunchTracking.formExists(d.formData,function(b){b&&e(a.tabID,"Form still on page!")})}})}var c={};return{isFeatureEnabled:function(a,c){a(g_launch_site_tracking_enabled)},startLaunchSite:function(a,d){g(a,d,15);c[a].launchedSite=!0},startFillTracking:function(a,c){g(a,c,15)},formSubmitted:function(a,d){c[d.tabID]&&(c[d.tabID].formData=a,c[d.tabID].formSubmitted=!0,c[d.tabID].userInteraction=a.userSubmit,
h(d))},getSubmitState:function(a,d){a(c[d.tabID]&&c[d.tabID].formSubmitted)},initiateFormExists:function(a){var d=c[a.tabID];d&&d.formSubmitted&&h(a)},hasFormWithPassword:function(a){c[a.tabID]&&(c[a.tabID].hasFormWithPassword=!0)}}}(sendLpImprove);
