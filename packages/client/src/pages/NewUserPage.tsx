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
    <div className="newUserContainer m-3 p-3  h-100">
      <div className="mb-5">
        <h1>Cadastro</h1>
      </div>
      <div>
        <label className="form-label mt-0 mb-3" htmlFor="username">Nome</label>
        <input
          className="form-control"
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
      <div className="fixed-bottom d-flex justify-content-end me-3 pe-3">
        <button className="btn btn-primary w-25 mb-3" onClick={enterOnClick} disabled={sending}>
          Entrar
        </button>
      </div>
    </div>
  );
};
