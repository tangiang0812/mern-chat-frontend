import { AddIcon, Search2Icon } from "@chakra-ui/icons";
import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import React, { useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
// import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
import { AppContext } from "../context/appContext";
import { useLazyFetchChatsQuery } from "../services/appApi";

import GroupChatModal from "./miscellaneous/GroupChatModal";
import ChatLoading from "./UserAvater/ChatLoading";
import SearchModal from "./miscellaneous/SearchModal";

function Sidebar() {
  const {
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    fetchAgain,
    setPreviousSelectedChat,
  } = useContext(AppContext);

  const user = useSelector((state) => state.user);

  const toast = useToast();

  const [
    fetchChats,
    { isFetching: fetchFetching, isLoading: fetchLoading, error: fetchError },
  ] = useLazyFetchChatsQuery();

  const chatRef = useRef(null);

  const scrollIntoView = () => {
    chatRef.current?.scrollIntoView({
      behavior: "auto",
      block: "nearest",
      inline: "nearest",
    });
  };

  const handleFetchChats = () => {
    fetchChats().then(({ data, error }) => {
      if (data) {
        setChats(data);
        console.log(data);
        if (selectedChat) {
          let found = false;
          for (var chat of data) {
            if (chat._id === selectedChat._id) {
              found = true;
              break;
            }
          }
          found ? setSelectedChat(chat) : setSelectedChat();
        }
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

  useEffect(() => {
    scrollIntoView();
  }, [selectedChat, chats]);

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
      <SearchModal p={3}>
        <Button w="100%" mb={3}>
          <Search2Icon mr={3} /> Search
        </Button>
      </SearchModal>
      <GroupChatModal p={3}>
        <Button w="100%" mb={3}>
          <AddIcon mr={3} /> New group chat
        </Button>
      </GroupChatModal>
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
                  setPreviousSelectedChat(chat);
                }}
                height="64px"
                cursor="pointer"
                bg={selectedChat === chat ? "#638bfa" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                ref={selectedChat === chat ? chatRef : null}
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
                  name={
                    !chat.isGroupChat
                      ? getSender(user, chat.users).name
                      : chat.chatName
                  }
                  // src={chat.users[0].picture}
                />
                <Box overflow="hidden" display="flex" flexDir="column">
                  <Text overflow="hidden" noOfLines={1}>
                    {!chat.isGroupChat
                      ? getSender(user, chat.users).name
                      : chat.chatName}
                  </Text>
                  {chat.latestMessage && (
                    <Text fontSize="xs" overflow="hidden" noOfLines={1}>
                      <b>{chat.latestMessage.sender?.name} : </b>
                      {chat.latestMessage.content?.length > 24
                        ? chat.latestMessage.content?.substring(0, 25) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  )}
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
