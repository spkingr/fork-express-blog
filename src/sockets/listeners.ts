import type { Server } from 'socket.io'
import { liveService } from '../service/live.service.js'
import type { ISocket } from '../../types'
import { Debugger } from './debugger.js'

const { debuggerMap, addDebuggerMap, delDebuggerMap } = Debugger()

const HEART_BEAT_INTERVAL = 20 * 1000
const HEART_BEAT_TIMEOUT = 60 * 1000

export function addListeners(socket: ISocket, io: Server) {
  let time = new Date().getTime()

  function logNoRoomWarning(msg: string) {
    console.warn(`${msg}roomID is undefined`)
  }

  function join(roomID: string) {
    // 操作数据库人数+1
    liveService.addMember(roomID)
    // 给socket绑定房间
    socket.join(roomID)

    // ----------debugger-----------------
    addDebuggerMap(roomID, socket.id)
    console.log(debuggerMap)
    // -----------------------------------
  }

  function leave() {
    const { roomID } = socket
    if (!roomID)
      return logNoRoomWarning('[leave error: ]')
    // 删除用户
    io.sockets.sockets.delete(socket.id)
    // 操作数据库用户-1
    liveService.removeMember(roomID)
    // 退出房间
    socket.leave(roomID)

    // ----------debugger-----------------
    delDebuggerMap(roomID, socket.id)
    console.log(debuggerMap)
    // -----------------------------------
  }

  function removeRoom() {
    const { roomID } = socket
    if (!roomID)
      return logNoRoomWarning('[removeRoom error: ]')
    // 删除房间
    io.sockets.adapter.rooms.delete(roomID)
    // 操作数据库删除房间
    liveService.removeRoom(roomID)
  }

  /**
   * @event disconnect 当用户断开连接时
   * @description 事件描述
   * 用户离开房间
   */
  socket.on('disconnect', (data: any) => {
    // 刷新页面会触发disconnect
    // 断开链接socket会刷新，执行leave
    leave()
    // 断开链接通知房间其他人
    io.emit('member-disconnect', { type: 'broadcast' })
  })

  /**
   * @event join 当本地用户进入房间时
   * @memberId 用户id
   * @description 事件描述
   * 用户加入房间 此时需要让人数+1 绑定房间 通知房间其他用户
   */
  socket.on('join', (data) => {
    const { roomID } = data
    socket.roomID = roomID

    join(roomID)

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
   * 来自其他客户端的信息
   * @type 消息类型 offer | answer | candidate
   */
  socket.on('message-to-peer', (data) => {
    const { roomID } = socket
    // console.log('message-to-peer', roomID)
    if (!roomID)
      return logNoRoomWarning('[message-to-peer error: ]')
    socket.to(roomID).emit(
      'message-from-peer',
      { ...data, memberId: socket.id },
    )
  })

  /**
   * @event leave 当有一端离开房间时
   * @description 事件描述
   * 当有一端主动离开房间时，需要删除用户
   */
  socket.on('leave', (data) => {
    leave()
  })

  /**
   * @event close-room 当主播离开房间时
   * @description 事件描述
   * 当主播离开房间时，需要删除房间 并且告知房间其他人
   */
  socket.on('close-room', (data) => {
    const { roomID } = socket
    if (!roomID)
      return console.warn('[close-room error: ]roomID is undefined')
    // 对房间内的其他人广播关闭房间
    socket.to(roomID).emit('room-closed', { type: 'broadcast' })
    removeRoom()
  })

  /**
   * // todo
   * @event heartbeat 心跳包
   * @description 事件描述
   * 当服务端一定时间内没有收到客户端的心跳包时，删除用户
   */
  socket.on('heartbeat', () => {
    const now = new Date().getTime()
    if (now - time > HEART_BEAT_TIMEOUT) {
      // 一开始想在这里做点操作，但是发现这里的socket已经断开了，所以没有房间id了，无法操作数据库
      // 目前就打算做定期销毁
      // 目前的设计不会存储每一个用户的信息，只存储房间的信息 如果要解决的话需要再维护一份用户信息
      // ...
    }

    time = now
  })
}
