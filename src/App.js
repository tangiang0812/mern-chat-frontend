import "./App.css";
import Navigation from "./components/Navigation";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import { useSelector } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  const user = useSelector((state) => state.user);
  return (
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
  );
}

export default App;
