import { io } from "socket.io-client";
import React from "react";

const SOCKET_URL = "http://localhost:4000";

export const AppContext = React.createContext();
