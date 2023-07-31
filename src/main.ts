import app from './app/index.js'
import { setupSocketIO } from './app/socket.js'
import { parsed } from './config/index.js'

const server = app.listen(parsed!.PORT, () => {
  console.warn(`Server is running on port ${parsed!.PORT}`)
})

setupSocketIO(server)
