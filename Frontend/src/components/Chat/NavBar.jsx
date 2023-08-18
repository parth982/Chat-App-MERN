import {
  Box,
  Tooltip,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  Input,
  Spinner,
} from "@chakra-ui/react";

import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";

import axios from "axios";
import LoadChatSkel from "./LoadChatSkel";
import { useToast } from "@chakra-ui/toast";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/hooks";
import ProfileModal from "../Other/ProfileModal";
import UserListItem from "../Other/UserListItem";
import { Effect } from "react-notification-badge";
import React, { useContext, useState } from "react";
import NotificationBadge from "react-notification-badge";
import { UserContext } from "../../Context/UserProvider";
import { ChatContext } from "../../Context/ChatProvider";
import { NotifnContext } from "../../Context/NotifnProvider";
import { SelectChatContext } from "../../Context/SelectChatProvider";
import { ChevronDownIcon, SearchIcon, BellIcon } from "@chakra-ui/icons";
import { getSenderName } from "./ChatUserLogic";

const NavBar = () => {
  // Access Chat Between 2 Users
  const accessChat = (userId) => {
    setLoadingChat(true);
    axios
      .post(
        "http://localhost:5000/api/chat",
        { userId },
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        if (!Chats.find((c) => c._id === res.data._id)) {
          setChats([res.data, ...Chats]);
        }
        setSelectedChat(res.data);
        setLoadingChat(false);
        onClose();
      })
      .catch((err) => {
        toast({
          title: "Error Fetching the Chat!",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        setLoadingChat(false);
      });
  };

  // Fetching List of All Users with given QueryString.
  const handleSearch = () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/user?search=${search}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setSearchResult(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        setLoading(false);
      });
  };

  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { Chats, setChats } = useContext(ChatContext);
  const { Notifns, setNotifns } = useContext(NotifnContext);
  const { setSelectedChat } = useContext(SelectChatContext);

  const [search, setSearch] = useState("");
  const [isLoading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchResult, setSearchResult] = useState([]);
  const [isLoadingChat, setLoadingChat] = useState(false);

  const onLogOut = () => {
    localStorage.removeItem("UserInfo");
    navigate("/");
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        p="5px 10px 5px 10px"
        bg={"var(--chakra-colors-chakra-body-bg)"}
        border={"2px solid black"}
      >
        <Tooltip label="Search User" hasArrow placement="bottom-end">
          <Button onClick={onOpen} colorScheme="linkedin">
            <SearchIcon />
            <Text
              display={{ base: "none", md: "flex" }}
              paddingLeft={2}
              fontSize={"18px"}
            >
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize={"45px"} fontFamily={"mono"}>
          WittyWhisperer
        </Text>

        <div>
          <Menu>
            <MenuButton marginRight={3}>
              <NotificationBadge count={Notifns.length} effect={Effect.SCALE} />
              <BellIcon fontSize={"26px"} marginRight={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!Notifns.length && "No New Messages"}
              {Notifns.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotifns(Notifns.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Messg In ${notif.chat.chatName}`
                    : `New Messg In ${getSenderName(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                src={user.pic}
                name={user.name}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={onLogOut}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {isLoading ? (
              <LoadChatSkel />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {isLoadingChat && <Spinner ml="auto" display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default NavBar;
