import { Box } from "@chakra-ui/react";
import { UserContext } from "../../context/AuthContext";
import { useContext } from "react";
import { removeReactionFromChat } from "../../services";
import { DefaultUserData } from "../../types/types";
export const DisplayReactions = ({ reactions, chatId, messageId }: {
  chatId: string;
  messageId: string;
  reactions: {
    [reaction: string]: {
      [uid: string]: number;
    };
  };
}): JSX.Element => {
  const { user, userData } = useContext(UserContext);
  let reaction: string;
  const reactionsList = [];
  for (reaction in reactions) {
    reactionsList.push([reaction, Object.keys(reactions[reaction]).length]);
  }
  const handleRemoveReaction = async (reaction: [string, {[uid: string]: number}]) => {
    const result = await removeReactionFromChat(
      reaction[0],
      chatId,
      messageId,
      (userData as DefaultUserData).uid,
    );
    if (result.error) console.log(result.error);
  };
  return (
    <Box
      display={"flex"}
      flexDir={"row"}
    >
      {reactionsList.map((reactionInfo) => {
        return (
          <Box
            key={crypto.randomUUID()}
            mx={3}
            display={"flex"}
            flexDir="row"
            onClick={() => handleRemoveReaction(reactionInfo)}
          >
            <Box mr={1}>{reactionInfo[0]}</Box>
            <Box>{reactionInfo[1]}</Box>
          </Box>
        );
      })}
    </Box>
  );
};
