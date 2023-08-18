import { createContext, useState } from "react";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [Chats, setChats] = useState([]);

  return (
    <ChatContext.Provider value={{ Chats, setChats }}>
      {children}
    </ChatContext.Provider>
  );
};

export { ChatContext, ChatProvider };
