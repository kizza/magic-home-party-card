const net = require('net');

const DISCOVERY_PORT = 48899
const PROTOCOL_PORT = 5577
const stringify = (bytes) => Array.from(bytes).map(byte => '0x' + byte.toString(16).padStart(2, '0')).join(' ');

// Create a TCP server
const server = net.createServer((socket) => {
  console.log('Client connected');

  // Event handler for receiving data
  socket.on('data', (data) => {
    console.log(`Received ${stringify(data)}`)

    if (data[0] != 0x81) {
      console.log("Incorrect starting code")
      return;
    }

    socket.write(
      Buffer.from([0x81, 0x06, 0x24, 0x61, 0x26, 0x10, 0x48, 0x0F, 0x4B, 0x00, 0x03, 0x00, 0xF0, 0xD7])
    )
  });

  // Event handler for client disconnection
  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

// Start listening for connections
server.listen(PROTOCOL_PORT, () => {
  console.log(`Server listening on port ${PROTOCOL_PORT}`);
});

const dgram = require('dgram');
const dgramServer = dgram.createSocket('udp4');
dgramServer.on('message', (msg, rinfo) => {
  // console.log(`Received message: ${msg} from ${rinfo.address}:${rinfo.port}`);
  let response = undefined;
  switch (msg.toString()) {
    case 'HF-A11ASSISTHREAD':
      response = `${process.env.IP_ADDRESS},${process.env.DEVICE_ID},AK001-ZJ2147` // ip, id, model
      break;
    case 'AT+LVER\r':
      response = '+ok=06_31_20210426_ZG-BL\r'
      break;
    case 'AT+SOCKB\r':
      response = '+ok=TCP,8816,dn8816us02.magichue.net\r'
      break;
  }

  if (response) {
    console.log("Sending back", response)
    dgramServer.send(response, 0, response.length, rinfo.port, rinfo.address );
  }
});

dgramServer.on('listening', () => {
  const address = server.address();
  console.log(`dgramServer UDP server listening on ${address.address}:${address.port}`);
});

dgramServer.bind(DISCOVERY_PORT);
