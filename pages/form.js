var ws = {};

function $i(id) {
    return document.getElementById(id);
};

function msgbox(string, title = null, callback = null) {
    if (callback != null) {
        callback(alert(string))
    } else {
        alert(string)
    }
};

$i("status").onclick = function() {
    // if (this.getAttribute("condition") == "disconnected" || this.getAttribute("condition") == "error") {
        startWebSocket(null, null);
    // };
};

function changeStatus(status) {
    statusbar = $i("status");
    statusbar.setAttribute("condition", status);
    console.log("Status change: " + status);
};

// Source: https://www.educative.io/answers/how-to-escape-unescape-html-characters-in-string-in-javascript
function escapeHTMLChars(string) {
    return string.replace(/</g, "&lt;"  )
                    .replace(/>/g, "&gt;"  )
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#39;" ); 
};

function previewMessage(message) {
    previewOutput = window.open("", "popup", "width=360,height=400");
    previewOutput.document.write(DOMPurify.sanitize('<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Preview Message</title><style>*{font-family:sans-serif} code,kbd,output,pre{font-family:monospace}</style></head><body><div class="preview">' + message + '</div></body></html>'));
};

function preview () {
    msgpreview = "";
    if ($i("message-type").value == "markdown") {
        msgpreview = marked.parse($i("message-content").value);
    } else if ($i("message-type").value == "plain") {
        msgpreview = "<div>" + $i("message-content").value + "</div>";
    } else {
        return;
    };
    previewMessage(msgpreview);
};

function startWebSocket(callback, error) {
    try {
        changeStatus("connecting");
        
        hostname = new URL(window.location.href).hostname;
        ws = new WebSocket("ws://" + hostname + ":${daemonPort}");

        ws.addEventListener("open", function () {
            changeStatus("connecting");
        });

        ws.addEventListener("error", function () {
            changeStatus("error");
        });

        ws.addEventListener("close", function () {
            changeStatus("disconnected");
        });

        ws.addEventListener("message", function (x) {
            console.log(x.data);
            msgdata = JSON.parse(x.data) || x.data;
            if ((typeof msgdata == "object" && typeof msgdata.status !== "undefined") && msgdata.status == "OK") changeStatus("connected")
        });
        if (typeof callback === "function" && ws.readyState !== WebSocket.OPEN) 
            callback($i("status").getAttribute("condition"));
    } catch (e) {
        changeStatus("error");
        if (typeof error === "function") error(e);
    };
};
startWebSocket(null, null);

function getMessageOnLoad() {
    startWebSocket(function(x) {
        ws.addEventListener("message", function (x) {
            msgdata = JSON.parse(x.data) || x.data;
            if (typeof msgdata == "object") {
                if (typeof msgdata.status == "string" && msgdata.status == "OK") {
                    changeStatus("connected");
                }
                if (msgdata.type == "plain") {
                    $i("message-content").value = DOMPurify.sanitize(msgdata.message);
                } else if (msgdata.type == "markdown") {
                    $i("message-content").value = DOMPurify.sanitize(marked.parse(msgdata.message));
                };
            } else {
                $i("message").innerHTML = msgdata;
            };
        });
        document.removeEventListener("load", getMessage);
    }, null);
};

function send() {
    startWebSocket(function(x) {
        // if (ws.readyState !== WebSocket.OPEN) return;
        const message = JSON.stringify({
            type: $i("message-type").value,
            message: $i("message-content").value,
            status: "OK"
        });
        ws.send(message);
    }, function(x) {
        msgbox(x.toString(), "Error", null)
    })
};

document.addEventListener("load", getMessageOnLoad);