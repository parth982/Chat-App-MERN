import { Box } from "@chakra-ui/react";
import NavBar from "../components/Chat/NavBar";
import { useNavigate } from "react-router-dom";
import ChatBox from "../components/Chat/ChatBox";
import MyChats from "../components/Chat/MyChats";
import { UserContext } from "../Context/UserProvider";
import React, { useContext, useEffect, useState } from "react";

const ChatPage = () => {
  const { user, setUser } = useContext(UserContext);
  const [fetchAgain, setFetchAgain] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("UserInfo"));
    setUser(userInfo);
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <Box bg={"	#EBADAD"}>
      {user && <NavBar />}
      <Box
        display="flex"
        justifyContent={"space-between"}
        w={"100%"}
        h={"92vh"}
        padding={"10px"}
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </Box>
  );
};

export default ChatPage;
