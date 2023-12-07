import {
    Button,
    Flex,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { CreateTeamValues } from "../../types/types";
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import FroalaEditorComponent from 'react-froala-wysiwyg';
import { froalaBioConfig } from "../../utils/profileUtils";
import { createTeam } from "../../services";
import { UserContext } from "../../context/AuthContext";

export const CreateTeam = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [formValues, setFormValues] = useState<CreateTeamValues>({
        teamName: '',
        info: '',
    });
    const [teamNameError, setTeamNameError] = useState<string>('');
    const { userData } = useContext(UserContext);

    const handleClose = () => {
        setTeamNameError('');
        setFormValues({
            teamName: '',
            info: '',
        })
        onClose();
    }

    const handleCreate = async () => {
        if (formValues.teamName.length < 5) {
            setTeamNameError('Team name must be at least five characters');
            return;
        } else {
            setTeamNameError('');
            try {
                await createTeam(formValues.teamName, userData!.uid, formValues.info);
                handleClose();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={handleClose} size={'lg'}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Team</ModalHeader>
                    <ModalCloseButton />
                    <Flex display={{ base: 'sm', md: 'flex' }} w={'85%'} ml={6}>
                    </Flex>
                    <ModalBody>
                        <form>
                            <FormControl isInvalid={!!teamNameError}>
                                <FormLabel htmlFor="teamName" fontWeight={600}>Team Name:</FormLabel>
                                <Input
                                    id="teamName"
                                    placeholder="Enter team name"
                                    value={formValues.teamName}
                                    onChange={(e) =>
                                        setFormValues({ ...formValues, teamName: e.target.value })
                                    }
                                />
                                <FormErrorMessage>{teamNameError}</FormErrorMessage>
                            </FormControl>

                            <FormControl mt={5}>
                                <FormLabel htmlFor="secondField" fontWeight={600}>Team Info:</FormLabel>
                                <FroalaEditorComponent
                                    model={formValues.info}
                                    onModelChange={(e: string) =>
                                        setFormValues({ ...formValues, info: e })
                                    }
                                    config={froalaBioConfig} />
                                    <FormHelperText fontStyle='italic'>Info section is not mandatory</FormHelperText>
                            </FormControl>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button mr={3}
                            onClick={handleCreate}
                            color={'brand.primary'}
                            variant={'ghost'}
                            _hover={{
                                bg: 'brand.primary',
                                color: 'brand.accent',
                            }}>
                            Create
                        </Button>
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