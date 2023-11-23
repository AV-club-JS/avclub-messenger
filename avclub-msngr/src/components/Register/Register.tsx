"use strict";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChangeEvent, MouseEvent, useState, useContext } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
// types
import { DefaultUserData, Credentials } from "../../types/types";
// services
import { registerUser } from "../../services";
import { createUser, getUserByUid } from "../../services/users.services";
// context
import { AuthContext } from "../../context/AuthContext";
import { UserCredential } from "firebase/auth";

const defaultUserData: DefaultUserData & Credentials = {
  email: "",
  password: "",
  username: "",
  firstName: "",
  lastName: "",
  phone: "",
};

export const Register = () => {
  const { setAuth, userData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(defaultUserData);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    return setUser({ ...user, [e.target.id]: e.target.value });
  };

  const submit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let credential: null | UserCredential = null;
    try {
      credential = await registerUser(user) as UserCredential;
    } catch (error) {
      console.error(error);
    }

    const uid: string | null = credential?.user.uid || null;

    try {
      await createUser({ ...user, uid: (uid as string) });
    } catch (error) {
      console.error(error);
    }

    if (uid) {

      const req = await getUserByUid(uid);
      const userInfo: DefaultUserData | null = req?.val();
      console.log(userInfo);
      
      if (userInfo !== null) {
        setAuth({
          userData: userInfo
        });
      }

      console.log(userData);
    }

    // navigate("/");
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    onChange={(e) => handleChange(e)}
                    type="text"
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName">
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    onChange={(e) => handleChange(e)}
                    type="text"
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="phone">
              <FormLabel>Phone number</FormLabel>
              <Input
                onChange={(e) => handleChange(e)}
                type="text"
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                onChange={(e) => handleChange(e)}
                type="email"
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  onChange={(e) => handleChange(e)}
                  type={showPassword ? "text" : "password"}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)}
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                onClick={submit}
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user? <Link onClick={() => navigate("/login")} color={"blue.400"}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};
