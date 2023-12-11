"use strict";
import { Button, ButtonGroup, Flex } from "@chakra-ui/react";
import { ChatBar } from "../ChatBar";
import { DefaultUserData } from "../../types/types";
import { useContext } from "react";
import { UserContext } from "../../context/AuthContext";
import { FaPhoneVolume } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { IoPersonAdd } from "react-icons/io5";
import { Link } from "react-router-dom";

export const AdditionalSettingsBar = ({
  name,
  participants,
  roomId
}: {
  name: string;
  participants: DefaultUserData[];
  roomId: string
}) => {
  const { userData } = useContext(UserContext);

  participants = participants.filter((participant) =>
    participant.uid !== userData?.uid
  );

  return (
    <Flex
      px={4}
      alignItems={"center"}
    >
      <ChatBar name={name} participants={participants} />
      <ButtonGroup>
        <Button as={Link} to={`/${roomId}`} >
          <FaVideo />
        </Button>
        <Button>
          <FaPhoneVolume />
        </Button>
        <Button>
          <IoPersonAdd />
        </Button>
      </ButtonGroup>
    </Flex>
  );
};
