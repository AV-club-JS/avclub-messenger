import {
    Button,
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay
} from "@chakra-ui/react";
import { Search2Icon } from '@chakra-ui/icons';
import { useState, ChangeEvent, useEffect } from "react";
import { getUsersNotInTeam, getUsersByTeam } from "../../services";
import { DefaultUserData } from "../../types/types";
import { SearchResults } from './SearchResults';

export const AddMemberModal = ({ isOpen, onClose, teamId, channelAdd = false, channelId }:
    { isOpen: boolean, onClose: () => void, teamId: string, channelAdd?: boolean, channelId?: string }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<DefaultUserData[]>([]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    }

    const handleSearch = async () => {
        try {
            if (channelAdd) {
                const users = await getUsersByTeam(teamId) as DefaultUserData[];
                setResults(users);
            } else {
                const users = await getUsersNotInTeam(query, teamId) as DefaultUserData[];
                setResults(users);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleClose = () => {
        setResults([]);
        onClose();
    }

    useEffect(() => {
        if (channelAdd) {
            handleSearch();
        }
    },[results])

    return (
        <>
            <Modal isOpen={isOpen} onClose={handleClose} size={'lg'}
                motionPreset='slideInBottom'
                scrollBehavior='inside'>
                <ModalOverlay />
                <ModalContent>
                    {!channelAdd &&
                        <>
                            <ModalHeader>Search</ModalHeader>
                            <Flex display={{ base: 'sm', md: 'flex' }} w={'85%'} ml={6}>
                                <InputGroup>
                                    <InputLeftElement>
                                        <Search2Icon />
                                    </InputLeftElement>
                                    <Input type='text' size={'md'} onChange={e => handleChange(e)} />
                                    <Button
                                        onClick={handleSearch}
                                        ml={1}
                                        color={'brand.primary'}
                                        variant={'ghost'}
                                        _hover={{
                                            bg: 'brand.primary',
                                            color: 'brand.accent',
                                        }}>Search</Button>
                                </InputGroup>
                            </Flex>
                        </>}
                        {channelAdd && <ModalHeader>Add Channel Members</ModalHeader>}
                    <ModalBody>
                        <SearchResults users={results} currentTeamId={teamId} 
                        channelAdd={channelAdd} channelId={channelId}/>
                    </ModalBody>
                    <ModalCloseButton />
                </ModalContent>
            </Modal>
        </>
    )
}