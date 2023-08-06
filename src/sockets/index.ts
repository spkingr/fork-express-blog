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

    /**
     * @event disconnect 当用户断开连接时
     * @description 事件描述
     * @type 事件类型
     * @message 信息 断开时传入用户信息即可
     */
    socket.on('disconnect', (data: any) => {
      const { name } = data
      io.emit('member-disconnect', { type: 'broadcast' })
      // other ...
    })

    /**
     * @event join 当本地用户进入房间时
     * @memberId 用户id
     * @description 事件描述
     * @type 事件类型
     * @message 信息 客户端一般会传过来用户基本信息 携带一个用户id 即客户端的socket.id
     */
    socket.on('join', (data) => {
      const { memberId } = data
      const client = io.sockets.sockets.get(memberId)
      if (!client)
        return console.error('memberId is not exist')
      client.emit('joined', { type: 'self' })
    })

    /**
     * @event member-joined 当其他用户进入房间时
     * @message 信息
     * @description 事件描述
     * @type 事件类型
     * @memberId 用户id
     */
    io.emit('member-joined', { type: 'broadcast', memberId: socket.id })

    /**
     * @event message-to-peer 当有一端发来了消息时 这是webrtc的信令过程
     * @message 信息
     * @description 事件描述
     * @memberId 用户id
     * @type 消息类型 offer | answer | candidate
     */
    socket.on('message-to-peer', (data) => {
      const { memberId, type } = data // 这个memberId是对端的id

      const client = io.sockets.sockets.get(memberId)
      if (!client)
        return console.error('memberId is not exist')

      if (type === 'offer') {
        client.emit('message-from-peer', { ...data, memberId: socket.id })
        console.log('--- offer ---', client.id, memberId)
      }
      if (type === 'answer')
        client.emit('message-from-peer', { ...data, memberId: socket.id })

      if (type === 'candidate')
        client.emit('message-from-peer', { ...data, memberId: socket.id })
    })
  })
}
