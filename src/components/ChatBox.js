import {
  ArrowBackIcon,
  InfoIcon,
  InfoOutlineIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSender } from "../config/ChatLogics";
import { AppContext } from "../context/appContext";
import {
  useLazyFetchMessagesQuery,
  useSendMessageMutation,
} from "../services/appApi";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupModal";

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();

  const toast = useToast();

  const { selectedChat, setSelectedChat, showDetail, setShowDetail } =
    useContext(AppContext);

  const user = useSelector((state) => state.user);

  const [sendMessage, { isLoading: sendLoading, error: sendErorr }] =
    useSendMessageMutation();

  const [fetchMessages, { isFetching: fetchFetching, error: fetchError }] =
    useLazyFetchMessagesQuery();

  const typingHandler = (msg) => {
    setNewMessage(msg);
  };

  const handleSendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      const payload = {
        content: newMessage,
        chatId: selectedChat._id,
      };
      event.target.value = "";
      console.log(messages);
      setNewMessage("");
      sendMessage(payload).then(({ data, error }) => {
        if (data) {
          setMessages([...messages, data]);
        } else if (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      });
    }
  };

  const handleFetchMessages = async () => {
    if (!selectedChat) return;
    const payload = {
      chatId: selectedChat._id,
    };
    fetchMessages(payload).then(({ data, error }) => {
      if (data) {
        setMessages(data);
        // socket.emit("join chat", selectedChat._id);
      } else if (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Messages",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    });
  };

  useEffect(() => {
    handleFetchMessages();
  }, [selectedChat]);

  return (
    <Box
      // display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      display="flex"
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      // w={{ base: "100%", md: "31%" }}
      w={{ base: showDetail ? "58%" : " 79%" }}
      borderRadius="lg"
      borderWidth="1px"
      overflowY="hidden"
    >
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users).name}
                  {/* <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  /> */}
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  {/* <Button
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  /> */}
                </>
              ))}
            <Button
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
              onClick={(e) => {
                setShowDetail(!showDetail);
              }}
            >
              <InfoOutlineIcon></InfoOutlineIcon>
            </Button>
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {!fetchFetching ? (
              <Spinner m="auto" alignSelf="center"></Spinner>
            ) : (
              <></>
            )}
            <FormControl
              onKeyDown={handleSendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {false ? (
                <></>
              ) : (
                // <div>
                //   <Lottie
                //     options={defaultOptions}
                //     // height={50}
                //     width={70}
                //     style={{ marginBottom: 15, marginLeft: 0 }}
                //   />
                // </div>
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                // value={newMessage}
                onChange={(e) => typingHandler(e.target.value)}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3}>
            Take the red pill ...and I'll show you how deep the rabbit-hole
            goes.
          </Text>
        </Box>
      )}
    </Box>
  );
}

export default ChatBox;
