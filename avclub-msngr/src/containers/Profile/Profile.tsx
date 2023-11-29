import { useState, useEffect, useContext } from "react";
import { formatTimestamp } from "../../utils/formatTimestamp";
// chakra
import { Avatar, AvatarBadge, Box, Button, Flex, FormControl, FormLabel, Select, Stack, Link, Text, Input } from "@chakra-ui/react";
// utils
import { getStatusBadgeColor, validatePhoneNumber, froalaBioConfig } from "../../utils/profileUtils";
// froala editor
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import FroalaEditorComponent from 'react-froala-wysiwyg';
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
// context
import { UserContext } from "../../context/AuthContext";
// services
import { updateUserData } from "../../services";

export const Profile = () => {
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [isEditingFirstName, setIsEditingFirstName] = useState(false);
    const [isEditingLastName, setIsEditingLastName] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [currentStatus, setCurrentStatus] = useState('');
    const { user, userData, setAuth } = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');

    const handleUsernameEdit = async () => {
        if (username.length < 5) {
            alert('Username must be at least 5 symbols');
            setUsername(userData!.username);
            setIsEditingUsername(false);
            return;
        }
        try {
            await updateUserData(userData!.uid, { username: username });
            setAuth({
                user,
                userData: { ...userData!, username: username },
            });
        } catch (error) {
            console.error(error);
            alert('Failed to update');
            setUsername(userData!.username);
        }
        setIsEditingUsername(false);
    }

    const handleFirstNameEdit = async () => {
        if (firstName.length < 1) {
            alert('Invalid First Name!');
            setFirstName(userData!.firstName);
            setIsEditingFirstName(false);
            return;
        }
        try {
            await updateUserData(userData!.uid, { firstName: firstName });
            setAuth({
                user,
                userData: { ...userData!, firstName: firstName },
            });
        } catch (error) {
            console.error(error);
            alert('Failed to update');
            setFirstName(userData!.firstName);
        }
        setIsEditingFirstName(false);
    }

    const handleLastNameEdit = async () => {
        if (lastName.length < 1) {
            alert('Invalid Last Name!');
            setLastName(userData!.lastName);
            setIsEditingLastName(false);
            return;
        }
        try {
            await updateUserData(userData!.uid, { lastName: lastName });
            setAuth({
                user,
                userData: { ...userData!, lastName: lastName },
            });
        } catch (error) {
            console.error(error);
            alert('Failed to update');
            setLastName(userData!.lastName);
        }
        setIsEditingLastName(false);
    }

    const handlePhoneEdit = async () => {
        if (!validatePhoneNumber(phone)) {
            alert('Invalid Phone!');
            setPhone(userData!.phone);
            setIsEditingPhone(false);
            return;
        }
        try {
            await updateUserData(userData!.uid, { phone: phone });
            setAuth({
                user,
                userData: { ...userData!, phone: phone },
            });
        } catch (error) {
            console.error(error);
            alert('Failed to update');
            setPhone(userData!.phone);
        }
        setIsEditingPhone(false);
    }

    const handleBioEdit = async () => {
        try {
            await updateUserData(userData!.uid, { bio: bio });
            setAuth({
                user,
                userData: { ...userData!, bio: bio },
            });
        } catch (error) {
            console.error(error);
            alert('Update failed');
            setBio(userData!.bio);
        }
        setIsEditingBio(false);
    }

    const handleStatusChange = async (newStatus: string) => {
        setCurrentStatus(newStatus);
        if (userData) {
            try {
                await updateUserData(userData.uid, { status: newStatus });
                setAuth({
                    user,
                    userData: { ...userData, status: newStatus },
                });
            } catch (error) {
                console.error(error);
                alert('Update failed');
                setCurrentStatus(userData!.status);
            }
        }
    };

    useEffect(() => {
        if (userData) {
            setUsername(userData.username);
            setFirstName(userData.firstName);
            setLastName(userData.lastName);
            setPhone(userData.phone);
            setBio(userData.bio);
        }

    }, [userData])


    if (userData) {
        return (
            <Flex direction="column" alignItems="center" px={4}>

                <Stack direction="row" p={6}>
                    <Avatar size="2xl" src={''}>
                        <AvatarBadge boxSize="1.25em" bg={getStatusBadgeColor(userData.status)} />
                    </Avatar>
                    <FormControl>
                        <FormLabel>Status</FormLabel>
                        <Select defaultValue={userData.status} onChange={(e) => handleStatusChange(e.target.value)}>
                            <option value="online">Online</option>
                            <option value="away">Away</option>
                            <option value="busy">Busy</option>
                            <option value="in meeting">In Meeting</option>
                            <option value="offline">Offline</option>
                        </Select>
                        <Button mt="10px" size="xs">Change Avatar</Button>
                    </FormControl>
                </Stack>
                <Stack direction="row" spacing={4} mt={4}>
                    <Text fontWeight={600}>Email: {userData.email}</Text>
                </Stack>
                <Text fontSize="small">Member Since: {formatTimestamp(userData.createdOn)}</Text>
                <Box mt={8} w="100%" maxW="600px">
                    <Stack direction="row" spacing={4}>
                        <FormControl>
                            <Stack direction="row">
                                <FormLabel fontWeight={600}>Username</FormLabel>
                                {isEditingUsername ?
                                    <Button size={'xs'} onClick={() => handleUsernameEdit()}>Save</Button>
                                    : <Button size={'xs'} onClick={() => setIsEditingUsername(true)}>Edit</Button>
                                }
                            </Stack>
                            {isEditingUsername ?
                                <Input value={username}
                                    maxLength={35}
                                    onChange={e => setUsername(e.target.value)}></Input>
                                : <Text>{userData.username}</Text>}
                        </FormControl>
                    </Stack>
                    <Stack direction="row" spacing={4} mt={4}>
                        <FormControl>
                            <Stack direction="row">
                                <FormLabel fontWeight={600}>First Name</FormLabel>
                                {isEditingFirstName ?
                                    <Button size={'xs'} onClick={() => handleFirstNameEdit()}>Save</Button>
                                    : <Button size={'xs'} onClick={() => setIsEditingFirstName(true)}>Edit</Button>
                                }
                            </Stack>
                            {isEditingFirstName ?
                                <Input value={firstName}
                                    maxLength={1019}
                                    onChange={e => setFirstName(e.target.value)}></Input>
                                : <Text>{userData.firstName}</Text>}
                        </FormControl>
                        <FormControl>
                            <Stack direction='row'>
                                <FormLabel fontWeight={600}>Last Name</FormLabel>
                                {isEditingLastName ?
                                    <Button size={'xs'} onClick={() => handleLastNameEdit()}>Save</Button>
                                    : <Button size={'xs'} onClick={() => setIsEditingLastName(true)}>Edit</Button>
                                }
                            </Stack>
                            {isEditingLastName ?
                                <Input value={lastName}
                                    maxLength={747}
                                    onChange={e => setLastName(e.target.value)}></Input>
                                : <Text>{userData.lastName}</Text>}
                        </FormControl>
                    </Stack>
                    <FormControl mt={4}>
                        <Stack direction='row'>
                            <FormLabel fontWeight={600}>Phone Number</FormLabel>
                            {isEditingPhone ?
                                <Button size={'xs'} onClick={() => handlePhoneEdit()}>Save</Button>
                                : <Button size={'xs'} onClick={() => setIsEditingPhone(true)}>Edit</Button>
                            }
                        </Stack>
                        {isEditingPhone ?
                            <Input value={phone}
                                type="tel"
                                onChange={e => setPhone(e.target.value)}></Input>
                            : <Text>{userData.phone}</Text>}
                    </FormControl>
                    <FormControl mt={8}>
                        <Stack direction='row'>
                            <FormLabel fontWeight={600}>Bio</FormLabel>
                            {isEditingBio ?
                                <Button size={'xs'} onClick={() => handleBioEdit()}>Save</Button>
                                : <Button size={'xs'} onClick={() => setIsEditingBio(true)}>Edit</Button>
                            }
                        </Stack>
                        {isEditingBio ?
                            <FroalaEditorComponent
                                model={bio}
                                onModelChange={(e: string) => setBio(e)}
                                config={froalaBioConfig}
                            />
                            : <FroalaEditorView model={userData.bio} />
                        }
                    </FormControl>
                    <Button onClick={() => console.log(userData)
                    }></Button>
                </Box>
            </Flex>
        );
    }
};