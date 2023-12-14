import {
  Avatar,
  Box,
  CheckboxProps,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChildrenProps } from "../../types/types";
import { useEffect, useState } from "react";
import { getAvatar } from "../../services/home.services";
import { VELISLAV_AVATAR, ANDREY_AVATAR } from "../../constants/servicesConstants";

const Testimonial = (props: ChildrenProps) => {
  const { children } = props;

  return <Box>{children}</Box>;
};



const TestimonialContent = (props: CheckboxProps) => {
  const { children } = props;

  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      boxShadow={"lg"}
      p={8}
      rounded={"xl"}
      align={"center"}
      pos={"relative"}
      _after={{
        content: `""`,
        w: 0,
        h: 0,
        borderLeft: "solid transparent",
        borderLeftWidth: 16,
        borderRight: "solid transparent",
        borderRightWidth: 16,
        borderTop: "solid",
        borderTopWidth: 16,
        borderTopColor: useColorModeValue("white", "gray.800"),
        pos: "absolute",
        bottom: "-16px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      {children}
    </Stack>
  );
};

const TestimonialText = (props: CheckboxProps) => {
  const { children } = props;

  return (
    <Text
      textAlign={"center"}
      color={useColorModeValue("gray.600", "gray.400")}
      fontSize={"sm"}
    >
      {children}
    </Text>
  );
};

const TestimonialAvatar = ({
  src,
  name,
  title,
}: {
  src: string;
  name: string;
  title: string;
}) => {
  return (
    <Flex align={"center"} mt={8} direction={"column"}>
      <Avatar src={src} mb={2} />
      <Stack spacing={-1} align={"center"}>
        <Text fontWeight={600}>{name}</Text>
        <Text fontSize={"sm"} color={useColorModeValue("gray.600", "gray.400")}>
          {title}
        </Text>
      </Stack>
    </Flex>
  );
};

const WithSpeechBubbles = () => {
  const [avatarOne, setAvatarOne] = useState('');
  const [avatarTwo, setAvatarTwo] = useState('');

  useEffect(() => {
    (async () => {
      const urlOne = await getAvatar(ANDREY_AVATAR);
      const urlTwo = await getAvatar(VELISLAV_AVATAR);
      console.log(`${urlOne}/${urlTwo}`);

      setAvatarOne(urlOne);
      setAvatarTwo(urlTwo);
    })()
  }, [])

  return (
    <Box bg={useColorModeValue("gray.100", "gray.700")}>
      <Container maxW={"7xl"} py={16} as={Stack} spacing={12}>
        <Stack spacing={0} align={"center"}>
          <Heading>Who we are:</Heading>
          <Text>Connecting people is our pasion</Text>
        </Stack>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: 10, md: 4, lg: 10 }}
        >
          <Testimonial>
            <TestimonialContent>
              <TestimonialText>
              We have two ears and one mouth so that we can listen twice as much as we speak.
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={avatarOne}
              name={"Andrey Kunev"}
              title={"Aspiring web developer, JavaScript enjoyer"}
            />
          </Testimonial>
          <Testimonial>
            <TestimonialContent>
              <TestimonialText>
                Employ your time in improving yourself by other men's writings so that you shall come easily by what others have labored hard for.
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={avatarTwo}
              name={"Velislav Karastoychev"}
              title={"Econometrician, JavaScript developer"}
            />
          </Testimonial>
        </Stack>
      </Container>
    </Box>
  );
};

export const Footer = () => {
  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
    >
      <WithSpeechBubbles />
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
      >
        <Text mx='auto' fontWeight={600}>© 2023 AVL club</Text>
      </Container>
    </Box>
  );
};
