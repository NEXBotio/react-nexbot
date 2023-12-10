import logo from "./logo512 copy.png";
import { useEffect, useState } from "react";
import "./App.css";
import { useChatStream }  from "react-nexbot";
import axios from "axios";

function App() {
  const { sendMessage } = useChatStream(() => {
    return axios
      .get("https://apis.nexbot.io/web/v1/secrets/generate_single_use_token", {
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_SERVER_SECRET,
        },
      })
      .then((res) => {
        // console.log("will send message", res.data.access_token);
        return res.data.access_token;
      });
  }, process.env.REACT_APP_BOT_ID);

  const [willStream, setWillStream] = useState(false);
  const [buttonText, setButtonText] = useState('Tell me a very brief story about reactive programming that ends in "Hello World!"');
  
  const onClick = () => {
    setText("");
    setWillStream(true);
  }


  const [text, setText] = useState("");
  useEffect(() => {

    if (willStream) {
      setButtonText("Generating...");
      const newObservable = sendMessage('Tell me a very brief story about reactive programming that ends in "Hello World!"');
      newObservable.subscribe({
        next: (data) => {

          console.log(data.stream);
          setText(prev=>prev?prev+data.stream:data.stream);
        },
        complete: () => {
          console.log("complete");
          setWillStream(false);
          setButtonText('Tell me a very brief story about reactive programming that ends in "Hello World!"');
        },
      });
    }

  }, [willStream,sendMessage]);



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo}alt="logo" />
        <p style={{ marginBottom: '15px' }}>

          <code>{text}</code>
        </p>

        <button 
         style={{ fontSize: '24px' }} 

          onClick={onClick}
        >
          {buttonText}
        </button>
      </header>
    </div>
  );
}

export default App;
