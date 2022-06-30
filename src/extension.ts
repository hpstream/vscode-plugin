// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import {
  QuickInputButton,
  QuickInputButtons,
  QuickPickItem,
  Uri,
  window,
} from "vscode";
import {addDirCommand} from "./command/addDir";
import {addTypesCommand} from "./command/addType";
import {loginCommand} from "./command/login";
import {SidebarProvider} from "./webview/SidebarProvider";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri, context);
  console.log(SidebarProvider.viewType);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      SidebarProvider.viewType,
      sidebarProvider
    )
  );

  vscode.commands.registerCommand("studyArea.addType", async (ele) => {
    addTypesCommand(context, sidebarProvider);
  });

  vscode.commands.registerCommand("studyArea.login", async (ele) => {
    loginCommand(context);
  });

  vscode.commands.registerCommand("studyArea.addDir", async (ele) => {
    addDirCommand(context);
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
