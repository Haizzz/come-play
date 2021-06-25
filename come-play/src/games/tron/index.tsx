import * as React from "react";
import { Network } from '../../controllers/network';
import message from './messages';

const PREFIX = 'come-play-tron-'

const PlayerList = ({ players }: {players: string[]}) => {
  return <div>Players: {players.join(', ')}</div>
}

const Tron = () => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [players, setPlayers] = React.useState<string[]>([])
  const network = new Network(PREFIX)
  network.onConnect(() => {
    const intro: message = { type: 'introduction', value: { name: network.id.replace(PREFIX, ''), timestamp: Date.now() }}
    network.send(intro)
  })
  network.receive((msg: message) => {
    console.log(msg)
    switch (msg.type) {
      case 'introduction':
        console.log(`introduction by ${msg.value.name}`)
        console.log(`ping: ${Date.now() - msg.value.timestamp}`)
        setPlayers([...players, msg.value.name])
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
    <PlayerList players={players}/>
  </>
};

export default Tron;
