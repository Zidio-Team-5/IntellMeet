import appConfig from "../../config/app.config.js";

export const APP_NAME    = appConfig.appName;
export const APP_VERSION = appConfig.version;

export function setPageTitle(title) {
  document.title = title ? `${title} — ${APP_NAME}` : APP_NAME;
}
