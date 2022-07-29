// Chakra
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Center,
  CloseButton,
  useDisclosure
} from '@chakra-ui/react';

// Styles
import './promo-code-banner.scss';
import './promo-code-banner.mobile.scss';

function PromoCodeBanner({ promoCode }) {
  const { isOpen: isVisible, onClose } = useDisclosure({ defaultIsOpen: true });

  return (
    isVisible && (
      <div className="promo-code-banner-container">
        <Center>
          <div className="promo-code-alert-container">
            <Alert
              className="promo-code-alert"
              status="info"
              variant="top-accent"
              w="100%"
            >
              <AlertIcon className="promo-code-alert-icon" />

              <Box>
                <AlertTitle>
                  {promoCode.discount * 100}% off with Promo Code{' '}
                  {promoCode.code}
                </AlertTitle>
                <AlertDescription>
                  You can receive {promoCode.discount * 100}% off your order
                  today if you use promo code {promoCode.code} during checkout!
                  This will expire {promoCode.getExpiredDateAndTime()}. This can
                  only be used once.
                </AlertDescription>
              </Box>

              <CloseButton
                alignSelf="flex-start"
                position="relative"
                right={-1}
                top={-1}
                onClick={onClose}
              />
            </Alert>
          </div>
        </Center>
      </div>
    )
  );
}

export default PromoCodeBanner;
