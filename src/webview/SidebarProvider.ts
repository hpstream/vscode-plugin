import {AxiosResponse} from "axios";
import {fstat, readFileSync} from "fs";

import * as vscode from "vscode";
import {savedoc} from "../service";
import {listTaskType} from "../service/typeServe";
import {getWorkspaceConfiguration} from "../utils/workspaceConfiguration";
export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;
  public static readonly viewType = "taskWebView";

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly context: vscode.ExtensionContext
  ) {}

  handleMessage(webviewView: vscode.WebviewView) {
    // Receive message from the webview.

    webviewView.webview.onDidReceiveMessage((data: any) => {
      // 收消息
      // console.log(data.type);
      switch (data.type) {
        case "finishTask":
          let info: any = this.context.globalState.get("infos");
          if (info) {
            info = info.taskData;
            info.endTime = new Date().getTime();
            savedoc(this.context, info);
          }
          this.context.globalState.update("infos", "");
          info = this.context.globalState.get("infos");

          console.log(info);

          return;

        case "addTask":
          let infos = JSON.parse(data.value);
          this.context.globalState.update("infos", infos);

          return;
        case "delete":
          return;
      }
    });

    // message from the webview.

    setTimeout(() => {
      this.sendTypeOption();
    }, 3000);
  }
  async sendTypeOption() {
    let isLogin = this.context.globalState.get("isLogin");
    if (!isLogin) {
      vscode.window.showWarningMessage("请先登录");
    }
    let userid = this.context.globalState.get("userid");
    let res = await listTaskType({userid});
    if (res) {
      this._view?.webview.postMessage({
        type: "getTypeOption",
        value: res.data,
      });
    }
  }

  public async resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    let url = vscode.Uri.joinPath(this._extensionUri, "media", "main.html");
    // let HTMLDATA = readFileSync(url.path, "utf-8");
    let HTMLDATA = readFileSync(url.fsPath, "utf-8");

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };
    webviewView.onDidChangeVisibility((v) => {
      this.sendTypeOption();
    });
    try {
      webviewView.webview.html = this._getHtmlForWebview(
        webviewView.webview,
        HTMLDATA
      );

      this.handleMessage(webviewView);
    } catch (error) {
      return;
    }
  }
  private _getHtmlForWebview(webview: vscode.Webview, res: string) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "main.js")
    );
    const vueUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vue.global.js")
    );
    const elementCssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "index.css")
    );
    const elementJsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "index.full.js")
    );

    const nonce = getNonce();
    let data = res
      .replace(
        "<!-- css -->",
        `
        

          <!-- 导入样式 -->
          <link rel="stylesheet" href="${elementCssUri}" />
          <!-- 导入 Vue 3 -->
          <script src="${vueUri}"></script>
          <!-- 导入组件库 -->
          <script src="${elementJsUri}"></script>
      `
      )
      .replace(
        "<!-- js -->",
        `
        <script nonce="${nonce}" src="${scriptUri}"></script>
    `
      );
    return data;
  }
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
