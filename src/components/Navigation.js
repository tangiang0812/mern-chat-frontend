import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import download from "../assets/download.png";
import { useLogoutUserMutation } from "../services/appApi";
import { Link } from "react-router-dom";
import ProfileModal from "./miscellaneous/ProfileModal";
import { AppContext } from "../context/appContext";

function Navigation() {
  const user = useSelector((state) => state.user);
  const { setSelectedChat, setChats } = useContext(AppContext);
  // const { setSelectedChat, setChats, notifications, setNotifications } =
  //   useContext(AppContext);
  const [logoutUser, { isLoading, error }] = useLogoutUserMutation();

  const handleLogout = async (event) => {
    event.preventDefault();
    await logoutUser();
    setSelectedChat();
    setChats();
    window.location.replace("/"); // important line :D
  };
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      w="100%"
      p="5px 10px 5px 10px"
      borderWidth="5px"
    >
      <Link to="/">
        {/* <Text
          fontSize="2xl"
          // fontFamily="Work sans"
        >
          IMess
        </Text> */}
        <img src={download} width="40" alt="Logo"></img>
      </Link>
      {!user && (
        <div>
          <Link to="/login">
            <Button m={1}>Login</Button>
          </Link>
          <Link to="/signup">
            <Button m={1}>Signup</Button>
          </Link>
        </div>
      )}

      {user && (
        <div>
          {/* <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1}></BellIcon>
            </MenuButton>
            <MenuList>
              {!notifications.length && <MenuItem>No new messages</MenuItem>}
              {notifications.map((notification) => (
                <MenuItem key={notification.id}></MenuItem>
              ))}
            </MenuList>
          </Menu> */}
          <Menu>
            <MenuButton
              m={1}
              as={Button}
              rightIcon={<ChevronDownIcon></ChevronDownIcon>}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.picture}
              ></Avatar>
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              {/* <MenuDivider></MenuDivider> */}
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      )}
    </Box>
  );
}

export default Navigation;
