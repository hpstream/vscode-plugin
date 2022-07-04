import * as vscode from "vscode";
import {getWorkspaceConfiguration} from "../utils/workspaceConfiguration";
import {SidebarProvider} from "../webview/SidebarProvider";
export async function addTypesCommand(
  context: vscode.ExtensionContext,
  sidebarProvider: SidebarProvider
) {
  let res = await vscode.window.showInputBox({
    prompt: "请输入任务类型",
    validateInput: (s: string): string | undefined =>
      s && s.trim() ? undefined : "输入内容不能为空",
    placeHolder: "例如：[娱乐]",
    ignoreFocusOut: true,
  });
  let value = getWorkspaceConfiguration().get<any[]>("typeOptions") || [];
  if (res) {
    await getWorkspaceConfiguration().update(
      "typeOptions",
      [...value, {label: res, value: res}],
      vscode.ConfigurationTarget.Global
    );
    sidebarProvider.sendTypeOption();

    vscode.window.showInformationMessage("新增类型成功");
  }
}
