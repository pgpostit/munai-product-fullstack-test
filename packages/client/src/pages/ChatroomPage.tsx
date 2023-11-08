import { useCallback, useEffect, useState } from "react";
import { User } from "../types/user";
import { Message } from "../types/message";

interface ChatroomPageProps {
  user: User;
}

export const ChatroomPage = ({ user }: ChatroomPageProps) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const [messages, setMessages] = useState<Array<Message>>([]);

  // Parte feita para renderizar as mensagens de tempo em tempo. Substituir a funcionalidade pelo socket
  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/messages`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const loadedMessages: Array<Message> = await response.json();

      setMessages(loadedMessages);
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [setMessages]);

  const sendOnClick = useCallback(async () => {
    try {
      setSending(true);

      await fetch(`${import.meta.env.VITE_BACKEND_URL}/message`, {
        body: JSON.stringify({ message, user: user.id }),
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setMessage("");
      setSending(false);
    }
  }, [message, user, setMessage, setSending]);

  return (
    <div>
      <div>
        <h1>Broadcast</h1>
        <button>Sair</button>
      </div>
      <div>
        {messages.map(({ text, id, author, createdAt }) => (
          <div key={id}>
            <div>
              <span>{author.username}:</span>
              <span>{createdAt}</span>
            </div>
            <div>{text}</div>
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          name="username"
          id="username"
          value={message}
          disabled={sending}
          onChange={({ target }) => {
            setMessage(target.value);
          }}
        />
        <button onClick={sendOnClick} disabled={sending}>
          Enviar
        </button>
      </div>
    </div>
  );
};
