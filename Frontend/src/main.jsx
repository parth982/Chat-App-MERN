import "./index.css";
import "./App.css";
import React from "react";
import router from "./Routes/routes";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { RouterProvider } from "react-router-dom";
import { UserProvider } from "./Context/UserProvider";
import { ChatProvider } from "./Context/ChatProvider";
import { NotifnProvider } from "./Context/NotifnProvider";
import { SelectChatProvider } from "./Context/SelectChatProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NotifnProvider>
      <ChatProvider>
        <SelectChatProvider>
          <UserProvider>
            <ChakraProvider>
              <RouterProvider router={router} />
            </ChakraProvider>
          </UserProvider>
        </SelectChatProvider>
      </ChatProvider>
    </NotifnProvider>
  </React.StrictMode>
);
