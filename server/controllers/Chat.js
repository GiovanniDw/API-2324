import Room from '../models/Room.js'
import Message from '../models/Message.js'

export const chatController = async (req, res, next) => {
  const { username, email, password, name, id } = req.body

  try {
    const data = { user: req.user }
    // const render = renderTemplate('index.liquid', data);

    console.log(data)
    res.render('chat', data)
  } catch (err) {
    let data = {
      error: { message: err },
    }

    res.render('chat.njk', data)
  }
}


export const roomController = async (req, res, next) => {
  const { username, email, password, name, id, description } = req.body

  try {
    const rooms = await Room.find();
    const data = { 
      user: req.user,
      rooms: rooms
     }
    // const render = renderTemplate('index.liquid', data);

    console.log(data)
    res.render('rooms.njk', data)
  } catch (err) {
    let data = {
      error: { message: err },
    }

    res.render('chat.njk', data)
  }
}