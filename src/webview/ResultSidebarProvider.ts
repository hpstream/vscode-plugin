import {AxiosResponse} from "axios";
import dayjs = require("dayjs");
import {fstat, readFileSync} from "fs";

import * as vscode from "vscode";
import {getList, savedoc} from "../service";
import {taskList, taskMy} from "../service/typeServe";
import {getWorkspaceConfiguration} from "../utils/workspaceConfiguration";
export class ResultSidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;
  public static readonly viewType = "taskTimes";

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly context: vscode.ExtensionContext
  ) {}

  async sendData(): Promise<void> {
    // console.log(value);
    let isLogin = this.context.globalState.get("isLogin");
    if (!isLogin) {
      vscode.window.showWarningMessage("请先登录");
      return;
    }
    let userid = this.context.globalState.get("userid");

    let starTime: any = dayjs().startOf("week").add(1, "day");
    let endTime = starTime.add(1, "week").format("YYYY-MM-DD HH:mm:ss");
    starTime = starTime.format("YYYY-MM-DD HH:mm:ss");
    let time = getWorkspaceConfiguration().get<{
      starTime: string;
      endTime: string;
    }>("times") || {
      starTime,
      endTime,
    };

    let resMydata: any = await taskMy({
      userid,
      starTime: time.starTime ,
      endTime: time.endTime,
    });
    let mydata: any = {
      category: [],
      data: [],
    };
    resMydata.data.forEach((row: any) => {
      mydata.category.push(row.label);
      mydata.data.push(row.costTime);
    });

    let resAllData: any = await taskList({});
    let allData: any = {
      category: [],
      data: [],
    };

    resAllData.data.forEach((row: any) => {
      allData.category.push(row.name);
      allData.data.push(row.costTime);
    });

    this._view?.webview.postMessage({
      type: "data",
      value: {
        mytitle: `${dayjs(time.starTime).format("YYYY-MM-DD")}~${dayjs(
          time.endTime
        ).format("YYYY-MM-DD")}`,
        mydata,
        allData,
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
    let HTMLDATA = readFileSync(url.fsPath, "utf-8");

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
      this.sendData();
      webviewView.onDidChangeVisibility((v) => {
        setTimeout(() => {
          this.sendData();
        }, 3000);
      });
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
