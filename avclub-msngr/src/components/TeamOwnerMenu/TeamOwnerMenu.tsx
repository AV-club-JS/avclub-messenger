import { Button, Stack } from "@chakra-ui/react";
import { TeamButtonsProps } from "../../types/types";
import { FC, useState } from "react";
import { DeleteIcon, CheckIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";


export const TeamOwnerMenu: FC<TeamButtonsProps> = ({ handleDelete, handleSearchOpen }) => {
    const [confirmDelete, setConfirmDelete] = useState(false);

    return (
        <Stack direction="row" spacing={4} justify="center" p={4} borderBottom="1px solid" borderColor="gray.200">
            <Button
                w={{ base: 'auto', md: '15%' }}
                minW="fit-content" maxW="fit-content"
                fontSize='sm'
                color={'brand.primary'}
                variant={'ghost'}
                _hover={{
                    bg: 'brand.primary',
                    color: 'brand.accent',
                }}
                onClick={() => handleSearchOpen()}>
                <AddIcon mr={1} />
                Add User
            </Button>
            {confirmDelete ?
                <>
                    <Button
                        w={{ base: 'auto', md: '15%' }}
                        minW="fit-content" maxW="fit-content"
                        fontSize='sm'
                        color={'green'}
                        variant={'ghost'}
                        _hover={{
                            bg: 'green.400',
                            color: 'brand.primary',
                        }}
                        onClick={() => handleDelete()}><CheckIcon mr={1} />Confirm</Button>
                    <Button
                        w={{ base: 'auto', md: '15%' }}
                        minW="fit-content" maxW="fit-content"
                        fontSize='sm'
                        color={'brand.primary'}
                        variant={'ghost'}
                        _hover={{
                            bg: 'brand.primary',
                            color: 'brand.accent',
                        }}
                        onClick={() => setConfirmDelete(false)}><CloseIcon mr={1} />Cancel</Button>
                </>
                : <Button
                    w={{ base: 'auto', md: '15%' }}
                    minW="fit-content" maxW="fit-content"
                    fontSize='sm'
                    color={'red.500'}
                    variant={'ghost'}
                    _hover={{
                        bg: 'red.400',
                        color: 'brand.primary',
                    }}
                    onClick={() => setConfirmDelete(true)}><DeleteIcon mr={1} />Delete Team</Button>
            }

        </Stack>
    )
}