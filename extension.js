const vscode = require('vscode');
const client = require('discord-rich-presence')('771147594092249088');


function activate() {
    var start = Date.now();
    if (!vscode.workspace.getConfiguration("discord-rich-presence-integration").startWithVSCode) {
        return;
    }
    if (!vscode.window.activeTextEditor) {
        var currState;
        if (!vscode.workspace.name) {
            currState = "Idling"
        } else {
            currState = "Working in Folder: " + vscode.workspace.name;
        }
        client.updatePresence({
            state: currState,
            startTimestamp: Date.now()
        });
    } else {
        updatepres(vscode.window.activeTextEditor.document, start);
    }
    //Change Rich Presence
    vscode.workspace.onDidOpenTextDocument((document) => {
        start = Date.now();
        updatepres(document, start);
    });

    vscode.window.onDidChangeActiveTextEditor((textEditor) => {

        var document = textEditor.document;
        start = Date.now();

        updatepres(document, start);
    });

    vscode.workspace.onDidCloseTextDocument(() => {

        if (!vscode.window.activeTextEditor) {
            var currState;
            if (!vscode.workspace.name) {
                currState = "Idling"
            } else {
                currState = "Working in Folder: " + vscode.workspace.name;
            }
            client.updatePresence({
                state: currState,
                startTimestamp: Date.now()
            });
        }
    });
}
//exports.activate = activate;


function updatepres(document, start) {
    if(document.fileName.endsWith(".git")) {
        return;
    }
    var filename = document.fileName.substring(document.fileName.lastIndexOf('\\') + 1);
    var language = "";
    console.log(document);
    if (document.languageId == "plaintext" || document.languageId.includes("txt")) {
        language = "Plaintext";
    } else {
        language = document.languageId.charAt(0).toUpperCase() + document.languageId.slice(1);
    }

    var currDetail = "Editing " + filename.replace(".git", "");
    var currState = "Language: " + language;
    var imagePath;
    switch (document.languageId) {
        case "javascript":
        case "c":
        case "cpp":
        case "csharp":
        case "java":
        case "php":
        case "python":
        case "ruby":
        case "sql":
        case "swift":
            imagePath = document.languageId + "_logo";
            break;
        default:
            imagePath = "vscode_logo";
            break;
    }
    client.updatePresence({
        state: currState,
        details: currDetail,
        startTimestamp: start,
        largeImageKey: imagePath
    });
}

function deactivate() {
    client.disconnect();
}

module.exports = {
    activate,
    deactivate
}