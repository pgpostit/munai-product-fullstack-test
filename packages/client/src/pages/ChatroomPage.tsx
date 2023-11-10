import { useCallback, useEffect, useState } from "react";
import { User } from "../types/user";
import { Message } from "../types/message";
import { Event } from "../types/events";

import { io } from "socket.io-client";
interface ChatroomPageProps {
  user: User;
}

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket", "polling"],
  autoConnect: false,
});

const ChatroomPage = ({ user }: ChatroomPageProps) => {
  const [message, setMessage] = useState("");

  type Events =
    | Event<Message, "sended-message">
    | Event<{ user: User; at: string }, "entered-chatroom">
    | Event<{ user: User; at: string }, "leaved-chatroom">;

  const [events, setEvents] = useState<Array<Events>>([]);

  useEffect(() => {
    socket.connect();
    socket.emit("enter-chatroom", { userId: user.id });

    socket.on("entered-chatroom", ({ user, at }) => {
      setEvents((state) => [
        ...state,
        { type: "entered-chatroom", data: { user, at } },
      ]);
    });

    socket.on("leaved-chatroom", ({ user, at }) => {
      setEvents((state) => [
        ...state,
        { type: "leaved-chatroom", data: { user, at } },
      ]);
    });

    socket.on("sended-message", ({ message }) => {
      setEvents((state) => [
        ...state,
        { type: "sended-message", data: message },
      ]);
    });

    return () => {
      socket.emit("leave-chatroom", { userId: user.id });

      socket.off("entered-chatroom");
      socket.off("leaved-chatroom");
      socket.off("sended-message");
      
      socket.disconnect();
    };
  }, [user, setEvents]);

  const sendOnClick = useCallback(async () => {
    socket.emit("send-message", { text: message, userId: user.id });
    setMessage("");
  }, [message, user, setMessage]);

  const quitOnClick = useCallback(() => {
    socket.emit("leave-chatroom", { userId: user.id });
    socket.disconnect();
    setEvents([]);
    return window.location.reload()
  }, [user, setEvents]);

  const eventsMapCallback = ({ type, data }: Events, index: number) => {
    switch (type) {
      case "entered-chatroom":
        return (
          <div key={index}>
            <div>{data.at}</div>
            <div>
              Usuário <b>{data.user.username}</b> entrou na sala.
            </div>
          </div>
        );

      case "leaved-chatroom":
        return (
          <div key={index}>
            <div>{data.at}</div>
            <div>
              Usuário <b>{data.user.username}</b> saiu da sala.
            </div>
          </div>
        );

      case "sended-message":
        return (
          <div key={index}>
            <div>
              <b>{data.author.username}:</b>
              <span>{data.createdAt}</span>
            </div>
            <div>{data.text}</div>
          </div>
        );

      default:
        return <></>;
    }
  };

  return (
    <div className="chatRoomContainer d-flex flex-column h-100 m-3 p-3">
      <div className="d-flex justify-content-between align-items-end">
        <div className="broadcast">Broadcast</div>
        <button className="btn btn-primary w-25" onClick={quitOnClick}>
          Sair
        </button>
      </div>
      <div className="flex-grow-1 overflow-auto">{events.map(eventsMapCallback)}</div>
      <div className="d-flex justify-content-between align-items-end pb-3">
        <input
          className="form-control"
          type="text"
          name="username"
          id="username"
          value={message}
          onChange={({ target }) => {
            setMessage(target.value);
          }}
        />
        <button className="btn btn-primary" onClick={sendOnClick}>
          Enviar
        </button>
      </div>
    </div>
  );
};
export default ChatroomPage;
