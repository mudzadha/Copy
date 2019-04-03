import { ruleKeys } from "../tools/rule";
import { dialog, BrowserWindow, MenuItem, nativeImage, shell } from "electron";
import { envConfig } from "../tools/envConfig";
import { checkUpdate } from "../tools/checker";
import { constants, version } from "../core/constant";
import { Controller } from "../core/controller";
import { decompose } from "../tools/action";

const _ = require("lodash");

const clipboard = require("electron-clipboard-extended");

function handleActions(
  id: string,
  menuItem: MenuItem | undefined = undefined,
  browserWindow: BrowserWindow | undefined = undefined,
  event: Event | undefined = undefined
) {
  const params = decompose(id);
  id = params[0];
  const param = params[1];
  if (ruleKeys.includes(id)) {
    const controller = <Controller>(<any>global).controller;
    if (param) {
      const intVal = parseInt(param);
      controller.setByKeyValue(id, intVal ? intVal : param);
      return;
    }
    if (menuItem) {
      controller.setByKeyValue(id, menuItem.checked);
    } else {
      controller.switchValue(id);
    }
  } else {
    handleNormalAction(id);
  }
}

function handleNormalAction(actionId: string) {
  const controller = <Controller>(<any>global).controller;
  const t = controller.getT();
  switch (actionId) {
    case "contrastMode":
      controller.win.routeTo("Contrast");
      break;
    case "focusMode":
      controller.win.routeTo("Focus");
      break;
    case "exit":
      controller.onExit();
      break;
    case "clear":
      controller.clear();
      break;
    case "copySource":
      clipboard.writeText(controller.src);
      break;
    case "copyResult":
      clipboard.writeText(controller.result);
      break;
    case "settings":
      controller.win.routeTo("Settings");
      break;
    case "helpAndUpdate":
      dialog.showMessageBox(
        <BrowserWindow>controller.win.window,
        {
          title: constants.appName + " " + version,
          message:
            "If you found it useful, please give me a star on GitHub or introduce to your friend.\n如果您感觉本软件对您有所帮助，请在项目Github上给个star或是介绍给您的朋友，谢谢。\n本软件免费开源，如果您是以付费的方式获得本软件，那么你应该是被骗了。[○･｀Д´･ ○]",
          buttons: [t("homepage"), t("userManual"), t("checkUpdate"), "cancel"],
          cancelId: 3,
          icon: nativeImage.createFromPath(envConfig.diffConfig.iconPath)
        },
        function(response, checkboxChecked) {
          switch (response) {
            case 0:
              shell.openExternal(constants.homepage);
              break;
            case 1:
              shell.openExternal(constants.wiki);
              break;
            case 2:
              checkUpdate();
              break;
          }
        }
      );

      break;
    case "retryTranslate":
      controller.doTranslate(controller.src);
      break;
    case "restoreDefault":
      controller.resotreDefaultSetting();
      break;
  }
}

export { handleActions };
