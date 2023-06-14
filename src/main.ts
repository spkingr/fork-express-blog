import app from './app/index.js'
import { parsed } from './config/index.js'

app.listen(parsed!.PORT, () => {
  console.warn(`Server is running on port ${parsed!.PORT}`)
})
