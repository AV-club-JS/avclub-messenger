import { Button, Stack } from "@chakra-ui/react";
import { TeamButtonsProps } from "../../types/types";
import { FC, useState } from "react";


export const TeamOwnerMenu: FC<TeamButtonsProps> = ({ handleDelete, handleSearchOpen }) => {
    const [confirmDelete, setConfirmDelete] = useState(false);

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
            {confirmDelete ?
                <>
                    <Button
                        w={{ base: 'auto', md: '10%' }}
                        fontSize='sm'
                        color={'red'}
                        variant={'ghost'}
                        _hover={{
                            bg: 'red',
                            color: 'brand.primary',
                        }}
                        onClick={() => handleDelete()}>Confirm</Button>
                    <Button
                        w={{ base: 'auto', md: '10%' }}
                        fontSize='sm'
                        color={'brand.primary'}
                        variant={'ghost'}
                        _hover={{
                            bg: 'brand.primary',
                            color: 'brand.accent',
                        }}
                        onClick={() => setConfirmDelete(false)}>Cancel</Button>
                </>
                : <Button
                    w={{ base: 'auto', md: '10%' }}
                    fontSize='sm'
                    color={'red'}
                    variant={'ghost'}
                    _hover={{
                        bg: 'red',
                        color: 'brand.primary',
                    }}
                    onClick={() => setConfirmDelete(true)}>Delete Team</Button>
            }

        </Stack>
    )
}