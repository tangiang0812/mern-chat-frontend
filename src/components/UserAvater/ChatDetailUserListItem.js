import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { AppContext } from "../../context/appContext";
import ProfileModal from "../miscellaneous/ProfileModal";

function ChatDetailUserListItem({
  handleRemove,
  handleAccessChat,
  selectedUser,
}) {
  const user = useSelector((state) => state.user);

  const { selectedChat } = useContext(AppContext);

  return (
    <Box
      cursor="pointer"
      w="100%"
      display="flex"
      alignItems="center"
      px={3}
      py={2}
      mb={2}
      h="60px"
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={selectedUser.name}
        // src={selectedUser.picture}
      />
      <Box
        display="flex"
        flexDir="column"
        alignItems="flex-start"
        overflow="hidden"
      >
        <Text>{selectedUser.name}</Text>
        {selectedChat.groupAdmin?._id === selectedUser._id && (
          <Text fontSize="xs">Group admin</Text>
        )}
      </Box>
      {selectedUser._id !== user._id && (
        <Box ml="auto">
          <Menu>
            <MenuButton>
              <ChevronDownIcon />
            </MenuButton>
            <MenuList>
              <ProfileModal user={selectedUser}>
                <MenuItem>Profile</MenuItem>
              </ProfileModal>
              {selectedChat?.isGroupChat && (
                <>
                  {selectedChat.groupAdmin?._id === user._id && (
                    <MenuItem onClick={() => handleRemove(selectedUser)}>
                      Remove user
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => handleAccessChat(selectedUser._id)}>
                    Private Message
                  </MenuItem>
                </>
              )}
            </MenuList>
          </Menu>
        </Box>
      )}
    </Box>
  );
}

export default ChatDetailUserListItem;
