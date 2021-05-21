import express from "express";
import * as path from "path";

const app = express();
let httpServer = require("http").Server(app);

const io = require('socket.io')(httpServer, {
	cors: {
		origin: "http://localhost:8080",
		methods: ["GET", "POST"],
		transports: ['websocket', 'polling'],
		credentials : true
	},
	allowEIO3: true
});

app.set("port", process.env.PORT || 3000);

app.get("/", (req: any, res: any) => {
	res.sendFile(path.resolve("./src/client/index.html"));
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

});

io.on('disconnect', function (socket: any) {
	console.log(socket);
 	});

const server = httpServer.listen(3000, function () {
	console.log("listening on http://localhost:3000/");
});
