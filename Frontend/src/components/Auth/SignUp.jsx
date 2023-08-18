import {
  FormControl,
  FormLabel,
  VStack,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

const SignUp = () => {
  const toast = useToast();

  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [Loading, setLoading] = useState(false);

  const submitHandler = () => {
    setLoading(true);
    if (!name || !email || !password) {
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

    const data = { name, email, password, pic };

    axios
      .post("http://localhost:5000/api/user/register", data)
      .then((res) => {
        toast({
          title: "Registration Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        localStorage.setItem("UserInfo", JSON.stringify(res.data));
        setLoading(false);
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
    <div>
      <form onSubmit={HandleSubmit}>
        <VStack spacing={2}>
          <FormControl required>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Enter your Name.."
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>

          <FormControl required>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter your Email.."
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl required>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={show ? "text" : "password"}
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Upload Profile Pic</FormLabel>
            <Input
              onChange={(e) => setPic(e.target.value)}
              placeholder="Upload URL of Image"
            />
          </FormControl>

          <Button
            width={"100%"}
            marginTop={2}
            colorScheme="teal"
            size="sm"
            type="submit"
            isLoading={Loading}
          >
            Sign Up
          </Button>
        </VStack>
      </form>
    </div>
  );
};

export default SignUp;
