import { Server } from 'socket.io'

const options = {
  cors: {
    origin: '*',
  },
}

export function setupSocketIO(server: any) {
  const io = new Server(server, options)
  io.on('connection', (socket) => {
    console.log('--- a user connected ---', socket.id)
    socket.on('disconnect', () => {
      console.log('--- user disconnected ---')
    })
  })
}
