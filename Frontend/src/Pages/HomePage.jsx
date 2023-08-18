import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
} from "@chakra-ui/react";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("UserInfo"));
    if (userInfo) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <div>
      <Container>
        <Box
          display="flex"
          justifyContent={"center"}
          marginTop={"10vh"}
          border={"2px"}
          borderRadius={15}
          marginBottom={3}
        >
          <Text fontFamily={"mono"} fontSize={"5xl"}>
            WittyWhisper
          </Text>
        </Box>

        <Box border={"2px"} borderRadius={15} padding={4}>
          <Tabs variant="soft-rounded">
            <TabList>
              <Tab width="50%">Login</Tab>
              <Tab width="50%">Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <SignUp />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </div>
  );
};

export default HomePage;
