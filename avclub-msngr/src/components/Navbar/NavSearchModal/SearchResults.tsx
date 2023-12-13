import { DefaultUserData, SearchResultsProps } from "../../../types/types";
import {
  Avatar,
  AvatarBadge,
  Divider,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { UserContext } from "../../../context/AuthContext";
import { useContext } from "react";
import { getStatusBadgeColor } from "../../../utils/profileUtils";
import { addChatParticipants, addRoomID, createChat, dyteRoomCreate } from "../../../services";

export const SearchResults = (
  { users, onClose, chatId }: SearchResultsProps,
) => {
  const { userData } = useContext(UserContext);

  const updateChatInstance = async (user: DefaultUserData, chatId?: string) => {
    try {
      if (!chatId) {
        const reqInfo = await createChat({
          name: user.username,
          uid: (userData as DefaultUserData).uid,
          personal: false,
          participants: [(userData as DefaultUserData).uid, user.uid],
          type: "chat",
        });
        const chatIdentifier = reqInfo.chatId;

        const res = await dyteRoomCreate(reqInfo.chatId!);
        const dyteData = await res.json();

        addRoomID(chatIdentifier!, dyteData.data.id);
      } else {
        const req = await addChatParticipants({chatId, participants: [user.uid]});
        if (!req.success) console.error(req.error);
      }
    } catch (error) {
      console.error(error);
    }

    onClose();
  };

  if (users.length > 0) {
    return (
      <VStack alignItems={"flex-start"} mt={3}>
        {users.length &&
          users.map((user) => (
            <HStack key={user.uid} p={1} w="100%" h="10vh">
              <HStack
                w="100%"
                h="100%"
                _hover={{ backgroundColor: "rgb(160, 160, 220)" }}
                onClick={() => updateChatInstance(user, chatId)}
              >
                <Avatar size="md" src={user.avatarUrl} mr={2}>
                  <AvatarBadge
                    boxSize="1em"
                    bg={getStatusBadgeColor(user.status)}
                  />
                </Avatar>
                <VStack>
                  <Text fontSize={"sm"}>{user.username}</Text>
                  <Divider />
                  <Text fontSize={"sm"}>{user.email}</Text>
                  <Divider />
                </VStack>
              </HStack>
            </HStack>
          ))}
      </VStack>
    );
  }
};
