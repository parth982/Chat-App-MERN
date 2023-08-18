import {
  FormControl,
  FormLabel,
  VStack,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  const submitHandler = () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    const data = { email, password };

    axios
      .post("http://localhost:5000/api/user/login", data)
      .then((res) => {
        toast({
          title: "Login Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        localStorage.setItem("UserInfo", JSON.stringify(res.data));

        setLoading(false);
        navigate("/chats");
      })
      .catch((err) => {
        toast({
          title: "Error Occured!",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      });
  };

  const HandleSubmit = (e) => {
    e.preventDefault();
    submitHandler();
    e.target.reset();
  };

  return (
    <form onSubmit={HandleSubmit}>
      <VStack spacing={2}>
        <FormControl required>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter your Email.."
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </FormControl>

        <FormControl required>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          width={"100%"}
          marginTop={2}
          colorScheme="teal"
          size="sm"
          type="submit"
        >
          Login
        </Button>

        <Button
          width={"100%"}
          marginTop={2}
          colorScheme="red"
          size="sm"
          onClick={() => {
            setEmail("dummy@gmail.com");
            setPassword("dummy");
          }}
        >
          Get Dummy Creds
        </Button>
      </VStack>
    </form>
  );
};

export default Login;
