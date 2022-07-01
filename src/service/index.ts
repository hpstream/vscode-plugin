import axios from "axios";
import dayjs = require("dayjs");
import * as vscode from "vscode";

export async function isValidate(context: vscode.ExtensionContext) {
  let token = context.globalState.get("token") as string;
  let domain = context.globalState.get("domain") as string;

  if (!token || !domain) {
    vscode.window.showErrorMessage("token,domain不能为空");
    vscode.window
      .showWarningMessage("是否去了解详细配置？", "去了解", "关闭")
      .then((result) => {
        if (result === "去了解") {
          vscode.env.openExternal(
            vscode.Uri.parse(
              " https://www.yuque.com/yuque/developer/doc#684fb2c5"
            )
          );
        }
      });

    return;
  }

  let data = {
    baseURL: domain,
    headers: {
      "X-Auth-Token": token,
    },
  };
  return data;
}

export async function request(
  context: vscode.ExtensionContext,
  params: Record<string, any>
) {
  let data = await isValidate(context);
  if (data) {
    return axios(Object.assign(data, params))
      .then((res) => {
        return res;
      })
      .catch((e) => {
        // console.log(e)
        return e.response
          ? e.response.data
          : {
              status: 401,
              message: "domain不合法",
            };
      });
  }
}

export async function savedoc(
  context: vscode.ExtensionContext,
  params: Record<string, any>
) {
  let data = await isValidate(context);
  let repo_id = context.globalState.get("dir") as string;
  if (data) {
    let title = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
    params.title = title;
    params.costTime = dayjs(params.endTime)
      .diff(params.starTime, "hour", true)
      .toFixed(2); // 7
    return axios(
      Object.assign(data, {
        method: "post",
        url: `/repos/${repo_id}/docs`,
        params: {
          description: "11111",
          title: JSON.stringify(params),
          body: JSON.stringify(params),
        },
      })
    )
      .then((res) => {
        console.log(res);
        vscode.window.showInformationMessage("恭喜完成一个任务");
        return res;
      })
      .catch((e) => {
        // console.log(e)
        let msg = e.response
          ? e.response.data
          : {
              status: 401,
              message: "domain不合法",
            };

        vscode.window.showInformationMessage(msg.message);
      });
  }
}

export async function getList(context: vscode.ExtensionContext) {
  let data = await isValidate(context);
  let repo_id = context.globalState.get("dir") as string;
  if (data) {
    return axios(
      Object.assign(data, {
        method: "get",
        url: `/repos/${repo_id}/docs`,
        params: {},
      })
    )
      .then((res) => {
        let datas = res.data.data;
        let map: any = {};
        datas.forEach((data: any) => {
          let pdata = JSON.parse(data.title);
          if (map[pdata.type] === undefined) {
            map[pdata.type] = 0;
          }
          map[pdata.type] += pdata.costTime;
        });

        let category = Object.keys(map);
        let data = Object.values(map);
        return {
          category,
          data,
        };
      })
      .catch((e) => {
        // console.log(e)
        let msg = e.response
          ? e.response.data
          : {
              status: 401,
              message: "domain不合法",
            };

        vscode.window.showInformationMessage(msg.message);
      });
  }
}
