import React from "react";
import { Box, Button } from "@chakra-ui/react";
import "./Home.css";
import download2 from "../assets/download2.png";
import { Link } from "react-router-dom";

function Home() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="85vh"
    >
      <Box display="flex" m="auto" flexDir="column" alignItems="center">
        <img src={download2} />
        <Link to="/chat">
          <Button mt={3}>
            Get Started
            <i className="fas fa-comments home-message-icon"></i>
          </Button>
        </Link>
      </Box>
      {/* <img
        // height="100%"
        src="https://images.unsplash.com/photo-1532634745-d438fed1a87e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      /> */}
    </Box>
  );
}

export default Home;
