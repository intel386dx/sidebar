﻿//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// sidebar.node.js
// ===============
// A Node.js script that implements a client-server sidebar.
//
// Copyright (c) 2023 Hilman Ahwas A.
//
// GitHub repository: https://github.com/intel386dx/sidebar
// This is licensed under the MIT license; see LICENSE.md for more information.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// How many failed tries? How many tries until this script gives up?
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
tries = 0;
maxTries = 3;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// The main function that can be looped.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function main() {
    try {
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Incrementing the trial counter.
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        tries = tries + 1;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Defining the ports used by the ws and http modules
        //
        // The lesser-privileged-friendly defaults:
        // const daemonPort = 8080;
        // const sidebarPort = 8081;
        // const formPort = 8082;
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        const daemonPort = 8080;
        const sidebarPort = 8081;
        const formPort = 8082;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Assets used for the Sidebar's web interfaces are defined below, mostly as template literals.
        // You can also find it in the pages/ folder of this repository.
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        // sidebar.html
        // ============
        // The sidebar UI.
        //
        // Part of sidebar.node.js
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
		
        const sidebarHTML = function(mini) {
	        return `<!DOCTYPE html>
	        <html>
	            <head>
	                <meta charset="utf-8">
	                <meta name="viewport" content="width=device-width, initial-scale=1.0">
	                <title>Information Sidebar</title>
	                <link rel="stylesheet" href="sidebar.css">
	                <script src="purify.min.js" async></script>
	                <script src="marked.min.js" async></script>
	                <script src="sidebar.js" defer async></script>
	            </head>
	            <body class="root ${mini? 'mini' : ''}">
	                <div class="title-bar">
	                    <h1 class="title">Information Sidebar</h1>
	                    <div class="status-part">
	                        <button class="status" id="status" title="Click to reconnect."></button>
	                        <div class="ports">
	                            <div class="port">
	                                <span class="port-name">Port:</span>
	                                <span id="port" style="margin-left:4px">${sidebarPort}</span>
	                            </div>
	                            <div class="port">
	                                <span class="port-name">Socket port:</span>
	                                <span id="socket-port" style="margin-left:4px">${daemonPort}</span>
	                            </div>
	                        </div>
	                    </div>
	                </div>
	                <div class="body">
	                    <div id="message" class="information" placeholder="Messages will be shown here"></div>
	                </div>
	            </body>
	        </html>`;
        };

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        // mini.html
        // =========
        // The mini sidebar UI. Only kept here just in case something bad happens.
        //
        // Part of sidebar.node.js
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        const sidebarMiniHTML =
        `<!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Information Sidebar</title>
                <link rel="stylesheet" href="sidebar.css">
                <script src="purify.min.js" async></script>
                <script src="marked.min.js" async></script>
                <script src="sidebar.js" defer async></script>
            </head>
            <body class="root mini">
                <div class="title-bar">
                    <h1 class="title">Information Sidebar</h1>
                    <div class="status-part">
                        <button class="status" id="status" title="Click to reconnect."></button>
                        <div class="ports">
                            <div class="port">
                                <span class="port-name">Port:</span>
                                <span id="port" style="margin-left:4px">${sidebarPort}</span>
                            </div>
                            <div class="port">
                                <span class="port-name">Socket port:</span>
                                <span id="socket-port" style="margin-left:4px">${daemonPort}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="body">
                    <div id="message" class="information" placeholder="Messages will be shown here"></div>
                </div>
            </body>
        </html>`;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        // sidebar.css
        // ===========
        // The sidebar and the sidebar changer's look.
        //
        // Part of sidebar.node.js
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        const sidebarCSS =
        `:root, html, body {
            width: 100vw;
            height: 100vh;
        }
        :root, html {
            background-color: transparent;
            background: none;
        }
        * {
            box-sizing: border-box;
            font-family: sans-serif;
        }
        code, kbd, output, pre {
            font-family: monospace;
        }
        .root, body {
            display: flex;
            flex-direction: column;
            margin: 0px;
            background-color: #f0f0f0;
            color: black;
            border: 1px solid #c0c0c0;
        }
        .root.mini .title-bar {
            display: none;
        }
        .root.mini .body {
            margin: 1px;
        }
        input[type=text],
        input[type=number],
        input[type=date],
        input[type=password],
        input[type=search],
        input[type=url],
        select,
        textarea {
            background-color: white;
            border: 1px solid #c0c0c0;
            border-radius: 0px;
        }
        textarea {
            overflow: scroll;
        }
        button,
        input[type=button],
        input[type=submit] {
            background-color: #f0f0f0;
            border: 1px solid #c0c0c0;
            border-radius: 0px;
            transition-duration: 0.25s;
        }
        button:hover,
        input[type=button]:hover,
        input[type=submit]:hover {
            background-color: #f8f8f8;
        }
        button:active,
        input[type=button]:active,
        input[type=submit]:active {
            background-color: #e0e0e0;
        }
        .title-bar {
            display: flex;
            align-items: flex-end;
            flex-direction: row;
            margin: 8px;
        }
        body > * + * {
            margin: 0px 8px 8px 8px;
        }
        .title {
            width: 100%;
            height: 100%;
            margin: 0px;
            font-size: 21pt;
            font-weight: 300;
            user-select: none;
        }
        .sidebar {
            display: flex;
            flex-direction: column;
        }
        .status-part {
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            align-items: flex-end;
            text-transform: uppercase;
            font-size: 7pt;
            font-style: normal;
            white-space: nowrap;
        }
        .status-part > * {
            padding: 2px;
            text-transform: uppercase;
            font-size: 7pt;
            font-style: normal;
            white-space: nowrap;
        }
        .status {
            display: flex;
            flex-direction: row;
            font-weight: bold;
            padding: 2px;
            pointer-events: all;
            background-color: transparent;
            border: 0px solid;
        }
        .status:hover {
            background-color: darkgray;
            background-color: rgba(0, 0, 0, 0.25);
        }
        .status:active {
            background-color: gray;
            background-color: rgba(0, 0, 0, 0.5);
        }
        .status[condition=disconnected],
        .status[condition=error] {
            pointer-events: all;
        }
        .status[condition=disconnected]::before {
            content: "${process.env.CODESPACES == "true"? "Codespaces" : "Socket"} Disconnected";
            color: maroon;
        }
        .status[condition=error]::before {
            content: "Error";
            color: maroon;
        }
        .status[condition=connecting]::before {
            content: "";
            display: inline-block;
            width: 8px;
            height: 8px;
            border: 1px solid;
            border-bottom: 1px solid transparent;
            border-radius: 10px;
            animation: spin 1s linear infinite;
        }
        .status[condition=connecting]::after {
            content: "Connecting...";
            margin-left: 4px;
            color: gray;
        }
        .status[condition=connected]::before {
            content: "${process.env.CODESPACES == "true"? "Codespaces" : "Socket"} Connected";
            color: green;
        }
        .ports {
            display: flex;
            flex-direction: row;
        }
        .port {
            display: flex;
            flex-direction: row;
        }
        .port + .port {
            margin-left: 4px;
        }
        .port .port-name {
            font-weight: bold;
        }
        .body {
            background-color: white;
            border: 1px solid #c0c0c0;
            padding: 8px;
            height: 100%;
            overflow: auto;
        }
        .body[condition=error],
        .body[condition=disconnected] {
            background-color: #ffe8e8;
        }
        .body[condition=connected] {
            animation: 1s connected linear;
        }
        .information {
            width: 100%;
            height: 100%;
            resize: none;
            background-color: transparent;
            border: 0px solid;
            border-radius: 0px;
            font-size: 9pt;
        }
        .information p {
            margin: 0px;
        }
        .information p + p {
            margin-top: 12px;
        }
        .information::placeholder {
            font-style: italic;
            color: black;
            opacity: 1;
        }
        .buttons-group {
            display: flex;
            flex-direction: row;
            gap: 4px;
        }
        .form {
            display: flex;
            flex-direction: column;
            height: 100%;
            margin: 8px;
        }
        .form-submit {
            height: 32px;
            width: 100%;
            transition-duration: 0.25s;
        }
        .form-submit[condition=error] {
            background-color: #f2d9d9;
            border: 1px solid #f08080;
            box-shadow: 0px 0px 4px rgba(224, 0, 0, 0.5);
        }
        .form-submit[condition=error]:hover {
            background-color: #f2d9d9;
            border: 1px solid #f08080;
            box-shadow: 0px 0px 4px rgba(255, 0, 0, 0.5) inset,
                        0px 0px 8px rgba(255, 0, 0, 0.25)
        }
        .form-submit[condition=error]:active {
            background-color: #c00000;
            color: white;
            border: 1px solid #800000;
            box-shadow: 0px 0px 4px red inset,
                        0px 0px 8px rgba(255, 0, 0, 0.25)
        }
        #update-sidebar-resizer {
            height: 4px;
            width: 100%;
            background-color: #c0c0c0;
            box-sizing: content-box;
            margin-bottom: 8px;
        }
        .update-sidebar {
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        .update-sidebar > * + * {
            margin-top: 4px;
        }
        .update-sidebar table {
            border-collapse: collapse;
            border: 0px solid;
            width: 100%;
            height: 100%;
        }
        .update-sidebar table td {
            vertical-align: top;
        }
        .update-sidebar table label {
            width: auto;
        }
        .update-sidebar textarea {
            font-family: monospace;
            resize: none;
        }
        #message-type {
            padding: 4px;
        }
        #message-content {
            height: 100%;
        }
        @keyframes spin {
            from { transform: rotate(0deg)   }
            to   { transform: rotate(359deg) }
        }
        @keyframes connected {
            from { background-color: #e8ffe8 }
            to   { background-color: white   }
        }
        @media only screen and (max-width: 280px) {
            .title {
                font-size: 18pt;
            }
        }
        @media only screen and (max-width: 425px) {
            .title-bar {
                flex-direction: column-reverse;
                align-items: flex-start;
            }
            .status-part {
                width: 100%;
                margin-bottom: 8px;
                padding-bottom: 6px;
                flex-direction: row;
                justify-content: space-between;
                align-content: center;
                border-bottom: 1px solid #c0c0c0;
            }
        }`;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        // sidebar.js
        // ==========
        // The sidebar's behavior.
        //
        // Part of sidebar.node.js
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        const sidebarJS = 
	    `try {
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
								if (typeof callback === "function") callback($i("status").getAttribute("condition"));
	                        };
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
	                if (typeof error === "function") error(e);
	            };
	        };
	        startWebSocket(null, null)
        } catch(x) {
        	alert(x)
        }`;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        // form.htm
        // ========
        // The sidebar changer UI.
        //
        // Part of sidebar.node.js
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        const formHTML =
        `<!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Update Sidebar</title>
                <link rel="stylesheet" href="sidebar.css">
                <script src="purify.min.js" defer async></script>
                <script src="marked.min.js" defer async></script>
                <script src="form.js" defer async></script>
            </head>
            <body class="root">
                <div class="title-bar">
                    <h1 class="title">Update Sidebar</h1>
                    <div class="status-part">
                        <button class="status" id="status" title="Click to reconnect."></button>
                        <div class="ports">
                            <div class="port">
                                <span class="port-name">Port:</span>
                                <span id="port" style="margin-left:4px">${formPort}</span>
                            </div>
                            <div class="port">
                                <span class="port-name">Socket port:</span>
                                <span id="socket-port" style="margin-left:4px">${daemonPort}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form" id="form" style="height:100%;margin-top:0px">
                    <section id="update-sidebar" class="update-sidebar">
                        <select id="message-type" style="width:100%">
                            <option value="">Select a type</option>
                            <option value="plain">Plain text</option>
                            <option value="markdown">Markdown</option>
                        </select>
                        <textarea id="message-content" placeholder="Type a message" wrap="off" style="width:100%"></textarea>
                        <div class="buttons-group">
                            <button onclick="send()" class="form-submit">Update</button>
                            <button id="preview-message" onclick="preview()" style="width:100%">Preview</button>
                        </div>
                    </section>
                </div>
            </body>
        </html>`;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        // form.js
        // =======
        // The sidebar changer's behavior.
        //
        // Part of sidebar.node.js
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        const formJS = 
        `var ws = {};

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
                    if (typeof callback === "function" && ws.readyState === 1) callback($i("status").getAttribute("condition"));
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
        
        document.addEventListener("load", getMessageOnLoad);`;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        // marked.min.js
        // =============
        // The Markdown parser for the sidebar message.
        //
        // Copyright (c) 2011-2023, Christopher Jeffrey.
        //
        // GitHub repository: https://github.com/markedjs/marked 
        // This is licensed under the MIT license; see LICENSE.md for more information.
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        const markedJS =
        "!function(e,t){\"object\"==typeof exports&&\"undefined\"!=typeof module?t(exports):\"function\"==typeof define&&define.amd?define([\"exports\"],t):t((e=\"undefined\"!=typeof globalThis?globalThis:e||self).marked={})}(this,function(r){\"use strict\";function i(e,t){for(var u=0;u<t.length;u++){var n=t[u];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(e,function(e){e=function(e,t){if(\"object\"!=typeof e||null===e)return e;var u=e[Symbol.toPrimitive];if(void 0===u)return(\"string\"===t?String:Number)(e);u=u.call(e,t||\"default\");if(\"object\"!=typeof u)return u;throw new TypeError(\"@@toPrimitive must return a primitive value.\")}(e,\"string\");return\"symbol\"==typeof e?e:String(e)}(n.key),n)}}function F(){return(F=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var u,n=arguments[t];for(u in n)Object.prototype.hasOwnProperty.call(n,u)&&(e[u]=n[u])}return e}).apply(this,arguments)}function s(e,t){(null==t||t>e.length)&&(t=e.length);for(var u=0,n=new Array(t);u<t;u++)n[u]=e[u];return n}function D(e,t){var u,n=\"undefined\"!=typeof Symbol&&e[Symbol.iterator]||e[\"@@iterator\"];if(n)return(n=n.call(e)).next.bind(n);if(Array.isArray(e)||(n=function(e,t){var u;if(e)return\"string\"==typeof e?s(e,t):\"Map\"===(u=\"Object\"===(u=Object.prototype.toString.call(e).slice(8,-1))&&e.constructor?e.constructor.name:u)||\"Set\"===u?Array.from(e):\"Arguments\"===u||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(u)?s(e,t):void 0}(e))||t&&e&&\"number\"==typeof e.length)return n&&(e=n),u=0,function(){return u>=e.length?{done:!0}:{done:!1,value:e[u++]}};throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\")}function e(){return{async:!1,baseUrl:null,breaks:!1,extensions:null,gfm:!0,headerIds:!0,headerPrefix:\"\",highlight:null,hooks:null,langPrefix:\"language-\",mangle:!0,pedantic:!1,renderer:null,sanitize:!1,sanitizer:null,silent:!1,smartypants:!1,tokenizer:null,walkTokens:null,xhtml:!1}}r.defaults=e();function u(e){return t[e]}var n=/[&<>\"\']/,l=new RegExp(n.source,\"g\"),o=/[<>\"\']|&(?!(#\\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\\w+);)/,a=new RegExp(o.source,\"g\"),t={\"&\":\"&amp;\",\"<\":\"&lt;\",\">\":\"&gt;\",\'\"\':\"&quot;\",\"\'\":\"&#39;\"};function A(e,t){if(t){if(n.test(e))return e.replace(l,u)}else if(o.test(e))return e.replace(a,u);return e}var c=/&(#(?:\\d+)|(?:#x[0-9A-Fa-f]+)|(?:\\w+));?/gi;function x(e){return e.replace(c,function(e,t){return\"colon\"===(t=t.toLowerCase())?\":\":\"#\"===t.charAt(0)?\"x\"===t.charAt(1)?String.fromCharCode(parseInt(t.substring(2),16)):String.fromCharCode(+t.substring(1)):\"\"})}var h=/(^|[^\\[])\\^/g;function p(u,e){u=\"string\"==typeof u?u:u.source,e=e||\"\";var n={replace:function(e,t){return t=(t=t.source||t).replace(h,\"$1\"),u=u.replace(e,t),n},getRegex:function(){return new RegExp(u,e)}};return n}var Z=/[^\\w:]/g,O=/^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;function f(e,t,u){if(e){try{n=decodeURIComponent(x(u)).replace(Z,\"\").toLowerCase()}catch(e){return null}if(0===n.indexOf(\"javascript:\")||0===n.indexOf(\"vbscript:\")||0===n.indexOf(\"data:\"))return null}var n;t&&!O.test(u)&&(e=u,g[\" \"+(n=t)]||(q.test(n)?g[\" \"+n]=n+\"/\":g[\" \"+n]=C(n,\"/\",!0)),t=-1===(n=g[\" \"+n]).indexOf(\":\"),u=\"//\"===e.substring(0,2)?t?e:n.replace(j,\"$1\")+e:\"/\"===e.charAt(0)?t?e:n.replace(P,\"$1\")+e:n+e);try{u=encodeURI(u).replace(/%25/g,\"%\")}catch(e){return null}return u}var g={},q=/^[^:]+:\\/*[^/]*$/,j=/^([^:]+:)[\\s\\S]*$/,P=/^([^:]+:\\/*[^/]*)[\\s\\S]*$/;var k={exec:function(){}};function d(e,t){var u=e.replace(/\\|/g,function(e,t,u){for(var n=!1,r=t;0<=--r&&\"\\\\\"===u[r];)n=!n;return n?\"|\":\" |\"}).split(/ \\|/),n=0;if(u[0].trim()||u.shift(),0<u.length&&!u[u.length-1].trim()&&u.pop(),u.length>t)u.splice(t);else for(;u.length<t;)u.push(\"\");for(;n<u.length;n++)u[n]=u[n].trim().replace(/\\\\\\|/g,\"|\");return u}function C(e,t,u){var n=e.length;if(0===n)return\"\";for(var r=0;r<n;){var i=e.charAt(n-r-1);if((i!==t||u)&&(i===t||!u))break;r++}return e.slice(0,n-r)}function E(e,t){if(t<1)return\"\";for(var u=\"\";1<t;)1&t&&(u+=e),t>>=1,e+=e;return u+e}function m(e,t,u,n){var r=t.href,t=t.title?A(t.title):null,i=e[1].replace(/\\\\([\\[\\]])/g,\"$1\");return\"!\"!==e[0].charAt(0)?(n.state.inLink=!0,e={type:\"link\",raw:u,href:r,title:t,text:i,tokens:n.inlineTokens(i)},n.state.inLink=!1,e):{type:\"image\",raw:u,href:r,title:t,text:A(i)}}var b=function(){function e(e){this.options=e||r.defaults}var t=e.prototype;return t.space=function(e){e=this.rules.block.newline.exec(e);if(e&&0<e[0].length)return{type:\"space\",raw:e[0]}},t.code=function(e){var t,e=this.rules.block.code.exec(e);if(e)return t=e[0].replace(/^ {1,4}/gm,\"\"),{type:\"code\",raw:e[0],codeBlockStyle:\"indented\",text:this.options.pedantic?t:C(t,\"\\n\")}},t.fences=function(e){var t,u,n,r,e=this.rules.block.fences.exec(e);if(e)return t=e[0],u=t,n=e[3]||\"\",u=null===(u=t.match(/^(\\s+)(?:```)/))?n:(r=u[1],n.split(\"\\n\").map(function(e){var t=e.match(/^\\s+/);return null!==t&&t[0].length>=r.length?e.slice(r.length):e}).join(\"\\n\")),{type:\"code\",raw:t,lang:e[2]&&e[2].trim().replace(this.rules.inline._escapes,\"$1\"),text:u}},t.heading=function(e){var t,u,e=this.rules.block.heading.exec(e);if(e)return t=e[2].trim(),/#$/.test(t)&&(u=C(t,\"#\"),!this.options.pedantic&&u&&!/ $/.test(u)||(t=u.trim())),{type:\"heading\",raw:e[0],depth:e[1].length,text:t,tokens:this.lexer.inline(t)}},t.hr=function(e){e=this.rules.block.hr.exec(e);if(e)return{type:\"hr\",raw:e[0]}},t.blockquote=function(e){var t,u,n,e=this.rules.block.blockquote.exec(e);if(e)return t=e[0].replace(/^ *>[ \\t]?/gm,\"\"),u=this.lexer.state.top,this.lexer.state.top=!0,n=this.lexer.blockTokens(t),this.lexer.state.top=u,{type:\"blockquote\",raw:e[0],tokens:n,text:t}},t.list=function(e){var t=this.rules.block.list.exec(e);if(t){var u,n,r,i,s,l,o,a,D,c,h,p=1<(g=t[1].trim()).length,f={type:\"list\",raw:\"\",ordered:p,start:p?+g.slice(0,-1):\"\",loose:!1,items:[]},g=p?\"\\\\d{1,9}\\\\\"+g.slice(-1):\"\\\\\"+g;this.options.pedantic&&(g=p?g:\"[*+-]\");for(var F=new RegExp(\"^( {0,3}\"+g+\")((?:[\\t ][^\\\\n]*)?(?:\\\\n|$))\");e&&(h=!1,t=F.exec(e))&&!this.rules.block.hr.test(e);){if(u=t[0],e=e.substring(u.length),o=t[2].split(\"\\n\",1)[0].replace(/^\\t+/,function(e){return\" \".repeat(3*e.length)}),a=e.split(\"\\n\",1)[0],this.options.pedantic?(i=2,c=o.trimLeft()):(i=t[2].search(/[^ ]/),c=o.slice(i=4<i?1:i),i+=t[1].length),s=!1,!o&&/^ *$/.test(a)&&(u+=a+\"\\n\",e=e.substring(a.length+1),h=!0),!h)for(var A=new RegExp(\"^ {0,\"+Math.min(3,i-1)+\"}(?:[*+-]|\\\\d{1,9}[.)])((?:[ \\t][^\\\\n]*)?(?:\\\\n|$))\"),k=new RegExp(\"^ {0,\"+Math.min(3,i-1)+\"}((?:- *){3,}|(?:_ *){3,}|(?:\\\\* *){3,})(?:\\\\n+|$)\"),d=new RegExp(\"^ {0,\"+Math.min(3,i-1)+\"}(?:```|~~~)\"),C=new RegExp(\"^ {0,\"+Math.min(3,i-1)+\"}#\");e&&(a=D=e.split(\"\\n\",1)[0],this.options.pedantic&&(a=a.replace(/^ {1,4}(?=( {4})*[^ ])/g,\"  \")),!d.test(a))&&!C.test(a)&&!A.test(a)&&!k.test(e);){if(a.search(/[^ ]/)>=i||!a.trim())c+=\"\\n\"+a.slice(i);else{if(s)break;if(4<=o.search(/[^ ]/))break;if(d.test(o))break;if(C.test(o))break;if(k.test(o))break;c+=\"\\n\"+a}s||a.trim()||(s=!0),u+=D+\"\\n\",e=e.substring(D.length+1),o=a.slice(i)}f.loose||(l?f.loose=!0:/\\n *\\n *$/.test(u)&&(l=!0)),this.options.gfm&&(n=/^\\[[ xX]\\] /.exec(c))&&(r=\"[ ] \"!==n[0],c=c.replace(/^\\[[ xX]\\] +/,\"\")),f.items.push({type:\"list_item\",raw:u,task:!!n,checked:r,loose:!1,text:c}),f.raw+=u}f.items[f.items.length-1].raw=u.trimRight(),f.items[f.items.length-1].text=c.trimRight(),f.raw=f.raw.trimRight();for(var E,x=f.items.length,m=0;m<x;m++)this.lexer.state.top=!1,f.items[m].tokens=this.lexer.blockTokens(f.items[m].text,[]),f.loose||(E=0<(E=f.items[m].tokens.filter(function(e){return\"space\"===e.type})).length&&E.some(function(e){return/\\n.*\\n/.test(e.raw)}),f.loose=E);if(f.loose)for(m=0;m<x;m++)f.items[m].loose=!0;return f}},t.html=function(e){var t,e=this.rules.block.html.exec(e);if(e)return t={type:\"html\",raw:e[0],pre:!this.options.sanitizer&&(\"pre\"===e[1]||\"script\"===e[1]||\"style\"===e[1]),text:e[0]},this.options.sanitize&&(e=this.options.sanitizer?this.options.sanitizer(e[0]):A(e[0]),t.type=\"paragraph\",t.text=e,t.tokens=this.lexer.inline(e)),t},t.def=function(e){var t,u,n,e=this.rules.block.def.exec(e);if(e)return t=e[1].toLowerCase().replace(/\\s+/g,\" \"),u=e[2]?e[2].replace(/^<(.*)>$/,\"$1\").replace(this.rules.inline._escapes,\"$1\"):\"\",n=e[3]&&e[3].substring(1,e[3].length-1).replace(this.rules.inline._escapes,\"$1\"),{type:\"def\",tag:t,raw:e[0],href:u,title:n}},t.table=function(e){e=this.rules.block.table.exec(e);if(e){var t={type:\"table\",header:d(e[1]).map(function(e){return{text:e}}),align:e[2].replace(/^ *|\\| *$/g,\"\").split(/ *\\| */),rows:e[3]&&e[3].trim()?e[3].replace(/\\n[ \\t]*$/,\"\").split(\"\\n\"):[]};if(t.header.length===t.align.length){t.raw=e[0];for(var u,n,r,i=t.align.length,s=0;s<i;s++)/^ *-+: *$/.test(t.align[s])?t.align[s]=\"right\":/^ *:-+: *$/.test(t.align[s])?t.align[s]=\"center\":/^ *:-+ *$/.test(t.align[s])?t.align[s]=\"left\":t.align[s]=null;for(i=t.rows.length,s=0;s<i;s++)t.rows[s]=d(t.rows[s],t.header.length).map(function(e){return{text:e}});for(i=t.header.length,u=0;u<i;u++)t.header[u].tokens=this.lexer.inline(t.header[u].text);for(i=t.rows.length,u=0;u<i;u++)for(r=t.rows[u],n=0;n<r.length;n++)r[n].tokens=this.lexer.inline(r[n].text);return t}}},t.lheading=function(e){e=this.rules.block.lheading.exec(e);if(e)return{type:\"heading\",raw:e[0],depth:\"=\"===e[2].charAt(0)?1:2,text:e[1],tokens:this.lexer.inline(e[1])}},t.paragraph=function(e){var t,e=this.rules.block.paragraph.exec(e);if(e)return t=\"\\n\"===e[1].charAt(e[1].length-1)?e[1].slice(0,-1):e[1],{type:\"paragraph\",raw:e[0],text:t,tokens:this.lexer.inline(t)}},t.text=function(e){e=this.rules.block.text.exec(e);if(e)return{type:\"text\",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}},t.escape=function(e){e=this.rules.inline.escape.exec(e);if(e)return{type:\"escape\",raw:e[0],text:A(e[1])}},t.tag=function(e){e=this.rules.inline.tag.exec(e);if(e)return!this.lexer.state.inLink&&/^<a /i.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&/^<\\/a>/i.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&/^<(pre|code|kbd|script)(\\s|>)/i.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&/^<\\/(pre|code|kbd|script)(\\s|>)/i.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:this.options.sanitize?\"text\":\"html\",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,text:this.options.sanitize?this.options.sanitizer?this.options.sanitizer(e[0]):A(e[0]):e[0]}},t.link=function(e){e=this.rules.inline.link.exec(e);if(e){var t=e[2].trim();if(!this.options.pedantic&&/^</.test(t)){if(!/>$/.test(t))return;var u=C(t.slice(0,-1),\"\\\\\");if((t.length-u.length)%2==0)return}else{u=function(e,t){if(-1!==e.indexOf(t[1]))for(var u=e.length,n=0,r=0;r<u;r++)if(\"\\\\\"===e[r])r++;else if(e[r]===t[0])n++;else if(e[r]===t[1]&&--n<0)return r;return-1}(e[2],\"()\");-1<u&&(r=(0===e[0].indexOf(\"!\")?5:4)+e[1].length+u,e[2]=e[2].substring(0,u),e[0]=e[0].substring(0,r).trim(),e[3]=\"\")}var n,u=e[2],r=\"\";return this.options.pedantic?(n=/^([^\'\"]*[^\\s])\\s+([\'\"])(.*)\\2/.exec(u))&&(u=n[1],r=n[3]):r=e[3]?e[3].slice(1,-1):\"\",u=u.trim(),m(e,{href:(u=/^</.test(u)?this.options.pedantic&&!/>$/.test(t)?u.slice(1):u.slice(1,-1):u)&&u.replace(this.rules.inline._escapes,\"$1\"),title:r&&r.replace(this.rules.inline._escapes,\"$1\")},e[0],this.lexer)}},t.reflink=function(e,t){var u;if(u=(u=this.rules.inline.reflink.exec(e))||this.rules.inline.nolink.exec(e))return(e=t[(e=(u[2]||u[1]).replace(/\\s+/g,\" \")).toLowerCase()])?m(u,e,u[0],this.lexer):{type:\"text\",raw:t=u[0].charAt(0),text:t}},t.emStrong=function(e,t,u){void 0===u&&(u=\"\");var n=this.rules.inline.emStrong.lDelim.exec(e);if(n&&(!n[3]||!u.match(/(?:[0-9A-Za-z\\xAA\\xB2\\xB3\\xB5\\xB9\\xBA\\xBC-\\xBE\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u037F\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u052F\\u0531-\\u0556\\u0559\\u0560-\\u0588\\u05D0-\\u05EA\\u05EF-\\u05F2\\u0620-\\u064A\\u0660-\\u0669\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07C0-\\u07EA\\u07F4\\u07F5\\u07FA\\u0800-\\u0815\\u081A\\u0824\\u0828\\u0840-\\u0858\\u0860-\\u086A\\u0870-\\u0887\\u0889-\\u088E\\u08A0-\\u08C9\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0966-\\u096F\\u0971-\\u0980\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09E6-\\u09F1\\u09F4-\\u09F9\\u09FC\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A66-\\u0A6F\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0AE6-\\u0AEF\\u0AF9\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B66-\\u0B6F\\u0B71-\\u0B77\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0BE6-\\u0BF2\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C39\\u0C3D\\u0C58-\\u0C5A\\u0C5D\\u0C60\\u0C61\\u0C66-\\u0C6F\\u0C78-\\u0C7E\\u0C80\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDD\\u0CDE\\u0CE0\\u0CE1\\u0CE6-\\u0CEF\\u0CF1\\u0CF2\\u0D04-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D3A\\u0D3D\\u0D4E\\u0D54-\\u0D56\\u0D58-\\u0D61\\u0D66-\\u0D78\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0DE6-\\u0DEF\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E50-\\u0E59\\u0E81\\u0E82\\u0E84\\u0E86-\\u0E8A\\u0E8C-\\u0EA3\\u0EA5\\u0EA7-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0ED0-\\u0ED9\\u0EDC-\\u0EDF\\u0F00\\u0F20-\\u0F33\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8C\\u1000-\\u102A\\u103F-\\u1049\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u1090-\\u1099\\u10A0-\\u10C5\\u10C7\\u10CD\\u10D0-\\u10FA\\u10FC-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1369-\\u137C\\u1380-\\u138F\\u13A0-\\u13F5\\u13F8-\\u13FD\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u16EE-\\u16F8\\u1700-\\u1711\\u171F-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u17E0-\\u17E9\\u17F0-\\u17F9\\u1810-\\u1819\\u1820-\\u1878\\u1880-\\u1884\\u1887-\\u18A8\\u18AA\\u18B0-\\u18F5\\u1900-\\u191E\\u1946-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19B0-\\u19C9\\u19D0-\\u19DA\\u1A00-\\u1A16\\u1A20-\\u1A54\\u1A80-\\u1A89\\u1A90-\\u1A99\\u1AA7\\u1B05-\\u1B33\\u1B45-\\u1B4C\\u1B50-\\u1B59\\u1B83-\\u1BA0\\u1BAE-\\u1BE5\\u1C00-\\u1C23\\u1C40-\\u1C49\\u1C4D-\\u1C7D\\u1C80-\\u1C88\\u1C90-\\u1CBA\\u1CBD-\\u1CBF\\u1CE9-\\u1CEC\\u1CEE-\\u1CF3\\u1CF5\\u1CF6\\u1CFA\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2070\\u2071\\u2074-\\u2079\\u207F-\\u2089\\u2090-\\u209C\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2150-\\u2189\\u2460-\\u249B\\u24EA-\\u24FF\\u2776-\\u2793\\u2C00-\\u2CE4\\u2CEB-\\u2CEE\\u2CF2\\u2CF3\\u2CFD\\u2D00-\\u2D25\\u2D27\\u2D2D\\u2D30-\\u2D67\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005-\\u3007\\u3021-\\u3029\\u3031-\\u3035\\u3038-\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312F\\u3131-\\u318E\\u3192-\\u3195\\u31A0-\\u31BF\\u31F0-\\u31FF\\u3220-\\u3229\\u3248-\\u324F\\u3251-\\u325F\\u3280-\\u3289\\u32B1-\\u32BF\\u3400-\\u4DBF\\u4E00-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C\\uA610-\\uA62B\\uA640-\\uA66E\\uA67F-\\uA69D\\uA6A0-\\uA6EF\\uA717-\\uA71F\\uA722-\\uA788\\uA78B-\\uA7CA\\uA7D0\\uA7D1\\uA7D3\\uA7D5-\\uA7D9\\uA7F2-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA830-\\uA835\\uA840-\\uA873\\uA882-\\uA8B3\\uA8D0-\\uA8D9\\uA8F2-\\uA8F7\\uA8FB\\uA8FD\\uA8FE\\uA900-\\uA925\\uA930-\\uA946\\uA960-\\uA97C\\uA984-\\uA9B2\\uA9CF-\\uA9D9\\uA9E0-\\uA9E4\\uA9E6-\\uA9FE\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAA50-\\uAA59\\uAA60-\\uAA76\\uAA7A\\uAA7E-\\uAAAF\\uAAB1\\uAAB5\\uAAB6\\uAAB9-\\uAABD\\uAAC0\\uAAC2\\uAADB-\\uAADD\\uAAE0-\\uAAEA\\uAAF2-\\uAAF4\\uAB01-\\uAB06\\uAB09-\\uAB0E\\uAB11-\\uAB16\\uAB20-\\uAB26\\uAB28-\\uAB2E\\uAB30-\\uAB5A\\uAB5C-\\uAB69\\uAB70-\\uABE2\\uABF0-\\uABF9\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA6D\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF10-\\uFF19\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]|\\uD800[\\uDC00-\\uDC0B\\uDC0D-\\uDC26\\uDC28-\\uDC3A\\uDC3C\\uDC3D\\uDC3F-\\uDC4D\\uDC50-\\uDC5D\\uDC80-\\uDCFA\\uDD07-\\uDD33\\uDD40-\\uDD78\\uDD8A\\uDD8B\\uDE80-\\uDE9C\\uDEA0-\\uDED0\\uDEE1-\\uDEFB\\uDF00-\\uDF23\\uDF2D-\\uDF4A\\uDF50-\\uDF75\\uDF80-\\uDF9D\\uDFA0-\\uDFC3\\uDFC8-\\uDFCF\\uDFD1-\\uDFD5]|\\uD801[\\uDC00-\\uDC9D\\uDCA0-\\uDCA9\\uDCB0-\\uDCD3\\uDCD8-\\uDCFB\\uDD00-\\uDD27\\uDD30-\\uDD63\\uDD70-\\uDD7A\\uDD7C-\\uDD8A\\uDD8C-\\uDD92\\uDD94\\uDD95\\uDD97-\\uDDA1\\uDDA3-\\uDDB1\\uDDB3-\\uDDB9\\uDDBB\\uDDBC\\uDE00-\\uDF36\\uDF40-\\uDF55\\uDF60-\\uDF67\\uDF80-\\uDF85\\uDF87-\\uDFB0\\uDFB2-\\uDFBA]|\\uD802[\\uDC00-\\uDC05\\uDC08\\uDC0A-\\uDC35\\uDC37\\uDC38\\uDC3C\\uDC3F-\\uDC55\\uDC58-\\uDC76\\uDC79-\\uDC9E\\uDCA7-\\uDCAF\\uDCE0-\\uDCF2\\uDCF4\\uDCF5\\uDCFB-\\uDD1B\\uDD20-\\uDD39\\uDD80-\\uDDB7\\uDDBC-\\uDDCF\\uDDD2-\\uDE00\\uDE10-\\uDE13\\uDE15-\\uDE17\\uDE19-\\uDE35\\uDE40-\\uDE48\\uDE60-\\uDE7E\\uDE80-\\uDE9F\\uDEC0-\\uDEC7\\uDEC9-\\uDEE4\\uDEEB-\\uDEEF\\uDF00-\\uDF35\\uDF40-\\uDF55\\uDF58-\\uDF72\\uDF78-\\uDF91\\uDFA9-\\uDFAF]|\\uD803[\\uDC00-\\uDC48\\uDC80-\\uDCB2\\uDCC0-\\uDCF2\\uDCFA-\\uDD23\\uDD30-\\uDD39\\uDE60-\\uDE7E\\uDE80-\\uDEA9\\uDEB0\\uDEB1\\uDF00-\\uDF27\\uDF30-\\uDF45\\uDF51-\\uDF54\\uDF70-\\uDF81\\uDFB0-\\uDFCB\\uDFE0-\\uDFF6]|\\uD804[\\uDC03-\\uDC37\\uDC52-\\uDC6F\\uDC71\\uDC72\\uDC75\\uDC83-\\uDCAF\\uDCD0-\\uDCE8\\uDCF0-\\uDCF9\\uDD03-\\uDD26\\uDD36-\\uDD3F\\uDD44\\uDD47\\uDD50-\\uDD72\\uDD76\\uDD83-\\uDDB2\\uDDC1-\\uDDC4\\uDDD0-\\uDDDA\\uDDDC\\uDDE1-\\uDDF4\\uDE00-\\uDE11\\uDE13-\\uDE2B\\uDE80-\\uDE86\\uDE88\\uDE8A-\\uDE8D\\uDE8F-\\uDE9D\\uDE9F-\\uDEA8\\uDEB0-\\uDEDE\\uDEF0-\\uDEF9\\uDF05-\\uDF0C\\uDF0F\\uDF10\\uDF13-\\uDF28\\uDF2A-\\uDF30\\uDF32\\uDF33\\uDF35-\\uDF39\\uDF3D\\uDF50\\uDF5D-\\uDF61]|\\uD805[\\uDC00-\\uDC34\\uDC47-\\uDC4A\\uDC50-\\uDC59\\uDC5F-\\uDC61\\uDC80-\\uDCAF\\uDCC4\\uDCC5\\uDCC7\\uDCD0-\\uDCD9\\uDD80-\\uDDAE\\uDDD8-\\uDDDB\\uDE00-\\uDE2F\\uDE44\\uDE50-\\uDE59\\uDE80-\\uDEAA\\uDEB8\\uDEC0-\\uDEC9\\uDF00-\\uDF1A\\uDF30-\\uDF3B\\uDF40-\\uDF46]|\\uD806[\\uDC00-\\uDC2B\\uDCA0-\\uDCF2\\uDCFF-\\uDD06\\uDD09\\uDD0C-\\uDD13\\uDD15\\uDD16\\uDD18-\\uDD2F\\uDD3F\\uDD41\\uDD50-\\uDD59\\uDDA0-\\uDDA7\\uDDAA-\\uDDD0\\uDDE1\\uDDE3\\uDE00\\uDE0B-\\uDE32\\uDE3A\\uDE50\\uDE5C-\\uDE89\\uDE9D\\uDEB0-\\uDEF8]|\\uD807[\\uDC00-\\uDC08\\uDC0A-\\uDC2E\\uDC40\\uDC50-\\uDC6C\\uDC72-\\uDC8F\\uDD00-\\uDD06\\uDD08\\uDD09\\uDD0B-\\uDD30\\uDD46\\uDD50-\\uDD59\\uDD60-\\uDD65\\uDD67\\uDD68\\uDD6A-\\uDD89\\uDD98\\uDDA0-\\uDDA9\\uDEE0-\\uDEF2\\uDFB0\\uDFC0-\\uDFD4]|\\uD808[\\uDC00-\\uDF99]|\\uD809[\\uDC00-\\uDC6E\\uDC80-\\uDD43]|\\uD80B[\\uDF90-\\uDFF0]|[\\uD80C\\uD81C-\\uD820\\uD822\\uD840-\\uD868\\uD86A-\\uD86C\\uD86F-\\uD872\\uD874-\\uD879\\uD880-\\uD883][\\uDC00-\\uDFFF]|\\uD80D[\\uDC00-\\uDC2E]|\\uD811[\\uDC00-\\uDE46]|\\uD81A[\\uDC00-\\uDE38\\uDE40-\\uDE5E\\uDE60-\\uDE69\\uDE70-\\uDEBE\\uDEC0-\\uDEC9\\uDED0-\\uDEED\\uDF00-\\uDF2F\\uDF40-\\uDF43\\uDF50-\\uDF59\\uDF5B-\\uDF61\\uDF63-\\uDF77\\uDF7D-\\uDF8F]|\\uD81B[\\uDE40-\\uDE96\\uDF00-\\uDF4A\\uDF50\\uDF93-\\uDF9F\\uDFE0\\uDFE1\\uDFE3]|\\uD821[\\uDC00-\\uDFF7]|\\uD823[\\uDC00-\\uDCD5\\uDD00-\\uDD08]|\\uD82B[\\uDFF0-\\uDFF3\\uDFF5-\\uDFFB\\uDFFD\\uDFFE]|\\uD82C[\\uDC00-\\uDD22\\uDD50-\\uDD52\\uDD64-\\uDD67\\uDD70-\\uDEFB]|\\uD82F[\\uDC00-\\uDC6A\\uDC70-\\uDC7C\\uDC80-\\uDC88\\uDC90-\\uDC99]|\\uD834[\\uDEE0-\\uDEF3\\uDF60-\\uDF78]|\\uD835[\\uDC00-\\uDC54\\uDC56-\\uDC9C\\uDC9E\\uDC9F\\uDCA2\\uDCA5\\uDCA6\\uDCA9-\\uDCAC\\uDCAE-\\uDCB9\\uDCBB\\uDCBD-\\uDCC3\\uDCC5-\\uDD05\\uDD07-\\uDD0A\\uDD0D-\\uDD14\\uDD16-\\uDD1C\\uDD1E-\\uDD39\\uDD3B-\\uDD3E\\uDD40-\\uDD44\\uDD46\\uDD4A-\\uDD50\\uDD52-\\uDEA5\\uDEA8-\\uDEC0\\uDEC2-\\uDEDA\\uDEDC-\\uDEFA\\uDEFC-\\uDF14\\uDF16-\\uDF34\\uDF36-\\uDF4E\\uDF50-\\uDF6E\\uDF70-\\uDF88\\uDF8A-\\uDFA8\\uDFAA-\\uDFC2\\uDFC4-\\uDFCB\\uDFCE-\\uDFFF]|\\uD837[\\uDF00-\\uDF1E]|\\uD838[\\uDD00-\\uDD2C\\uDD37-\\uDD3D\\uDD40-\\uDD49\\uDD4E\\uDE90-\\uDEAD\\uDEC0-\\uDEEB\\uDEF0-\\uDEF9]|\\uD839[\\uDFE0-\\uDFE6\\uDFE8-\\uDFEB\\uDFED\\uDFEE\\uDFF0-\\uDFFE]|\\uD83A[\\uDC00-\\uDCC4\\uDCC7-\\uDCCF\\uDD00-\\uDD43\\uDD4B\\uDD50-\\uDD59]|\\uD83B[\\uDC71-\\uDCAB\\uDCAD-\\uDCAF\\uDCB1-\\uDCB4\\uDD01-\\uDD2D\\uDD2F-\\uDD3D\\uDE00-\\uDE03\\uDE05-\\uDE1F\\uDE21\\uDE22\\uDE24\\uDE27\\uDE29-\\uDE32\\uDE34-\\uDE37\\uDE39\\uDE3B\\uDE42\\uDE47\\uDE49\\uDE4B\\uDE4D-\\uDE4F\\uDE51\\uDE52\\uDE54\\uDE57\\uDE59\\uDE5B\\uDE5D\\uDE5F\\uDE61\\uDE62\\uDE64\\uDE67-\\uDE6A\\uDE6C-\\uDE72\\uDE74-\\uDE77\\uDE79-\\uDE7C\\uDE7E\\uDE80-\\uDE89\\uDE8B-\\uDE9B\\uDEA1-\\uDEA3\\uDEA5-\\uDEA9\\uDEAB-\\uDEBB]|\\uD83C[\\uDD00-\\uDD0C]|\\uD83E[\\uDFF0-\\uDFF9]|\\uD869[\\uDC00-\\uDEDF\\uDF00-\\uDFFF]|\\uD86D[\\uDC00-\\uDF38\\uDF40-\\uDFFF]|\\uD86E[\\uDC00-\\uDC1D\\uDC20-\\uDFFF]|\\uD873[\\uDC00-\\uDEA1\\uDEB0-\\uDFFF]|\\uD87A[\\uDC00-\\uDFE0]|\\uD87E[\\uDC00-\\uDE1D]|\\uD884[\\uDC00-\\uDF4A])/))){var r=n[1]||n[2]||\"\";if(!r||\"\"===u||this.rules.inline.punctuation.exec(u)){var i=n[0].length-1,s=i,l=0,o=\"*\"===n[0][0]?this.rules.inline.emStrong.rDelimAst:this.rules.inline.emStrong.rDelimUnd;for(o.lastIndex=0,t=t.slice(-1*e.length+i);null!=(n=o.exec(t));){var a,D=n[1]||n[2]||n[3]||n[4]||n[5]||n[6];if(D)if(a=D.length,n[3]||n[4])s+=a;else if((n[5]||n[6])&&i%3&&!((i+a)%3))l+=a;else if(!(0<(s-=a)))return a=Math.min(a,a+s+l),D=e.slice(0,i+n.index+(n[0].length-D.length)+a),Math.min(i,a)%2?(a=D.slice(1,-1),{type:\"em\",raw:D,text:a,tokens:this.lexer.inlineTokens(a)}):(a=D.slice(2,-2),{type:\"strong\",raw:D,text:a,tokens:this.lexer.inlineTokens(a)})}}}},t.codespan=function(e){var t,u,n,e=this.rules.inline.code.exec(e);if(e)return n=e[2].replace(/\\n/g,\" \"),t=/[^ ]/.test(n),u=/^ /.test(n)&&/ $/.test(n),n=A(n=t&&u?n.substring(1,n.length-1):n,!0),{type:\"codespan\",raw:e[0],text:n}},t.br=function(e){e=this.rules.inline.br.exec(e);if(e)return{type:\"br\",raw:e[0]}},t.del=function(e){e=this.rules.inline.del.exec(e);if(e)return{type:\"del\",raw:e[0],text:e[2],tokens:this.lexer.inlineTokens(e[2])}},t.autolink=function(e,t){var u,e=this.rules.inline.autolink.exec(e);if(e)return t=\"@\"===e[2]?\"mailto:\"+(u=A(this.options.mangle?t(e[1]):e[1])):u=A(e[1]),{type:\"link\",raw:e[0],text:u,href:t,tokens:[{type:\"text\",raw:u,text:u}]}},t.url=function(e,t){var u,n,r,i;if(u=this.rules.inline.url.exec(e)){if(\"@\"===u[2])r=\"mailto:\"+(n=A(this.options.mangle?t(u[0]):u[0]));else{for(;i=u[0],u[0]=this.rules.inline._backpedal.exec(u[0])[0],i!==u[0];);n=A(u[0]),r=\"www.\"===u[1]?\"http://\"+u[0]:u[0]}return{type:\"link\",raw:u[0],text:n,href:r,tokens:[{type:\"text\",raw:n,text:n}]}}},t.inlineText=function(e,t){e=this.rules.inline.text.exec(e);if(e)return t=this.lexer.state.inRawBlock?this.options.sanitize?this.options.sanitizer?this.options.sanitizer(e[0]):A(e[0]):e[0]:A(this.options.smartypants?t(e[0]):e[0]),{type:\"text\",raw:e[0],text:t}},e}(),B={newline:/^(?: *(?:\\n|$))+/,code:/^( {4}[^\\n]+(?:\\n(?: *(?:\\n|$))*)?)+/,fences:/^ {0,3}(`{3,}(?=[^`\\n]*(?:\\n|$))|~{3,})([^\\n]*)(?:\\n|$)(?:|([\\s\\S]*?)(?:\\n|$))(?: {0,3}\\1[~`]* *(?=\\n|$)|$)/,hr:/^ {0,3}((?:-[\\t ]*){3,}|(?:_[ \\t]*){3,}|(?:\\*[ \\t]*){3,})(?:\\n+|$)/,heading:/^ {0,3}(#{1,6})(?=\\s|$)(.*)(?:\\n+|$)/,blockquote:/^( {0,3}> ?(paragraph|[^\\n]*)(?:\\n|$))+/,list:/^( {0,3}bull)([ \\t][^\\n]+?)?(?:\\n|$)/,html:\"^ {0,3}(?:<(script|pre|style|textarea)[\\\\s>][\\\\s\\\\S]*?(?:</\\\\1>[^\\\\n]*\\\\n+|$)|comment[^\\\\n]*(\\\\n+|$)|<\\\\?[\\\\s\\\\S]*?(?:\\\\?>\\\\n*|$)|<![A-Z][\\\\s\\\\S]*?(?:>\\\\n*|$)|<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?(?:\\\\]\\\\]>\\\\n*|$)|</?(tag)(?: +|\\\\n|/?>)[\\\\s\\\\S]*?(?:(?:\\\\n *)+\\\\n|$)|<(?!script|pre|style|textarea)([a-z][\\\\w-]*)(?:attribute)*? */?>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n *)+\\\\n|$)|</(?!script|pre|style|textarea)[a-z][\\\\w-]*\\\\s*>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n *)+\\\\n|$))\",def:/^ {0,3}\\[(label)\\]: *(?:\\n *)?([^<\\s][^\\s]*|<.*?>)(?:(?: +(?:\\n *)?| *\\n *)(title))? *(?:\\n+|$)/,table:k,lheading:/^((?:.|\\n(?!\\n))+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/,_paragraph:/^([^\\n]+(?:\\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\\n)[^\\n]+)*)/,text:/^[^\\n]+/,_label:/(?!\\s*\\])(?:\\\\.|[^\\[\\]\\\\])+/,_title:/(?:\"(?:\\\\\"?|[^\"\\\\])*\"|\'[^\'\\n]*(?:\\n[^\'\\n]+)*\\n?\'|\\([^()]*\\))/},w=(B.def=p(B.def).replace(\"label\",B._label).replace(\"title\",B._title).getRegex(),B.bullet=/(?:[*+-]|\\d{1,9}[.)])/,B.listItemStart=p(/^( *)(bull) */).replace(\"bull\",B.bullet).getRegex(),B.list=p(B.list).replace(/bull/g,B.bullet).replace(\"hr\",\"\\\\n+(?=\\\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\\\* *){3,})(?:\\\\n+|$))\").replace(\"def\",\"\\\\n+(?=\"+B.def.source+\")\").getRegex(),B._tag=\"address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul\",B._comment=/<!--(?!-?>)[\\s\\S]*?(?:-->|$)/,B.html=p(B.html,\"i\").replace(\"comment\",B._comment).replace(\"tag\",B._tag).replace(\"attribute\",/ +[a-zA-Z:_][\\w.:-]*(?: *= *\"[^\"\\n]*\"| *= *\'[^\'\\n]*\'| *= *[^\\s\"\'=<>`]+)?/).getRegex(),B.paragraph=p(B._paragraph).replace(\"hr\",B.hr).replace(\"heading\",\" {0,3}#{1,6} \").replace(\"|lheading\",\"\").replace(\"|table\",\"\").replace(\"blockquote\",\" {0,3}>\").replace(\"fences\",\" {0,3}(?:`{3,}(?=[^`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n\").replace(\"list\",\" {0,3}(?:[*+-]|1[.)]) \").replace(\"html\",\"</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)\").replace(\"tag\",B._tag).getRegex(),B.blockquote=p(B.blockquote).replace(\"paragraph\",B.paragraph).getRegex(),B.normal=F({},B),B.gfm=F({},B.normal,{table:\"^ *([^\\\\n ].*\\\\|.*)\\\\n {0,3}(?:\\\\| *)?(:?-+:? *(?:\\\\| *:?-+:? *)*)(?:\\\\| *)?(?:\\\\n((?:(?! *\\\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\\\n|$))*)\\\\n*|$)\"}),B.gfm.table=p(B.gfm.table).replace(\"hr\",B.hr).replace(\"heading\",\" {0,3}#{1,6} \").replace(\"blockquote\",\" {0,3}>\").replace(\"code\",\" {4}[^\\\\n]\").replace(\"fences\",\" {0,3}(?:`{3,}(?=[^`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n\").replace(\"list\",\" {0,3}(?:[*+-]|1[.)]) \").replace(\"html\",\"</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)\").replace(\"tag\",B._tag).getRegex(),B.gfm.paragraph=p(B._paragraph).replace(\"hr\",B.hr).replace(\"heading\",\" {0,3}#{1,6} \").replace(\"|lheading\",\"\").replace(\"table\",B.gfm.table).replace(\"blockquote\",\" {0,3}>\").replace(\"fences\",\" {0,3}(?:`{3,}(?=[^`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n\").replace(\"list\",\" {0,3}(?:[*+-]|1[.)]) \").replace(\"html\",\"</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)\").replace(\"tag\",B._tag).getRegex(),B.pedantic=F({},B.normal,{html:p(\"^ *(?:comment *(?:\\\\n|\\\\s*$)|<(tag)[\\\\s\\\\S]+?</\\\\1> *(?:\\\\n{2,}|\\\\s*$)|<tag(?:\\\"[^\\\"]*\\\"|\'[^\']*\'|\\\\s[^\'\\\"/>\\\\s]*)*?/?> *(?:\\\\n{2,}|\\\\s*$))\").replace(\"comment\",B._comment).replace(/tag/g,\"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\\\b)\\\\w+(?!:|[^\\\\w\\\\s@]*@)\\\\b\").getRegex(),def:/^ *\\[([^\\]]+)\\]: *<?([^\\s>]+)>?(?: +([\"(][^\\n]+[\")]))? *(?:\\n+|$)/,heading:/^(#{1,6})(.*)(?:\\n+|$)/,fences:k,lheading:/^(.+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/,paragraph:p(B.normal._paragraph).replace(\"hr\",B.hr).replace(\"heading\",\" *#{1,6} *[^\\n]\").replace(\"lheading\",B.lheading).replace(\"blockquote\",\" {0,3}>\").replace(\"|fences\",\"\").replace(\"|list\",\"\").replace(\"|html\",\"\").getRegex()}),{escape:/^\\\\([!\"#$%&\'()*+,\\-./:;<=>?@\\[\\]\\\\^_`{|}~])/,autolink:/^<(scheme:[^\\s\\x00-\\x1f<>]*|email)>/,url:k,tag:\"^comment|^</[a-zA-Z][\\\\w:-]*\\\\s*>|^<[a-zA-Z][\\\\w-]*(?:attribute)*?\\\\s*/?>|^<\\\\?[\\\\s\\\\S]*?\\\\?>|^<![a-zA-Z]+\\\\s[\\\\s\\\\S]*?>|^<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?\\\\]\\\\]>\",link:/^!?\\[(label)\\]\\(\\s*(href)(?:\\s+(title))?\\s*\\)/,reflink:/^!?\\[(label)\\]\\[(ref)\\]/,nolink:/^!?\\[(ref)\\](?:\\[\\])?/,reflinkSearch:\"reflink|nolink(?!\\\\()\",emStrong:{lDelim:/^(?:\\*+(?:([punct_])|[^\\s*]))|^_+(?:([punct*])|([^\\s_]))/,rDelimAst:/^(?:[^_*\\\\]|\\\\.)*?\\_\\_(?:[^_*\\\\]|\\\\.)*?\\*(?:[^_*\\\\]|\\\\.)*?(?=\\_\\_)|(?:[^*\\\\]|\\\\.)+(?=[^*])|[punct_](\\*+)(?=[\\s]|$)|(?:[^punct*_\\s\\\\]|\\\\.)(\\*+)(?=[punct_\\s]|$)|[punct_\\s](\\*+)(?=[^punct*_\\s])|[\\s](\\*+)(?=[punct_])|[punct_](\\*+)(?=[punct_])|(?:[^punct*_\\s\\\\]|\\\\.)(\\*+)(?=[^punct*_\\s])/,rDelimUnd:/^(?:[^_*\\\\]|\\\\.)*?\\*\\*(?:[^_*\\\\]|\\\\.)*?\\_(?:[^_*\\\\]|\\\\.)*?(?=\\*\\*)|(?:[^_\\\\]|\\\\.)+(?=[^_])|[punct*](\\_+)(?=[\\s]|$)|(?:[^punct*_\\s\\\\]|\\\\.)(\\_+)(?=[punct*\\s]|$)|[punct*\\s](\\_+)(?=[^punct*_\\s])|[\\s](\\_+)(?=[punct*])|[punct*](\\_+)(?=[punct*])/},code:/^(`+)([^`]|[^`][\\s\\S]*?[^`])\\1(?!`)/,br:/^( {2,}|\\\\)\\n(?!\\s*$)/,del:k,text:/^(`+|[^`])(?:(?= {2,}\\n)|[\\s\\S]*?(?:(?=[\\\\<!\\[`*_]|\\b_|$)|[^ ](?= {2,}\\n)))/,punctuation:/^([\\spunctuation])/});function L(e){return e.replace(/---/g,\"—\").replace(/--/g,\"–\").replace(/(^|[-\\u2014/(\\[{\"\\s])\'/g,\"$1‘\").replace(/\'/g,\"’\").replace(/(^|[-\\u2014/(\\[{\\u2018\\s])\"/g,\"$1“\").replace(/\"/g,\"”\").replace(/\\.{3}/g,\"…\")}function y(e){for(var t,u=\"\",n=e.length,r=0;r<n;r++)t=e.charCodeAt(r),u+=\"&#\"+(t=.5<Math.random()?\"x\"+t.toString(16):t)+\";\";return u}w._punctuation=\"!\\\"#$%&\'()+\\\\-.,/:;<=>?@\\\\[\\\\]`^{|}~\",w.punctuation=p(w.punctuation).replace(/punctuation/g,w._punctuation).getRegex(),w.blockSkip=/\\[[^\\]]*?\\]\\([^\\)]*?\\)|`[^`]*?`|<[^>]*?>/g,w.escapedEmSt=/(?:^|[^\\\\])(?:\\\\\\\\)*\\\\[*_]/g,w._comment=p(B._comment).replace(\"(?:--\\x3e|$)\",\"--\\x3e\").getRegex(),w.emStrong.lDelim=p(w.emStrong.lDelim).replace(/punct/g,w._punctuation).getRegex(),w.emStrong.rDelimAst=p(w.emStrong.rDelimAst,\"g\").replace(/punct/g,w._punctuation).getRegex(),w.emStrong.rDelimUnd=p(w.emStrong.rDelimUnd,\"g\").replace(/punct/g,w._punctuation).getRegex(),w._escapes=/\\\\([!\"#$%&\'()*+,\\-./:;<=>?@\\[\\]\\\\^_`{|}~])/g,w._scheme=/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/,w._email=/[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/,w.autolink=p(w.autolink).replace(\"scheme\",w._scheme).replace(\"email\",w._email).getRegex(),w._attribute=/\\s+[a-zA-Z:_][\\w.:-]*(?:\\s*=\\s*\"[^\"]*\"|\\s*=\\s*\'[^\']*\'|\\s*=\\s*[^\\s\"\'=<>`]+)?/,w.tag=p(w.tag).replace(\"comment\",w._comment).replace(\"attribute\",w._attribute).getRegex(),w._label=/(?:\\[(?:\\\\.|[^\\[\\]\\\\])*\\]|\\\\.|`[^`]*`|[^\\[\\]\\\\`])*?/,w._href=/<(?:\\\\.|[^\\n<>\\\\])+>|[^\\s\\x00-\\x1f]*/,w._title=/\"(?:\\\\\"?|[^\"\\\\])*\"|\'(?:\\\\\'?|[^\'\\\\])*\'|\\((?:\\\\\\)?|[^)\\\\])*\\)/,w.link=p(w.link).replace(\"label\",w._label).replace(\"href\",w._href).replace(\"title\",w._title).getRegex(),w.reflink=p(w.reflink).replace(\"label\",w._label).replace(\"ref\",B._label).getRegex(),w.nolink=p(w.nolink).replace(\"ref\",B._label).getRegex(),w.reflinkSearch=p(w.reflinkSearch,\"g\").replace(\"reflink\",w.reflink).replace(\"nolink\",w.nolink).getRegex(),w.normal=F({},w),w.pedantic=F({},w.normal,{strong:{start:/^__|\\*\\*/,middle:/^__(?=\\S)([\\s\\S]*?\\S)__(?!_)|^\\*\\*(?=\\S)([\\s\\S]*?\\S)\\*\\*(?!\\*)/,endAst:/\\*\\*(?!\\*)/g,endUnd:/__(?!_)/g},em:{start:/^_|\\*/,middle:/^()\\*(?=\\S)([\\s\\S]*?\\S)\\*(?!\\*)|^_(?=\\S)([\\s\\S]*?\\S)_(?!_)/,endAst:/\\*(?!\\*)/g,endUnd:/_(?!_)/g},link:p(/^!?\\[(label)\\]\\((.*?)\\)/).replace(\"label\",w._label).getRegex(),reflink:p(/^!?\\[(label)\\]\\s*\\[([^\\]]*)\\]/).replace(\"label\",w._label).getRegex()}),w.gfm=F({},w.normal,{escape:p(w.escape).replace(\"])\",\"~|])\").getRegex(),_extended_email:/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,url:/^((?:ftp|https?):\\/\\/|www\\.)(?:[a-zA-Z0-9\\-]+\\.?)+[^\\s<]*|^email/,_backpedal:/(?:[^?!.,:;*_\'\"~()&]+|\\([^)]*\\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_\'\"~)]+(?!$))+/,del:/^(~~?)(?=[^\\s~])([\\s\\S]*?[^\\s~])\\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\\n)|(?=[a-zA-Z0-9.!#$%&\'*+\\/=?_`{\\|}~-]+@)|[\\s\\S]*?(?:(?=[\\\\<!\\[`*~_]|\\b_|https?:\\/\\/|ftp:\\/\\/|www\\.|$)|[^ ](?= {2,}\\n)|[^a-zA-Z0-9.!#$%&\'*+\\/=?_`{\\|}~-](?=[a-zA-Z0-9.!#$%&\'*+\\/=?_`{\\|}~-]+@)))/}),w.gfm.url=p(w.gfm.url,\"i\").replace(\"email\",w.gfm._extended_email).getRegex(),w.breaks=F({},w.gfm,{br:p(w.br).replace(\"{2,}\",\"*\").getRegex(),text:p(w.gfm.text).replace(\"\\\\b_\",\"\\\\b_| {2,}\\\\n\").replace(/\\{2,\\}/g,\"*\").getRegex()});var v=function(){function u(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||r.defaults,this.options.tokenizer=this.options.tokenizer||new b,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,(this.tokenizer.lexer=this).inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};e={block:B.normal,inline:w.normal};this.options.pedantic?(e.block=B.pedantic,e.inline=w.pedantic):this.options.gfm&&(e.block=B.gfm,this.options.breaks?e.inline=w.breaks:e.inline=w.gfm),this.tokenizer.rules=e}u.lex=function(e,t){return new u(t).lex(e)},u.lexInline=function(e,t){return new u(t).inlineTokens(e)};var e,t,n=u.prototype;return n.lex=function(e){var t;for(e=e.replace(/\\r\\n|\\r/g,\"\\n\"),this.blockTokens(e,this.tokens);t=this.inlineQueue.shift();)this.inlineTokens(t.src,t.tokens);return this.tokens},n.blockTokens=function(r,t){var u,e,i,n,s=this;for(void 0===t&&(t=[]),r=this.options.pedantic?r.replace(/\\t/g,\"    \").replace(/^ +$/gm,\"\"):r.replace(/^( *)(\\t+)/gm,function(e,t,u){return t+\"    \".repeat(u.length)});r;)if(!(this.options.extensions&&this.options.extensions.block&&this.options.extensions.block.some(function(e){return!!(u=e.call({lexer:s},r,t))&&(r=r.substring(u.raw.length),t.push(u),!0)})))if(u=this.tokenizer.space(r))r=r.substring(u.raw.length),1===u.raw.length&&0<t.length?t[t.length-1].raw+=\"\\n\":t.push(u);else if(u=this.tokenizer.code(r))r=r.substring(u.raw.length),!(e=t[t.length-1])||\"paragraph\"!==e.type&&\"text\"!==e.type?t.push(u):(e.raw+=\"\\n\"+u.raw,e.text+=\"\\n\"+u.text,this.inlineQueue[this.inlineQueue.length-1].src=e.text);else if(u=this.tokenizer.fences(r))r=r.substring(u.raw.length),t.push(u);else if(u=this.tokenizer.heading(r))r=r.substring(u.raw.length),t.push(u);else if(u=this.tokenizer.hr(r))r=r.substring(u.raw.length),t.push(u);else if(u=this.tokenizer.blockquote(r))r=r.substring(u.raw.length),t.push(u);else if(u=this.tokenizer.list(r))r=r.substring(u.raw.length),t.push(u);else if(u=this.tokenizer.html(r))r=r.substring(u.raw.length),t.push(u);else if(u=this.tokenizer.def(r))r=r.substring(u.raw.length),!(e=t[t.length-1])||\"paragraph\"!==e.type&&\"text\"!==e.type?this.tokens.links[u.tag]||(this.tokens.links[u.tag]={href:u.href,title:u.title}):(e.raw+=\"\\n\"+u.raw,e.text+=\"\\n\"+u.raw,this.inlineQueue[this.inlineQueue.length-1].src=e.text);else if(u=this.tokenizer.table(r))r=r.substring(u.raw.length),t.push(u);else if(u=this.tokenizer.lheading(r))r=r.substring(u.raw.length),t.push(u);else if(i=r,this.options.extensions&&this.options.extensions.startBlock&&!function(){var t=1/0,u=r.slice(1),n=void 0;s.options.extensions.startBlock.forEach(function(e){\"number\"==typeof(n=e.call({lexer:this},u))&&0<=n&&(t=Math.min(t,n))}),t<1/0&&0<=t&&(i=r.substring(0,t+1))}(),this.state.top&&(u=this.tokenizer.paragraph(i)))e=t[t.length-1],n&&\"paragraph\"===e.type?(e.raw+=\"\\n\"+u.raw,e.text+=\"\\n\"+u.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=e.text):t.push(u),n=i.length!==r.length,r=r.substring(u.raw.length);else if(u=this.tokenizer.text(r))r=r.substring(u.raw.length),(e=t[t.length-1])&&\"text\"===e.type?(e.raw+=\"\\n\"+u.raw,e.text+=\"\\n\"+u.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=e.text):t.push(u);else if(r){var l=\"Infinite loop on byte: \"+r.charCodeAt(0);if(this.options.silent){console.error(l);break}throw new Error(l)}return this.state.top=!0,t},n.inline=function(e,t){return this.inlineQueue.push({src:e,tokens:t=void 0===t?[]:t}),t},n.inlineTokens=function(r,t){var u,e,i,n,s,l,o=this,a=(void 0===t&&(t=[]),r);if(this.tokens.links){var D=Object.keys(this.tokens.links);if(0<D.length)for(;null!=(n=this.tokenizer.rules.inline.reflinkSearch.exec(a));)D.includes(n[0].slice(n[0].lastIndexOf(\"[\")+1,-1))&&(a=a.slice(0,n.index)+\"[\"+E(\"a\",n[0].length-2)+\"]\"+a.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;null!=(n=this.tokenizer.rules.inline.blockSkip.exec(a));)a=a.slice(0,n.index)+\"[\"+E(\"a\",n[0].length-2)+\"]\"+a.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);for(;null!=(n=this.tokenizer.rules.inline.escapedEmSt.exec(a));)a=a.slice(0,n.index+n[0].length-2)+\"++\"+a.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex),this.tokenizer.rules.inline.escapedEmSt.lastIndex--;for(;r;)if(s||(l=\"\"),s=!1,!(this.options.extensions&&this.options.extensions.inline&&this.options.extensions.inline.some(function(e){return!!(u=e.call({lexer:o},r,t))&&(r=r.substring(u.raw.length),t.push(u),!0)})))if(u=this.tokenizer.escape(r))r=r.substring(u.raw.length),t.push(u);else if(u=this.tokenizer.tag(r))r=r.substring(u.raw.length),(e=t[t.length-1])&&\"text\"===u.type&&\"text\"===e.type?(e.raw+=u.raw,e.text+=u.text):t.push(u);else if(u=this.tokenizer.link(r))r=r.substring(u.raw.length),t.push(u);else if(u=this.tokenizer.reflink(r,this.tokens.links))r=r.substring(u.raw.length),(e=t[t.length-1])&&\"text\"===u.type&&\"text\"===e.type?(e.raw+=u.raw,e.text+=u.text):t.push(u);else if(u=this.tokenizer.emStrong(r,a,l))r=r.substring(u.raw.length),t.push(u);else if(u=this.tokenizer.codespan(r))r=r.substring(u.raw.length),t.push(u);else if(u=this.tokenizer.br(r))r=r.substring(u.raw.length),t.push(u);else if(u=this.tokenizer.del(r))r=r.substring(u.raw.length),t.push(u);else if(u=this.tokenizer.autolink(r,y))r=r.substring(u.raw.length),t.push(u);else if(!this.state.inLink&&(u=this.tokenizer.url(r,y)))r=r.substring(u.raw.length),t.push(u);else if(i=r,this.options.extensions&&this.options.extensions.startInline&&!function(){var t=1/0,u=r.slice(1),n=void 0;o.options.extensions.startInline.forEach(function(e){\"number\"==typeof(n=e.call({lexer:this},u))&&0<=n&&(t=Math.min(t,n))}),t<1/0&&0<=t&&(i=r.substring(0,t+1))}(),u=this.tokenizer.inlineText(i,L))r=r.substring(u.raw.length),\"_\"!==u.raw.slice(-1)&&(l=u.raw.slice(-1)),s=!0,(e=t[t.length-1])&&\"text\"===e.type?(e.raw+=u.raw,e.text+=u.text):t.push(u);else if(r){var c=\"Infinite loop on byte: \"+r.charCodeAt(0);if(this.options.silent){console.error(c);break}throw new Error(c)}return t},n=u,t=[{key:\"rules\",get:function(){return{block:B,inline:w}}}],(e=null)&&i(n.prototype,e),t&&i(n,t),Object.defineProperty(n,\"prototype\",{writable:!1}),u}(),_=function(){function e(e){this.options=e||r.defaults}var t=e.prototype;return t.code=function(e,t,u){var n,t=(t||\"\").match(/\\S*/)[0];return this.options.highlight&&null!=(n=this.options.highlight(e,t))&&n!==e&&(u=!0,e=n),e=e.replace(/\\n$/,\"\")+\"\\n\",t?\'<pre><code class=\"\'+this.options.langPrefix+A(t)+\'\">\'+(u?e:A(e,!0))+\"</code></pre>\\n\":\"<pre><code>\"+(u?e:A(e,!0))+\"</code></pre>\\n\"},t.blockquote=function(e){return\"<blockquote>\\n\"+e+\"</blockquote>\\n\"},t.html=function(e){return e},t.heading=function(e,t,u,n){return this.options.headerIds?\"<h\"+t+\' id=\"\'+(this.options.headerPrefix+n.slug(u))+\'\">\'+e+\"</h\"+t+\">\\n\":\"<h\"+t+\">\"+e+\"</h\"+t+\">\\n\"},t.hr=function(){return this.options.xhtml?\"<hr/>\\n\":\"<hr>\\n\"},t.list=function(e,t,u){var n=t?\"ol\":\"ul\";return\"<\"+n+(t&&1!==u?\' start=\"\'+u+\'\"\':\"\")+\">\\n\"+e+\"</\"+n+\">\\n\"},t.listitem=function(e){return\"<li>\"+e+\"</li>\\n\"},t.checkbox=function(e){return\"<input \"+(e?\'checked=\"\" \':\"\")+\'disabled=\"\" type=\"checkbox\"\'+(this.options.xhtml?\" /\":\"\")+\"> \"},t.paragraph=function(e){return\"<p>\"+e+\"</p>\\n\"},t.table=function(e,t){return\"<table>\\n<thead>\\n\"+e+\"</thead>\\n\"+(t=t&&\"<tbody>\"+t+\"</tbody>\")+\"</table>\\n\"},t.tablerow=function(e){return\"<tr>\\n\"+e+\"</tr>\\n\"},t.tablecell=function(e,t){var u=t.header?\"th\":\"td\";return(t.align?\"<\"+u+\' align=\"\'+t.align+\'\">\':\"<\"+u+\">\")+e+\"</\"+u+\">\\n\"},t.strong=function(e){return\"<strong>\"+e+\"</strong>\"},t.em=function(e){return\"<em>\"+e+\"</em>\"},t.codespan=function(e){return\"<code>\"+e+\"</code>\"},t.br=function(){return this.options.xhtml?\"<br/>\":\"<br>\"},t.del=function(e){return\"<del>\"+e+\"</del>\"},t.link=function(e,t,u){return null===(e=f(this.options.sanitize,this.options.baseUrl,e))?u:(e=\'<a href=\"\'+e+\'\"\',t&&(e+=\' title=\"\'+t+\'\"\'),e+\">\"+u+\"</a>\")},t.image=function(e,t,u){return null===(e=f(this.options.sanitize,this.options.baseUrl,e))?u:(e=\'<img src=\"\'+e+\'\" alt=\"\'+u+\'\"\',t&&(e+=\' title=\"\'+t+\'\"\'),e+(this.options.xhtml?\"/>\":\">\"))},t.text=function(e){return e},e}(),z=function(){function e(){}var t=e.prototype;return t.strong=function(e){return e},t.em=function(e){return e},t.codespan=function(e){return e},t.del=function(e){return e},t.html=function(e){return e},t.text=function(e){return e},t.link=function(e,t,u){return\"\"+u},t.image=function(e,t,u){return\"\"+u},t.br=function(){return\"\"},e}(),$=function(){function e(){this.seen={}}var t=e.prototype;return t.serialize=function(e){return e.toLowerCase().trim().replace(/<[!\\/a-z].*?>/gi,\"\").replace(/[\\u2000-\\u206F\\u2E00-\\u2E7F\\\\\'!\"#$%&()*+,./:;<=>?@[\\]^`{|}~]/g,\"\").replace(/\\s/g,\"-\")},t.getNextSafeSlug=function(e,t){var u=e,n=0;if(this.seen.hasOwnProperty(u))for(n=this.seen[e];u=e+\"-\"+ ++n,this.seen.hasOwnProperty(u););return t||(this.seen[e]=n,this.seen[u]=0),u},t.slug=function(e,t){void 0===t&&(t={});e=this.serialize(e);return this.getNextSafeSlug(e,t.dryrun)},e}(),S=function(){function u(e){this.options=e||r.defaults,this.options.renderer=this.options.renderer||new _,this.renderer=this.options.renderer,this.renderer.options=this.options,this.textRenderer=new z,this.slugger=new $}u.parse=function(e,t){return new u(t).parse(e)},u.parseInline=function(e,t){return new u(t).parseInline(e)};var e=u.prototype;return e.parse=function(e,t){void 0===t&&(t=!0);for(var u,n,r,i,s,l,o,a,D,c,h,p,f,g,F,A,k=\"\",d=e.length,C=0;C<d;C++)if(a=e[C],this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[a.type]&&(!1!==(A=this.options.extensions.renderers[a.type].call({parser:this},a))||![\"space\",\"hr\",\"heading\",\"code\",\"table\",\"blockquote\",\"list\",\"html\",\"paragraph\",\"text\"].includes(a.type)))k+=A||\"\";else switch(a.type){case\"space\":continue;case\"hr\":k+=this.renderer.hr();continue;case\"heading\":k+=this.renderer.heading(this.parseInline(a.tokens),a.depth,x(this.parseInline(a.tokens,this.textRenderer)),this.slugger);continue;case\"code\":k+=this.renderer.code(a.text,a.lang,a.escaped);continue;case\"table\":for(l=D=\"\",r=a.header.length,u=0;u<r;u++)l+=this.renderer.tablecell(this.parseInline(a.header[u].tokens),{header:!0,align:a.align[u]});for(D+=this.renderer.tablerow(l),o=\"\",r=a.rows.length,u=0;u<r;u++){for(l=\"\",i=(s=a.rows[u]).length,n=0;n<i;n++)l+=this.renderer.tablecell(this.parseInline(s[n].tokens),{header:!1,align:a.align[n]});o+=this.renderer.tablerow(l)}k+=this.renderer.table(D,o);continue;case\"blockquote\":o=this.parse(a.tokens),k+=this.renderer.blockquote(o);continue;case\"list\":for(D=a.ordered,E=a.start,c=a.loose,r=a.items.length,o=\"\",u=0;u<r;u++)f=(p=a.items[u]).checked,g=p.task,h=\"\",p.task&&(F=this.renderer.checkbox(f),c?0<p.tokens.length&&\"paragraph\"===p.tokens[0].type?(p.tokens[0].text=F+\" \"+p.tokens[0].text,p.tokens[0].tokens&&0<p.tokens[0].tokens.length&&\"text\"===p.tokens[0].tokens[0].type&&(p.tokens[0].tokens[0].text=F+\" \"+p.tokens[0].tokens[0].text)):p.tokens.unshift({type:\"text\",text:F}):h+=F),h+=this.parse(p.tokens,c),o+=this.renderer.listitem(h,g,f);k+=this.renderer.list(o,D,E);continue;case\"html\":k+=this.renderer.html(a.text);continue;case\"paragraph\":k+=this.renderer.paragraph(this.parseInline(a.tokens));continue;case\"text\":for(o=a.tokens?this.parseInline(a.tokens):a.text;C+1<d&&\"text\"===e[C+1].type;)o+=\"\\n\"+((a=e[++C]).tokens?this.parseInline(a.tokens):a.text);k+=t?this.renderer.paragraph(o):o;continue;default:var E=\'Token with \"\'+a.type+\'\" type was not found.\';if(this.options.silent)return void console.error(E);throw new Error(E)}return k},e.parseInline=function(e,t){t=t||this.renderer;for(var u,n,r=\"\",i=e.length,s=0;s<i;s++)if(u=e[s],this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[u.type]&&(!1!==(n=this.options.extensions.renderers[u.type].call({parser:this},u))||![\"escape\",\"html\",\"link\",\"image\",\"strong\",\"em\",\"codespan\",\"br\",\"del\",\"text\"].includes(u.type)))r+=n||\"\";else switch(u.type){case\"escape\":r+=t.text(u.text);break;case\"html\":r+=t.html(u.text);break;case\"link\":r+=t.link(u.href,u.title,this.parseInline(u.tokens,t));break;case\"image\":r+=t.image(u.href,u.title,u.text);break;case\"strong\":r+=t.strong(this.parseInline(u.tokens,t));break;case\"em\":r+=t.em(this.parseInline(u.tokens,t));break;case\"codespan\":r+=t.codespan(u.text);break;case\"br\":r+=t.br();break;case\"del\":r+=t.del(this.parseInline(u.tokens,t));break;case\"text\":r+=t.text(u.text);break;default:var l=\'Token with \"\'+u.type+\'\" type was not found.\';if(this.options.silent)return void console.error(l);throw new Error(l)}return r},u}(),T=function(){function e(e){this.options=e||r.defaults}var t=e.prototype;return t.preprocess=function(e){return e},t.postprocess=function(e){return e},e}();function R(f,g){return function(e,u,n){\"function\"==typeof u&&(n=u,u=null);var r,i,s,t=F({},u),l=(u=F({},I.defaults,t),r=u.silent,i=u.async,s=n,function(e){var t;if(e.message+=\"\\nPlease report this to https://github.com/markedjs/marked.\",r)return t=\"<p>An error occurred:</p><pre>\"+A(e.message+\"\",!0)+\"</pre>\",i?Promise.resolve(t):s?void s(null,t):t;if(i)return Promise.reject(e);if(!s)throw e;s(e)});if(null==e)return l(new Error(\"marked(): input parameter is undefined or null\"));if(\"string\"!=typeof e)return l(new Error(\"marked(): input parameter is of type \"+Object.prototype.toString.call(e)+\", string expected\"));if((t=u)&&t.sanitize&&!t.silent&&console.warn(\"marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options\"),u.hooks&&(u.hooks.options=u),n){var o,a=u.highlight;try{u.hooks&&(e=u.hooks.preprocess(e)),o=f(e,u)}catch(e){return l(e)}var D,c=function(t){var e;if(!t)try{u.walkTokens&&I.walkTokens(o,u.walkTokens),e=g(o,u),u.hooks&&(e=u.hooks.postprocess(e))}catch(e){t=e}return u.highlight=a,t?l(t):n(null,e)};return!a||a.length<3?c():(delete u.highlight,o.length?(D=0,I.walkTokens(o,function(u){\"code\"===u.type&&(D++,setTimeout(function(){a(u.text,u.lang,function(e,t){if(e)return c(e);null!=t&&t!==u.text&&(u.text=t,u.escaped=!0),0===--D&&c()})},0))}),void(0===D&&c())):c())}if(u.async)return Promise.resolve(u.hooks?u.hooks.preprocess(e):e).then(function(e){return f(e,u)}).then(function(e){return u.walkTokens?Promise.all(I.walkTokens(e,u.walkTokens)).then(function(){return e}):e}).then(function(e){return g(e,u)}).then(function(e){return u.hooks?u.hooks.postprocess(e):e}).catch(l);try{u.hooks&&(e=u.hooks.preprocess(e));var h=f(e,u),p=(u.walkTokens&&I.walkTokens(h,u.walkTokens),g(h,u));return p=u.hooks?u.hooks.postprocess(p):p}catch(e){return l(e)}}}function I(e,t,u){return R(v.lex,S.parse)(e,t,u)}T.passThroughHooks=new Set([\"preprocess\",\"postprocess\"]),I.options=I.setOptions=function(e){return I.defaults=F({},I.defaults,e),e=I.defaults,r.defaults=e,I},I.getDefaults=e,I.defaults=r.defaults,I.use=function(){for(var D=I.defaults.extensions||{renderers:{},childTokens:{}},e=arguments.length,t=new Array(e),u=0;u<e;u++)t[u]=arguments[u];t.forEach(function(s){var u,e=F({},s);if(e.async=I.defaults.async||e.async||!1,s.extensions&&(s.extensions.forEach(function(r){if(!r.name)throw new Error(\"extension name required\");var i;if(r.renderer&&(i=D.renderers[r.name],D.renderers[r.name]=i?function(){for(var e=arguments.length,t=new Array(e),u=0;u<e;u++)t[u]=arguments[u];var n=r.renderer.apply(this,t);return n=!1===n?i.apply(this,t):n}:r.renderer),r.tokenizer){if(!r.level||\"block\"!==r.level&&\"inline\"!==r.level)throw new Error(\"extension level must be \'block\' or \'inline\'\");D[r.level]?D[r.level].unshift(r.tokenizer):D[r.level]=[r.tokenizer],r.start&&(\"block\"===r.level?D.startBlock?D.startBlock.push(r.start):D.startBlock=[r.start]:\"inline\"===r.level&&(D.startInline?D.startInline.push(r.start):D.startInline=[r.start]))}r.childTokens&&(D.childTokens[r.name]=r.childTokens)}),e.extensions=D),s.renderer){var t,l=I.defaults.renderer||new _;for(t in s.renderer)!function(r){var i=l[r];l[r]=function(){for(var e=arguments.length,t=new Array(e),u=0;u<e;u++)t[u]=arguments[u];var n=s.renderer[r].apply(l,t);return n=!1===n?i.apply(l,t):n}}(t);e.renderer=l}if(s.tokenizer){var n,o=I.defaults.tokenizer||new b;for(n in s.tokenizer)!function(r){var i=o[r];o[r]=function(){for(var e=arguments.length,t=new Array(e),u=0;u<e;u++)t[u]=arguments[u];var n=s.tokenizer[r].apply(o,t);return n=!1===n?i.apply(o,t):n}}(n);e.tokenizer=o}if(s.hooks){var r,a=I.defaults.hooks||new T;for(r in s.hooks)!function(r){var i=a[r];T.passThroughHooks.has(r)?a[r]=function(e){return I.defaults.async?Promise.resolve(s.hooks[r].call(a,e)).then(function(e){return i.call(a,e)}):(e=s.hooks[r].call(a,e),i.call(a,e))}:a[r]=function(){for(var e=arguments.length,t=new Array(e),u=0;u<e;u++)t[u]=arguments[u];var n=s.hooks[r].apply(a,t);return n=!1===n?i.apply(a,t):n}}(r);e.hooks=a}s.walkTokens&&(u=I.defaults.walkTokens,e.walkTokens=function(e){var t=[];return t.push(s.walkTokens.call(this,e)),t=u?t.concat(u.call(this,e)):t}),I.setOptions(e)})},I.walkTokens=function(e,l){for(var o,a=[],t=D(e);!(o=t()).done;)!function(){var t=o.value;switch(a=a.concat(l.call(I,t)),t.type){case\"table\":for(var e=D(t.header);!(u=e()).done;){var u=u.value;a=a.concat(I.walkTokens(u.tokens,l))}for(var n,r=D(t.rows);!(n=r()).done;)for(var i=D(n.value);!(s=i()).done;){var s=s.value;a=a.concat(I.walkTokens(s.tokens,l))}break;case\"list\":a=a.concat(I.walkTokens(t.items,l));break;default:I.defaults.extensions&&I.defaults.extensions.childTokens&&I.defaults.extensions.childTokens[t.type]?I.defaults.extensions.childTokens[t.type].forEach(function(e){a=a.concat(I.walkTokens(t[e],l))}):t.tokens&&(a=a.concat(I.walkTokens(t.tokens,l)))}}();return a},I.parseInline=R(v.lexInline,S.parseInline),I.Parser=S,I.parser=S.parse,I.Renderer=_,I.TextRenderer=z,I.Lexer=v,I.lexer=v.lex,I.Tokenizer=b,I.Slugger=$,I.Hooks=T;var k=(I.parse=I).options,Q=I.setOptions,U=I.use,M=I.walkTokens,N=I.parseInline,H=I,X=S.parse,G=v.lex;r.Hooks=T,r.Lexer=v,r.Parser=S,r.Renderer=_,r.Slugger=$,r.TextRenderer=z,r.Tokenizer=b,r.getDefaults=e,r.lexer=G,r.marked=I,r.options=k,r.parse=H,r.parseInline=N,r.parser=X,r.setOptions=Q,r.use=U,r.walkTokens=M});";

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        // purify.min.js
        // =============
        // The client-side code for sanitizing Marked HTML output.
        //
        // Copyright (c) Cure53 and other contributors.
        //
        // GitHub repository: https://github.com/cure53/DOMPurify 
        // This is licensed under both the Apache License and the Mozilla Public License; see LICENSE.md for more 
        // information.
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        const purifyJS = 
        "!function(e,t){\"object\"==typeof exports&&\"undefined\"!=typeof module?module.exports=t():\"function\"==typeof define&&define.amd?define(t):(e=\"undefined\"!=typeof globalThis?globalThis:e||self).DOMPurify=t()}(this,(function(){\"use strict\";const{entries:e,setPrototypeOf:t,isFrozen:n,getPrototypeOf:o,getOwnPropertyDescriptor:r}=Object;let{freeze:i,seal:a,create:l}=Object,{apply:c,construct:s}=\"undefined\"!=typeof Reflect&&Reflect;c||(c=function(e,t,n){return e.apply(t,n)}),i||(i=function(e){return e}),a||(a=function(e){return e}),s||(s=function(e,t){return new e(...t)});const m=N(Array.prototype.forEach),u=N(Array.prototype.pop),p=N(Array.prototype.push),f=N(String.prototype.toLowerCase),d=N(String.prototype.toString),h=N(String.prototype.match),g=N(String.prototype.replace),y=N(String.prototype.indexOf),T=N(String.prototype.trim),E=N(RegExp.prototype.test),A=(b=TypeError,function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return s(b,t)});var b;function N(e){return function(t){for(var n=arguments.length,o=new Array(n>1?n-1:0),r=1;r<n;r++)o[r-1]=arguments[r];return c(e,t,o)}}function _(e,o,r){r=r||f,t&&t(e,null);let i=o.length;for(;i--;){let t=o[i];if(\"string\"==typeof t){const e=r(t);e!==t&&(n(o)||(o[i]=e),t=e)}e[t]=!0}return e}function w(t){const n=l(null);for(const[o,r]of e(t))n[o]=r;return n}function R(e,t){for(;null!==e;){const n=r(e,t);if(n){if(n.get)return N(n.get);if(\"function\"==typeof n.value)return N(n.value)}e=o(e)}return function(e){return console.warn(\"fallback value for\",e),null}}const S=i([\"a\",\"abbr\",\"acronym\",\"address\",\"area\",\"article\",\"aside\",\"audio\",\"b\",\"bdi\",\"bdo\",\"big\",\"blink\",\"blockquote\",\"body\",\"br\",\"button\",\"canvas\",\"caption\",\"center\",\"cite\",\"code\",\"col\",\"colgroup\",\"content\",\"data\",\"datalist\",\"dd\",\"decorator\",\"del\",\"details\",\"dfn\",\"dialog\",\"dir\",\"div\",\"dl\",\"dt\",\"element\",\"em\",\"fieldset\",\"figcaption\",\"figure\",\"font\",\"footer\",\"form\",\"h1\",\"h2\",\"h3\",\"h4\",\"h5\",\"h6\",\"head\",\"header\",\"hgroup\",\"hr\",\"html\",\"i\",\"img\",\"input\",\"ins\",\"kbd\",\"label\",\"legend\",\"li\",\"main\",\"map\",\"mark\",\"marquee\",\"menu\",\"menuitem\",\"meter\",\"nav\",\"nobr\",\"ol\",\"optgroup\",\"option\",\"output\",\"p\",\"picture\",\"pre\",\"progress\",\"q\",\"rp\",\"rt\",\"ruby\",\"s\",\"samp\",\"section\",\"select\",\"shadow\",\"small\",\"source\",\"spacer\",\"span\",\"strike\",\"strong\",\"style\",\"sub\",\"summary\",\"sup\",\"table\",\"tbody\",\"td\",\"template\",\"textarea\",\"tfoot\",\"th\",\"thead\",\"time\",\"tr\",\"track\",\"tt\",\"u\",\"ul\",\"var\",\"video\",\"wbr\"]),x=i([\"svg\",\"a\",\"altglyph\",\"altglyphdef\",\"altglyphitem\",\"animatecolor\",\"animatemotion\",\"animatetransform\",\"circle\",\"clippath\",\"defs\",\"desc\",\"ellipse\",\"filter\",\"font\",\"g\",\"glyph\",\"glyphref\",\"hkern\",\"image\",\"line\",\"lineargradient\",\"marker\",\"mask\",\"metadata\",\"mpath\",\"path\",\"pattern\",\"polygon\",\"polyline\",\"radialgradient\",\"rect\",\"stop\",\"style\",\"switch\",\"symbol\",\"text\",\"textpath\",\"title\",\"tref\",\"tspan\",\"view\",\"vkern\"]),D=i([\"feBlend\",\"feColorMatrix\",\"feComponentTransfer\",\"feComposite\",\"feConvolveMatrix\",\"feDiffuseLighting\",\"feDisplacementMap\",\"feDistantLight\",\"feFlood\",\"feFuncA\",\"feFuncB\",\"feFuncG\",\"feFuncR\",\"feGaussianBlur\",\"feImage\",\"feMerge\",\"feMergeNode\",\"feMorphology\",\"feOffset\",\"fePointLight\",\"feSpecularLighting\",\"feSpotLight\",\"feTile\",\"feTurbulence\"]),k=i([\"animate\",\"color-profile\",\"cursor\",\"discard\",\"fedropshadow\",\"font-face\",\"font-face-format\",\"font-face-name\",\"font-face-src\",\"font-face-uri\",\"foreignobject\",\"hatch\",\"hatchpath\",\"mesh\",\"meshgradient\",\"meshpatch\",\"meshrow\",\"missing-glyph\",\"script\",\"set\",\"solidcolor\",\"unknown\",\"use\"]),v=i([\"math\",\"menclose\",\"merror\",\"mfenced\",\"mfrac\",\"mglyph\",\"mi\",\"mlabeledtr\",\"mmultiscripts\",\"mn\",\"mo\",\"mover\",\"mpadded\",\"mphantom\",\"mroot\",\"mrow\",\"ms\",\"mspace\",\"msqrt\",\"mstyle\",\"msub\",\"msup\",\"msubsup\",\"mtable\",\"mtd\",\"mtext\",\"mtr\",\"munder\",\"munderover\"]),C=i([\"maction\",\"maligngroup\",\"malignmark\",\"mlongdiv\",\"mscarries\",\"mscarry\",\"msgroup\",\"mstack\",\"msline\",\"msrow\",\"semantics\",\"annotation\",\"annotation-xml\",\"mprescripts\",\"none\"]),L=i([\"#text\"]),O=i([\"accept\",\"action\",\"align\",\"alt\",\"autocapitalize\",\"autocomplete\",\"autopictureinpicture\",\"autoplay\",\"background\",\"bgcolor\",\"border\",\"capture\",\"cellpadding\",\"cellspacing\",\"checked\",\"cite\",\"class\",\"clear\",\"color\",\"cols\",\"colspan\",\"controls\",\"controlslist\",\"coords\",\"crossorigin\",\"datetime\",\"decoding\",\"default\",\"dir\",\"disabled\",\"disablepictureinpicture\",\"disableremoteplayback\",\"download\",\"draggable\",\"enctype\",\"enterkeyhint\",\"face\",\"for\",\"headers\",\"height\",\"hidden\",\"high\",\"href\",\"hreflang\",\"id\",\"inputmode\",\"integrity\",\"ismap\",\"kind\",\"label\",\"lang\",\"list\",\"loading\",\"loop\",\"low\",\"max\",\"maxlength\",\"media\",\"method\",\"min\",\"minlength\",\"multiple\",\"muted\",\"name\",\"nonce\",\"noshade\",\"novalidate\",\"nowrap\",\"open\",\"optimum\",\"pattern\",\"placeholder\",\"playsinline\",\"poster\",\"preload\",\"pubdate\",\"radiogroup\",\"readonly\",\"rel\",\"required\",\"rev\",\"reversed\",\"role\",\"rows\",\"rowspan\",\"spellcheck\",\"scope\",\"selected\",\"shape\",\"size\",\"sizes\",\"span\",\"srclang\",\"start\",\"src\",\"srcset\",\"step\",\"style\",\"summary\",\"tabindex\",\"title\",\"translate\",\"type\",\"usemap\",\"valign\",\"value\",\"width\",\"xmlns\",\"slot\"]),M=i([\"accent-height\",\"accumulate\",\"additive\",\"alignment-baseline\",\"ascent\",\"attributename\",\"attributetype\",\"azimuth\",\"basefrequency\",\"baseline-shift\",\"begin\",\"bias\",\"by\",\"class\",\"clip\",\"clippathunits\",\"clip-path\",\"clip-rule\",\"color\",\"color-interpolation\",\"color-interpolation-filters\",\"color-profile\",\"color-rendering\",\"cx\",\"cy\",\"d\",\"dx\",\"dy\",\"diffuseconstant\",\"direction\",\"display\",\"divisor\",\"dur\",\"edgemode\",\"elevation\",\"end\",\"fill\",\"fill-opacity\",\"fill-rule\",\"filter\",\"filterunits\",\"flood-color\",\"flood-opacity\",\"font-family\",\"font-size\",\"font-size-adjust\",\"font-stretch\",\"font-style\",\"font-variant\",\"font-weight\",\"fx\",\"fy\",\"g1\",\"g2\",\"glyph-name\",\"glyphref\",\"gradientunits\",\"gradienttransform\",\"height\",\"href\",\"id\",\"image-rendering\",\"in\",\"in2\",\"k\",\"k1\",\"k2\",\"k3\",\"k4\",\"kerning\",\"keypoints\",\"keysplines\",\"keytimes\",\"lang\",\"lengthadjust\",\"letter-spacing\",\"kernelmatrix\",\"kernelunitlength\",\"lighting-color\",\"local\",\"marker-end\",\"marker-mid\",\"marker-start\",\"markerheight\",\"markerunits\",\"markerwidth\",\"maskcontentunits\",\"maskunits\",\"max\",\"mask\",\"media\",\"method\",\"mode\",\"min\",\"name\",\"numoctaves\",\"offset\",\"operator\",\"opacity\",\"order\",\"orient\",\"orientation\",\"origin\",\"overflow\",\"paint-order\",\"path\",\"pathlength\",\"patterncontentunits\",\"patterntransform\",\"patternunits\",\"points\",\"preservealpha\",\"preserveaspectratio\",\"primitiveunits\",\"r\",\"rx\",\"ry\",\"radius\",\"refx\",\"refy\",\"repeatcount\",\"repeatdur\",\"restart\",\"result\",\"rotate\",\"scale\",\"seed\",\"shape-rendering\",\"specularconstant\",\"specularexponent\",\"spreadmethod\",\"startoffset\",\"stddeviation\",\"stitchtiles\",\"stop-color\",\"stop-opacity\",\"stroke-dasharray\",\"stroke-dashoffset\",\"stroke-linecap\",\"stroke-linejoin\",\"stroke-miterlimit\",\"stroke-opacity\",\"stroke\",\"stroke-width\",\"style\",\"surfacescale\",\"systemlanguage\",\"tabindex\",\"targetx\",\"targety\",\"transform\",\"transform-origin\",\"text-anchor\",\"text-decoration\",\"text-rendering\",\"textlength\",\"type\",\"u1\",\"u2\",\"unicode\",\"values\",\"viewbox\",\"visibility\",\"version\",\"vert-adv-y\",\"vert-origin-x\",\"vert-origin-y\",\"width\",\"word-spacing\",\"wrap\",\"writing-mode\",\"xchannelselector\",\"ychannelselector\",\"x\",\"x1\",\"x2\",\"xmlns\",\"y\",\"y1\",\"y2\",\"z\",\"zoomandpan\"]),I=i([\"accent\",\"accentunder\",\"align\",\"bevelled\",\"close\",\"columnsalign\",\"columnlines\",\"columnspan\",\"denomalign\",\"depth\",\"dir\",\"display\",\"displaystyle\",\"encoding\",\"fence\",\"frame\",\"height\",\"href\",\"id\",\"largeop\",\"length\",\"linethickness\",\"lspace\",\"lquote\",\"mathbackground\",\"mathcolor\",\"mathsize\",\"mathvariant\",\"maxsize\",\"minsize\",\"movablelimits\",\"notation\",\"numalign\",\"open\",\"rowalign\",\"rowlines\",\"rowspacing\",\"rowspan\",\"rspace\",\"rquote\",\"scriptlevel\",\"scriptminsize\",\"scriptsizemultiplier\",\"selection\",\"separator\",\"separators\",\"stretchy\",\"subscriptshift\",\"supscriptshift\",\"symmetric\",\"voffset\",\"width\",\"xmlns\"]),U=i([\"xlink:href\",\"xml:id\",\"xlink:title\",\"xml:space\",\"xmlns:xlink\"]),F=a(/\\{\\{[\\w\\W]*|[\\w\\W]*\\}\\}/gm),P=a(/<%[\\w\\W]*|[\\w\\W]*%>/gm),H=a(/\\${[\\w\\W]*}/gm),z=a(/^data-[\\-\\w.\\u00B7-\\uFFFF]/),B=a(/^aria-[\\-\\w]+$/),W=a(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\\-]+(?:[^a-z+.\\-:]|$))/i),G=a(/^(?:\\w+script|data):/i),j=a(/[\\u0000-\\u0020\\u00A0\\u1680\\u180E\\u2000-\\u2029\\u205F\\u3000]/g),q=a(/^html$/i);var X=Object.freeze({__proto__:null,MUSTACHE_EXPR:F,ERB_EXPR:P,TMPLIT_EXPR:H,DATA_ATTR:z,ARIA_ATTR:B,IS_ALLOWED_URI:W,IS_SCRIPT_OR_DATA:G,ATTR_WHITESPACE:j,DOCTYPE_NAME:q});const Y=()=>\"undefined\"==typeof window?null:window,K=function(e,t){if(\"object\"!=typeof e||\"function\"!=typeof e.createPolicy)return null;let n=null;const o=\"data-tt-policy-suffix\";t.currentScript&&t.currentScript.hasAttribute(o)&&(n=t.currentScript.getAttribute(o));const r=\"dompurify\"+(n?\"#\"+n:\"\");try{return e.createPolicy(r,{createHTML:e=>e,createScriptURL:e=>e})}catch(e){return console.warn(\"TrustedTypes policy \"+r+\" could not be created.\"),null}};var V=function t(){let n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Y();const o=e=>t(e);if(o.version=\"3.0.1\",o.removed=[],!n||!n.document||9!==n.document.nodeType)return o.isSupported=!1,o;const r=n.document;let{document:a}=n;const{DocumentFragment:l,HTMLTemplateElement:c,Node:s,Element:b,NodeFilter:N,NamedNodeMap:F=n.NamedNodeMap||n.MozNamedAttrMap,HTMLFormElement:P,DOMParser:H,trustedTypes:z}=n,B=b.prototype,W=R(B,\"cloneNode\"),G=R(B,\"nextSibling\"),j=R(B,\"childNodes\"),V=R(B,\"parentNode\");if(\"function\"==typeof c){const e=a.createElement(\"template\");e.content&&e.content.ownerDocument&&(a=e.content.ownerDocument)}const $=K(z,r),Z=$?$.createHTML(\"\"):\"\",{implementation:J,createNodeIterator:Q,createDocumentFragment:ee,getElementsByTagName:te}=a,{importNode:ne}=r;let oe={};o.isSupported=\"function\"==typeof e&&\"function\"==typeof V&&J&&void 0!==J.createHTMLDocument;const{MUSTACHE_EXPR:re,ERB_EXPR:ie,TMPLIT_EXPR:ae,DATA_ATTR:le,ARIA_ATTR:ce,IS_SCRIPT_OR_DATA:se,ATTR_WHITESPACE:me}=X;let{IS_ALLOWED_URI:ue}=X,pe=null;const fe=_({},[...S,...x,...D,...v,...L]);let de=null;const he=_({},[...O,...M,...I,...U]);let ge=Object.seal(Object.create(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),ye=null,Te=null,Ee=!0,Ae=!0,be=!1,Ne=!0,_e=!1,we=!1,Re=!1,Se=!1,xe=!1,De=!1,ke=!1,ve=!0,Ce=!1;const Le=\"user-content-\";let Oe=!0,Me=!1,Ie={},Ue=null;const Fe=_({},[\"annotation-xml\",\"audio\",\"colgroup\",\"desc\",\"foreignobject\",\"head\",\"iframe\",\"math\",\"mi\",\"mn\",\"mo\",\"ms\",\"mtext\",\"noembed\",\"noframes\",\"noscript\",\"plaintext\",\"script\",\"style\",\"svg\",\"template\",\"thead\",\"title\",\"video\",\"xmp\"]);let Pe=null;const He=_({},[\"audio\",\"video\",\"img\",\"source\",\"image\",\"track\"]);let ze=null;const Be=_({},[\"alt\",\"class\",\"for\",\"id\",\"label\",\"name\",\"pattern\",\"placeholder\",\"role\",\"summary\",\"title\",\"value\",\"style\",\"xmlns\"]),We=\"http://www.w3.org/1998/Math/MathML\",Ge=\"http://www.w3.org/2000/svg\",je=\"http://www.w3.org/1999/xhtml\";let qe=je,Xe=!1,Ye=null;const Ke=_({},[We,Ge,je],d);let Ve;const $e=[\"application/xhtml+xml\",\"text/html\"],Ze=\"text/html\";let Je,Qe=null;const et=a.createElement(\"form\"),tt=function(e){return e instanceof RegExp||e instanceof Function},nt=function(e){Qe&&Qe===e||(e&&\"object\"==typeof e||(e={}),e=w(e),Ve=Ve=-1===$e.indexOf(e.PARSER_MEDIA_TYPE)?Ze:e.PARSER_MEDIA_TYPE,Je=\"application/xhtml+xml\"===Ve?d:f,pe=\"ALLOWED_TAGS\"in e?_({},e.ALLOWED_TAGS,Je):fe,de=\"ALLOWED_ATTR\"in e?_({},e.ALLOWED_ATTR,Je):he,Ye=\"ALLOWED_NAMESPACES\"in e?_({},e.ALLOWED_NAMESPACES,d):Ke,ze=\"ADD_URI_SAFE_ATTR\"in e?_(w(Be),e.ADD_URI_SAFE_ATTR,Je):Be,Pe=\"ADD_DATA_URI_TAGS\"in e?_(w(He),e.ADD_DATA_URI_TAGS,Je):He,Ue=\"FORBID_CONTENTS\"in e?_({},e.FORBID_CONTENTS,Je):Fe,ye=\"FORBID_TAGS\"in e?_({},e.FORBID_TAGS,Je):{},Te=\"FORBID_ATTR\"in e?_({},e.FORBID_ATTR,Je):{},Ie=\"USE_PROFILES\"in e&&e.USE_PROFILES,Ee=!1!==e.ALLOW_ARIA_ATTR,Ae=!1!==e.ALLOW_DATA_ATTR,be=e.ALLOW_UNKNOWN_PROTOCOLS||!1,Ne=!1!==e.ALLOW_SELF_CLOSE_IN_ATTR,_e=e.SAFE_FOR_TEMPLATES||!1,we=e.WHOLE_DOCUMENT||!1,xe=e.RETURN_DOM||!1,De=e.RETURN_DOM_FRAGMENT||!1,ke=e.RETURN_TRUSTED_TYPE||!1,Se=e.FORCE_BODY||!1,ve=!1!==e.SANITIZE_DOM,Ce=e.SANITIZE_NAMED_PROPS||!1,Oe=!1!==e.KEEP_CONTENT,Me=e.IN_PLACE||!1,ue=e.ALLOWED_URI_REGEXP||ue,qe=e.NAMESPACE||je,ge=e.CUSTOM_ELEMENT_HANDLING||{},e.CUSTOM_ELEMENT_HANDLING&&tt(e.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(ge.tagNameCheck=e.CUSTOM_ELEMENT_HANDLING.tagNameCheck),e.CUSTOM_ELEMENT_HANDLING&&tt(e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(ge.attributeNameCheck=e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),e.CUSTOM_ELEMENT_HANDLING&&\"boolean\"==typeof e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements&&(ge.allowCustomizedBuiltInElements=e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),_e&&(Ae=!1),De&&(xe=!0),Ie&&(pe=_({},[...L]),de=[],!0===Ie.html&&(_(pe,S),_(de,O)),!0===Ie.svg&&(_(pe,x),_(de,M),_(de,U)),!0===Ie.svgFilters&&(_(pe,D),_(de,M),_(de,U)),!0===Ie.mathMl&&(_(pe,v),_(de,I),_(de,U))),e.ADD_TAGS&&(pe===fe&&(pe=w(pe)),_(pe,e.ADD_TAGS,Je)),e.ADD_ATTR&&(de===he&&(de=w(de)),_(de,e.ADD_ATTR,Je)),e.ADD_URI_SAFE_ATTR&&_(ze,e.ADD_URI_SAFE_ATTR,Je),e.FORBID_CONTENTS&&(Ue===Fe&&(Ue=w(Ue)),_(Ue,e.FORBID_CONTENTS,Je)),Oe&&(pe[\"#text\"]=!0),we&&_(pe,[\"html\",\"head\",\"body\"]),pe.table&&(_(pe,[\"tbody\"]),delete ye.tbody),i&&i(e),Qe=e)},ot=_({},[\"mi\",\"mo\",\"mn\",\"ms\",\"mtext\"]),rt=_({},[\"foreignobject\",\"desc\",\"title\",\"annotation-xml\"]),it=_({},[\"title\",\"style\",\"font\",\"a\",\"script\"]),at=_({},x);_(at,D),_(at,k);const lt=_({},v);_(lt,C);const ct=function(e){let t=V(e);t&&t.tagName||(t={namespaceURI:qe,tagName:\"template\"});const n=f(e.tagName),o=f(t.tagName);return!!Ye[e.namespaceURI]&&(e.namespaceURI===Ge?t.namespaceURI===je?\"svg\"===n:t.namespaceURI===We?\"svg\"===n&&(\"annotation-xml\"===o||ot[o]):Boolean(at[n]):e.namespaceURI===We?t.namespaceURI===je?\"math\"===n:t.namespaceURI===Ge?\"math\"===n&&rt[o]:Boolean(lt[n]):e.namespaceURI===je?!(t.namespaceURI===Ge&&!rt[o])&&(!(t.namespaceURI===We&&!ot[o])&&(!lt[n]&&(it[n]||!at[n]))):!(\"application/xhtml+xml\"!==Ve||!Ye[e.namespaceURI]))},st=function(e){p(o.removed,{element:e});try{e.parentNode.removeChild(e)}catch(t){e.remove()}},mt=function(e,t){try{p(o.removed,{attribute:t.getAttributeNode(e),from:t})}catch(e){p(o.removed,{attribute:null,from:t})}if(t.removeAttribute(e),\"is\"===e&&!de[e])if(xe||De)try{st(t)}catch(e){}else try{t.setAttribute(e,\"\")}catch(e){}},ut=function(e){let t,n;if(Se)e=\"<remove></remove>\"+e;else{const t=h(e,/^[\\r\\n\\t ]+/);n=t&&t[0]}\"application/xhtml+xml\"===Ve&&qe===je&&(e=\'<html xmlns=\"http://www.w3.org/1999/xhtml\"><head></head><body>\'+e+\"</body></html>\");const o=$?$.createHTML(e):e;if(qe===je)try{t=(new H).parseFromString(o,Ve)}catch(e){}if(!t||!t.documentElement){t=J.createDocument(qe,\"template\",null);try{t.documentElement.innerHTML=Xe?Z:o}catch(e){}}const r=t.body||t.documentElement;return e&&n&&r.insertBefore(a.createTextNode(n),r.childNodes[0]||null),qe===je?te.call(t,we?\"html\":\"body\")[0]:we?t.documentElement:r},pt=function(e){return Q.call(e.ownerDocument||e,e,N.SHOW_ELEMENT|N.SHOW_COMMENT|N.SHOW_TEXT,null,!1)},ft=function(e){return e instanceof P&&(\"string\"!=typeof e.nodeName||\"string\"!=typeof e.textContent||\"function\"!=typeof e.removeChild||!(e.attributes instanceof F)||\"function\"!=typeof e.removeAttribute||\"function\"!=typeof e.setAttribute||\"string\"!=typeof e.namespaceURI||\"function\"!=typeof e.insertBefore||\"function\"!=typeof e.hasChildNodes)},dt=function(e){return\"object\"==typeof s?e instanceof s:e&&\"object\"==typeof e&&\"number\"==typeof e.nodeType&&\"string\"==typeof e.nodeName},ht=function(e,t,n){oe[e]&&m(oe[e],(e=>{e.call(o,t,n,Qe)}))},gt=function(e){let t;if(ht(\"beforeSanitizeElements\",e,null),ft(e))return st(e),!0;const n=Je(e.nodeName);if(ht(\"uponSanitizeElement\",e,{tagName:n,allowedTags:pe}),e.hasChildNodes()&&!dt(e.firstElementChild)&&(!dt(e.content)||!dt(e.content.firstElementChild))&&E(/<[/\\w]/g,e.innerHTML)&&E(/<[/\\w]/g,e.textContent))return st(e),!0;if(!pe[n]||ye[n]){if(!ye[n]&&Tt(n)){if(ge.tagNameCheck instanceof RegExp&&E(ge.tagNameCheck,n))return!1;if(ge.tagNameCheck instanceof Function&&ge.tagNameCheck(n))return!1}if(Oe&&!Ue[n]){const t=V(e)||e.parentNode,n=j(e)||e.childNodes;if(n&&t){for(let o=n.length-1;o>=0;--o)t.insertBefore(W(n[o],!0),G(e))}}return st(e),!0}return e instanceof b&&!ct(e)?(st(e),!0):\"noscript\"!==n&&\"noembed\"!==n||!E(/<\\/no(script|embed)/i,e.innerHTML)?(_e&&3===e.nodeType&&(t=e.textContent,t=g(t,re,\" \"),t=g(t,ie,\" \"),t=g(t,ae,\" \"),e.textContent!==t&&(p(o.removed,{element:e.cloneNode()}),e.textContent=t)),ht(\"afterSanitizeElements\",e,null),!1):(st(e),!0)},yt=function(e,t,n){if(ve&&(\"id\"===t||\"name\"===t)&&(n in a||n in et))return!1;if(Ae&&!Te[t]&&E(le,t));else if(Ee&&E(ce,t));else if(!de[t]||Te[t]){if(!(Tt(e)&&(ge.tagNameCheck instanceof RegExp&&E(ge.tagNameCheck,e)||ge.tagNameCheck instanceof Function&&ge.tagNameCheck(e))&&(ge.attributeNameCheck instanceof RegExp&&E(ge.attributeNameCheck,t)||ge.attributeNameCheck instanceof Function&&ge.attributeNameCheck(t))||\"is\"===t&&ge.allowCustomizedBuiltInElements&&(ge.tagNameCheck instanceof RegExp&&E(ge.tagNameCheck,n)||ge.tagNameCheck instanceof Function&&ge.tagNameCheck(n))))return!1}else if(ze[t]);else if(E(ue,g(n,me,\"\")));else if(\"src\"!==t&&\"xlink:href\"!==t&&\"href\"!==t||\"script\"===e||0!==y(n,\"data:\")||!Pe[e]){if(be&&!E(se,g(n,me,\"\")));else if(n)return!1}else;return!0},Tt=function(e){return e.indexOf(\"-\")>0},Et=function(e){let t,n,r,i;ht(\"beforeSanitizeAttributes\",e,null);const{attributes:a}=e;if(!a)return;const l={attrName:\"\",attrValue:\"\",keepAttr:!0,allowedAttributes:de};for(i=a.length;i--;){t=a[i];const{name:c,namespaceURI:s}=t;if(n=\"value\"===c?t.value:T(t.value),r=Je(c),l.attrName=r,l.attrValue=n,l.keepAttr=!0,l.forceKeepAttr=void 0,ht(\"uponSanitizeAttribute\",e,l),n=l.attrValue,l.forceKeepAttr)continue;if(mt(c,e),!l.keepAttr)continue;if(!Ne&&E(/\\/>/i,n)){mt(c,e);continue}_e&&(n=g(n,re,\" \"),n=g(n,ie,\" \"),n=g(n,ae,\" \"));const m=Je(e.nodeName);if(yt(m,r,n)){if(!Ce||\"id\"!==r&&\"name\"!==r||(mt(c,e),n=Le+n),$&&\"object\"==typeof z&&\"function\"==typeof z.getAttributeType)if(s);else switch(z.getAttributeType(m,r)){case\"TrustedHTML\":n=$.createHTML(n);break;case\"TrustedScriptURL\":n=$.createScriptURL(n)}try{s?e.setAttributeNS(s,c,n):e.setAttribute(c,n),u(o.removed)}catch(e){}}}ht(\"afterSanitizeAttributes\",e,null)},At=function e(t){let n;const o=pt(t);for(ht(\"beforeSanitizeShadowDOM\",t,null);n=o.nextNode();)ht(\"uponSanitizeShadowNode\",n,null),gt(n)||(n.content instanceof l&&e(n.content),Et(n));ht(\"afterSanitizeShadowDOM\",t,null)};return o.sanitize=function(e){let t,n,i,a,c=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(Xe=!e,Xe&&(e=\"\\x3c!--\\x3e\"),\"string\"!=typeof e&&!dt(e)){if(\"function\"!=typeof e.toString)throw A(\"toString is not a function\");if(\"string\"!=typeof(e=e.toString()))throw A(\"dirty is not a string, aborting\")}if(!o.isSupported)return e;if(Re||nt(c),o.removed=[],\"string\"==typeof e&&(Me=!1),Me){if(e.nodeName){const t=Je(e.nodeName);if(!pe[t]||ye[t])throw A(\"root node is forbidden and cannot be sanitized in-place\")}}else if(e instanceof s)t=ut(\"\\x3c!----\\x3e\"),n=t.ownerDocument.importNode(e,!0),1===n.nodeType&&\"BODY\"===n.nodeName||\"HTML\"===n.nodeName?t=n:t.appendChild(n);else{if(!xe&&!_e&&!we&&-1===e.indexOf(\"<\"))return $&&ke?$.createHTML(e):e;if(t=ut(e),!t)return xe?null:ke?Z:\"\"}t&&Se&&st(t.firstChild);const m=pt(Me?e:t);for(;i=m.nextNode();)gt(i)||(i.content instanceof l&&At(i.content),Et(i));if(Me)return e;if(xe){if(De)for(a=ee.call(t.ownerDocument);t.firstChild;)a.appendChild(t.firstChild);else a=t;return(de.shadowroot||de.shadowrootmod)&&(a=ne.call(r,a,!0)),a}let u=we?t.outerHTML:t.innerHTML;return we&&pe[\"!doctype\"]&&t.ownerDocument&&t.ownerDocument.doctype&&t.ownerDocument.doctype.name&&E(q,t.ownerDocument.doctype.name)&&(u=\"<!DOCTYPE \"+t.ownerDocument.doctype.name+\">\\n\"+u),_e&&(u=g(u,re,\" \"),u=g(u,ie,\" \"),u=g(u,ae,\" \")),$&&ke?$.createHTML(u):u},o.setConfig=function(e){nt(e),Re=!0},o.clearConfig=function(){Qe=null,Re=!1},o.isValidAttribute=function(e,t,n){Qe||nt({});const o=Je(e),r=Je(t);return yt(o,r,n)},o.addHook=function(e,t){\"function\"==typeof t&&(oe[e]=oe[e]||[],p(oe[e],t))},o.removeHook=function(e){if(oe[e])return u(oe[e])},o.removeHooks=function(e){oe[e]&&(oe[e]=[])},o.removeAllHooks=function(){oe={}},o}();return V}));";

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Rest of the server-side code goes below.
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Initiate readline for in-prompt JSON message editing
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        const rl = require("readline");
        const rli = rl.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: "JSON: "
        });

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Initiate http module for serving the sidebar's UI
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        const http = require("http");
        const http2 = require("http");

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Sidebar UI
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        const sidebarServer = http.createServer(function (req, res) {
            function ret(status, string, type) {
                res.statusCode = status;
                if (type !== null) res.setHeader("Content-Type", type);
                res.end(string);
            };
            const reqPath = req.url;
            if (reqPath == "/") {
                ret(200, sidebarHTML(false), "text/html");
            } else if (reqPath == "/mini") {
                ret(200, sidebarHTML(true), "text/html");
            } else if (reqPath === "/sidebar.css") {
                ret(200, sidebarCSS, "text/css");
            } else if (reqPath == "/sidebar.js") {
                ret(200, sidebarJS, "text/javascript");
            } else if (reqPath == "/marked.min.js") { /* Marked.min.js */
                ret(200, markedJS, "text/javascript");
            } else if (reqPath.toLowerCase() === "/purify.min.js") {
                ret(200, purifyJS, "text/javascript");
            } else {
                ret(404, "404 Not Found\n", "text/plain");
            }
            });
            sidebarServer.listen(sidebarPort, () => {
                void(0);
        });

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Sidebar changer UI
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        const formServer = http2.createServer((req, res) => {
            function ret(status, string, type) {
                res.statusCode = status;
                if (type !== null) res.setHeader("Content-Type", type);
                res.end(string);
            };
            const reqPath = req.url;
            if (reqPath == "/") {
                ret(200, formHTML, "text/html");
            } else if (reqPath.toLowerCase() === "/sidebar.css") {
                ret(200, sidebarCSS, "text/css");
            } else if (reqPath.toLowerCase() === "/form.js") {
                ret(200, formJS, "text/javascript");
            } else if (reqPath.toLowerCase() === "/marked.min.js") {
                ret(200, markedJS, "text/javascript");
            } else if (reqPath.toLowerCase() === "/purify.min.js") {
                ret(200, purifyJS, "text/javascript");
            } else {
                ret(404, "404 Not Found\n", "text/plain");
            };
        });
        formServer.listen(formPort, () => {
            void(0);
        });

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        // The WebSocket server so real-time sidebar updating made possible
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        const ws = require("ws");
        const wss = new ws.Server({
            port: daemonPort
        });
        
        msg = {};
        msgdata = { status: "OK" };
        function update(msgobj) {
            msgdata = msgobj;
        };
        
        function sendMessage(message) {
            wss.clients.forEach(function each(client) {
                if (client.readyState === ws.OPEN) {
                    client.send(message);
                };
            });
        };
        
        
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Retrieve preset message from msgdata.json
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        const fs = require("fs");
        const path = require("path");
        
        fs.readFile(path.join(__dirname, "msgdata.json"), "utf8", function(err, data) {
            if (err) {
                console.log(err);
            } else {
                if (typeof data == "string" && data !== "") update(JSON.parse(data));
            };
        });
        
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Send messages periodically to make sure the new message will be delivered as soon as a client is 
        // connected
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        try {
            wss.on("connection", function connection(ws) {
                ws.on("message", function incoming(message) {
                    update(JSON.parse(message));
                    sendMessage(JSON.stringify(msgdata))
                });
                sendMessage('{ "status": "OK" }');
                sendMessage(JSON.stringify(msgdata));
            });

            wss.on("error", function error(x) {
                console.error("WebSocket error: " + x);
                process.exit(1);
            });
        } catch (x) {
            console.log("WebSocket failed to start: " + x);
            process.exit(1);
        };
        // setInterval(function () {
        //     sendMessage(JSON.stringify(msgdata));
        // }, 100);

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Program termination function
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        function terminate () {
            console.log("");
            console.log("Program finished");
            process.exit(0);
        };

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        // The prompt.
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        console.log(" ");
        console.log("To open the sidebar, visit http://localhost:" + sidebarPort + "/.");
        console.log(" ");
        console.log("To edit the sidebar from your browser, visit http://localhost:" + formPort + "/.");
        console.log(" ");
        console.log("Type the message in JSON here or press Ctrl+C to exit");
        console.log("The message format should be like:");
        console.log("1. Plain text message");
        console.log("   {\"type\":\"plain\", \"message\":\"Hello World\"}");
        console.log("2. Markdown message");
        console.log("   {\"type\":\"markdown\", \"message\":\"# Hello World\"}");
        console.log(" ");
        rli.prompt();

        rli.on("line", function (line) {
            //////////////////////////////////////////////////////////////////////////////////////////////////////
            // In-terminal message editing using readline
            //////////////////////////////////////////////////////////////////////////////////////////////////////
            msgdata = JSON.parse(line);
            msgdata.status = "OK";
            update(msgdata);
            sendMessage('{ "status": "OK" }');
            sendMessage(JSON.stringify(msgdata));
            rli.prompt();
        }).on("close", function () {
            //////////////////////////////////////////////////////////////////////////////////////////////////////
            // This will happen after you sent SIGINT (pressing Ctrl+C) in the prompt
            //////////////////////////////////////////////////////////////////////////////////////////////////////
            terminate();
        });
    } catch (x) {
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        // The crash handler that I wrote myself.
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        console.error(x);
        console.log("Let's try again.");
        if (tries < maxTries) {
            main();
        } else {
            console.error("I give up. I attempted to run it for " + maxTries + " attempt" + (maxTries > 1? "s " : " ") + "and I still got errors.");
            process.exit(1);
        };
    };
};
main();
