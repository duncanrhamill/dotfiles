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
var Content;
(function (Content) {
    var marks = [];
    var cur = 0;

    chrome.runtime.sendMessage({ event: "loaded" });

    var InfoSpan = (function () {
        function InfoSpan() {
            var _this = this;
            this.span = document.createElement('span');
            this.span.className = "__regexp_search_count";

            this.span.addEventListener('mouseover', function (event) {
                _this.span.style.opacity = "0";
            });
            this.span.addEventListener('mouseout', function (event) {
                _this.span.style.opacity = "1";
            });
        }
        InfoSpan.prototype.setText = function (text) {
            this.span.innerHTML = text;
        };

        InfoSpan.prototype.remove = function () {
            if (this.span.parentNode) {
                this.span.parentNode.removeChild(this.span);
            }
        };

        InfoSpan.prototype.add = function () {
            if (!this.span.parentNode) {
                document.getElementsByTagName('body')[0].appendChild(this.span);
            }
        };
        return InfoSpan;
    })();

    var infoSpan = new InfoSpan();

    function makeTimeoutCall(fn, data, timeout) {
        setTimeout(function () {
            fn.call(null, data);
        }, timeout);
    }

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        Log.debug("Received command " + request.command);
        if (request.command == "search") {
            Log.debug("Searching for regex: " + request.regexp);
            var flags = "g";
            if (request.caseInsensitive === true) {
                Log.debug("Case insensitive enabled");
                flags = "gi";
            }
            clear();
            infoSpan.add();
            infoSpan.setText("Searching...");
            var re = new RegExp(request.regexp, flags);

            makeTimeoutCall(function (re) {
                delayedSearch(re);
            }, re, 10);
        } else if (request.command == "clear") {
            clear();
        } else if (request.command == "prev") {
            move(false);
        } else if (request.command == "next") {
            move(true);
        } else {
            Log.debug("Invalid command");
        }
        if (request.command != "search") {
            if (marks.length > 0) {
                marks[cur].className = "__regexp_search_selected";
                if (!elementInViewport(marks[cur])) {
                    $('body').scrollTop($(marks[cur]).offset().top - 20);
                }
            }
        }
    });

    function delayedSearch(re) {
        var html = document.getElementsByTagName('body')[0];
        html.normalize();

        recurse(html, re);

        displayCount();
        if (marks.length > 0) {
            marks[cur].className = "__regexp_search_selected";

            if (!elementInViewport(marks[cur])) {
                $('body').scrollTop($(marks[cur]).offset().top - 20);
            }
        }
    }

    function recurse(element, regexp) {
        if (element.nodeName == "MARK" || element.nodeName == "SCRIPT" || element.nodeName == "NOSCRIPT" || element.nodeName == "STYLE" || element.nodeType == Node.COMMENT_NODE) {
            return;
        }

        if (element.id == '_regexp_search_count') {
            return;
        }

        if (element.nodeType != Node.TEXT_NODE) {
            var disp = $(element).css('display');
            if (disp == 'none' || disp == 'hidden') {
                return;
            }
        }

        if (element.childNodes.length > 0) {
            for (var i = 0; i < element.childNodes.length; i++) {
                recurse(element.childNodes[i], regexp);
            }
        }

        if (element.nodeType == Node.TEXT_NODE && element.nodeValue.trim() !== '') {
            var str = element.nodeValue;
            var matches = str.match(regexp);
            var parent = element.parentNode;

            if (matches !== null) {
                var pos = 0;
                var mark;
                for (var i = 0; i < matches.length; i++) {
                    var index = str.indexOf(matches[i], pos);
                    var before = document.createTextNode(str.substring(pos, index));
                    pos = index + matches[i].length;

                    if (element.parentNode == parent) {
                        parent.replaceChild(before, element);
                    } else {
                        parent.insertBefore(before, mark.nextSibling);
                    }

                    mark = document.createElement('mark');
                    mark.appendChild(document.createTextNode(matches[i]));

                    parent.insertBefore(mark, before.nextSibling);
                    marks.push(mark);
                }
                var after = document.createTextNode(str.substring(pos));
                parent.insertBefore(after, mark.nextSibling);
            }
        }
    }

    function clear() {
        infoSpan.setText("Clearing...");
        setTimeout(function () {
            cur = 0;
            for (var i = 0; i < marks.length; i++) {
                var mark = marks[i];
                mark.parentNode.replaceChild(mark.firstChild, mark);
            }
            marks.length = 0;
            infoSpan.remove();
        }, 10);
    }

    function displayCount() {
        var num;
        if (marks.length > 0) {
            num = cur + 1;
        } else {
            num = 0;
        }
        infoSpan.setText(num + " of " + marks.length + " matches.");
        infoSpan.add();
    }

    function move(next) {
        if (marks.length > 0) {
            console.assert(cur >= 0 && cur < marks.length);
            marks[cur].className = "";
            if (next) {
                nextMatch();
            } else {
                prevMatch();
            }
            marks[cur].className = "__regexp_search_selected";
            infoSpan.setText((cur + 1) + " of " + marks.length + " matches.");
        }
    }

    function nextMatch() {
        cur++;
        cur %= marks.length;
    }

    function prevMatch() {
        cur--;
        if (cur < 0) {
            cur += marks.length;
        }
    }

    function elementInViewport(el) {
        var top = el.offsetTop;
        var left = el.offsetLeft;
        var width = el.offsetWidth;
        var height = el.offsetHeight;

        while (el.offsetParent) {
            el = el.offsetParent;
            top += el.offsetTop;
            left += el.offsetLeft;
        }

        return top >= window.pageYOffset && left >= window.pageXOffset && (top + height) <= (window.pageYOffset + window.innerHeight) && (left + width) <= (window.pageXOffset + window.innerWidth);
    }
})(Content || (Content = {}));
