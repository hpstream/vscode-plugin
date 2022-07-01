import * as vscode from "vscode";
export async function addDirCommand(context: vscode.ExtensionContext) {
  let res = await vscode.window.showInputBox({
    prompt: "请输入存放目录",
    validateInput: (s: string): string | undefined =>
      s && s.trim() ? undefined : "输入目录不能为空",
    placeHolder: "例如：tegbr4/izuna1",
    ignoreFocusOut: true,
  });
  context.globalState.update("dir", res);
  vscode.window.showInformationMessage("目录保存成功");
}
