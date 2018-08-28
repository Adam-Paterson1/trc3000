import openSocket from 'socket.io-client';
let socket;
let todos = [];
let watching = [];
function setupSocket(ip) {
  socket = openSocket(ip + ':5000');
  socket.on('disconnect', (reason) => {
    console.log('hi', reason)
    // if (reason === 'io server disconnect') {
    //   // the disconnection was initiated by the server, you need to reconnect manually
    //   socket.connect();
    //   watching.forEach((resub) => resub())
    // } else if (reason === 'transport close') {
    //   setTimeout(() => {
    //     socket.connect()
    //     watching.forEach((resub) => resub())
    //   }, 2000)
    // }
  })
  todos.forEach((todo) => todo());
  todos = [];
}
function subscribeToTimer(cb) {
  if (!socket) {
    todos.push(() => subscribeToTimer(cb))
    return;
  }
  socket.on('timer', timestamp => cb(null, timestamp));
  socket.emit('subscribeToTimer', 1000);
  watching.push(() => subscribeToTimer(cb))
}
function subscribeToTilt(cb) {
  if (!socket) {
    todos.push(() => subscribeToTilt(cb))
    return;
  }
  socket.on('tilt', tilt => cb(tilt));
  socket.emit('subscribeToTilt');
  watching.push(() => subscribeToTilt(cb))

}
function subscribeToVid(cb) {
  if (!socket) {
    todos.push(() => subscribeToVid(cb))
    return;
  }
  socket.on('vid', data => cb(data));
  socket.emit('subscribeToVid');
  watching.push(() => subscribeToVid(cb))

}
function setTarget(value) {
  if (!socket) {
    todos.push(() => setTarget(value))
    return;
  }
  socket.emit('setTarget', value)
}
function subscribeToTarget(cb) {
  if (!socket) {
    todos.push(() => subscribeToTarget(cb))
    return;
  }
  socket.on('target', value => cb(value));
  socket.emit('getTarget')
  watching.push(() => subscribeToTarget(cb))
}
function subscribeToGains(cb) {
  if (!socket) {
    todos.push(() => subscribeToGains(cb))
    return;
  }
  socket.on('gains', value => cb(value));
  socket.emit('getGains')
  watching.push(() => subscribeToGains(cb))
}
function setGains(value) {
  if (!socket) {
    todos.push(() => setGains(value))
    return;
  }
  socket.emit('setGains', value)
}
function subscribeToLogs(cb) {
  if (!socket) {
    todos.push(() => subscribeToLogs(cb))
    return;
  }
  socket.on('log', value => cb(value))
}
export { setupSocket, subscribeToTimer, subscribeToTilt, subscribeToVid, setTarget, subscribeToTarget, subscribeToGains, setGains, subscribeToLogs };