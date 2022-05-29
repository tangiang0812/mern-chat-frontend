import {
  Box,
  Button,
  Divider,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { AppContext } from "../context/appContext";
import UserListItem from "./UserAvater/UserListItem";
import ChatDetailUserListItem from "./UserAvater/ChatDetailUserListItem";
import { useSelector } from "react-redux";
import {
  useAccessChatMutation,
  useRemoveFromGroupMutation,
} from "../services/appApi";
import AddUserModal from "./miscellaneous/AddUserModal";
import RenameGroupModal from "./miscellaneous/RenameGroupModal";
import {
  AddIcon,
  ArrowLeftIcon,
  EditIcon,
  SmallAddIcon,
} from "@chakra-ui/icons";

function ChatDetail() {
  const toast = useToast();

  const {
    showDetail,
    selectedChat,
    setSelectedChat,
    fetchAgain,
    setFetchAgain,
    chats,
    setChats,
  } = useContext(AppContext);

  const user = useSelector((state) => state.user);

  const [removeFromGroup, { isLoading: removeLoading, error: removeError }] =
    useRemoveFromGroupMutation();

  const [accessChat, { isLoading: accessLoading, error: accessError }] =
    useAccessChatMutation();

  const handleRemove = (selectedUser) => {
    const payload = {
      chatId: selectedChat._id,
      userId: selectedUser._id,
    };
    removeFromGroup(payload).then(({ data, error }) => {
      if (data) {
        setFetchAgain(!fetchAgain);
        selectedUser._id === user._id && setSelectedChat();
      } else if (error) {
        toast({
          title: "Error Occured!",
          description: error.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    });
  };

  const handleAccessChat = async (userId) => {
    console.log("giangdeptrai");
    accessChat({ userId }).then(({ data, error }) => {
      if (data) {
        if (!chats.find((chat) => chat._id === data._id)) {
          setChats([data, ...chats]);
          setSelectedChat(data);
        } else {
          setSelectedChat(chats.find((chat) => chat._id === data._id));
        }
      } else if (error) {
        toast({
          title: "Error",
          description: "Can not access chat",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    });
  };

  return (
    <Box
      display={{ md: showDetail ? "flex" : "none" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w="20%"
      borderRadius="lg"
      borderWidth="1px"
      overflowY="auto"
    >
      {selectedChat?.isGroupChat && (
        <>
          <RenameGroupModal p={3}>
            <Button w="100%">
              <EditIcon mr={3} />
              Rename group chat
            </Button>
          </RenameGroupModal>
          <Divider my={3} />
          <AddUserModal p={3}>
            <Button w="100%">
              <AddIcon mr={3} />
              Add user
            </Button>
          </AddUserModal>
        </>
      )}
      <Box w="100%" display="flex" flexDir="column" overflowY="auto" my={3}>
        {selectedChat?.users.map((selectedUser) => (
          <ChatDetailUserListItem
            selectedUser={selectedUser}
            key={selectedUser._id}
            handleRemove={handleRemove}
            handleAccessChat={handleAccessChat}
          />
        ))}
      </Box>
      {selectedChat?.isGroupChat && (
        <Box mt="auto" w="100%">
          <Divider my={3} />
          <Button onClick={() => handleRemove(user)} colorScheme="red" w="100%">
            <ArrowLeftIcon mr={3} />
            Leave group
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default ChatDetail;
