import { Liquid } from 'liquidjs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const engine = new Liquid({
  root: __dirname, // for layouts and partials
  extname: '.liquid'
})

export const renderTemplate = (template, data) => {
  const templateData = {
    NODE_ENV: process.env.NODE_ENV || 'production',
    ...data
  }

  return engine.renderFileSync(`${template}`, templateData)
}


const users = [];
export const addUser = ({ socket_id, name, user_id, room_id }) => {
    const exist = users.find(user => user.room_id === room_id && user.user_id === user_id);
    if (exist) {
        return { error: 'User already exist in this room' }
    }
    const user = { socket_id, name, user_id, room_id };
    users.push(user)
    console.log('users list', users)
    return { user }
}

export const removeUser = (socket_id) => {
    const index = users.findIndex(user => user.socket_id === socket_id);
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}
export const getUser = (socket_id) => users.find(user => user.socket_id === socket_id)
