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
var BackgroundInterface;
(function (BackgroundInterface) {
    function getBgVar(name) {
        return chrome.extension.getBackgroundPage()[name];
    }

    function getTabStateManager() {
        return getBgVar("BackgroundScript").getTabStateManager();
    }
    BackgroundInterface.getTabStateManager = getTabStateManager;
})(BackgroundInterface || (BackgroundInterface = {}));
var Popup;
(function (Popup) {
    var prevButton = document.getElementById("prev");
    var nextButton = document.getElementById("next");
    var queryInput = document.getElementById("query");
    var caseInsensitiveCheckbox = document.getElementById("case-insensitive");

    var chromeStoreURL = "https://chrome.google.com/webstore/";

    Utils.withActiveTab(function (tab) {
        var id = tab.id;
        var tabStates = BackgroundInterface.getTabStateManager();

        if (!tabStates.exists(id)) {
            Log.warning("ID doesn't exist. Initializing entry.");
            tabStates.resetState(id);
            var tabState = tabStates.get(id);
        }

        addListeners(id, tabStates);
        restoreState(id, tabStates);

        setNextButtonState();
        setPrevButtonState(id, tabStates);

        if (tab.url.indexOf(chromeStoreURL) == 0) {
            Log.info("Chrome store detected");
            document.getElementById("chrome-store-warning").style.display = "block";
        }
    });

    function setNextButtonState() {
        if (queryInput.value == "") {
            nextButton.disabled = true;
        } else {
            nextButton.disabled = false;
        }
    }

    function setPrevButtonState(tabId, tabStates) {
        if (tabStates.isSearching(tabId)) {
            prevButton.disabled = false;
        } else {
            prevButton.disabled = true;
        }
    }

    function addListeners(id, tabStates) {
        var prevButtonClick = function () {
            Utils.sendCommand("prev");
        };

        var nextButtonClick = function () {
            if (tabStates.isSearching(id)) {
                Utils.sendCommand("next");
            } else {
                search(id, tabStates);
            }
        };

        var queryInputKeyDown = function (event) {
            if (event.keyCode == 13) {
                Log.info("Enter pressed");
                if (tabStates.isSearching(id)) {
                    if (event.shiftKey) {
                        prevButtonClick();
                    } else {
                        nextButtonClick();
                    }
                } else {
                    search(id, tabStates);
                }
            } else if (event.keyCode == 27) {
                Log.info("Esc pressed");
                setSearching(id, false, tabStates);
                Utils.sendCommand("clear");
            }
        };

        var queryInputInput = function () {
            tabStates.set(id, "query", queryInput.value);

            if (tabStates.isSearching(id)) {
                setSearching(id, false, tabStates);
                Utils.sendCommand("clear");
            }

            queryInput.className = '';

            setNextButtonState();
        };

        var checkboxClick = function () {
            Log.info("Set checkbox state to " + caseInsensitiveCheckbox.checked);
            tabStates.set(id, "caseInsensitive", caseInsensitiveCheckbox.checked);

            if (tabStates.isSearching(id)) {
                setSearching(id, false, tabStates);
                Utils.sendCommand("clear");
            }
        };

        prevButton.addEventListener("click", prevButtonClick);
        nextButton.addEventListener("click", nextButtonClick);
        queryInput.addEventListener("keydown", queryInputKeyDown);
        queryInput.addEventListener("input", queryInputInput);
        caseInsensitiveCheckbox.onclick = checkboxClick;
    }

    function restoreState(tabId, tabStates) {
        queryInput.value = tabStates.get(tabId, "query");
        caseInsensitiveCheckbox.checked = tabStates.get(tabId, "caseInsensitive");
    }

    function search(tabId, tabStates) {
        if (validate(queryInput.value)) {
            queryInput.className = '';
            var insensitive = caseInsensitiveCheckbox.checked;

            chrome.tabs.sendMessage(tabId, {
                command: "search",
                caseInsensitive: insensitive,
                regexp: queryInput.value
            });
            setSearching(tabId, true, tabStates);
        } else {
            Log.info("Invalid regex");
            queryInput.className = 'invalid';
        }
    }

    function setSearching(tabId, val, tabStates) {
        tabStates.set(tabId, "searching", val);
        setPrevButtonState(tabId, tabStates);
    }

    function validate(regexp) {
        if (regexp != "") {
            try  {
                "".match(regexp);
                return true;
            } catch (e) {
            }
        }
        return false;
    }
})(Popup || (Popup = {}));
