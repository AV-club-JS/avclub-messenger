import { ChatsCollection } from "../../types/types";
import { Stack, Link, Box } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { FC } from "react";

export const ChannelList: FC<{ channelArr: ChatsCollection }> = ({ channelArr }) => {
    return (
        <Stack direction='column' mt={2}>
            {channelArr.map(channel => (
            <Box borderBottom='1px solid' borderColor='gray.100' key={channel.chatId}>
                <Link as={NavLink} key={channel.chatId}
                    fontSize={20}
                    fontWeight={600}
                    _hover={{
                        color: 'brand.accent',
                    }}
                >{channel.name}</Link>
            </Box>
            ))}
        </Stack>
    );
};