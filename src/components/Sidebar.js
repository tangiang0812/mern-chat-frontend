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

  const { selectedChat, setSelectedChat, chats, setChats, fetchAgain } =
    useContext(AppContext);

  const user = useSelector((state) => state.user);

  const toast = useToast();

  const [
    fetchChats,
    { isFetching: fetchFetching, isLoading: fetchLoading, error: fetchError },
  ] = useLazyFetchChatsQuery();

  const [
    searchUsers,
    {
      isFetching: searchFetching,
      isLoading: searchLoading,
      error: searchError,
    },
  ] = useLazySearchUsersQuery();

  const [accessChat, { isLoading: accessLoading, error: accessError }] =
    useAccessChatMutation();

  const handleFetchChats = () => {
    fetchChats().then(({ data, error }) => {
      if (data) {
        console.log(data);
        setChats(data);
        if (selectedChat) {
          for (let chat of data) {
            if (chat._id === selectedChat._id) {
              setSelectedChat(chat);
            }
          }
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
        if (!chats.find((chat) => chat._id === data._id)) {
          setChats([data, ...chats]);
          setSelectedChat(data);
        } else {
          setSelectedChat(chats.find((chat) => chat._id === data._id));
        }
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
  }, [fetchAgain]);

  useEffect(() => {
    console.log(isSearching);
  }, [isSearching]);

  return (
    <Box
      // display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      display="flex"
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      // w={{ base: "100%", md: "31%" }}
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
        <InputGroup mr={3}>
          <InputLeftElement
            pointerEvents="none"
            children={<Search2Icon color="gray.300" />}
          />
          <Input
            placeholder="Search by name or email"
            // mr={2}
            bg="#F8F8F8"
            onChange={(e) => handleSearch(e.target.value)}
            onClick={() => setIsSearching(true)}
          />
        </InputGroup>
        {isSearching ? (
          <Button
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
            <Button fontSize={{ base: "17px", md: "10px", lg: "17px" }}>
              <AddIcon></AddIcon>
            </Button>
          </GroupChatModal>
        )}
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
        {isSearching ? (
          <>
            {searchFetching ? (
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
            {accessLoading && <Spinner m="auto" display="flex" />}
          </>
        ) : !fetchLoading ? (
          <Stack>
            {chats.map((chat) => (
              <Box
                onClick={() => {
                  setSelectedChat(chat);
                }}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
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
                  size="sm"
                  cursor="pointer"
                  name={chat.chatName}
                  src={chat.users[0].picture}
                />
                <Text>
                  {!chat.isGroupChat
                    ? getSender(user, chat.users).name
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
          <ChatLoading />
          // <></>
        )}
      </Box>
    </Box>
  );
}

export default Sidebar;
