import Room from './models/Room.js'

export const socketController = (io, socket) => {
  console.log('user connected')
  console.log('session')
  console.log(socket.request.session)
  console.log('ID')
  console.log(socket.id)

  Room.find().then((result) => {
    socket.emit('output-rooms', result)
  })

  socket.on('create-room', (name) => {
    const room = new Room({ name })
    room.save().then((result) => {
      io.emit('room-created', result)
    })
  })

  socket.on('join', ({ name, room_id, user_id }) => {
    const { error, user } = addUser({
      socket_id: socket.id,
      name,
      user_id,
      room_id
    })
    socket.join(room_id)
    if (error) {
      console.log('join error', error)
      io.to(room_id).emit('receive-message', { msg: 'err' })
    } else {
      io.to(room_id).emit('receive-message', { msg: 'hallo', user_id: null })
      console.log('join user', user)
    }
  })

  socket.on('send-message', ({ msg, room_id, alert, cb }) => {
    const user = getUser(socket.id)
    console.log(msg)
    console.log(alert)
    console.log(user)
    // socket.emit('receive-message', msg);

    const msgToStore = {
      name: user.name,
      user_id: user.user_id,
      room_id,
      text: msg
    }
    console.log('messageStore')
    console.log(msgToStore)
    const message = new Message({
      name: user.name,
      user_id: user.user_id,
      room_id: room_id,
      text: msg,
      alert: alert
    })

    message.save().then((result) => {
      io.to(room_id).emit('receive-message', result)
    })
  })

  socket.on('drawing', (data) => {
    console.log(data)

    // io.to(data.room_id).emit('drawing', data)
    socket.broadcast.emit('drawing', data)
    socket.emit('drawing', data)
  })

  socket.on('get-messages-history', (room_id) => {
    Message.find({ room_id }).then((result) => {
      socket.emit('output-message', result)
    })
  })

  socket.on('disconnect', () => {
    const user = removeUser(socket.id)
    console.log(user)
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.to(room).emit('user has left', socket.id)
      }
    }

    console.log('user disconnected')
  })
}
