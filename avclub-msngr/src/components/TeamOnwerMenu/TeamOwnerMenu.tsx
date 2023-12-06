import { Button, Stack } from "@chakra-ui/react";
import { TeamButtonsProps } from "../../types/types";
import { FC } from "react";


export const TeamOwnerMenu: FC<TeamButtonsProps> = ({ handleDelete, handleSearchOpen }) => {
    return (
            <Stack direction="row" spacing={4} justify="center" p={4} borderBottom="1px solid" borderColor="gray.200">
                <Button
                    w={{ base: 'auto', md: '10%' }}
                    fontSize='sm'
                    color={'brand.primary'}
                    variant={'ghost'}
                    _hover={{
                        bg: 'brand.primary',
                        color: 'brand.accent',
                    }}
                    onClick={() => handleSearchOpen()}>
                    Add Member
                </Button>
                <Button
                    w={{ base: 'auto', md: '10%' }}
                    color={'red'}
                    variant={'ghost'}
                    _hover={{
                        bg: 'red',
                        color: 'brand.primary',
                    }}
                    onClick={() => handleDelete()}>Delete Team</Button>
            </Stack>
    )
}