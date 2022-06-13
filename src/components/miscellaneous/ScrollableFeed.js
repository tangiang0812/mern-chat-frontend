import { Avatar, Box } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { isSameUser, showAvatar } from "../../config/ChatLogics";

const ScrollableFeed = ({ messages }) => {
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "auto",
      block: "end",
      inline: "nearest",
    });
  };
  useEffect(scrollToBottom, [messages]);

  const user = useSelector((state) => state.user);

  return (
    <>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {m.sender._id === user._id ? (
              <>
                <span
                  style={{
                    marginLeft: "auto",
                    backgroundColor: "#638bfa",
                    marginBottom: isSameUser(messages, m, i) ? 3 : 10,
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                    color: "white",
                  }}
                >
                  {m.content}
                </span>
                {showAvatar(messages, m, i) ? (
                  <Avatar
                    mt="1px"
                    ml="4px"
                    size="sm"
                    name={m.sender.name}
                    // src={m.sender.picture}
                  />
                ) : (
                  <Box w="36px" mr="0px" />
                )}
              </>
            ) : (
              <>
                {showAvatar(messages, m, i) ? (
                  <Avatar
                    mt="1px"
                    mr="4px"
                    size="sm"
                    name={m.sender.name}
                    // src={m.sender.picture}
                  />
                ) : (
                  <Box w="36px" />
                )}
                <span
                  style={{
                    backgroundColor: "#f1f3f4",
                    color: "black",
                    marginBottom: isSameUser(messages, m, i) ? 3 : 10,
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                  }}
                >
                  {m.content}
                </span>
              </>
            )}
          </div>
        ))}
      <div
        style={{ marginfloat: "left", clear: "both" }}
        ref={messagesEndRef}
      ></div>
    </>
  );
};

export default ScrollableFeed;
