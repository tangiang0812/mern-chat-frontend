import "./App.css";
import Navigation from "./components/Navigation";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import { useSelector } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";
import { AppContext } from "./context/appContext";
import { useState } from "react";

function App() {
  const user = useSelector((state) => state.user);
  const [selectedChat, setSelectedChat] = useState();
  const [previousSelectedChat, setPreviousSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);
  // const [notification, setNotification] = useState([]);

  return (
    <AppContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        showDetail,
        setShowDetail,
        fetchAgain,
        setFetchAgain,
        previousSelectedChat,
        setPreviousSelectedChat,
        // notifications,
        // setNotifications,
      }}
    >
      <BrowserRouter>
        <ChakraProvider>
          <Navigation></Navigation>
          <Routes>
            <Route path="/" element={<Home />} />
            {!user && (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </>
            )}
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </ChakraProvider>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
