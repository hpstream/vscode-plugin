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
  try {
    const res: {
      isStudent: boolean;
    } = await instance.post(`/github/searchStudent`, {data});
    //
    console.log(res.isStudent);
    if (res.isStudent) {
      vscode.window.showInformationMessage(`恭喜你登录成功`);
    } else {
      vscode.window.showInformationMessage(`恭喜你登录成功`);
      vscode.window
        .showWarningMessage(
          `珠峰培训-十二年专注前端培训，有口皆碑的前端培训机构`,
          ButtonType.know,
          ButtonType.close
        )
        .then((res) => {
          if (res === ButtonType.know) {
            vscode.env.openExternal(vscode.Uri.parse(zfUlr));
          }
        });
    }
  } catch (e) {
    console.log(e);
  }

  await context.globalState.update("isLogin", true);

  return;
}
