import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../services/appApi";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const navigate = useNavigate();

  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const [validated, setValidated] = useState(false);

  const toast = useToast();

  const handleLogin = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    loginUser({ email, password }).then(({ error, data }) => {
      if (data) {
        toast({
          title: "Login Success!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        navigate("/chat");
      } else if (error) {
        toast({
          title: "Error Occured!",
          description: error.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    });
    setValidated(true);
  };

  // function handleLogin(e) {
  //   e.preventDefault();
  // }

  useEffect(() => {
    console.log(email, password);
  }, [email, password]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        bg="white"
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        m="40px 0 15px 0"
      >
        <VStack spacing="5px">
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              placeholder="Enter your email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={show ? "text" : "password"}
                placeholder="Enter password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          {/* <FormControl id="pic">
        <FormLabel>Profile Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetail(e.target.files[0])}
          placeholder="Upload Picture"
        ></Input>
      </FormControl> */}
          <Button
            colorScheme="blue"
            width="100%"
            color="white"
            style={{ marginTop: 25 }}
            onClick={handleLogin}
            isLoading={isLoading}
          >
            Login
          </Button>
        </VStack>
        <div className="mt-3">
          <p className="text-center">
            {" "}
            Don't have an account ? <Link to="/signup">Signup</Link>
          </p>
        </div>
      </Box>
    </Container>
  );
}

export default Login;
