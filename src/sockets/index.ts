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
    socket.on('disconnect', (data: any) => {
      const { name } = data
      io.emit('member-disconnect', { type: 'broadcast', message: `${name}已离开房间` })
      // other ...
    })

    /* 本地用户进入房间 */
    socket.on('join', (data) => {
      const { memberId } = data
      const client = io.sockets.sockets.get(memberId)
      // 广播通知所有人
      client?.emit('joined', { type: 'self', messgae: '您已进入房间' })
      // other ...
    })

    /* 其它用户进入房间（连上socket） */
    socket.on('member-joined', (data) => {
      const { name, memberId } = data
      if (memberId === socket.id)
        return
      // 广播通知所有人
      io.emit('member-joined', { type: 'broadcast', messgae: `${name}已进入房间` })
      // other ...
    })

    /* 用户发送消息事件 */ // 这里的发送存在问题
    socket.on('message-to-peer', (data) => {
      const { memberId, type } = data

      if (type === 'offer') {
        io.sockets.sockets.forEach((socket) => {
          if (socket.id !== memberId)
            socket.emit('message-from-peer', { ...data, memberId: socket.id })
        })
      }

      if (type === 'answer') {
        const client = io.sockets.sockets.get(memberId)
        client?.emit('message-from-peer', { ...data, memberId: socket.id })
      }
    })
  })
}
