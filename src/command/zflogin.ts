import axios from "axios";
import * as vscode from "vscode";
import {instance} from "../service/zfServe";

let zfUlr = "http://www.zhufengpeixun.com/";
enum ButtonType {
  know = "了解下",
  close = "关闭",
}
export async function zfloginCommand(context: vscode.ExtensionContext) {
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

  const {data} = await axios({
    method: "get",
    url: `https://api.github.com/user`,
    headers: {
      accept: "application/json",
      Authorization: `token ${accessToken}`,
    },
  });

  if (!data) return;
  console.log(instance);
  try {
    const res: {
      isStudent: boolean;
    } = await instance.post(`/github/searchStudent`, {data});

    console.log(res.isStudent);
    if (res.isStudent) {
      vscode.window.showInformationMessage(`恭喜你登录成功`);
    } else {
      vscode.window.showInformationMessage(`恭喜你登录成功`);
    }
  } catch (e) {
    console.log(e);
  }

  await context.globalState.update("isLogin", true);
  await context.globalState.update("userid", account.id);

  return;
}
