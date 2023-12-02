import {Subject} from "rxjs";


export interface SourceMetadata {
  'file_name'?: string;
  'file_type'?: string;
  'file_path'?: string;
}
export interface Source {
  'page_content': string;
  'metadata': SourceMetadata;
}

export interface MessageStream{
  stream:string
  sources:Source[]|undefined
  }
  

export interface UseChatStreamReturn {
  sendMessage: (message: string) => Subject<MessageStream>|undefined; // Replace ResponseType with the actual response type
}

export function useChatStream(
    keyRetrievalCallback: () => Promise<string>,
    botId: string,
    conversationId: string|undefined,
    user_display_name: string,
    bot_display_name: string,
  ):UseChatStreamReturn

