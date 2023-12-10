# react-nexbot
## End-to-End RAG Implementation for React Applications
![Alt text](code.gif)

## Table of Contents
- [react-nexbot](#react-nexbot)
  - [End-to-End RAG Implementation for React Applications](#end-to-end-rag-implementation-for-react-applications)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [How to Use react-nexbot](#how-to-use-react-nexbot)
    - [Arguments](#arguments)
    - [Return Value](#return-value)
      - [sendMessage](#sendmessage)
      - [MessageStream](#messagestream)
    - [Installation](#installation)
    - [Example Usage](#example-usage)
    - [Nexbot Authentication Endpoint](#nexbot-authentication-endpoint)
        - [JavaScript](#javascript)
        - [TypeScript](#typescript)
      - [Invoking useChatStream](#invoking-usechatstream)
        - [JavaScript](#javascript-1)
        - [TypeScript](#typescript-1)
      - [Sending a Message](#sending-a-message)
        - [JavaScript](#javascript-2)
        - [TypeScript](#typescript-2)
    - [Dependency Note](#dependency-note)

React-nexbot is the quickest, cheapest, and fastest way to embed Retrieval Augmented Generation (RAG) functionality into your React applications. Utilize our web app at [NEXBot.io](https://www.nexbot.io) to create, prompt, and add documents to your bots. This NPM package enables you to access and chat with your NEXBots from your apps.

## Getting Started

Begin by signing up or logging in with your preferred authentication provider at [Sign Up / Login](https://www.about.nexbot.io/signup-login).

You can generate your `server secret` by going to the developers settings, accessible from your profile menu.

**Pricing:** Pay-as-you-go model. Charges are based only on compute and storage usage. New accounts receive unlimited bots, 500 messages, and 300 pages of storage.

## How to Use react-nexbot

The package exports a single client-side React hook: `useChatStream()`.

### Arguments

| Parameter            | Type                         | Description                                                                                                                                                 |
|----------------------|------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| keyRetrievalCallback | `() => Promise<string>`      | A callback that returns a promise resolving to a string. This should return an authentication token from an API call to our servers, containing your server-secret. |
| botId                | `string`                     | The ID corresponding to the bot you will be chatting with.                                                                                                  |
| conversationId       | `string \| undefined`        | Optional identifier. Use this to reference the conversation in chat. If omitted, each message will be independent of previous ones.                         |
| user_display_name    | `string \| undefined`        | A name for your user. Defaults to “Guest” if not provided.                                                                                                  |

### Return Value

The hook returns a `sendMessage` function.

#### sendMessage

- **Arguments:**
  - `message: string`: The message your bot will respond to.
- **Returns:**
  - An RXJS Subject ([RXJS Subject Documentation](https://rxjs.dev/guide/subject)).

Subscribing to the subject and using `next` on the subscriber will retrieve the observer’s value.

#### MessageStream

- **Type:** Object
- **Property:** `stream`
- **Description:** Contains a string with the token streamed by the server on each pull.

### Installation
```shell
npm install react-nexbot
```

import
```
import { useChatStream }  from "react-nexbot";

```


### Example Usage

### Nexbot Authentication Endpoint

For Nexbot authentication, your endpoint should call the Nexbot API as follows:

```bash
curl -X GET \
     -H "Authorization: Bearer YOUR_SERVER_SECRET" \
     "https://apis.nexbot.io/web/v1/secrets/generate_single_use_token"
```


##### JavaScript
```javascript
fetch("https://apis.nexbot.io/web/v1/secrets/generate_single_use_token", {
  method: "GET",
  headers: {
    "Authorization": "Bearer YOUR_SERVER_SECRET"
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));

```

##### TypeScript
```typescript
const getSingleUseToken = async (): Promise<any> => {
  try {
    const response = await fetch("https://apis.nexbot.io/web/v1/secrets/generate_single_use_token", {
      method: "GET",
      headers: {
        "Authorization": "Bearer YOUR_SERVER_SECRET"
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
};
```

The response will contain a JSON payload with the key `access_token`. Your callback must provide only this string.

The callback is initially used by the hook to cache a single-use token, which opens a websocket connection with our servers and is immediately invalidated. The hook refreshes the token every 25 minutes using the callback. While the callback does not have to be an API call, using one allows Nexbot to handle token refresh for you.


#### Invoking useChatStream

##### JavaScript
```javascript
const { sendMessage } = useChatStream(() => {
  return axios.get("https://your.api/nexbot/authing/endpoint")
    .then((res) => {
      return res.data.token;
    });
}, botId);
```

##### TypeScript
```typescript
const botId: string = 'your-bot-id'; // Replace with your actual bot ID

const { sendMessage } = useChatStream(() => {
  return axios.get("https://your.api/nexbot/authing/endpoint")
    .then((res) => {
      return res.data.token as string;
    });
}, botId);
```

#### Sending a Message

##### JavaScript
```javascript
const onClick = () => {
  setWillStream(true);
}
const [text, setText] = useState("");
useEffect(() => {
  if (willStream) {
    setText("");
    const newObservable = sendMessage("Hello!");
    newObservable.subscribe({
      next: (data) => {
        setText(prev => prev ? prev + data.stream : data.stream);
      },
      complete: () => {
        setWillStream(false);
      },
    });
  }
}, [willStream]);
```

##### TypeScript
```typescript
 const [willStream, setWillStream] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const { sendMessage } = useChatStream(/* arguments here */);

  useEffect(() => {
    if (willStream) {
      setText('');
      const newObservable: Observable<any> = sendMessage('Hello!');
      newObservable.subscribe({
        next: (data) => {
          setText((prev: string) => prev ? `${prev}${data.stream}` : data.stream);
        },
        complete: () => {
          setWillStream(false);
        },
      });
    }
  }, [willStream, sendMessage]);

  const onClick = (): void => {
    setWillStream(true);
  };
```




### Dependency Note

React-nexbot uses `useQuery` as a dependency. Ensure to wrap your component hierarchy with `useQueryClientProvider` at your desired level if not already doing so.

