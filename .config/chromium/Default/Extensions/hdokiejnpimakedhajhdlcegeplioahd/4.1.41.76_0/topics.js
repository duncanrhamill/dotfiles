Topics=function(){var e={};return{publish:function(b,c){Topics.get(b).publish(c)},get:function(b){var c=b&&e[b];if(!c){var d=[],g=function(a){for(var f=0,b=d.length;f<b;++f)if(a===d[f])return f;return-1},h=function(a){a=g(a);-1<a&&d.splice(a,1)},c={publish:function(){for(var a=!0,b=d.slice(),c=0,e=b.length;c<e&&!1!==a;++c)try{a=b[c].apply(window,arguments)}catch(k){"function"===typeof LPPlatform.logException&&LPPlatform.logException(k)}},subscribe:function(a){-1===g(a)&&d.push(a)},subscribeFirst:function(a){h(a);
d.unshift(a)},unsubscribe:function(a){h(a)}};b&&(e[b]=c)}return c}}}();Topics.ITEMS_DESELECTED=1;Topics.ITEMS_SELECTED=2;Topics.CONTEXT_MENU=3;Topics.CONFIRM=4;Topics.ITEM_SHARE=5;Topics.ERROR=6;Topics.SUCCESS=7;Topics.IDENTITY_ENABLE=8;Topics.SITE_ADDED=9;Topics.NOTE_ADDED=10;Topics.FORM_FILL_ADDED=11;Topics.EDIT_NOTE=12;Topics.EDIT_SITE=13;Topics.EDIT_FORM_FILL=14;Topics.ACCEPT_SHARE=15;Topics.REJECT_SHARE=16;Topics.GROUP_ADDED=17;Topics.RENAME_FOLDER=18;Topics.CONTEXT_CLOSE=19;
Topics.EDIT_SETTINGS=20;Topics.REQUEST_START=21;Topics.REQUEST_SUCCESS=22;Topics.REQUEST_ERROR=23;Topics.COLLAPSE_ALL=24;Topics.EXPAND_ALL=25;Topics.DISPLAY_GRID=26;Topics.DISPLAY_LIST=27;Topics.CLEAR_DATA=28;Topics.EDIT_IDENTITY=29;Topics.CREATE_SUB_FOLDER=30;Topics.DIALOG_OPEN=31;Topics.DIALOG_CLOSE=32;Topics.ESCAPE=33;Topics.IDENTITY_ADDED=34;Topics.PUSH_STATE=35;Topics.EDIT_SHARED_FOLDER=36;Topics.LEFT_ARROW=37;Topics.RIGHT_ARROW=38;Topics.PASSWORD_CHANGE=39;Topics.UP_ARROW=40;
Topics.DOWN_ARROW=41;Topics.ENTER=42;Topics.EDIT_SHARED_FOLDER_ACCESS=43;Topics.REMOVED_SHARED_FOLDER_USER=44;Topics.LOGIN=45;Topics.REFRESH_DATA=46;Topics.ACCOUNT_LINKED=48;Topics.ACCOUNT_UNLINKED=49;Topics.CREATE_SHARED_FOLDER=50;Topics.DIALOG_LOADING=51;Topics.DIALOG_LOADED=52;Topics.REPROMPT=53;Topics.EDIT_APPLICATION=54;Topics.ATTACHMENT_REMOVED=55;Topics.CLEAR_STATE=56;Topics.SELECT_COUNT_CHANGE=57;Topics.REAPPLY_SEARCH=58;Topics.EMERGENCY_RECIPIENT_ADDED=59;
Topics.EDIT_EMERGENCY_RECIPIENT=60;Topics.UPDATE_NOTIFICATION_COUNT=61;Topics.UPDATE_VAULT_STATE=62;Topics.ENROLLED_CREDIT_MONITORING=63;Topics.ITEM_SHARED=64;Topics.REFRESH_PREFERENCES=65;Topics.DISPLAY_COMPACT=66;Topics.DISPLAY_LARGE=67;Topics.ALL_COLLAPSED=68;Topics.ALL_EXPANDED=69;Topics.APPLICATION_ADDED=70;Topics.REQUEST_STATUS=71;Topics.DIALOG_RESIZE=72;Topics.SECURENOTE_TEMPLATE_ADDED=73;Topics.INITIALIZED=74;Topics.REQUEST_FRAMEWORK_INITIALIZED=75;Topics.SITE_NOTIFICATION_STATE=76;
Topics.SITE_NOTIFICATION=77;Topics.DROPDOWN_SHOWN=78;Topics.DROPDOWN_HIDE=79;Topics.FILLED_GENERATED_PW=80;Topics.VAULT_LEFT_MENU_TOGGLE=81;Topics.EMPTY_VAULT_STATE_CHANGE=82;Topics.LOGIN_FINISHED=83;Topics.ACCTS_VERSION_UPDATED=84;
