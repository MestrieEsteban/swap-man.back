import express from "express";
import * as path from "path";
import * as process from "process";

const port = process.env.port || 3000;
const socketIO = require('socket.io');

const app = express()
	//.use((req, res) => res.sendFile(path.resolve("./src/client/index.html")))
	.set("port", port)
	.listen(port, function () {
		console.log(`listening on http://localhost:${port}/`);
	});

const io = socketIO(app, {
	cors: {
		origin: "http://localhost:8080",
		methods: ["GET", "POST"],
		transports: ['websocket', 'polling'],
		credentials : true
	},
	allowEIO3: true
});

let rooms: any = {}

io.on("connection", function (socket: any) {
	socket.on("createRoom", function (room: string, name: string) {
		socket.join(room);
		rooms[room] = { user1: name, user2: "" }
		console.log(`${name} create room : ${room}`);
		io.in(room).emit('user', rooms[room])
	});
	socket.on("joinRoom", function (room: string, name: string) {
		socket.join(room);
		rooms[room].user2 = name
		console.log(`${name} join room : ${room}`);
		io.in(room).emit('user', rooms[room])
	});
	socket.on("startGame", function (room: string) {
		io.in(room).emit('startGame')
	});
	socket.on("pacmanMove", function (pacman: any, room: string) {
		socket.to(room).emit("pacmanMove", pacman)
	});
	socket.on("Player2Move", function (pacman: any, room: string) {
		socket.to(room).emit("Player2Move", pacman)
	});

	socket.on("SenderUp", function (room: string, type: string) {

		socket.to(room).emit("Up", type)
	})
	socket.on("SenderDown", function (room: string, type: string) {
		socket.to(room).emit("Down", type)
	})
	socket.on("SenderLeft", function (room: string, type: string) {
		socket.to(room).emit("Left", type)
	})
	socket.on("SenderRight", function (room: string, type: string) {
		socket.to(room).emit("Right", type)
	})
	socket.on("SenderClear", function (room: string, type: string) {
		socket.to(room).emit("Clear", type)
	})
});

io.on('disconnect', function (socket: any) {
	console.log(socket);
 	});
