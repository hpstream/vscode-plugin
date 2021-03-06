import {ResultSidebarProvider} from "./webview/ResultSidebarProvider";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import {addDirCommand} from "./command/addDir";
import {addTypesCommand} from "./command/addType";
import {loginCommand} from "./command/login";
import {SidebarProvider} from "./webview/SidebarProvider";
import {zfloginCommand} from "./command/zflogin";
import {onlineCount} from "./service/typeServe";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const resultSidebarProvider = new ResultSidebarProvider(
    context.extensionUri,
    context
  );

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      ResultSidebarProvider.viewType,
      resultSidebarProvider
    )
  );
  const sidebarProvider = new SidebarProvider(
    context.extensionUri,
    context,
    () => resultSidebarProvider.sendData()
  );
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

  vscode.commands.registerCommand("studyArea.zflogin", async (ele) => {
    zfloginCommand(context);
  });

  let myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  const myCommandId = "studyArea.onlineCount";
  let timer: any = null;
  vscode.commands.registerCommand(myCommandId, () => {
    updateStatusBarItem();
  });
  updateStatusBarItem();
  myStatusBarItem.command = myCommandId;

  async function updateStatusBarItem() {
    clearInterval(timer);
    onlineCountAPI();
    setInterval(() => {
      onlineCountAPI();
    }, 60 * 1000);
  }

  async function onlineCountAPI() {
    let res = await onlineCount({});
    myStatusBarItem.text = `??????????????????????????????${res.data.list.length}`;
    myStatusBarItem.show();
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
