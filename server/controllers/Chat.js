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
