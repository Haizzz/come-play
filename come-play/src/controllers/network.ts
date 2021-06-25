// Helper and wrapper to establish connections with other browsers
import Peer from 'peerjs'
import { v4 as uuidv4 } from 'uuid'

// a light wrapper around peerjs to centralise connection and error handling
export class Network {
  id: string
  peer: Peer
  connections: Peer.DataConnection[]
  openHandlers: (() => void)[]
  dataHandlers: ((data: any) => void)[]

  constructor(prefix = 'come-play-') {
    const uuid = uuidv4() as string
    this.id = `${prefix}${uuid.substring(0, 5)}`
    this.peer = new Peer(this.id)
    this.connections = []
    this.openHandlers = []
    this.dataHandlers = []
    this.registerDefaultPeerHandlers()
  }

  private registerDefaultPeerHandlers() {
    // .on calls functions with overwritten this
    this.peer.on('connection', (conn) => {
      this.registerNewConnection(conn)
    })
  }

  private handleOpen() {
    console.log('new connection created')
    this.openHandlers.forEach((h) => h())
  }

  private handleClose() {
    console.log('connection closed')
  }

  private handleError(err) {
    console.log('connection error')
    console.error(err)
  }

  private registerNewConnection(conn: Peer.DataConnection) {
    this.connections.push(conn)
    conn.on('open', () => this.handleOpen())
    conn.on('close', this.handleClose)
    conn.on('error', this.handleError)
    this.dataHandlers.forEach((handler) => {
      conn.on('data', handler)
    })
  }

  onConnect(handler: () => void) {
    // register a handler when someone connect to us
    this.openHandlers.push(handler)
  }

  connect(id) {
    const conn = this.peer.connect(id)
    this.registerNewConnection(conn)
  }

  receive(handler: (data: any) => void) {
    // register a data handler for all connections
    this.dataHandlers.push(handler)
    this.connections.forEach((conn) => {
      conn.on('data', handler)
    })
  }

  send(data: any) {
    // send data to all connections
    console.log('sending')
    this.connections.forEach((conn) => {
      conn.send(data)
    })
  }
}
