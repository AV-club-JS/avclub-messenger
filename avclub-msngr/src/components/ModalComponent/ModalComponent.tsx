"use strict";
import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { ChildrenProps } from "../../types/types";

export const ModalComponent = (
  { children, isOpen, onClose }: ChildrenProps & {
    isOpen: boolean;
    onClose: () => void;
  },
): JSX.Element => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalOverlay/>
        {children}
      </ModalContent>
    </Modal>
  );
};
