import { useCallback, useEffect, useState } from "react";
import { User } from "../types/user";
import { Message } from "../types/message";
import { Event } from "../types/events";

import { io } from "socket.io-client";
import ScrollToBottom from "../components/ScrollToBottom";
interface ChatroomPageProps {
  user: User;
}

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket", "polling"],
  autoConnect: false,
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
};

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

  const messageOnSubmit = useCallback(async () => {
    if (!message) {
      return;
    }

    socket.emit("send-message", { text: message, userId: user.id });
    setMessage("");
  }, [message, user, setMessage]);

  const quitOnClick = useCallback(() => {
    socket.emit("leave-chatroom", { userId: user.id });
    socket.disconnect();
    setEvents([]);
    return window.location.reload();
  }, [user, setEvents]);

  const eventsMapCallback = ({ type, data }: Events, index: number) => {
    switch (type) {
      case "entered-chatroom":
        return (
          <div
            className="alert alert-light d-flex justify-content-between"
            key={index}
          >
            <small className="pe-2">
              Usuário <b>{data.user.username}</b> entrou na sala.
            </small>
            <small className="align-self-end">{formatDate(data.at)}</small>
          </div>
        );

      case "leaved-chatroom":
        return (
          <div
            className="alert alert-light d-flex justify-content-between"
            key={index}
          >
            <small className="pe-2">
              Usuário <b>{data.user.username}</b> saiu da sala.
            </small>
            <small className="align-self-end">{formatDate(data.at)}</small>
          </div>
        );

      case "sended-message":
        return (
          <div
            className={`alert d-flex flex-column ${
              data.authorId === user.id ? "alert-primary" : "alert-light"
            }`}
            key={index}
          >
            <div className="d-flex justify-content-between">
              <b>{data.author.username}:</b>
              <span>{formatDate(data.createdAt)}</span>
            </div>
            <hr />
            <div>{data.text}</div>
          </div>
        );

      default:
        return <></>;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div
        className="d-flex position-sticky top-0 justify-content-between align-items-end p-4 bg-white shadow-sm"
        style={{ zIndex: 1000 }}
      >
        <h1>Broadcast</h1>
        <button className="btn btn-primary w-25" onClick={quitOnClick}>
          Sair
        </button>
      </div>
      <div className="flex-grow-1 overflow-auto justify-content-start px-4 gy-2">
        {events.map(eventsMapCallback)}
      </div>
      <form
        className="d-flex justify-content-between align-items-end p-4 bg-white position-sticky bottom-0 shadow"
        onSubmit={(e) => {
          e.preventDefault();
          messageOnSubmit();
        }}
      >
        <div className="input-group">
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
          <button type="submit" className="btn btn-primary">
            Enviar
          </button>
        </div>
      </form>
      <ScrollToBottom />
    </div>
  );
};
export default ChatroomPage;
