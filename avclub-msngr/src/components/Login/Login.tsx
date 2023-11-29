"use client";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { ChangeEvent, MouseEvent, useContext, useState } from "react";
// types
import { Credentials } from "../../types/types";
// services
import { loginUser } from "../../services";

import { UserContext } from "../../context/AuthContext";



const defaultUserLoginData: Credentials = {
  email: "",
  password: "",
};
import { auth } from "../../config/firebase-config";
export const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const [user, setUser] = useState(defaultUserLoginData);
  const context = useContext(UserContext);
  const toast = useToast();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.id]: e.target.value });
  };

  const submit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const loginData = await loginUser(user);
      navigate("/profile");
    } catch (error) {
      switch ((error as FirebaseError).code) {
        case "auth/invalid-login-credentials":
          toast({
            status: "error",
            position: "top",
            title: "Login error:",
            description: "Incorrect email or password",
            isClosable: true,
          });
          break;
        case "auth/invalid-email":
          toast({
            position: "top",
            status: "error",
            title: "Login error:",
            description: "Incorrect email inserted",
            isClosable: true,
          });
          break;
        default:
          toast({
            position: "top",
            status: "error",
            title: "Login error:",
            description: "There was a problem loggin in.",
          });
          break;
      }
      console.log((error as FirebaseError).code);
    }
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
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
                type="email"
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
                type="password"
              />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox>Remember me</Checkbox>
                <Text color={"blue.400"}>Forgot password?</Text>
              </Stack>
              <Button
                onClick={submit}
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};
