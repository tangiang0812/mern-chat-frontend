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
import { useSignupUserMutation } from "../services/appApi";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const navigate = useNavigate();

  const [signupUser, { isLoading, error }] = useSignupUserMutation();

  const toast = useToast();

  const [validated, setValidated] = useState(false);

  const handleSignup = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    setValidated(true);
    signupUser({ name, email, password }).then(({ data }) => {
      if (data) {
        toast({
          title: "Signup Success!",
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
  };

  // function handleSignup(e) {
  //   e.preventDefault();
  // }

  useEffect(() => {
    console.log(email, password, name);
  }, [email, password, name]);

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
          <FormControl id="first-name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Enter your name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </FormControl>

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
            onClick={handleSignup}
            isLoading={isLoading}
          >
            Signup
          </Button>
          <div className="mt-3">
            <p className="text-center">
              {" "}
              Don't have an account ? <Link to="/login">Login</Link>
            </p>
          </div>
        </VStack>
      </Box>
    </Container>
  );
}

export default Signup;
