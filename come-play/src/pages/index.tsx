import * as React from "react";
import { v4 as uuidv4 } from 'uuid';
import Peer from "peerjs";

const IndexPage = () => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const peer = new Peer(uuidv4());

  peer.on('connection', (conn) => {
    console.log('peer ' + conn.peer + ' connected!')
    conn.on('data', (data) => {
      console.log(data);
    });
    conn.on('open', () => {
      console.log("connection opened");
    });
  })

  const handleOnClick = (e) => {
    if (inputRef === null || inputRef.current === null) return
    console.log(inputRef.current.value)
    const conn = peer.connect(inputRef.current.value);
    conn.on('open', () => {
      console.log('connected to ' + conn.peer + '!')
      conn.send('hi!');
    });
  }

  return <>
    <p>Your ID is: <b>{peer.id}</b></p>
    <label>Connect with: </label>
    <input ref={inputRef}></input>
    <button onClick={handleOnClick}>Connect</button>
  </>
};

export default IndexPage;
