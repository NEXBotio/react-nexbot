import React, { useEffect, useMemo, useState } from "react";
import {
  HumanMessage,
  AIMessage,
  Conversation,
  Bot,
  UserInfo,
  BotPublicInterface,
  DefaultApi,
  Source,
} from "@api/api";
import useManagedWebSocket from "@hooks/useManagedWebSocket";
import { v4 as uuidv4 } from "uuid";
import { BASE_PATH } from "@api/base";
import { WEBSOCKET_CHAT_PATH } from "@config/config";
import { Configuration } from "@api/configuration";
import axios from "axios";
import {createNewConversation} from "@functions/Utils"
import { Subject } from "rxjs";
axios.defaults.withCredentials = true;
// import { useSharedApiData } from "./useSharedApiData";

{
  /*
//how does this work?
usechat takes in all the info needed to identify the bot and the userInfo when first set up (called)
Then it provides prepareMessage, which takes a string and given the state (bots, userInfo, conversation) returns a message object
that can then be take and used in some way. in our implementation of the main chat here we use it right on input submit byt setting the message in our message array. this displays the message
Then when we are readuy to actually send the message to the server, we use another provided function, sendMessageAndReceiveStream, which takes the message object and sends it to the server.
this is a synchronous function (that is, not async), which streams data from teh websocket connection that is opened when usechatis first called.

*/
}
export interface MessageWithSources{
stream:string
sources:Source[]|undefined
}


export interface StreamedMessage {
  stream: string;
  is_conversation_summary: boolean;
  is_streaming: boolean;
  ai_message: AIMessage;
}

function useChatStream(
  keyRetrievalCallback: () => Promise<string>,
  botId: string,
  conversationId: string|undefined=undefined,
  user_display_name: string='Guest',
  bot_display_name: string='Bot',
) {
const [outgoingMessage, setOutgoingMessage] = React.useState<HumanMessage | undefined>();
const [singleUseToken, setSingleUseToken] =useState<string|undefined>(undefined)
useEffect(() => {
  keyRetrievalCallback()
    .then((retrievedKey) => {
      setSingleUseToken(retrievedKey);
    })
    .catch((err) => {
      console.error('Error retrieving key:', err);
      throw err;
    });
}, [keyRetrievalCallback]);
const api = useMemo(() => new DefaultApi(new Configuration({ basePath: BASE_PATH, accessToken: singleUseToken })), [singleUseToken]);
const [url, setUrl] = React.useState<string | null>(null);
  const { sendJsonMessage, lastJsonMessage, getWebSocket, setSocketUrl } = useManagedWebSocket(url);

  useEffect(() => {
    if (botId) {
      const websocketTicket = async () => {
        try {
          const tokenData = await api.getWsTicketGetWsTicketGet();
          const ticket = `${WEBSOCKET_CHAT_PATH}/${tokenData?.data.access_token}/messages`;

          setUrl(ticket);
          setSocketUrl(ticket);
        } catch (e) {
          console.log(e);
          throw(`Could not establish websocket connection to ${WEBSOCKET_CHAT_PATH}. This is likely an issue with credentials, is your callback returning a token?. Error: ${e}`)
        }
      };
      websocketTicket();
    }
  }, [botId, api, setUrl,setSocketUrl]);


  const messageStreamObservable: Subject<MessageWithSources> = useMemo(
    () => new Subject<MessageWithSources>(),
    [outgoingMessage]
  );
  useEffect(() => {
    getWebSocket()?.close();
  }, [botId]);


  useEffect(() => {
    try {
      console.log("useChat: lastJsonMessage", lastJsonMessage);
      if (lastJsonMessage) {
        console.log("useChat: lastJsonMessage", lastJsonMessage);
        if ("error" in lastJsonMessage) {

          return;
        }
          if ((lastJsonMessage as unknown as StreamedMessage).is_streaming) {
            try {
                messageStreamObservable.next(
                  {stream:(lastJsonMessage as unknown as StreamedMessage).stream, sources:undefined}
                );
            } catch {
              messageStreamObservable.error("error");
            }
          } else {
            messageStreamObservable.next(
              {stream:'', sources:(lastJsonMessage as unknown as StreamedMessage).ai_message.sources}
            );
            messageStreamObservable.complete();
          }
        }
    } catch {
      messageStreamObservable.error("error");
    }
  }, [lastJsonMessage]);


  function prepareMessageToSend(message: string): HumanMessage | undefined {
    if (botId) {
      let conv:Conversation
      if(conversationId){
      conv = createNewConversation(botId, bot_display_name,conversationId)
      }
      else{
      conv= createNewConversation(botId, bot_display_name)
      }
      const id = uuidv4();
      return {
        id: id,
        content: message,
        sender_type: "human",
        is_streaming: false,
        timestamp: Date.now(),
        sender_readable_name:user_display_name,
        user_display_name: user_display_name,
        recipient_bot_id: botId,
        conversation: conv,
      };
    }
  }

  function sendMessage(message:string) {
  const msg = prepareMessageToSend(message)
    try {
      sendJsonMessage(JSON.parse(JSON.stringify(message)));
      return messageStreamObservable;
    } catch (e) {
      console.log("error sending message", e);
      return undefined;
    }
    
  }

  return {
    sendMessage
  };
}

export default useChatStream;
