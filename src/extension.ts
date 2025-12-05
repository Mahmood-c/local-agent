// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { LocalAgentViewProvider } from './view/webview';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Register the TreeView or Webview Provider
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
