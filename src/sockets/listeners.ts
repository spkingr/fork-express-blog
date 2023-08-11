import type { Server, Socket } from 'socket.io'
import { liveService } from '../service/live.service.js'

const HEART_BEAT_INTERVAL = 20 * 1000
const HEART_BEAT_TIMEOUT = 60 * 1000

export function addListeners(socket: Socket, io: Server) {
  let time = new Date().getTime()

  function leave(roomID: string, socket: Socket) {
    if (!roomID)
      return console.warn('[leave error:] roomID is required;')
    // 删除用户
    io.sockets.sockets.delete(socket.id)
    // 操作数据库用户-1
    liveService.removeMember(roomID)
    // 退出房间
    socket.leave(roomID)
  }

  function removeRoom(roomID: string) {
    // 删除房间
    io.sockets.adapter.rooms.delete(roomID)
    // 操作数据库删除房间
    liveService.removeRoom(roomID)
  }

  /**
   * @event disconnect 当用户断开连接时
   * @description 事件描述
   * @type 事件类型
   * @message 信息 断开时传入用户信息即可
   */
  socket.on('disconnect', (data: any) => {
    // 断开链接
    io.emit('member-disconnect', { type: 'broadcast' })
  })

  /**
   * @event join 当本地用户进入房间时
   * @memberId 用户id
   * @description 事件描述
   * @type 事件类型
   * @message 信息 客户端一般会传过来用户基本信息 携带一个用户id 即客户端的socket.id
   */
  socket.on('join', (data) => {
    const { roomID } = data
    // 操作数据库人数+1
    liveService.addMember(roomID)
    // 给socket绑定房间
    socket.join(roomID)

    // 给房间除自己外的其他人发消息
    socket.to(roomID).emit(
      'member-joined',
      { type: 'broadcast', memberId: socket.id },
    )

    // 心跳包
    setInterval(() => {
      socket.emit('heartbeat', { type: 'self' })
    }, HEART_BEAT_INTERVAL)
  })

  /**
   * @event message-to-peer 当有一端发来了消息
   * @message 信息
   * @description 事件描述
   * @memberId 用户id
   * @type 消息类型 offer | answer | candidate
   */
  socket.on('message-to-peer', (data) => {
    const { roomID } = data
    socket.to(roomID).emit(
      'message-from-peer',
      { ...data, memberId: socket.id },
    )
  })

  /**
   * @event leave 当有一端离开房间时
   * @description 事件描述
   * 当有一端离开房间时，需要删除用户
   */
  socket.on('leave', (data) => {
    const { roomID } = data
    leave(roomID, socket)
  })

  /**
   * @event close-room 当主播离开房间时
   * @description 事件描述
   * 当主播离开房间时，需要删除房间
   */
  socket.on('close-room', (data) => {
    const { roomID } = data
    // 对房间内的其他人广播关闭房间
    socket.to(roomID).emit('room-closed', { type: 'broadcast' })
    removeRoom(roomID)
  })

  /**
   * @event heartbeat 心跳包
   * @description 事件描述
   * 当服务端一定时间内没有收到客户端的心跳包时，删除用户
   */
  socket.on('heartbeat', () => {
    const now = new Date().getTime()
    if (now - time > HEART_BEAT_TIMEOUT) {
      // 一开始想在这里做点操作，但是发现这里的socket已经断开了，所以没有房间id了，无法操作数据库
      // 目前就打算做定期销毁
      // ...
    }

    time = now
  })
}
