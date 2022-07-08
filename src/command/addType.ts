import * as vscode from "vscode";
import {addTaskType} from "../service/typeServe";
import {SidebarProvider} from "../webview/SidebarProvider";
export async function addTypesCommand(
  context: vscode.ExtensionContext,
  sidebarProvider: SidebarProvider
) {
  let isLogin = context.globalState.get("isLogin");
  if (!isLogin) {
    vscode.window.showWarningMessage("请先登录");
    return;
  }
  let label = await vscode.window.showInputBox({
    prompt: "请输入任务类型",
    validateInput: (s: string): string | undefined =>
      s && s.trim() ? undefined : "输入内容不能为空",
    placeHolder: "例如：[娱乐]",
    ignoreFocusOut: true,
  });

  if (label) {
    let userid = context.globalState.get("userid");
    try {
      let res: any = await addTaskType({
        userid,
        label,
      });
      vscode.window.showInformationMessage(res.msg);
      sidebarProvider.sendTypeOption();
    } catch (error) {}
  } else {
    vscode.window.showWarningMessage("输入内容不能为空");
  }
}
