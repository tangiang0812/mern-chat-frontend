import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
// import axios from "axios";
import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { AppContext } from "../../context/appContext";
import {
  useAddToGroupMutation,
  useLazySearchUsersQuery,
} from "../../services/appApi";
import UserListItem from "../UserAvater/UserListItem";
import UserBadgeItem from "../UserAvater/UserBadgeItem";

function AddUserModal({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  // const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { selectedChat, setFetchAgain, fetchAgain, setChats, setSelectedChat } =
    useContext(AppContext);

  const [
    searchUsers,
    {
      isFetching: searchFetching,
      isLoading: searchLoading,
      error: searchError,
    },
  ] = useLazySearchUsersQuery();

  const [addToGroup, { isLoading: addLoading, error: addError }] =
    useAddToGroupMutation();

  const handleClose = () => {
    setSelectedUsers([]);
    setSearchResult([]);
    setSearch("");
    onClose();
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.find((u) => u._id === userToAdd._id)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast({
        title: "User is a member aldready",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSearch = async (keyword) => {
    setSearch(keyword);
    searchUsers(keyword).then(({ data, error }) => {
      if (data) {
        setSearchResult(data);
      } else if (error) {
        toast({
          title: "Error searching users",
          description: error.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    });
  };

  const handleAddToGroup = async () => {
    if (!selectedUsers) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const payload = {
      chatId: selectedChat._id,
      userId: selectedUsers.map((u) => u._id),
    };

    addToGroup(payload).then(({ data, error }) => {
      if (data) {
        setSelectedChat(data);
        setChats((prevChatState) => {
          const newChatState = prevChatState.map((chat) => {
            if (chat._id === data._id) {
              return data;
            }
            return chat;
          });
          return newChatState;
        });
        // setFetchAgain(!fetchAgain);
        // setChats([data, ...chats]);
        handleClose();
        toast({
          title: "Add user(s) successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } else if (error) {
        toast({
          title: "Failed to add user(s)!",
          description: error.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    });
  };

  return (
    <>
      <span onClick={onOpen} style={{ width: "100%" }}>
        {children}
      </span>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            // fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Add user
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Add Users"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap" mb={3}>
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {searchFetching ? (
              // <ChatLoading />
              <Spinner m="auto" display="flex" />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="twitter"
              mr={3}
              onClick={handleAddToGroup}
              isLoading={addLoading}
            >
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddUserModal;
