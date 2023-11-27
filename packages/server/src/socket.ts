import { createServer } from "http";
import { Server } from "socket.io";
import { prisma } from "./prisma";

const port = 3001;
const server = createServer();
const io = new Server(server, {
  transports: ["websocket", "polling"],
  cors: {
    origin: "*",
  },
});

interface SendMessagePayload {
  text: string;
  userId: string;
}

io.on("connection", (client) => {
  console.log(`[SOCKET] Client with id ${client.id} connected`);

  client.on("enter-chatroom", async ({ userId }: SendMessagePayload) => {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    io.emit("entered-chatroom", { user, at: new Date() });
  });

  client.on("leave-chatroom", async ({ userId }: SendMessagePayload) => {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    io.emit("leaved-chatroom", { user, at: new Date() });
  });

  client.on("send-message", async ({ text, userId }: SendMessagePayload) => {
    const createdMessage = await prisma.message.create({
      data: {
        text,
        authorId: userId,
      },
      include: { author: true },
    });

    io.emit("sended-message", { message: createdMessage });
  });

  client.on("disconnect", () => {
    console.log(`[SOCKET] Client with id ${client.id} disconnected`);
  });
});

server.listen(port);
console.log(`Socket.io started on: ws://localhost:${port}`);
