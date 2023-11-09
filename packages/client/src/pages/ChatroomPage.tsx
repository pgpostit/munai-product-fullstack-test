import { useCallback, useEffect, useState } from "react";
import { User } from "../types/user";
import { Message } from "../types/message";
import { Event } from "../types/events";

import { io } from "socket.io-client";
interface ChatroomPageProps {
  user: User;
}

const socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
  transports: ["websocket", "polling"],
  path: 'socket',
  autoConnect: false,
});

export const ChatroomPage = ({ user }: ChatroomPageProps) => {
  const [message, setMessage] = useState("");

  type Events =
    | Event<Message, "message">
    | Event<User, "enter-chatroom">
    | Event<User, "leave-chatroom">;

  const [events, setEvents] = useState<Array<Events>>([]);

  useEffect(() => {
    socket.connect();
    socket.emit("enter-chatroom", { user });

    socket.on("enter-chatroom", ({user}) => {
      setEvents(state => [...state, {type: "enter-chatroom", data: user}])
    })

    socket.on("leave-chatroom", ({user}) => {
      setEvents(state => [...state, {type: "leave-chatroom", data: user}])
    })

    socket.on("message", ({message}) => {
      setEvents(state => [...state, {type: "message", data: message}])
    })

    return () => {
      socket.emit("leave-chatroom", { user });
      socket.disconnect();
    };
  }, [user, setEvents]);

  const sendOnClick = useCallback(async () => {
    socket.emit('send-message', { text: message, userId: user.id })
    setMessage("")
  }, [message, user, setMessage]);

  const eventsMapCallback = ({ type, data }: Events, index: number) => {
    switch (type) {
      case "enter-chatroom":
        return (
          <div key={index}>
            Usuário <b>{data.username}</b> entrou na sala.
          </div>
        );

      case "leave-chatroom":
        return (
          <div key={index}>
            Usuário <b>{data.username}</b> saiu da sala.
          </div>
        );

      case "message":
        return (
          <div key={index}>
            <div>
              <span>{data.author.username}:</span>
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
    <div>
      <div>
        <h1>Broadcast</h1>
        <button>Sair</button>
      </div>
      <div>{events.map(eventsMapCallback)}</div>
      <div>
        <input
          type="text"
          name="username"
          id="username"
          value={message}
          onChange={({ target }) => {
            setMessage(target.value);
          }}
        />
        <button onClick={sendOnClick}>
          Enviar
        </button>
      </div>
    </div>
  );
};
