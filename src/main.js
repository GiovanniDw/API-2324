// import "./assets/reset.css";
// import "./assets/base.css";
// import "./assets/main.css";
// import "./assets/form.css";
console.log('hallo');
import Chat from './components/Chat.js';


import { $, $$, receiveMessage } from './utils.js';
import socket from './socket.js';

socket.onAny((event, ...args) => {
  console.log(event, args);
});
socket.on('connect', (socket) => {
  console.log('socketconnection');
  console.log(socket);
});


Chat()

socket.on('receive-message', receiveMessage);