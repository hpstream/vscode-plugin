import {AxiosResponse} from "axios";
import {fstat, readFileSync} from "fs";

import * as vscode from "vscode";
import {savedoc} from "../service";
import {getWorkspaceConfiguration} from "../utils/workspaceConfiguration";
export class ResultSidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;
  public static readonly viewType = "taskTimes";

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly context: vscode.ExtensionContext
  ) {}

  async sendData() {
    // console.log(value);
    this._view?.webview.postMessage({
      type: "data",
      value: {
        category: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        data: [10, 52, 200, 334, 390, 330, 220],
      },
    });
  }

  public async resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;
    let url = vscode.Uri.joinPath(
      this._extensionUri,
      "media",
      "result",
      "main.html"
    );
    let HTMLDATA = readFileSync(url.path, "utf-8");

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    try {
      webviewView.webview.html = this._getHtmlForWebview(
        webviewView.webview,
        HTMLDATA
      );
      setTimeout(() => {
        this.sendData();
      }, 3000);
    } catch (error) {
      return;
    }
  }
  private _getHtmlForWebview(webview: vscode.Webview, res: string) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        "media",
        "result",
        "echarts.min.js"
      )
    );

    const mainUrl = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "result", "main.js")
    );
    // console.log(scriptUri);
    // console.log(mainUrl);

    const nonce = getNonce();
    let data = res
      .replace(
        "<!-- css -->",
        `
         <script nonce="${nonce}" src="${scriptUri}"></script>
      `
      )
      .replace(
        "<!-- js -->",
        `
        <script nonce="${nonce}" src="${mainUrl}"></script>
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
