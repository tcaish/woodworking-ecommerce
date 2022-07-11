// React
import { useRef } from 'react';

// Chakra
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea
} from '@chakra-ui/react';

// Styles
import './edit-cart-item-modal.scss';

function EditCartItemModal(props) {
  const initialRef = useRef(null);

  return (
    <>
      <Modal
        className="edit-modal"
        initialFocusRef={initialRef}
        isOpen={props.isOpen}
        onClose={props.onClose}
        motionPreset="slideInBottom"
      >
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
        <ModalContent>
          <ModalHeader>{props.product.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Quantity</FormLabel>
              <Input
                ref={initialRef}
                type="number"
                placeholder="e.g. 2"
                value={props.cartProduct.quantity}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Notes</FormLabel>
              <Textarea
                placeholder="Specify any changes or modifications you would like to make to this order."
                value={props.cartProduct.notes}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button className="edit-modal-save-button" mr={3}>
              Update
            </Button>
            <Button onClick={props.onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditCartItemModal;
