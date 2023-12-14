import {
  Box,
  Button,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { loadSearched, loadTrending } from "../../services/giphy.services";
import { GIFsComponentProps, GIFsInfo } from "../../types/types";
import { addMessageToChat } from "../../services";

const GIFComponent: React.FC<GIFsComponentProps> = ({ src, alt, chatId, uid, onClose, setSearchTerm }) => {
  const sendGIFToMessages = async () => {
    const req = await addMessageToChat({chatId, uid, content: `<div class='gif-container'><img src=${src}/></div>`, type: 'gif'});
    if (!req.success) console.log(req.error);
    setSearchTerm('');
    onClose();
  };
  return (
    <Box p={2} boxSize="100px">
      <Image
        onClick={sendGIFToMessages}
        src={src}
        alt={alt}
        borderRadius="md"
        boxSize="100%"
        objectFit="cover"
      />
    </Box>
  );
};
export const LoadGIFs = (
  { isOpen, onClose, chatId, uid }: {
    isOpen: boolean;
    onClose: () => {};
    chatId: string;
    uid: string;
  },
) => {
  const [GIFs, setGIFs] = useState<GIFsInfo>([]);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    (async () => {
      const trendingGIFs = await loadTrending();
      const { data } = trendingGIFs;
      setGIFs(data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const searchedGIFs = await loadSearched(searchTerm);
      const { data } = searchedGIFs;
      if (data) setGIFs(data);
    })();
  }, [searchTerm]);
  return (
    <Modal
      scrollBehavior="inside"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent w={"500px"} bgColor={"white"}>
        <ModalHeader>SELECT GIF</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Search GIFs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value || "")}
            mb={4}
          />
          <SimpleGrid columns={4} spacing={2}>
            {GIFs.map((GIF) => (
              <GIFComponent
                key={GIF.id}
                alt="GIF"
                src={GIF.images.downsized.url}
                chatId={chatId}
                uid={uid}
                setSearchTerm={setSearchTerm}
                onClose={onClose}
              />
            ))}
          </SimpleGrid>
        </ModalBody>
        <ModalFooter>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
