'use client'
import { useNavigate} from 'react-router-dom';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { ChangeEvent, MouseEvent, useState } from 'react';
// types
import { Credentials } from '../../types/types';
// services 
import { loginUser } from '../../services';

const defaultUserLoginData: Credentials = {
  email: '',
  password: ''
};
export const Login = ():JSX.Element => {
  const navigate = useNavigate();
  const [user, setUser] = useState(defaultUserLoginData);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({...user, [e.target.id]: e.target.value})
  }

  const submit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    loginUser(user);
    console.log('YES!');
    
    navigate('/');
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
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
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox>Remember me</Checkbox>
                <Text color={'blue.400'}>Forgot password?</Text>
              </Stack>
              <Button
               onClick={submit}
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}>
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}
