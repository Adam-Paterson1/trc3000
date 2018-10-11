import openSocket from 'socket.io-client';
let socket;
let todos = [];
let watching = [];
function setupSocket(ip) {
  socket = openSocket(ip);
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
function subscribeToTilt(cb) {
  if (!socket) {
    todos.push(() => subscribeToTilt(cb))
    return;
  }
  socket.on('tilt', tilt => cb(tilt));
  socket.emit('subscribeToTilt');
  watching.push(() => subscribeToTilt(cb))

}
function subscribeToImage(cb) {
  if (!socket) {
    todos.push(() => subscribeToImage(cb))
    return;
  }
  socket.on('image', data => cb(data));
  socket.emit('subscribeToImage');
  watching.push(() => subscribeToImage(cb))
}
function subscribeToThreshold(cb) {
  if (!socket) {
    todos.push(() => subscribeToThreshold(cb))
    return;
  }
  socket.on('thresh', data => cb(data));
  socket.emit('subscribeToThresh');
  watching.push(() => subscribeToThreshold(cb))
}
function setHSV(value) {
  if (!socket) {
    todos.push(() => setHSV(value))
    return;
  }
  socket.emit('setHSV', value)
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
function start() {
  socket.emit('start')
}
function stop() {
  socket.emit('stop')
}
export { setupSocket, subscribeToTilt, subscribeToImage, setTarget, subscribeToTarget, subscribeToGains, setGains, subscribeToLogs, start, stop, subscribeToThreshold, setHSV };