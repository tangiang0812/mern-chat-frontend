import { InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
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
  useLazyFetchMessagesQuery,
  useSendMessageMutation,
} from "../services/appApi";
import ScrollableFeed from "./miscellaneous/ScrollableFeed";
import io from "socket.io-client";

const ENDPOINT = "https://chat-toy.herokuapp.com";
// const ENDPOINT = "http://localhost:4000";

let socket, previousSelectedChat; // previous selectedChat at the moment receiving notification, not the current selectedChat

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
  // const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);

  const toast = useToast();

  const {
    selectedChat,
    showDetail,
    setShowDetail,
    setChats,
    chats,
    // notifications,
    // setNotifications,
    fetchAgain,
    setFetchAgain,
  } = useContext(AppContext);

  const inputField = useRef(null);

  const user = useSelector((state) => state.user);

  const [sendMessage, { isLoading: sendLoading, error: sendErorr }] =
    useSendMessageMutation();

  const [fetchMessages, { isFetching: fetchFetching, error: fetchError }] =
    useLazyFetchMessagesQuery();

  const typingHandler = (msg) => {
    setNewMessage(msg);
  };

  const handleSendMessage = async (event) => {
    if ((event?.key && event.key !== "Enter") || !newMessage) return;
    // if ((event.key && event.key === "Enter") || newMessage) {

    inputField.current.value = "";
    setNewMessage("");

    const payload = {
      content: newMessage,
      chatId: selectedChat._id,
    };

    sendMessage(payload).then(({ data, error }) => {
      if (data) {
        socket.emit("new-message", data);
        // console.log(data);
        // setMessages([...messages, data]);
        dispatch({ type: ACTIONS.ADD_MESSAGE, payload: { newMessage: data } });

        if (selectedChat !== chats[0]) {
          setChats([
            selectedChat,
            ...chats.filter((chat) => chat !== selectedChat),
          ]);
        }

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
    if (!selectedChat) return;
    const payload = {
      chatId: selectedChat._id,
    };
    fetchMessages(payload).then(({ data, error }) => {
      if (data) {
        dispatch({
          type: ACTIONS.FETCH_MESSAGES,
          payload: { messages: data },
        });
        socket.emit("join-chat", selectedChat._id);
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
    previousSelectedChat = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.off("message-received").on("message-received", (receivedMessage) => {
      if (
        !previousSelectedChat ||
        previousSelectedChat._id !== receivedMessage.chat
      ) {
        if (!chats.find((chat) => chat._id === receivedMessage.chat)) {
          setFetchAgain(!fetchAgain);
        }
        // if (!notifications.includes(receivedMessage)) {
        //   setNotifications([receivedMessage, ...notifications]);
        //   // setFetchAgain(!fetchAgain);
        // }
      } else {
        dispatch({
          type: ACTIONS.ADD_MESSAGE,
          payload: { newMessage: receivedMessage },
        });

        // setMessages([...state.messages, receivedMessage]);
      }
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
            {fetchFetching ? (
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
                placeholder="Enter a message.."
                ref={inputField}
                onChange={(e) => typingHandler(e.target.value)}
                disabled={sendLoading}
              />
            </FormControl>
            <Button
              colorScheme="twitter"
              color="white"
              onClick={handleSendMessage}
              isLoading={sendLoading}
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
