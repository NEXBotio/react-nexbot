import React from "react";
import useChatStream from "@hooks/useChatStream";
import { BASE_PATH } from "@config/config";
import axios from "axios";


const TestComponent:React.FC = ()=>{
    const { sendMessage } = useChatStream(async () => {
        try {
          const resp = await axios.get(
            `${BASE_PATH}/secrets/generate_single_use_token`,
            {
              headers: {
                Authorization: process.env.SERVER_SECRET,
                Origin: "",
              },
            }
          );
          return resp.data.token;
        } catch (err) {
          console.log(err);
          throw err;
        }
      }, process.env.BOT_ID!)


      const observable = sendMessage("Hello");
      if (observable) {
        observable.subscribe({
          next: (data) => {
            console.log(process.env.BOT_ID!);
            expect(data).toBeDefined();
            console.log(data);
            expect(data).toHaveProperty("stream");
            // additional assertions as needed
          },
          error: (err) => fail(`Observable should not error out: ${err}`),
        });
      }
    return (<>Test</>)
    }
    
    export default TestComponent;

