import express from "express";
import * as socketio from "socket.io";
import * as path from "path";

const app = express();
app.set("port", process.env.PORT || 3000);

let http = require("http").Server(app);

let io = require("socket.io")(http);

app.get("/", (req: any, res: any) => {
	res.sendFile(path.resolve("./src/client/index.html"));
});

var rooms: any = {}

io.on("connection", function (socket: any) {
	socket.on("createRoom", function (room: string, name: string) {
		socket.join(room);
		rooms[room] = { user1: name, user2: "" }
		console.log(`${name} join room : ${room}`);
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

const server = http.listen(3000, function () {
	console.log("listening on http://localhost:3000/");
});