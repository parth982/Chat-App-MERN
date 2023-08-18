import { createContext, useState } from "react";

const NotifnContext = createContext();

const NotifnProvider = ({ children }) => {
  const [Notifns, setNotifns] = useState([]);

  return (
    <NotifnContext.Provider value={{ Notifns, setNotifns }}>
      {children}
    </NotifnContext.Provider>
  );
};

export { NotifnContext, NotifnProvider };
