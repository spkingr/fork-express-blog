export function Debugger() {
  const debuggerMap = new Map()

  function addDebuggerMap(room: string, id: string) {
    if (debuggerMap.has(room)) {
      const ids = debuggerMap.get(room)
      ids.push(id)
      console.log(ids)
      debuggerMap.set(room, ids)
      return
    }
    debuggerMap.set(room, [id])
  }

  function delDebuggerMap(room: string, id: string) {
    if (debuggerMap.has(room)) {
      const ids = debuggerMap.get(room)
      const index = ids.indexOf(id)
      if (index !== -1) {
        ids.splice(index, 1)
        debuggerMap.set(room, ids)
      }
    }
  }

  function delRoom(room: string) {
    debuggerMap.delete(room)
  }

  return {
    debuggerMap,
    addDebuggerMap,
    delDebuggerMap,
    delRoom,
  }
}
