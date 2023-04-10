# Sidebar

## 1. Introduction
This is a Node.js script that will run a WebSocket server running on the port 8080 and serve the sidebar page on the port 8081. Those are the default ports and can be changed by editing the ``sidebar.node.js`` script. User can change the message in real-time by typing the message in one of the formats:
1. **Plain text**
```
{"type":"plain", "message":"Hello World"}
```
2. **Markdown**
```
{"type":"markdown", "message":"Hello World"}
```

## 2. Installation
Just ``git clone`` this repository and run the ``sidebar.node.js`` inside it. You can install or upgrade the modules used by this script by running the command below while on the script's directory:
```
npm install readline http ws fs path
```
To change the preset message, edit the ``msgdata.json`` file using one of the formats above.

## 3. Licensing
This is licensed under [the MIT license](LICENSE).
