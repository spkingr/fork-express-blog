import { Server } from 'socket.io'
import { addListeners } from './listeners.js'

const options = {
  cors: {
    origin: '*',
  },
}

export function setupSocketIO(server: any) {
  const io = new Server(server, options)
  io.on('connection', (socket) => {
    addListeners(socket, io)
  })
}
