export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const showAvatar = (messages, m, i) => {
  return (
    (i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined)) ||
    i === messages.length - 1
  );
};

export const isSameUser = (messages, m, i) => {
  return i < messages.length - 1 && messages[i + 1].sender._id === m.sender._id;
};
