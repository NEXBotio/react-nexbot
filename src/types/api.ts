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

    export interface Conversation {
        /**
         * 
         * @type {string}
         * @memberof Conversation
         */
        'id': string;
        /**
         * 
         * @type {string}
         * @memberof Conversation
         */
        'summary': string;
        /**
         * 
         * @type {string}
         * @memberof Conversation
         */
        'chat_history_doc_id': string;
        /**
         * 
         * @type {string}
         * @memberof Conversation
         */
        'user_id'?: string;
        /**
         * 
         * @type {string}
         * @memberof Conversation
         */
        'bot_id': string;
        /**
         * 
         * @type {string}
         * @memberof Conversation
         */
        'bot_readable_name': string;
    }


    /**
 * An enumeration.
 * @export
 * @enum {string}
 */

export const SenderType = {
    Human: 'human',
    Ai: 'ai',
    Advertiser: 'advertiser',
    System: 'system'
} as const;

export type SenderType = typeof SenderType[keyof typeof SenderType];

/**
 * An enumeration.
 * @export
 * @enum {string}
 */

export const EmailAction = {
    Forward: 'forward',
    Reply: 'reply'
} as const;

export type EmailAction = typeof EmailAction[keyof typeof EmailAction];

/**
 * 
 * @export
 * @interface Connection
 */
export interface Connection {
    /**
     * 
     * @type {string}
     * @memberof Connection
     */
    'id'?: string;
    /**
     * 
     * @type {ConnectionType}
     * @memberof Connection
     */
    'connection_type': ConnectionType;
    /**
     * 
     * @type {string}
     * @memberof Connection
     */
    'bot_id': string;
    /**
     * 
     * @type {object}
     * @memberof Connection
     */
    'subclass_data'?: object;
    /**
     * 
     * @type {string}
     * @memberof Connection
     */
    'email': string;
    /**
     * 
     * @type {EmailAction}
     * @memberof Connection
     */
    'email_action': EmailAction;
    /**
     * 
     * @type {string}
     * @memberof Connection
     */
    'forwarding_email'?: string;
    /**
     * 
     * @type {string}
     * @memberof Connection
     */
    'instructions': string;
    /**
     * 
     * @type {string}
     * @memberof Connection
     */
    'api_url': string;
}


/**
 * An enumeration.
 * @export
 * @enum {string}
 */

export const ConnectionType = {
    Email: 'email'
} as const;

export type ConnectionType = typeof ConnectionType[keyof typeof ConnectionType];

/**
 * 
 * @export
 * @interface HumanMessage
 */
export interface HumanMessage {
    /**
     * 
     * @type {string}
     * @memberof HumanMessage
     */
    'content': string;
    /**
     * 
     * @type {SenderType}
     * @memberof HumanMessage
     */
    'sender_type': SenderType;
    /**
     * 
     * @type {boolean}
     * @memberof HumanMessage
     */
    'is_streaming': boolean;
    /**
     * 
     * @type {number}
     * @memberof HumanMessage
     */
    'timestamp': number;
    /**
     * 
     * @type {string}
     * @memberof HumanMessage
     */
    'sender_readable_name': string;
    /**
     * 
     * @type {string}
     * @memberof HumanMessage
     */
    'user_id'?: string;
    /**
     * 
     * @type {string}
     * @memberof HumanMessage
     */
    'id': string;
    /**
     * 
     * @type {Conversation}
     * @memberof HumanMessage
     */
    'conversation': Conversation;
    /**
     * 
     * @type {string}
     * @memberof HumanMessage
     */
    'user_display_name': string;
    /**
     * 
     * @type {string}
     * @memberof HumanMessage
     */
    'recipient_bot_id': string;
    /**
     * 
     * @type {Connection}
     * @memberof HumanMessage
     */
    'connection'?: Connection;
}


/**
 * 
 * @export
 * @interface AIMessage
 */
export interface AIMessage {
    /**
     * 
     * @type {string}
     * @memberof AIMessage
     */
    'content': string;
    /**
     * 
     * @type {SenderType}
     * @memberof AIMessage
     */
    'sender_type': SenderType;
    /**
     * 
     * @type {boolean}
     * @memberof AIMessage
     */
    'is_streaming': boolean;
    /**
     * 
     * @type {number}
     * @memberof AIMessage
     */
    'timestamp': number;
    /**
     * 
     * @type {string}
     * @memberof AIMessage
     */
    'sender_readable_name': string;
    /**
     * 
     * @type {string}
     * @memberof AIMessage
     */
    'id': string;
    /**
     * 
     * @type {Array<Source>}
     * @memberof AIMessage
     */
    'sources'?: Array<Source>;
    /**
     * 
     * @type {Conversation}
     * @memberof AIMessage
     */
    'conversation': Conversation;
    /**
     * 
     * @type {string}
     * @memberof AIMessage
     */
    'bot_id': string;
}
