import { createContext, useState } from "react";

const SelectChatContext = createContext();

const SelectChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();

  return (
    <SelectChatContext.Provider value={{ selectedChat, setSelectedChat }}>
      {children}
    </SelectChatContext.Provider>
  );
};

export { SelectChatContext, SelectChatProvider };
