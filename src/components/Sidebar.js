import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
import { AppContext } from "../context/appContext";
import { useFetchChatsQuery } from "../services/appApi";
import { useLazyFetchChatsQuery } from "../services/appApi";

// import GroupChatModal from "./miscellaneous/GroupChatModal";

function Sidebar() {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, chats, setChats } =
    useContext(AppContext);

  const user = useSelector((state) => state.user);

  const toast = useToast();
  // const { data, isLoading, error } = useFetchChatsQuery();
  const [fetchChats, { isLoading, error }] = useLazyFetchChatsQuery();

  // const fetchChatsHandler = async () => {
  //   try {
  //     const { data } = fetchChats();
  //     console.log(data);
  //     setChats(data);
  //   } catch (e) {
  //     toast({
  //       title: "Error fetching chats",
  //       description: e.message,
  //       status: "error",
  //       duration: 5000,
  //       isClosable: true,
  //       position: "bottom-left",
  //     });
  //   }
  // };

  const handleFetchChats = () => {
    const { data } = fetchChats()
      .then(({ data }) => {
        console.log(data);
        setChats(data);
      })
      .catch((e) => {
        toast({
          title: "Error fetching chats",
          description: e.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      });
  };

  useEffect(() => {
    handleFetchChats();
  }, []);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        // fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        {/* <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal> */}
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
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
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          // <ChatLoading />
          <></>
        )}
      </Box>
    </Box>
  );
}

export default Sidebar;
