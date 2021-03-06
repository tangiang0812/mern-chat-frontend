import {
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
import React, { useContext, useState } from "react";
import { AppContext } from "../../context/appContext";
import {
  useAccessChatMutation,
  useLazySearchUsersQuery,
} from "../../services/appApi";
import UserListItem from "../UserAvater/UserListItem";

function SearchModal({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const toast = useToast();

  const { chats, setChats, setSelectedChat, setPreviousSelectedChat } =
    useContext(AppContext);

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

  const handleClose = () => {
    setSearchResult([]);
    setSearch("");
    onClose();
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
    accessChat({ userId }).then(({ data, error }) => {
      if (data) {
        // update chat without fetch
        const foundChat = chats.find((chat) => chat._id === data._id);
        if (!foundChat) {
          setChats([data, ...chats]);
          setSelectedChat(data);
          setPreviousSelectedChat(data);
        } else {
          setSelectedChat(foundChat);
          setPreviousSelectedChat(foundChat);
        }

        // update chat with fetchAgain
        // setSelectedChat(data);
        // setFetchAgain(!fetchAgain);

        handleClose();
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

  return (
    <>
      <span onClick={onOpen} style={{ width: "100%" }}>
        {children}
      </span>
      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={handleClose}
        autoFocus={true}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            // fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Search
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl mb={3}>
              <Input
                placeholder="Search Users"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {searchFetching ? (
              // <ChatLoading />
              <Spinner m="auto" display="flex" />
            ) : (
              searchResult
                ?.slice(0, 6)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAccessChat(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            {/* <Button
              colorScheme="blue"
              mr={3}
              isLoading={addLoading}
            >
              Create
            </Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default SearchModal;
