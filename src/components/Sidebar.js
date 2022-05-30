import { AddIcon, CloseIcon, Search2Icon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
import { AppContext } from "../context/appContext";
import { useLazyFetchChatsQuery } from "../services/appApi";

import GroupChatModal from "./miscellaneous/GroupChatModal";
import ChatLoading from "./UserAvater/ChatLoading";
import SearchModal from "./miscellaneous/SearchModal";

function Sidebar() {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, chats, setChats, fetchAgain } =
    useContext(AppContext);

  const user = useSelector((state) => state.user);

  const toast = useToast();

  const [
    fetchChats,
    { isFetching: fetchFetching, isLoading: fetchLoading, error: fetchError },
  ] = useLazyFetchChatsQuery();

  const handleFetchChats = () => {
    fetchChats().then(({ data, error }) => {
      if (data) {
        console.log(data);
        setChats(data);
        if (selectedChat) {
          let found = false;
          for (var chat of data) {
            if (chat._id === selectedChat._id) {
              found = true;
              break;
            }
          }
          console.log(chat);
          found ? setSelectedChat(chat) : setSelectedChat();
        }
        // console.log(
        //   chats.find((chat) => selectedChat && chat._id === selectedChat._id)
        // );
        // setSelectedChat(
        //   chats.find((chat) => selectedChat && chat._id === selectedChat._id) // this one will not work bc return value of find is selectedChat not chat
        // );
      } else if (error) {
        toast({
          title: "Error fetching chats",
          description: error.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    });
  };

  useEffect(() => {
    handleFetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display="flex"
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w="20%"
      borderRadius="lg"
      borderWidth="1px"
      overflowY="hidden"
    >
      <Box
        width="100%"
        display="flex"
        pb={2}
        borderRadius="lg"
        justifyContent="space-between"
        alignItems="center"
      >
        <SearchModal>
          <Button>
            <Search2Icon mr={3} /> Search
          </Button>
        </SearchModal>
        <GroupChatModal>
          <Button>
            <AddIcon mr={3} /> New group chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="auto"
      >
        {!fetchLoading ? (
          <Stack>
            {chats.map((chat) => (
              <Box
                onClick={() => {
                  setSelectedChat(chat);
                }}
                cursor="pointer"
                bg={selectedChat === chat ? "#638bfa" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                display="flex"
                flexDirection="row"
              >
                <Avatar
                  mr={2}
                  size="md"
                  cursor="pointer"
                  name={chat.chatName}
                  src={chat.users[0].picture}
                />
                <Box>
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(user, chat.users).name
                      : chat.chatName}
                  </Text>
                  {/* {chat.latestMessage && (
                    <Text fontSize="xs">
                      <b>{chat.latestMessage.sender.name} : </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  )} */}
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
          // <>Giang</>
        )}
      </Box>
    </Box>
  );
}

export default Sidebar;
