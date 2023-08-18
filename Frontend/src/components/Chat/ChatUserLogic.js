const getSenderName = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

const getSenderInfo = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};

// If Message is Send by another sender not logged in user and after this message there is message sent by another user not same.
const isSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

// If Message is Send by another sender not logged in user and it is the last Message of messages Array.
const isLastMesg = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

const AdjustMargin = (messages, m, i, userId) => {
  // Sent from Sender and not logged in User,But it is Not Last Message without Avatar:
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  // Sent from Sender and not logged in User,But it is Last Message with Avatar:
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  // Sent from Logged in User
  else return "auto";
};

// True if Curr Messg & Previous Messg are Sent by Same user.
const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export {
  getSenderInfo,
  getSenderName,
  isSender,
  isLastMesg,
  AdjustMargin,
  isSameUser,
};
