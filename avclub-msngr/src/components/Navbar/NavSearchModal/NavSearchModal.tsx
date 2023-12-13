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
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from "@chakra-ui/react";
import { Search2Icon } from '@chakra-ui/icons';
import { useState, ChangeEvent } from "react";
import { getUsersByUsername } from "../../../services";
import { DefaultUserData } from "../../../types/types";
import { SearchResults } from "./SearchResults";

export const NavSearchModal = ({ isOpen, onClose, chatId }: { isOpen: boolean, onClose: () => void, chatId: string }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<DefaultUserData[]>([]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    }

    const handleSearch = async () => {
        try {
            const users = await getUsersByUsername(query) as DefaultUserData[];
            setResults(users);            
        } catch (error) {
            console.error(error);
        }
    }

    const handleClose = () => {
        setResults([]);
        onClose();
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={handleClose} 
            size={'lg'}
            scrollBehavior='inside'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Search</ModalHeader>
                    <ModalCloseButton />
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
                    <ModalBody>
                        <SearchResults onClose={handleClose} users={results} chatId={chatId} />
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3}
                            onClick={handleClose}
                            color={'brand.primary'}
                            variant={'ghost'}
                            _hover={{
                                bg: 'brand.primary',
                                color: 'brand.accent',
                            }}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
