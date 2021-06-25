import * as React from 'react'
import { Network } from '../../controllers/network'
import message from './messages'

const PREFIX = 'come-play-tron-'
const network = new Network(PREFIX)

const PlayerList = ({ players }: { players: string[] }) => {
  return <div>Players: {players.join(', ')}</div>
}

const Connect = ({ network }: { network: Network }) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  network.onConnect(() => {
    const intro: message = {
      type: 'introduction',
      value: { name: network.id.replace(PREFIX, ''), timestamp: Date.now() },
    }
    network.send(intro)
  })
  const handleOnClick = () => {
    if (inputRef === null || inputRef.current === null) return
    network.connect(`${PREFIX}${inputRef.current.value}`)
  }
  return (
    <>
      <p>
        Your ID is: <b>{network.id.replace(PREFIX, '')}</b>
      </p>
      <label>Connect with: </label>
      <input ref={inputRef}></input>
      <button onClick={handleOnClick}>Connect</button>
    </>
  )
}

const Tron = () => {
  const [players, setPlayers] = React.useState<string[]>([])
  network.receive((msg: message) => {
    console.log(msg)
    switch (msg.type) {
      case 'introduction':
        console.log(`introduction by ${msg.value.name}`)
        console.log(`ping: ${Date.now() - msg.value.timestamp}`)
        setPlayers([...players, msg.value.name])
        break

      default:
        console.log('message could not be parsed')
        break
    }
  })

  return (
    <>
      <Connect network={network} />
      <PlayerList players={players} />
    </>
  )
}

export default Tron
