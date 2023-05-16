try {
    function $i(id) {
        return document.getElementById(id);
    };

    $i("status").onclick = function() {
        // if (this.getAttribute("condition") == "disconnected" || this.getAttribute("condition") == "error") {
            startWebSocket(null, null);
        // };
    };

    if (document.querySelector(".root.mini .body") != null) 
    document.querySelector(".root.mini .body").ondblclick = function () {
        // if (this.getAttribute("condition") == "disconnected" || this.getAttribute("condition") == "error") {
            startWebSocket();
        // };
    };

    function changeStatus(status) {
        statusbar = $i("status");
        if (document.querySelector(".root.mini .body") !== null) body = document.querySelector(".root.mini .body")
        statusbar.setAttribute("condition", status);
        if (typeof body !== "undefined" && body != null) body.setAttribute("condition", status);
        console.log("Status change: " + status);
    };

    // Source: https://www.educative.io/answers/how-to-escape-unescape-html-characters-in-string-in-javascript
    function escapeHTMLChars(string) {
        return string.replace(/</g, "&lt;"  )
                     .replace(/>/g, "&gt;"  )
                     .replace(/"/g, "&quot;")
                     .replace(/'/g, "&#39;" ); 
    };

    function startWebSocket(callback, error) {
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
            if (typeof callback === "function") callback($i("status").getAttribute("condition"));
        } catch (e) {
            changeStatus("error");
            if (typeof error === "function") error(e);
        };
    };
    startWebSocket(null, null)
} catch(x) {
    alert(x)
}