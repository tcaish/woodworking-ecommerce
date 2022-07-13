// React
import { useRef, useState } from 'react';

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
  Select,
  Textarea
} from '@chakra-ui/react';

// Styles
import './edit-cart-item-modal.scss';
import { updateCartItem } from '../../../utils/firebase/firebase';

function EditCartItemModal(props) {
  const initialRef = useRef(null);

  const [quantity, setQuantity] = useState(props.cartProduct.quantity);
  const [quantityInvalid, setQuantityInvalid] = useState(false);
  const [color, setColor] = useState(props.cartProduct.color);
  const [colorInvalid, setColorInvalid] = useState(false);
  const [notes, setNotes] = useState(props.cartProduct.notes);
  const [updating, setUpdating] = useState(false);

  // Handles submitting the changes to the cart item
  async function submitUpdate() {
    if (quantityInvalid || colorInvalid) return;
    setUpdating(true);

    await updateCartItem(props.user.uid, props.cartProduct.id, {
      quantity,
      color,
      notes
    })
      .then((res) => {
        setUpdating(false);
        props.onClose();
      })
      .catch((err) => {
        setUpdating(false);
        console.log(err);
      });
  }

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
          <ModalHeader>Edit {props.product.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={quantityInvalid}>
              <FormLabel>Quantity</FormLabel>
              <Input
                placeholder="e.g. 2"
                type="number"
                onChange={(e) => {
                  setQuantity(e.target.value > 0 ? Number(e.target.value) : '');
                  setQuantityInvalid(!e.target.value || e.target.value < 1);
                }}
                value={quantity}
              />
            </FormControl>

            <FormControl mt={4} isRequired isInvalid={colorInvalid}>
              <FormLabel>Color</FormLabel>
              <Select
                placeholder="Select color"
                onChange={(e) => {
                  setColorInvalid(!e.target.value);
                  setColor(e.target.value);
                }}
                value={color}
              >
                {props.product.colors.map((theColor, index) => (
                  <option key={index} value={theColor}>
                    {theColor}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Notes</FormLabel>
              <Textarea
                placeholder="Specify any changes or modifications you would like to make to this order."
                onChange={(e) => setNotes(e.target.value)}
                value={notes}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              className="edit-modal-save-button"
              mr={3}
              onClick={submitUpdate}
              isLoading={updating}
            >
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
