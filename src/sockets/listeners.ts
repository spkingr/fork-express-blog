import type { Server, Socket } from 'socket.io'

export function addListeners(socket: Socket, io: Server) {
  let time = new Date()
  // log
  console.warn('--- a user connected ---', socket.id)

  /**
   * @event disconnect 当用户断开连接时
   * @description 事件描述
   * @type 事件类型
   * @message 信息 断开时传入用户信息即可
   */
  socket.on('disconnect', (data: any) => {
    io.emit('member-disconnect', { type: 'broadcast' })
    // 删除用户
    io.sockets.sockets.delete(socket.id)
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

    // 给自己发消息
    const client = io.sockets.sockets.get(memberId)
    if (!client)
      return console.error('memberId is not exist')
    client.emit('joined', { type: 'self' })

    // 给其他人发消息
    const clients = [...io.sockets.sockets.values()]
    clients.forEach((client) => {
      if (client.id !== memberId)
        client.emit('member-joined', { type: 'broadcast', memberId })
    })

    // 心跳包
    setInterval(() => {
      client.emit('heartbeat', { type: 'self' })
    }, 3000)
  })

  /**
   * @event message-to-peer 当有一端发来了消息时 这是webrtc的信令过程
   * @message 信息
   * @description 事件描述
   * @memberId 用户id
   * @type 消息类型 offer | answer | candidate
   */
  socket.on('message-to-peer', (data) => {
    const { memberId, type } = data
    const client = io.sockets.sockets.get(memberId)
    if (!client)
      return console.error('client is not exist')

    client.emit('message-from-peer', { ...data, memberId: socket.id })
  })

  /**
   * @event leave 当有一端离开房间时
   * @description 事件描述
   * 当有一端离开房间时，需要删除用户
   */
  socket.on('leave', () => {
    // 删除用户
    io.sockets.sockets.delete(socket.id)
  })

  /**
   * @event heartbeat 心跳包
   * @description 事件描述
   * 当服务端十秒内没有收到客户端的心跳包时，删除用户
   */
  socket.on('heartbeat', () => {
    const now = new Date()
    if (now.getTime() - time.getTime() > 10000)
      io.sockets.sockets.delete(socket.id)
    time = new Date()
  })
}
