import mongoose from 'mongoose'
const Schema = mongoose.Schema
const RoomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  }
})
const Room = mongoose.model('Room', RoomSchema)

export default Room
