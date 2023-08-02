import { Server } from 'socket.io'

const options = {
  cors: {
    origin: '*',
  },
}

export function setupSocketIO(server: any) {
  const io = new Server(server, options)
  io.on('connection', (socket) => {
    console.warn('--- a user connected ---', socket.id)

    /* 用户断开链接 */
    socket.on('disconnect', () => {
      console.warn('--- user disconnected ---')
    })

    /* 用户进入房间（连上socket） */
    socket.on('member-joined', (data) => {
      const { name } = data
      // 广播通知所有人
      io.emit('member-joined', { type: 'broadcast', messgae: { name } })
    })
  })
}
