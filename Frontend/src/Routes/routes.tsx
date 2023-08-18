import React from "react";
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../Pages/HomePage";
import ChatPage from "../Pages/ChatPage";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/chats", element: <ChatPage /> },
]);

export default router;
