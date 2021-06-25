import * as React from "react";
import { Network } from '../controllers/network';

const PREFIX = 'come-play-test-'

const IndexPage = () => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const network = new Network(PREFIX)
  network.receive((d) => {
    console.log(d)
  })
  const handleOnClick = (e) => {
    if (inputRef === null || inputRef.current === null) return
    network.connect(`${PREFIX}${inputRef.current.value}`, () => {
      // once connected, send a hello
      network.send('hello from ' + network.id)
    })
  }

  return <>
    <p>Your ID is: <b>{network.id.replace(PREFIX, '')}</b></p>
    <label>Connect with: </label>
    <input ref={inputRef}></input>
    <button onClick={handleOnClick}>Connect</button>
  </>
};

export default IndexPage;
