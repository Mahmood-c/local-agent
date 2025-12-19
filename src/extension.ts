// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { LocalAgentViewProvider } from './view/webview';
import { spawn } from "child_process";
import path from 'path';

let mcpProcess: ReturnType<typeof spawn> | undefined;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Register the TreeView or Webview Provider
    const serverPath = path.join(
        context.extensionPath,
        "dist",
        "mpc-server.ts"
    );
    mcpProcess = spawn("node", [serverPath], {
        cwd: vscode.workspace.workspaceFolders?.[0].uri.fsPath,
        stdio: ["pipe", "pipe", "pipe"]
    });

    mcpProcess.stderr?.on("data", (data) => {
        console.error("[MCP]", data.toString());
    });
    context.subscriptions.push({
        dispose() {
            mcpProcess?.kill();
        }
    });
    const provider = new LocalAgentViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            "local-agent-view", // must match the id in package.json
            provider
        )

    );

}

// This method is called when your extension is deactivated
export function deactivate() { }
