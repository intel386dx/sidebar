# Sidebar

[![Last commit time](https://img.shields.io/github/last-commit/intel386dx/sidebar.svg)](https://github.com/intel386dx/sidebar/commits/main) [![Download ZIP file](https://img.shields.io/badge/zip%20file-download-blue)](https://github.com/intel386dx/sidebar/archive/main.zip)

![My designed cover](cover/cover-shadowed.png)

## 1. Introduction
This is a Node.js script that will run a WebSocket server running on the port 8080, serve the sidebar page on the port 8081, and serve the UI to update the sidebar on the port 8082. Those are the default ports and can be changed by editing the ``sidebar.node.js`` script.

![Sidebar UI](screenshots/information-sidebar.png)

The source files for the sidebar, the sidebar changer UI, and the minified versions of [Marked](https://github.com/markedjs/marked) and [DOMPurify](https://github.com/cure53/DOMPurify) is included in the ``pages`` folder. 

## 2. Installation
Just ``git clone`` this repository and run the ``sidebar.node.js`` script inside it. You can install or upgrade the modules used by this script by running the command below while on the script's directory:
```
npm install readline http ws fs path
```
To change the preset message, edit the ``msgdata.json`` file using one of the formats above.

## 3. Usage
1. While the script is running, you can change the message in real-time by typing the message to the prompt in one of the formats below. Press Enter to submit the message.
  - **Plain text**
  ```
  {"type":"plain", "message":"Hello World"}
  ```
  - **Markdown**
  ```
  {"type":"markdown", "message":"Hello World"}
  ```
> **Note:** If you want to include the double-quote and backslash marks in your message, use ``\"`` and ``\\``, respectively.
> For example:
> ```
> {"type":"plain", "message":"Press the Windows logo key + R, type \"C:\\Windows\\System32\\cmd.exe\", and then select OK."}
> ```
> will output something like this:
>
> ![This is what you will see.](screenshots/escaping-example.png)

2. Or, you can access the port 8082 (by default) to access the web-based UI to change the message. The UI is simple and intuitive. You choose the message type, type in the message, and hit the Update button.

![Update Sidebar UI](screenshots/update-sidebar.png)

> **Note:** This is the recommended way to edit the sidebar. If you don't understand how does JSON work, I recommend you to use the web-based UI instead.

## 4. Licensing
See [LICENSE.md](LICENSE.md) for more information.
