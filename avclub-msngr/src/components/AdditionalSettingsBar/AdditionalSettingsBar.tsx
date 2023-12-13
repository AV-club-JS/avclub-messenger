import { Button, ButtonGroup, Flex, useDisclosure } from "@chakra-ui/react";
import { ChatBar } from "../ChatBar";
import { ChatInfo, DefaultUserData } from "../../types/types";
import { Dispatch, SetStateAction, useContext } from "react";
import { UserContext } from "../../context/AuthContext";
import { FaPhoneVolume } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { IoPersonAdd } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { NavSearchModal } from "../Navbar/NavSearchModal";
import { DeleteIcon } from "@chakra-ui/icons";
import { deleteChannel } from "../../services";
export const AdditionalSettingsBar = ({
  name,
  participants,
  chatId,
  roomId,
}: {
  name: string;
  participants: DefaultUserData[];
  chatId: string;
  roomId: string;
}) => {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);
  const { isOpen: isSearchOpen, onOpen: onSearchOpen, onClose: onSearchClose } =
    useDisclosure();
  participants = participants.filter((participant) =>
    participant.uid !== userData?.uid
  );

  const handleSearchNavbar = () => onSearchOpen();
  const handleDeleteChat = async () => {
    // if the user is the owner of the chat delete it!
    navigate('/chats')
    const req = await deleteChannel(chatId);
    if (!req.success) console.log(req.error);
    
  };
  return (
    <Flex
      px={4}
      alignItems={"center"}
    >
      <NavSearchModal
        isOpen={isSearchOpen}
        onClose={onSearchClose}
        chatId={chatId}
      />
      <ChatBar name={name} participants={participants} />
      <ButtonGroup>
        <Button as={Link} to={`/meeting/${roomId}`}>
          <FaVideo />
        </Button>
        <Button>
          <DeleteIcon onClick={handleDeleteChat} />
        </Button>
        <Button
          onClick={handleSearchNavbar}
        >
          <IoPersonAdd />
        </Button>
      </ButtonGroup>
    </Flex>
  );
};
