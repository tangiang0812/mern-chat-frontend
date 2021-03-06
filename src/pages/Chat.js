import { Box, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import ChatBox from "../components/ChatBox";
import Sidebar from "../components/Sidebar";
import ChatDetail from "../components/ChatDetail";

function Chat() {
  const user = useSelector((state) => state.user);

  return (
    <div style={{ width: "100%" }}>
      <Box
        display={{ lg: "flex" }}
        justifyContent="space-between"
        w="100%"
        h="92.5vh"
        p="10px"
      >
        {user && <Sidebar />}
        {user && <ChatBox />}
        {user && <ChatDetail />}
        {/* {<Sidebar />}
        {<ChatBox />}
        {<ChatDetail />} */}
      </Box>
      {/* <Box
        h="92.5vh"
        display={{ base: "flex", lg: "none" }}
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="3xl" pb={3}>
          Expand your browser window to be able to chat.
        </Text>
      </Box> */}
    </div>
  );
}

export default Chat;
