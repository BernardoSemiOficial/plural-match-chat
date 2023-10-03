interface Message {
	username: string;
	room: string;
	message: string;
}

export function getMessagesRoom(room: string, messages: Message[]) {
    const messagesRoom = messages.filter(message => message.room === room);
    return messagesRoom;
}