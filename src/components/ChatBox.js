import { InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import Picker from "emoji-picker-react";
import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { getSender } from "../config/ChatLogics";
import { AppContext } from "../context/appContext";
import {
  useLazyFetchChatsQuery,
  useLazyFetchMessagesQuery,
  useSendMessageMutation,
  useUpdateNotificationsMutation,
} from "../services/appApi";
import ScrollableFeed from "./miscellaneous/ScrollableFeed";
import io from "socket.io-client";

// const ENDPOINT = "https://chat-toy.herokuapp.com";
const ENDPOINT = "http://localhost:4000";

let socket;
// previousSelectedChat; // previous selectedChat at the moment receiving notification, not the current selectedChat

const ACTIONS = {
  FETCH_MESSAGES: "fetch-messages",
  ADD_MESSAGE: "add-message",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.FETCH_MESSAGES:
      return { messages: action.payload.messages };
    case ACTIONS.ADD_MESSAGE:
      return { messages: [...state.messages, action.payload.newMessage] };
  }
}

function ChatBox() {
  const [state, dispatch] = useReducer(reducer, { messages: [] });
  const [socketConnected, setSocketConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const {
    selectedChat,
    showDetail,
    setShowDetail,
    setChats,
    chats,
    notifications,
    setNotifications,
    previousSelectedChat,
    setSelectedChat,
  } = useContext(AppContext);

  const inputField = useRef(null);

  const user = useSelector((state) => state.user);

  const [sendMessage] = useSendMessageMutation();

  const [fetchMessages] = useLazyFetchMessagesQuery();

  const [fetchChats] = useLazyFetchChatsQuery();

  const [updateNotifications] = useUpdateNotificationsMutation();

  const typingHandler = (msg) => {};

  const onEmojiClick = (event, emojiObject) => {
    inputField.current.value += emojiObject.emoji;
  };

  const handleSendMessage = async (event) => {
    if ((event?.key && event.key !== "Enter") || !inputField.current.value)
      return;

    const payload = {
      content: inputField.current.value,
      chatId: selectedChat._id,
    };

    inputField.current.value = "";

    sendMessage(payload).then(({ data, error }) => {
      if (data) {
        dispatch({ type: ACTIONS.ADD_MESSAGE, payload: { newMessage: data } });
        setChats((previousChatState) => {
          const newChatState = previousChatState.map((chat) => {
            let newChat = chat;
            if (chat._id === data.chat._id) {
              newChat = { ...chat, latestMessage: data };
            }
            return newChat;
          });

          const newSelectedChat = newChatState.find(
            (chat) => chat._id === selectedChat._id
          );

          setSelectedChat(newSelectedChat);
          if (selectedChat._id !== newChatState[0]._id) {
            return [
              newSelectedChat,
              ...newChatState.filter((chat) => chat._id !== selectedChat._id),
            ];
          }
          return newChatState;
        });
        socket.emit("new-message", data);

        inputField.current.focus();
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
    // }
  };

  const handleFetchMessages = async () => {
    if (
      !selectedChat ||
      (previousSelectedChat._id === selectedChat._id &&
        previousSelectedChat !== selectedChat)
    )
      return;

    setLoading(true);
    fetchMessages(selectedChat._id).then(({ data, error }) => {
      if (data) {
        dispatch({
          type: ACTIONS.FETCH_MESSAGES,
          payload: { messages: data },
        });
        // socket.emit("join-chat", selectedChat._id);
        setLoading(false);
      } else if (error) {
        setLoading(false);

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

  const handleFetchChats = async (chatId) => {
    fetchChats(chatId).then(({ data, error }) => {
      if (data) {
        setChats((previousChatState) => [data[0], ...previousChatState]);
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
    socket = io(ENDPOINT, {
      auth: {
        token: user.token,
      },
    });
    socket.emit("setup");
    // console.log(user);
    // socket.on("connected", () => setSocketConnected(true));
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    handleFetchMessages();
  }, [selectedChat]);

  useEffect(() => {
    socket
      .off("message-received")
      .on("message-received", async (receivedMessage) => {
        if (
          !previousSelectedChat ||
          previousSelectedChat._id !== receivedMessage.chat._id
        ) {
          if (!chats.find((chat) => chat._id === receivedMessage.chat._id)) {
            return handleFetchChats(receivedMessage.chat._id);
          }
          setNotifications((preNotifState) => [
            receivedMessage,
            ...preNotifState.filter(
              (notif) => receivedMessage.chat._id !== notif.chat._id
            ),
          ]);
          console.log(receivedMessage);
          updateNotifications({ receivedMessage }).then(({ data, error }) => {
            if (data) {
              console.log(data);
            } else if (error) {
              console.log(error.data.message);
            }
          });
        } else {
          dispatch({
            type: ACTIONS.ADD_MESSAGE,
            payload: { newMessage: receivedMessage },
          });
        }
        setChats((previousChatState) => {
          const newChatState = previousChatState.map((chat) => {
            let newChat = chat;
            if (chat._id === receivedMessage.chat._id) {
              newChat = { ...chat, latestMessage: receivedMessage };
              if (selectedChat && newChat._id === selectedChat._id) {
                setSelectedChat(newChat);
              }
            }

            return newChat;
          });
          return newChatState;
        });
      });
  });

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
          <Box
            w="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              mb={3}
              px={2}
              w="100%"
            >
              {state.messages &&
                (!selectedChat.isGroupChat ? (
                  <>{getSender(user, selectedChat.users).name}</>
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
            </Text>
            <Button
              mb={3}
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
              onClick={(e) => {
                setShowDetail(!showDetail);
              }}
            >
              <InfoOutlineIcon></InfoOutlineIcon>
            </Button>
          </Box>
          <Box
            display="flex"
            flexDir="column"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="scroll"
          >
            {loading ? (
              <Spinner m="auto" alignSelf="center"></Spinner>
            ) : (
              <ScrollableFeed messages={state.messages} />
            )}
          </Box>
          <Box
            width="100%"
            display="flex"
            borderRadius="lg"
            justifyContent="space-between"
            alignItems="center"
          >
            <FormControl onKeyDown={handleSendMessage} isRequired mt={3}>
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
                placeholder="Enter a message.."
                ref={inputField}
              />
            </FormControl>
            <Popover
              offset={[-70, 10]}
              onClose={(e) => {
                inputField.current.focus();
                inputField.current.setSelectionRange(
                  inputField.current.value.length - 1,
                  inputField.current.value.length - 1
                );
              }}
            >
              <PopoverTrigger>
                <Button mt={3} ml={3} colorScheme="twitter">
                  <i className="fa-solid fa-face-smile"></i>
                </Button>
              </PopoverTrigger>
              <Portal>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody>
                    <Picker
                      native
                      disableSearchBar
                      onEmojiClick={onEmojiClick}
                      pickerStyle={{ width: "100%" }}
                    />
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
            <Button
              colorScheme="twitter"
              color="white"
              onClick={handleSendMessage}
              // isLoading={sendLoading}
              mt={3}
              ml={3}
            >
              <i className="fa-solid fa-paper-plane"></i>
            </Button>
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
