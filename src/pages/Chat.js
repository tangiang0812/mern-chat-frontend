import { Box } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import MessageForm from "../components/MessageForm";
import Sidebar from "../components/Sidebar";

function Chat() {
  const user = useSelector((state) => state.user);
  console.log(user);

  return (
    <div style={{ width: "100%" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <Sidebar />}
        {/* {user && <MessageForm />} */}
      </Box>
    </div>
  );
}

export default Chat;
