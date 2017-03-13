var Options;
(function (Options) {
    var caseInsensitiveKey = "caseInsensitive";
    var checkbox = document.getElementById("case-insensitive");
    restoreState();
    checkbox.onclick = saveState;

    function restoreState() {
        if (localStorage[caseInsensitiveKey] !== undefined) {
            checkbox.checked = localStorage[caseInsensitiveKey] == "true";
        }
    }

    function saveState() {
        if (checkbox.checked) {
            localStorage[caseInsensitiveKey] = true;
        } else {
            localStorage[caseInsensitiveKey] = false;
        }

        var status = document.getElementById("status");
        status.innerHTML = "Options Saved.";
        setTimeout(function () {
            status.innerHTML = "";
        }, 1000);
    }
})(Options || (Options = {}));
