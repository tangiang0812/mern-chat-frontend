import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React from "react";
import { useSelector } from "react-redux";
import download from "../assets/download.png";
import { useLogoutUserMutation } from "../services/appApi";
import { Link } from "react-router-dom";

function Navigation() {
  const user = useSelector((state) => state.user);
  const [logoutUser, { isLoading, error }] = useLogoutUserMutation();

  const handleLogout = async (event) => {
    event.preventDefault();
    await logoutUser();
    window.location.replace("/");
  };
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flex
      bg="white"
      w="100%"
      p="5px 10px 5px 10px"
      borderWidth="5px"
    >
      <Link to="/">
        <Text
          fontSize="2xl"
          // fontFamily="Work sans"
        >
          IMess
        </Text>
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
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1}></BellIcon>
            </MenuButton>
            {/* <MenuList> </MenuList> */}
          </Menu>
          <Menu>
            <MenuButton
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
              {/* <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal> */}
              <MenuDivider></MenuDivider>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      )}
    </Box>
    // <Navbar bg="light" expand="lg">
    //   <Container>
    //     <LinkContainer to="/">
    //       <Navbar.Brand>
    //         <img
    //           src={download}
    //           alt="App Logo"
    //           style={{ width: 50, height: 50 }}
    //         />
    //       </Navbar.Brand>
    //     </LinkContainer>
    //     <Navbar.Toggle aria-controls="basic-navbar-nav" />
    //     <Navbar.Collapse id="basic-navbar-nav">
    //       <Nav className="ms-auto">
    //         {!user && (
    //           <LinkContainer to="/login">
    //             <Nav.Link>Login</Nav.Link>
    //           </LinkContainer>
    //         )}
    //         <LinkContainer to="/chat">
    //           <Nav.Link>Chat</Nav.Link>
    //         </LinkContainer>
    //         {user && (
    //           <NavDropdown
    //             title={
    //               <>
    //                 <img
    //                   src={user.picture}
    //                   alt={user.name}
    //                   style={{
    //                     width: 30,
    //                     height: 30,
    //                     marginRight: 10,
    //                     objectFit: "cover",
    //                     borderRadius: "50%",
    //                   }}
    //                 />
    //                 {user.name}
    //               </>
    //             }
    //             id="basic-nav-dropdown"
    //           >
    //             <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
    //             <NavDropdown.Item href="#action/3.2">
    //               Another action
    //             </NavDropdown.Item>
    //             <NavDropdown.Item href="#action/3.3">
    //               Something
    //             </NavDropdown.Item>
    //             <NavDropdown.Divider />
    //             <NavDropdown.Item>
    //               <Button variant="danger" onClick={handleLogout}>
    //                 Logout
    //               </Button>
    //             </NavDropdown.Item>
    //           </NavDropdown>
    //         )}
    //       </Nav>
    //     </Navbar.Collapse>
    //   </Container>
    // </Navbar>
  );
}

export default Navigation;
