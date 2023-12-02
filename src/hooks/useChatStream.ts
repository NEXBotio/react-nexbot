import React, { useEffect, useMemo } from "react";
import {
  HumanMessage,
  AIMessage,
  Conversation,
  Source,
} from "../api/api";
import useManagedWebSocket from "./useManagedWebSocket";
import { v4 as uuidv4 } from "uuid";
import { WEBSOCKET_CHAT_PATH } from "../config/config";
import { createNewConversation } from "../functions/Utils";
import { Subject } from "rxjs";
import { useWebSocketTicket } from "./useWebSocketTicket";


export interface MessageStream {
  stream: string;
  sources: Source[] | undefined;
}

export interface StreamedMessage {
  stream: string;
  is_conversation_summary: boolean;
  is_streaming: boolean;
  ai_message: AIMessage;
}
export interface UseChatStreamReturn {
  sendMessage: (message: string) => Subject<MessageStream> | undefined; // Replace ResponseType with the actual response type
}
export function useChatStream(
  keyRetrievalCallback: () => Promise<string>,
  botId: string,
  conversationId: string | undefined = undefined,
  user_display_name: string = "Guest",
  bot_display_name: string = "Bot"
): UseChatStreamReturn {
  const [outgoingMessage, setOutgoingMessage] = React.useState<
    HumanMessage | undefined
  >();

  const [url, setUrl] = React.useState<string | null>(null);
  const { sendJsonMessage, lastJsonMessage, getWebSocket, setSocketUrl } = useManagedWebSocket(url);
  const {wsTicket} = useWebSocketTicket(keyRetrievalCallback, 30 * 60, botId)

  useEffect(() => {
    if (botId && wsTicket) {
          const ticket = `${WEBSOCKET_CHAT_PATH}/${wsTicket}/messages`
          setUrl(ticket);
          setSocketUrl(ticket);
    }
  }, [botId, setUrl, setSocketUrl,wsTicket]);

  const messageStreamObservable: Subject<MessageStream> = useMemo(
    () => new Subject<MessageStream>(),
    [outgoingMessage]
  );
  useEffect(() => {
    return () =>
    getWebSocket()?.close();
  }, []);

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
            messageStreamObservable.next({
              stream: (lastJsonMessage as unknown as StreamedMessage).stream,
              sources: undefined,
            });
          } catch {
            messageStreamObservable.error("error");
          }
        } else {
          messageStreamObservable.next({
            stream: "",
            sources: (lastJsonMessage as unknown as StreamedMessage).ai_message
              .sources,
          });
          messageStreamObservable.complete();
        }
      }
    } catch {
      messageStreamObservable.error("error");
    }
  }, [lastJsonMessage]);

  function prepareMessageToSend(message: string): HumanMessage | undefined {
    if (botId) {
      let conv: Conversation;
      if (conversationId) {
        conv = createNewConversation(botId, bot_display_name, conversationId);
      } else {
        conv = createNewConversation(botId, bot_display_name);
      }
      const id = uuidv4();
      return {
        id: id,
        content: message,
        sender_type: "human",
        is_streaming: false,
        timestamp: Date.now(),
        sender_readable_name: user_display_name,
        user_display_name: user_display_name,
        recipient_bot_id: botId,
        conversation: conv,
      };
    }
  }

  function sendMessage(message: string) {
    const msg = prepareMessageToSend(message);
    try {
      sendJsonMessage(JSON.parse(JSON.stringify(msg)));
      return messageStreamObservable;
    } catch (e) {
      console.log("error sending message", e);
      return undefined;
    }
  }

  return {
    sendMessage,
  };
}
