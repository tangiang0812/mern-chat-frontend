import { AddIcon, CloseIcon, Search2Icon } from "@chakra-ui/icons";
import {
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
import {
  useAccessChatMutation,
  useLazyFetchChatsQuery,
  useLazySearchUsersQuery,
} from "../services/appApi";

import GroupChatModal from "./miscellaneous/GroupChatModal";
import UserListItem from "./UserAvater/UserListItem";
import ChatLoading from "./UserAvater/ChatLoading";

// import GroupChatModal from "./miscellaneous/GroupChatModal";

function Sidebar() {
  const [loggedUser, setLoggedUser] = useState();
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  const { selectedChat, setSelectedChat, chats, setChats } =
    useContext(AppContext);

  const user = useSelector((state) => state.user);

  const toast = useToast();

  const [fetchChats, { isLoading: fetchLoading, error: fetchError }] =
    useLazyFetchChatsQuery();

  const [searchUsers, { isLoading: searchLoading, error: searchError }] =
    useLazySearchUsersQuery();

  const [accessChat, { isLoading: accessLoading, error: accessError }] =
    useAccessChatMutation();

  const handleFetchChats = () => {
    fetchChats().then(({ data, error }) => {
      if (data) {
        console.log(data);
        setChats(data);
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

  const handleAccessChat = async (userId) => {
    console.log("giangdeptrai");
    accessChat({ userId }).then(({ data, error }) => {
      if (data) {
        if (!chats.find((chat) => chat._id === data._id))
          setChats([data, ...chats]);
        setSelectedChat(data);
        setSearch("");
        setIsSearching(false);
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

  useEffect(() => {
    handleFetchChats();
  }, []);

  useEffect(() => {
    console.log(isSearching);
  }, [isSearching]);

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
        display="flex"
        pb={2}
        borderRadius="lg"
        justifyContent="space-between"
      >
        <InputGroup mr={2}>
          <InputLeftElement
            pointerEvents="none"
            children={<Search2Icon color="gray.300" />}
          />
          <Input
            placeholder="Search by name or email"
            // mr={2}
            value={search}
            bg="#F8F8F8"
            onChange={(e) => handleSearch(e.target.value)}
            onClick={() => setIsSearching(true)}
          />
        </InputGroup>
        {isSearching ? (
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            onClick={(e) => {
              setIsSearching(false);
              setSearch("");
              setSearchResult([]);
            }}
          >
            <CloseIcon></CloseIcon>
          </Button>
        ) : (
          <GroupChatModal>
            <Button
              d="flex"
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            >
              <AddIcon></AddIcon>
            </Button>
          </GroupChatModal>
        )}
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
        {isSearching ? (
          <>
            {" "}
            {searchLoading ? (
              <ChatLoading> </ChatLoading>
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAccessChat(user._id)}
                ></UserListItem>
              ))
            )}
            {accessLoading && <Spinner ml="auto" d="flex" />}
          </>
        ) : chats ? (
          <Stack overflowY="auto">
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
                height="45px"
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(user, chat.users)
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
