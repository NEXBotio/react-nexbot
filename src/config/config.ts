
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
let BASE__AND_PATH:string;
let WEBSOCKET_CHAT_PATH:string;
let WEBSOCKET_USER_INFO_PATH:string;

if (process.env.NODE_ENV === 'production') {
  BASE__AND_PATH = "https://apis.nexbot.io/web/v1".replace(/\/+$/, "");
  WEBSOCKET_CHAT_PATH = "wss://websockets.nexbot.io"
  WEBSOCKET_USER_INFO_PATH=WEBSOCKET_CHAT_PATH
} else {
  BASE__AND_PATH = "https://localhost:8000".replace(/\/+$/, "");
  WEBSOCKET_CHAT_PATH = "wss://localhost:8050"
  WEBSOCKET_USER_INFO_PATH = "wss://localhost:8051"
}
export { BASE__AND_PATH, WEBSOCKET_CHAT_PATH, WEBSOCKET_USER_INFO_PATH };



// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// let BASE_PATH:string;
// let WEBSOCKET_CHAT_PATH:string;
// let WEBSOCKET_USER_INFO_PATH:string;

// const userBranch = process.env.USER_BRANCH;

// if (userBranch === 'master') {
//   BASE_PATH = "https://apis.nexbot.io/web/v1".replace(/\/+$/, "");
//   WEBSOCKET_CHAT_PATH = "wss://websockets.nexbot.io"
//   WEBSOCKET_USER_INFO_PATH=WEBSOCKET_CHAT_PATH
// } 
// else if (userBranch === 'dev') {
//   BASE_PATH = "https://apis-dev.nexbot.io/web/v1".replace(/\/+$/, "");
//   WEBSOCKET_CHAT_PATH = "wss://websockets-dev.nexbot.io"
//   WEBSOCKET_USER_INFO_PATH=WEBSOCKET_CHAT_PATH
// } else {

//   BASE_PATH = "https://localhost:8000".replace(/\/+$/, "");
//   WEBSOCKET_CHAT_PATH = "wss://localhost:8050"
//   WEBSOCKET_USER_INFO_PATH = "wss://localhost:8051"
// }
// export { BASE_PATH, WEBSOCKET_CHAT_PATH, WEBSOCKET_USER_INFO_PATH };




