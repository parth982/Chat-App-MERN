import { useContext, useEffect, useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { Avatar, Tooltip } from "@chakra-ui/react";
import { UserContext } from "../../Context/UserProvider";

import {
  isSender,
  isLastMesg,
  AdjustMargin,
  isSameUser,
} from "./ChatUserLogic";

const ScrollChat = ({ messages }) => {
  const { user } = useContext(UserContext);
  const [forceScroll, setForceScroll] = useState(true);

  useEffect(() => {
    // Whenever the messages prop changes, enable forceScroll
    setForceScroll(true);
  }, [messages]);

  return (
    <ScrollableFeed forceScroll={forceScroll}>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSender(messages, m, i, user._id) ||
              isLastMesg(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: AdjustMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                color: "brown",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollChat;
