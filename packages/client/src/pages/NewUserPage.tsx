import { useCallback, useState } from "react";
import { User } from "../types/user";

interface NewUserPageProps {
  onCreateUser: (user: User) => void;
}

export const NewUserPage = ({ onCreateUser }: NewUserPageProps) => {
  const [username, setUsername] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  const enterOnClick = useCallback(async () => {
    try {
      setError(false);
      setSending(true);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user`, {
        body: JSON.stringify({ username }),
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const createdUser: User = await response.json();
      onCreateUser(createdUser);
    } catch (error) {
      console.error(error);

      setError(true);
    } finally {
      setSending(false);
    }
  }, [username, setSending, setError, onCreateUser]);

  return (
    <div>
      <div>
        <h1>Cadastro</h1>
      </div>
      <div>
        <label htmlFor="username">Nome</label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          disabled={sending}
          onChange={({ target }) => {
            setUsername(target.value);
          }}
        />
        {error && <p>Ocorreu um erro ao criar o usuário.</p>}
      </div>
      <div>
        <button onClick={enterOnClick} disabled={sending}>
          Entrar
        </button>
      </div>
    </div>
  );
};
