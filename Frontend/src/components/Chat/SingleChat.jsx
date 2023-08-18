import {
  Box,
  Divider,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import Lottie from "react-lottie";
import io from "socket.io-client";
import ScrollChat from "./ScrollChat";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "../Other/ProfileModal";
import UpdateGCModal from "../Other/UpdateGCModal";
import { UserContext } from "../../Context/UserProvider";
import { NotifnContext } from "../../Context/NotifnProvider";
import React, { useContext, useEffect, useState } from "react";
import { getSenderInfo, getSenderName } from "./ChatUserLogic";
import typeAnimate from "../../animation/animation_lkcfu4uj.json";
import { SelectChatContext } from "../../Context/SelectChatProvider";
const EndPoint = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const toast = useToast();
  const { user } = useContext(UserContext);
  const { Notifns, setNotifns } = useContext(NotifnContext);
  const [allMessages, setAllMessages] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConn, setSocketConn] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIstyping] = useState(false);
  const { selectedChat, setSelectedChat } = useContext(SelectChatContext);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: typeAnimate,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    socket = io(EndPoint);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConn(true));
    socket.on("typing", () => setIstyping(true));
    socket.on("stop typing", () => setIstyping(false));
  }, []);

  useEffect(() => {
    fetchAllMsgs();
    // To Decide whether to Emit Message or Send Notification
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("Message Received", (newMesgReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMesgReceived.chat._id
      ) {
        // Send Notification
        if (!Notifns.includes(newMesgReceived)) {
          setNotifns([newMesgReceived, ...Notifns]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setAllMessages([...allMessages, newMesgReceived]);
      }
    });
  });

  const sendMsg = (e) => {
    if (e.key === "Enter" && newMessage) {
      const data = {
        content: newMessage,
        chatId: selectedChat._id,
      };
      axios
        .post("http://localhost:5000/api/message", data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.token,
          },
        })
        .then((res) => {
          setNewMessage("");
          socket.emit("new message", res.data);
          setAllMessages([...allMessages, res.data]);
        })
        .catch((err) => {
          toast({
            title: "Error Occured!",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        });
    }
  };

  const fetchAllMsgs = () => {
    if (!selectedChat) return;

    setLoading(true);
    axios
      .get(`http://localhost:5000/api/message/${selectedChat._id}`, {
        headers: {
          Authorization: "Bearer " + user.token,
        },
      })
      .then((res) => {
        setAllMessages(res.data);
        setLoading(false);

        socket.emit("join chat", selectedChat._id);
      })
      .catch((err) => {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Messages",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      });
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Typing Loading Logic:
    // If the socket is Connected then:
    if (socketConn) {
      if (!typing) {
        setTyping(true);
        socket.emit("typing", selectedChat._id);
      }
      let lastTypingTime = new Date().getTime();
      var timeDurn = 3000;
      setTimeout(() => {
        var timeNow = new Date().getTime();
        var timeDiff = timeNow - lastTypingTime;
        if (timeDiff >= timeDurn && typing) {
          socket.emit("stop typing", selectedChat._id);
          setTyping(false);
        }
      }, timeDurn);
    }
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="cursive"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {selectedChat.isGroupChat ? (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGCModal
                  fetchAllMessages={fetchAllMsgs}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            ) : (
              <>
                {getSenderName(user, selectedChat.users)}
                <ProfileModal user={getSenderInfo(user, selectedChat.users)} />
              </>
            )}
          </Box>
          <Divider orientation="horizontal" borderWidth={1} />
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {Loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <Box
                className="messages"
                display={"flex"}
                flexDir={"column"}
                overflowY={"scroll"}
              >
                <ScrollChat messages={allMessages} />
              </Box>
            )}
            <FormControl onKeyDown={sendMsg} id="first-name" isRequired mt={3}>
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={45}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                placeholder="Enter a message.."
                bg={"var(--chakra-colors-chakra-body-bg)"}
                color={"white"}
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="4xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
