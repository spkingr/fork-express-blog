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
      if (!client)
        return console.error('memberId is not exist')
      client.emit('joined', { type: 'self', messgae: '您已进入房间' })
    })

    /* 其它用户进入房间（连上socket） */
    io.emit('member-joined', { type: 'broadcast', messgae: socket.id })

    /* 用户发送消息事件 */ // 这里的发送存在问题
    socket.on('message-to-peer', (data) => {
      const { memberId, type } = data
      // 有一端发来了offer 则把offer发送给其他人
      if (type === 'offer') {
        io.sockets.sockets.forEach((client) => {
          if (client.id !== memberId)
            client.emit('message-from-peer', { ...data, memberId: client.id })
        })
      }
      // 有一端发来了answer 则把answer发送给offer对象
      if (type === 'answer') {
        const client = io.sockets.sockets.get(memberId)
        client?.emit('message-from-peer', { ...data, memberId })
      }
    })
  })
}
