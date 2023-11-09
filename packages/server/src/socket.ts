import { createServer } from "http";
import {Server} from 'socket.io';
import app from './server';
import { prisma } from './prisma';


const server = createServer(app.callback());
const io = new Server(server, {
  transports: ["websocket", "polling"],
  path: 'socket'
})

interface SendMessagePayload {
  text: string;
  userId: string;
}

io.on("connection", client => {
  client.on("send-message", async ({ text, userId }: SendMessagePayload) => {

    const createdMessage = await prisma.message.create({
      data: {
        text,
        authorId: userId,
      },
      include: { author: true }
    });

    io.emit("message", {message: createdMessage});
  });
});






  