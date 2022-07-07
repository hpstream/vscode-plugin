import * as vscode from "vscode";
import {instance} from "../service/zfServe";
export async function addDirCommand(context: vscode.ExtensionContext) {
  const {account, accessToken} = await vscode.authentication.getSession(
    "github",
    ["user:email"],
    {
      createIfNone: true,
    }
  );
  // {
  // id: 18394192.
  // label: "hpstream"}
  if (!account) {
    vscode.window.showWarningMessage("请检查github账户权限");
    return;
  }
  let value = await vscode.window.showInputBox({
    prompt: "请输入存放目录",
    validateInput: (s: string): string | undefined =>
      s && s.trim() ? undefined : "输入目录不能为空",
    placeHolder: "例如：tegbr4/izuna1",
    ignoreFocusOut: true,
  });
  if (value) {
    try {
      const res = await instance.post(`/github/searchStudent`, {
        userid: account.id,
        label: value,
      });
      //
    } catch (e) {
      console.log(e);
    }
  } else {
    vscode.window.showWarningMessage("输入内容不能为空");
  }
}
