// utils.js

import { Conversation } from "../api/api";

import { v4 as uuidv4 } from "uuid";

export function generateConversationId() {
  return uuidv4();
}

export const createNewConversation = (bot_id:string, bot_readable_name:string, id:string  = generateConversationId()):Conversation => {  

  const newConversation: Conversation = {
    id:id,
    summary: '...',
    chat_history_doc_id: id,
    bot_id: bot_id,
    bot_readable_name: bot_readable_name,
  };
  return newConversation;
};


