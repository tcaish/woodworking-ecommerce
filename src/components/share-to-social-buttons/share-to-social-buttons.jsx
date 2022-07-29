// React Icons
import { FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa';

// Chakra
import { Button, HStack } from '@chakra-ui/react';

// Exports
import { SOCIAL_TYPES } from '../../exports/constants';
import { shareToSocialMedia } from '../../exports/functions';

// Styles
import './share-to-social-buttons.scss';

function ShareToSocialButtons() {
  return (
    <HStack>
      <Button
        colorScheme={SOCIAL_TYPES.facebook}
        leftIcon={<FaFacebook />}
        onClick={() => shareToSocialMedia(SOCIAL_TYPES.facebook)}
      >
        Facebook
      </Button>
      <Button
        colorScheme={SOCIAL_TYPES.twitter}
        leftIcon={<FaTwitter />}
        onClick={() => shareToSocialMedia(SOCIAL_TYPES.twitter)}
      >
        Twitter
      </Button>
      <Button
        className="detail-social-button-linkedin"
        leftIcon={<FaLinkedin />}
        onClick={() => shareToSocialMedia(SOCIAL_TYPES.linkedin)}
      >
        LinkedIn
      </Button>
    </HStack>
  );
}

export default ShareToSocialButtons;
