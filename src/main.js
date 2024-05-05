// import 'vite/modulePreload.polyfill'

// import "./assets/reset.css";
// import "./assets/base.css";
// import "./assets/main.css";
// import "./assets/form.css";
console.log('hallo');
console.log('hallo');console.log('hallo');
import Chat from './components/Chat.js';


import { $, $$, receiveMessage } from '~/utils.js';
import socket from '~/socket.js';

socket.onAny((event, ...args) => {
  console.log(event, args);
});
socket.on('connect', (socket) => {
  console.log('socketconnection');
  console.log(socket);
});

socket.on("connect_error", (err) => {
  // the reason of the error, for example "xhr poll error"
  console.log(err.message);

  // some additional description, for example the status code of the initial HTTP response
  console.log(err.description);

  // some additional context, for example the XMLHttpRequest object
  console.log(err.context);
});


// Chat()

socket.on('receive-message', receiveMessage);