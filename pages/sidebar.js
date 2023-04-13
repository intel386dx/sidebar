function $i(id) {
    return document.getElementById(id);
};

$i("status").onclick = function() {
    if (this.getAttribute("condition") == "disconnected" || this.getAttribute("condition") == "error") {
        startWebSocket();
    };
};

function changeStatus(status) {
    statusbar = $i("status");
    statusbar.setAttribute("condition", status);
    console.log("Status change: " + status);
};

// Source: https://www.educative.io/answers/how-to-escape-unescape-html-characters-in-string-in-javascript
function escapeHTMLChars(string) {
    return string.replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;"); 
};

function startWebSocket() {
    try {
        changeStatus("connecting");
        
        hostname = new URL(window.location.href).hostname;
        ws = new WebSocket("ws://" + hostname + ":${daemonPort}");

        ws.addEventListener("open", function () {
            changeStatus("connecting");
        });

        ws.addEventListener("close", function () {
            changeStatus("disconnected");
        });

        ws.addEventListener("message", function (x) {
            msgdata = JSON.parse(x.data) || x.data;
            if (typeof msgdata == "object") {
                if (typeof msgdata.status == "string" && msgdata.status == "OK") {
                    changeStatus("connected");
                }
                if (msgdata.type == "plain") {
                    $i("message").innerHTML = escapeHTMLChars(msgdata.message);
                } else if (msgdata.type == "markdown") {
                    $i("message").innerHTML = marked.parse(msgdata.message);
                };
            } else {
                $i("message").innerHTML = msgdata;
            };
        });
    } catch (e) {
        changeStatus("error");
    };
};

startWebSocket()