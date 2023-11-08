import { useState } from "react";
import { User } from "./types/user";
import { NewUserPage } from "./pages/NewUserPage";
import { ChatroomPage } from "./pages/ChatroomPage";

export const App = () => {
  const [user, setUser] = useState<User | null>(null);

  if (user == null) {
    return <NewUserPage onCreateUser={setUser} />;
  }

  return <ChatroomPage user={user} />;
};
