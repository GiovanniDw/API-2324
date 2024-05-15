export const $ = (e) => document.querySelector(e)
export const $$ = (e) => document.querySelectorAll(e)

export const $id = (e) => document.getElementById(e)

import { getState, setState } from '~/state.js'

export const receiveMessage = (obj) => {
  const { user } = getState()
  const currentUser = user

  const receivedFrom = obj.user

  const { name, text, room_id, user_id, alert } = obj

  const messageListContainer = $('.message-list-container')
  const messageList = $('.message-list')
  const item = document.createElement('li')

  if (user_id === currentUser._id && !alert) {
    item.setAttribute('class', 'message my-message')
    item.innerHTML = /*html*/ `
<p>${text}</p><span class="user">${name}</span>
  `
  } else if (alert) {
    item.setAttribute('class', 'message alert')
    item.innerHTML = /*html*/ `
  <p>${text}</p>
`
  } else {
    item.setAttribute('class', 'message')
    item.innerHTML = /*html*/ `
  <p>${text}</p><span class="user">${name}</span>
  `
  }
  messageList.appendChild(item)
  messageListContainer.scrollTo({
    top: messageListContainer.scrollHeight,
    left: 0,
    behavior: 'smooth',
  })
}

export const verifyUser = async () => {
  try {
    const res = await fetch('/verifyuser', {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()
    console.log('verify')
    console.log(data)

    setState({ user: data })
  } catch (error) {
    console.log(error)
  }
}
