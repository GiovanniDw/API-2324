import { io } from 'socket.io-client'

const URL =
  process.env.NODE_ENV === 'production' ? 'https://api-2324-g23i.onrender.com' : 'http://localhost:3000'

export const socket = io(URL, {
  autoConnect: true,
  cors: '*',
})

export default socket
