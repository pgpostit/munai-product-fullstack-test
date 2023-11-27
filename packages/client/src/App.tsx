import { useState, lazy, Suspense } from "react";
import { User } from "./types/user";
import { NewUserPage } from "./pages/NewUserPage";

const ChatroomPage = lazy(() => import("./pages/ChatroomPage"));

const App = () => {
  const [user, setUser] = useState<User | null>(null);

  if (user == null) {
    return <NewUserPage onCreateUser={setUser} />;
  }

  return (
    <Suspense fallback={<>Carregando...</>}>
      <ChatroomPage user={user} />
    </Suspense>
  );
};

export default App;
