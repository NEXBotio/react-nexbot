import { useState, useEffect, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

const INITIAL_RECONNECT_DELAY_MS = 1000;
const MAX_RECONNECT_DELAY_MS = 60000;

function useManagedWebSocket(url: string|null) {

    
    const [socketUrl, setSocketUrl] = useState(url);
    const {
        sendJsonMessage,
        lastJsonMessage,
        readyState,
        getWebSocket,
      } = useWebSocket(socketUrl, {
        shouldReconnect: () => socketUrl !== null,
      }) as {
        sendJsonMessage: Function; // Replace Function with a more specific type
        lastJsonMessage: any; 
        readyState: ReadyState;
        getWebSocket: Function; 
      };
    const reconnectDelayMS = useRef(INITIAL_RECONNECT_DELAY_MS);

    useEffect(() => {
        if(url){
        console.log(`Attempting to open WebSocket connection to ${socketUrl}`);
       
        if (readyState === ReadyState.CLOSED) {
            // The WebSocket has been closed, try to reconnect after a delay.
            console.log(`WebSocket connection closed to ${socketUrl}, attempting to reconnect in ${reconnectDelayMS.current}ms`);
           
            setTimeout(() => {
                setSocketUrl(url);
                reconnectDelayMS.current = Math.min(reconnectDelayMS.current * 2, MAX_RECONNECT_DELAY_MS);
            }, reconnectDelayMS.current);
        } else if (readyState === ReadyState.OPEN) {
            console.log(`WebSocket connection opened to ${socketUrl}`);
      
            // The WebSocket is open, reset the reconnect delay.
            reconnectDelayMS.current = INITIAL_RECONNECT_DELAY_MS;
        }
    }
    }, [readyState, url]);

    useEffect(() => {
        const ws = getWebSocket();
        if (ws) {
            ws.onerror = (e:any) => {
                console.log(e);
                 ws.close();
            }

            ws.onmessage = (e:any) => {
                console.log(`Received WebSocket message: ${e.data}`);
            };


            return () => {
            };
        }
    }, [getWebSocket]);



    return { sendJsonMessage, getWebSocket,lastJsonMessage, readyState, setSocketUrl };
}

export default useManagedWebSocket;
