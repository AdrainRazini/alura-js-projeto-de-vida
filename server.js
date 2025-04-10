// server.js
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

const users = {}; // Armazena usuários logados

// Configura a pasta pública para servir os arquivos HTML, CSS e JS
app.use(express.static('public'));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Evento de conexão do Socket.IO
io.on('connection', (socket) => {
  // Adiciona o usuário quando ele entra no chat
  socket.on('login', (username) => {
    users[socket.id] = username;
    socket.emit('loginSuccess', username);
    io.emit('userConnected', username);
  });

  // Lida com mensagens de chat
  socket.on('chatMessage', (msg) => {
    const username = users[socket.id];
    io.emit('message', { user: username, text: msg });
  });

  // Remove o usuário quando ele desconecta
  socket.on('disconnect', () => {
    const username = users[socket.id];
    delete users[socket.id];
    io.emit('userDisconnected', username);
  });
});

// Inicia o servidor
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
/* FEITO POR ADRIAN RAZINI */

