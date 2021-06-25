import * as React from "react";
import { Network } from '../../controllers/network';
import message from './messages';

const PREFIX = 'come-play-tron-'

const Tron = () => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const network = new Network(PREFIX)
  network.onConnect(() => {
    const intro: message = { type: 'introduction', value: { name: network.id.replace(PREFIX, ''), timestamp: Date.now() }}
    network.send(intro)
  })
  network.receive((d: message) => {
    console.log(d)
    switch (d.type) {
      case 'introduction':
        console.log(`introduction by ${d.value.name}`)
        console.log(`ping: ${Date.now() - d.value.timestamp}`)
        break;
    
      default:
        console.log('message could not be parsed')
        break;
    }
  })
  const handleOnClick = (e) => {
    if (inputRef === null || inputRef.current === null) return
    network.connect(`${PREFIX}${inputRef.current.value}`)
  }

  return <>
    <p>Your ID is: <b>{network.id.replace(PREFIX, '')}</b></p>
    <label>Connect with: </label>
    <input ref={inputRef}></input>
    <button onClick={handleOnClick}>Connect</button>
  </>
};

export default Tron;
