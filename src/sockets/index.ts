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
    socket.on('join', () => {
      // 广播通知所有人
      io.emit('member-joined', { type: 'broadcast', messgae: '您已进入房间' })
      // other ...
    })

    /* 其它用户进入房间（连上socket） */
    socket.on('member-joined', (data) => {
      const { name, memberId } = data
      if (memberId === socket.id)
        return
      // 广播通知所有人
      io.emit('member-joined', { type: 'broadcast', messgae: `${name}已进入房间`, memberId })
      // other ...
    })

    /* 用户发送消息事件 */
    socket.on('message-to-peer', (data) => {
      const { memberId } = data
      // 找到对端socket，即socket.id === memberId
      const client = io.sockets.sockets.get(memberId)
      // 发送消息
      client?.emit('message-from-peer', data)
    })
  })
}
