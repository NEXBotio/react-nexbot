

let BASE__AND_PATH:string;
let WEBSOCKET_CHAT_PATH:string;
let WEBSOCKET_USER_INFO_PATH:string;


  BASE__AND_PATH = "https://apis.nexbot.io/web/v1".replace(/\/+$/, "");
  WEBSOCKET_CHAT_PATH = "wss://websockets.nexbot.io"
  WEBSOCKET_USER_INFO_PATH=WEBSOCKET_CHAT_PATH

export { BASE__AND_PATH, WEBSOCKET_CHAT_PATH, WEBSOCKET_USER_INFO_PATH };

