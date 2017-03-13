var Utils;
(function (Utils) {
    function withActiveTab(callback) {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
            console.assert(tabs.length == 1);
            callback(tabs[0]);
        });
    }
    Utils.withActiveTab = withActiveTab;

    function sendCommand(commandName, responseHandler) {
        (function (commandName, responseHandler) {
            withActiveTab(function (tab) {
                if (typeof responseHandler === "undefined") {
                    responseHandler = null;
                }
                chrome.tabs.sendMessage(tab.id, { command: commandName }, responseHandler);
            });
        })(commandName, responseHandler);
    }
    Utils.sendCommand = sendCommand;
})(Utils || (Utils = {}));
var Log;
(function (Log) {
    var LOG_LEVEL = 2 /* Info */;
    (function (LogLevel) {
        LogLevel[LogLevel["Error"] = 0] = "Error";
        LogLevel[LogLevel["Warning"] = 1] = "Warning";
        LogLevel[LogLevel["Info"] = 2] = "Info";
        LogLevel[LogLevel["Debug"] = 3] = "Debug";
    })(Log.LogLevel || (Log.LogLevel = {}));
    var LogLevel = Log.LogLevel;

    function error(message) {
        log(0 /* Error */, message);
    }
    Log.error = error;

    function warning(message) {
        log(1 /* Warning */, message);
    }
    Log.warning = warning;

    function info(message) {
        log(2 /* Info */, message);
    }
    Log.info = info;

    function debug(message) {
        log(3 /* Debug */, message);
    }
    Log.debug = debug;

    function log(level, message) {
        if (level <= LOG_LEVEL) {
            console.log(message);
        }
    }
})(Log || (Log = {}));
var TabStateManager = (function () {
    function TabStateManager() {
        this.tabStates = {};
    }
    TabStateManager.prototype.remove = function (tabId) {
        delete this.tabStates[tabId];
    };

    TabStateManager.prototype.exists = function (tabId) {
        return typeof (this.tabStates[tabId]) !== "undefined";
    };

    TabStateManager.prototype.resetState = function (tabId) {
        var caseInsensitiveVal = localStorage["caseInsensitive"] == "true";
        this.set(tabId, { query: "", searching: false, caseInsensitive: caseInsensitiveVal });
    };

    TabStateManager.prototype.isSearching = function (tabId) {
        return this.get(tabId, "searching");
    };

    TabStateManager.prototype.set = function (tabId, stateOrPropName, propVal) {
        if (typeof propVal === "undefined") {
            Log.debug("Set " + tabId + " to:");
            Log.debug(stateOrPropName);
            this.tabStates[tabId] = stateOrPropName;
        } else {
            Log.debug("Set " + stateOrPropName + " for " + tabId + " to " + propVal);
            this.tabStates[tabId][stateOrPropName] = propVal;
        }
    };

    TabStateManager.prototype.get = function (tabId, propName) {
        if (typeof propName === "undefined") {
            return this.tabStates[tabId];
        } else {
            return this.tabStates[tabId][propName];
        }
    };
    return TabStateManager;
})();

var TabState = (function () {
    function TabState() {
    }
    return TabState;
})();
var KeyboardHandler;
(function (KeyboardHandler) {
    var lastCalled = 0;

    function init(tabStates) {
        chrome.commands.onCommand.addListener(function (command) {
            Log.info("Received command " + command);
            Utils.withActiveTab(function (tab) {
                var id = tab.id;

                var d = new Date();
                if (tabStates.exists(id) && tabStates.get(id, "searching") && d.getTime() - lastCalled > 50) {
                    if (command == "next" || command == "prev") {
                        Utils.sendCommand(command);
                    }
                    lastCalled = d.getTime();
                }
            });
        });
    }
    KeyboardHandler.init = init;
})(KeyboardHandler || (KeyboardHandler = {}));
var BackgroundScript;
(function (BackgroundScript) {
    var tabStates;

    function getTabStateManager() {
        return tabStates;
    }
    BackgroundScript.getTabStateManager = getTabStateManager;

    function init() {
        tabStates = new TabStateManager();
        addTabStateListeners(tabStates);

        KeyboardHandler.init(tabStates);

        registerInstallationNotice();
    }

    function registerInstallationNotice() {
        chrome.runtime.onInstalled.addListener(function (details) {
            if (details.reason == "install") {
                chrome.tabs.create({ url: "pages/install.html" });
            } else if (details.reason == "update") {
                chrome.tabs.create({ url: "pages/update.html" });
            }
        });
    }

    function addTabStateListeners(tabStates) {
        chrome.runtime.onMessage.addListener(function (request, sender) {
            var id = sender.tab.id;

            if (request.event == "loaded") {
                if (!tabStates.exists(id)) {
                    tabStates.resetState(id);
                } else {
                    tabStates.set(id, "searching", false);
                }
            }
        });

        chrome.tabs.onRemoved.addListener(function (id) {
            tabStates.remove(id);
        });
    }

    init();
})(BackgroundScript || (BackgroundScript = {}));
