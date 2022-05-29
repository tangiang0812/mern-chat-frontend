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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
// import axios from "axios";
import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { AppContext } from "../../context/appContext";
import {
  useCreateGroupChatMutation,
  useLazySearchUsersQuery,
  useRenameGroupMutation,
} from "../../services/appApi";
import UserListItem from "../UserAvater/UserListItem";
import UserBadgeItem from "../UserAvater/UserBadgeItem";

function RenameGroupModal({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();

  const toast = useToast();

  const user = useSelector((state) => state.user);

  const { setFetchAgain, fetchAgain, selectedChat } = useContext(AppContext);

  const [renameGroup, { isLoading: renameLoading, error: renameError }] =
    useRenameGroupMutation();

  const handleClose = () => {
    setGroupChatName("");
    onClose();
  };

  const handleRenameGroup = async () => {
    if (!groupChatName) {
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
      chatName: groupChatName,
      chatId: selectedChat._id,
    };

    renameGroup(payload).then(({ data, error }) => {
      if (data) {
        setFetchAgain(!fetchAgain);
        // setChats([data, ...chats]);
        handleClose();
        toast({
          title: "Renamed group chat",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } else if (error) {
        toast({
          title: "Failed to rename group chat!",
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
            Rename Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <FormControl>
              <Input
                placeholder="New name"
                mr={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <Button
              colorScheme="blue"
              ml={3}
              onClick={handleRenameGroup}
              isLoading={renameLoading}
            >
              Rename
            </Button>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default RenameGroupModal;
