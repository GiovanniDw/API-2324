import { io } from 'socket.io-client'

const URL =
  process.env.NODE_ENV === 'production' ? process.env.HOST : 'http://localhost:3000'

export const socket = io(URL, {
  autoConnect: true,
  cors: '*',
})

export default socket
