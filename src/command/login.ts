import * as vscode from "vscode";
let authUrl = "https://www.yuque.com/settings/profile";
let defaultUrl = "https://www.yuque.com/api/v2";
export async function loginCommand(context: vscode.ExtensionContext) {
  let domain = await vscode.window.showInputBox({
    prompt: "请输入",
    placeHolder: `默认值：${defaultUrl}`,
    ignoreFocusOut: true,
  });
  context.globalState.update("domain", domain || defaultUrl);

  vscode.window
    .showWarningMessage("了解如何获取token", "去了解", "关闭")
    .then((result) => {
      if (result === "去了解") {
        vscode.env.openExternal(vscode.Uri.parse(authUrl));
      }
    });

  let res = await vscode.window.showInputBox({
    prompt: "请输入token",
    validateInput: (s: string): string | undefined =>
      s && s.trim() ? undefined : "token不能",
    placeHolder: "请输入语雀token",
    ignoreFocusOut: true,
  });
  context.globalState.update("token", res);
  vscode.window.showInformationMessage(
    "您已通过语雀的授权，可以一键保存了,请关联存储目录"
  );
}
