import socket from '../socket.js'
// import '~/assets/chat.css';

import { $, $$, $id, receiveMessage } from '../utils.js'
// import { LoginModal, modalTemplate } from '@/components/modal';
import { addObserver, getState, setState } from '../state.js'

export const Rooms = () => {
  console.log('Rooms Loaded')

  const showRoomsDialogButton = $('.show-dialog')
  const closeRoomsDialogButton = $('.close-dialog')
  const createRoomDialog = $id('createRoomDialog')

  // const roomsList = $('#rooms-list')
  const createRoomForm = $('#create-room-form')
  const newRoomName = $('#new-room-name')

  // const messageForm = $('#message-form')
  // const messageInput = $('#message-input')
  // const messageList = $('.message-list')
  // const messageListContainer = $('.message-list-container')
  // const drawComponent = $('draw-component')

  showRoomsDialogButton.addEventListener('click', () => {
    console.log('show modal')
    createRoomDialog.showModal()
  })

  closeRoomsDialogButton.addEventListener('click', () => {
    createRoomDialog.close()
  })

  createRoomForm.addEventListener('submit', function (e) {
    e.preventDefault()
    if (newRoomName.value) {
      socket.emit('create-room', newRoomName.value)
      newRoomName.value = ''
    }
  })
}

export default Rooms
