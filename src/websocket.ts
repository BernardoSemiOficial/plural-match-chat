import { io } from "./http";
import { getMessagesRoom } from "./utils/getMessagesRoom";

interface RoomUser {
    room: string;
    username: string;
    socketId: string;
}

interface Message {
    room: string;
    message: string;
    createdAt: Date;
    username: string;
}

const users: RoomUser[] = [];
const messages: Message[] = [];

io.on("connection", (socket) => {
    socket.on("room", (data, response) => {
        console.log("[SOCKET] ROOM");
        socket.join(data.room);

        const userInRoom = users.find((user) => {
            return user.username === data.username && user.room === data.room;
        });

        if (userInRoom) {
            userInRoom.socketId = socket.id;
            console.log("[SOCKET] atualizado user: ", users);
            return;
        }

        users.push({
            room: data.room,
            username: data.username,
            socketId: socket.id,
        });

        const messagesRoom = getMessagesRoom(data.room, messages);
        response(messagesRoom);

        console.log("[SOCKET] criado usuário: ", users);
    });

    socket.on("send-message", (data) => {
        console.log("[SOCKET] SEND MESSAGE", data);
        const newMessage: Message = {
            room: data.room,
            username: data.username,
            message: data.message,
            createdAt: new Date(),
        };
        messages.push(newMessage);
        console.log(messages);
        io.to(data.room).emit("receive-message", newMessage);
    });

    socket.on("disconnecting", () => {
        console.log("[SOCKET] disconnecting user", socket.id);
    });

    socket.on("disconnect", () => {
        console.log("[SOCKET] null users");
    });
});
