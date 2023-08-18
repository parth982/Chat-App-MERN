import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext, useState } from "react";
import { SelectChatContext } from "../../Context/SelectChatProvider";
import { UserContext } from "../../Context/UserProvider";
import UserBadgeItem from "../Other/UserBadgeItem";
import UserListItem from "../Other/UserListItem";

const UpdateGCModal = ({ fetchAllMessages, fetchAgain, setFetchAgain }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { user } = useContext(UserContext);
  const { selectedChat, setSelectedChat } = useContext(SelectChatContext);

  const handleRename = () => {
    if (!groupChatName) return;

    setRenameLoading(true);
    axios
      .put(
        "http://localhost:5000/api/chat/renameGroup",
        {
          chatId: selectedChat._id,
          newChatName: groupChatName,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        setSelectedChat(res.data);
        setFetchAgain(!fetchAgain);
        setRenameLoading(false);
      })
      .catch((err) => {
        toast({
          title: "Error Occured!",
          description: err.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setRenameLoading(false);
      });

    setGroupChatName("");
  };

  const handleSearch = (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    setLoading(true);
    axios
      .get(`http://localhost:5000/api/user?search=${search}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setLoading(false);
        setSearchResult(res.data);
      })
      .catch((err) => {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Search Results",
          status: err.response.data.message,
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        setLoading(false);
      });
  };

  const handleAddUser = (toAddUser) => {
    if (selectedChat.users.find((u) => u._id === toAddUser._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    setLoading(true);
    axios
      .put(
        "http://localhost:5000/api/chat/addToGroup",
        {
          chatId: selectedChat._id,
          userId: toAddUser._id,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      .then((res) => {
        setSelectedChat(res.data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
      })
      .catch((err) => {
        toast({
          title: "Error Occured!",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      });

    setGroupChatName("");
  };

  const handleRemove = (toRmUser) => {
    if (selectedChat.groupAdmin._id !== user._id && toRmUser._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    setLoading(true);
    axios
      .put(
        "http://localhost:5000/api/chat/removeFromGroup",
        {
          chatId: selectedChat._id,
          userId: toRmUser._id,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      .then((res) => {
        toRmUser._id === user._id
          ? setSelectedChat()
          : setSelectedChat(res.data);
        setFetchAgain(!fetchAgain);
        fetchAllMessages();
        setLoading(false);
      })
      .catch((err) => {
        toast({
          title: "Error Occured!",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      });

    setGroupChatName("");
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {Loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGCModal;
