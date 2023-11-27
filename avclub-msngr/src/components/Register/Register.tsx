import { FirebaseError } from "firebase/app";
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
  useToast,
} from "@chakra-ui/react";
import { ChangeEvent, MouseEvent, useContext, useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
// types
import { Credentials, DefaultUserData } from "../../types/types";
// services
import { registerUser } from "../../services";
import { createUser, getUserByUid } from "../../services/users.services";
// context
import { UserContext } from "../../context/AuthContext";
import { UserCredential } from "firebase/auth";
import { isValidUserData } from "../../utils/isValidUserData";
const defaultUserData: DefaultUserData & Credentials = {
  email: "",
  password: "",
  username: "",
  firstName: "",
  lastName: "",
  phone: "",
};

export const Register = () => {
  const { setAuth } = useContext(UserContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(defaultUserData);
  const [validation, setValidation] = useState({
    error: true,
    message: "",
    field: "",
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    return setUser({ ...user, [e.target.id]: e.target.value });
  };

  const resetValidationError = () => {
    setValidation({ ...validation, message: "", field: "" });
  };

  const handleValidationErrorField = (field: string): {} | undefined => {
    return validation.field === field ? { borderColor: "red" } : undefined;
  };
  const submit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setValidation(isValidUserData(user));
    if (!validation.error) {
      try {
        const credential = await registerUser(user) as UserCredential;
        const uid = credential.user.uid;
        await createUser({ ...user, uid });
        const req = await getUserByUid(uid);
        const userInfo: DefaultUserData = req?.val();
        setAuth({
          user: credential!.user,
          userData: userInfo,
        });
        navigate("/");
      } catch (error) {
        console.log((error as FirebaseError).code);
        const code: string = (error as FirebaseError).code;
        switch (code) {
          case "auth/email-already-exists":
            setValidation({
              ...validation,
              field: "email",
              message: "The imail aready exists",
            });
            break;
          case "auth/invalid-email":
            setValidation({
              ...validation,
              field: "email",
              message: "Invalid email inserted",
            });
            break;
          case "auth/email-already-in-use":
            setValidation({
              ...validation,
              field: "email",
              message: "This email is already in use",
            });
            break;
          default:
            return setValidation({
              ...validation,
              message: "Incorrect data",
              field: "email",
            });
        }
      }
    } 
    return;
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
                    onClick={resetValidationError}
                    sx={handleValidationErrorField("firstName")}
                    onChange={(e) => handleChange(e)}
                    type="text"
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName" isRequired>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    onClick={resetValidationError}
                    sx={handleValidationErrorField("lastName")}
                    onChange={(e) => handleChange(e)}
                    type="text"
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="username" isRequired>
              <FormLabel>Usernamer</FormLabel>
              <Input
                sx={handleValidationErrorField("username")}
                onClick={resetValidationError}
                onChange={(e) => handleChange(e)}
                type="text"
              />
            </FormControl>

            <FormControl id="phone" isRequired>
              <FormLabel>Phone number</FormLabel>
              <Input
                sx={handleValidationErrorField("phone")}
                onClick={resetValidationError}
                onChange={(e) => handleChange(e)}
                type="text"
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                sx={handleValidationErrorField("email")}
                onClick={resetValidationError}
                onChange={(e) => handleChange(e)}
                type="email"
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  sx={handleValidationErrorField("password")}
                  onClick={resetValidationError}
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
              <Box color={"red"}>{validation.message}</Box>
              <Text align={"center"}>
                Already a user?{" "}
                <Link onClick={() => navigate("/login")} color={"blue.400"}>
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};
