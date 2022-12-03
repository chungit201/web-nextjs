import {env} from "server/config";

module.exports = {
  deployUrl: (env === "development") ?  "https://hermes.northstudio.dev/control/restart" : ""
}