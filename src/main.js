// import 'vite/modulePreload.polyfill'

import '~/assets/reset.css'
import '~/assets/base.css'
import '~/assets/main.css'
import '~/assets/form.css'
import '~/assets/nav.css'
import '~/assets/modal.css'
console.log('hallo')
console.log('hallo')
console.log('hallo')
import Chat from './components/Chat.js'

import { $, $$, receiveMessage } from '~/utils.js'
import socket from '~/socket.js'
import Rooms from '~/components/Room.js'

console.log('start of app')

socket.onAny((event, ...args) => {
  console.log(event, args)
})
socket.on('connect', (socket) => {
  console.log('socketconnection')
})

socket.on('connect_error', (err) => {
  // the reason of the error, for example "xhr poll error"
  console.log(err.message)

  // some additional description, for example the status code of the initial HTTP response
  console.log(err.description)

  // some additional context, for example the XMLHttpRequest object
  console.log(err.context)
})
Rooms()
Chat()

socket.on('receive-message', receiveMessage)

console.log('end of app')
