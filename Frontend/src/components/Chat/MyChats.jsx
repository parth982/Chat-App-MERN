import axios from "axios";
import { useContext } from "react";
import { Button } from "@chakra-ui/react";
import LoadChatSkel from "./LoadChatSkel";
import { AddIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/toast";
import { getSenderName } from "./ChatUserLogic";
import GroupChatModal from "../Other/GroupChatModal";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { ChatContext } from "../../Context/ChatProvider";
import { UserContext } from "../../Context/UserProvider";
import { SelectChatContext } from "../../Context/SelectChatProvider";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState("");

  const { user } = useContext(UserContext);
  const { Chats, setChats } = useContext(ChatContext);
  const { selectedChat, setSelectedChat } = useContext(SelectChatContext);

  const toast = useToast();

  // Fetch All Chats for the Logged User.
  const fetchChats = async () => {
    axios
      .get("http://localhost:5000/api/chat", {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => setChats(res.data))
      .catch((err) => {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the chats",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      });
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("UserInfo"));
    setLoggedUser(userInfo);
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
      bg="#6c8e94"
      border={"2px solid black"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "27px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "12.5px", lg: "17px" }}
            rightIcon={<AddIcon />}
            colorScheme="orange"
            paddingX={"2"}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#3a4659"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {Chats ? (
          <Stack overflowY="scroll">
            {Chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {chat.isGroupChat
                    ? chat.chatName
                    : getSenderName(loggedUser, chat.users)}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <LoadChatSkel />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
