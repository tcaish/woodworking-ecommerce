// React
import { useState } from 'react';

// Chakra
import { Center, CircularProgress } from '@chakra-ui/react';

// Styles
import './privacy-policy.scss';

function PrivacyPolicy() {
  // To update this privacy policy, go to the URL below:
  // https://app.termly.io/dashboard/website/d69d9dc5-98e5-4f2a-a64c-9a4aa2246f66
  const [loading, setLoading] = useState(true);

  return (
    <div className="main-container">
      <div
        className="iframe-size"
        style={{ display: loading ? 'block' : 'none' }}
      >
        <Center h="100%">
          <CircularProgress isIndeterminate color="#f7d794" size="120px" />
        </Center>
      </div>

      <iframe
        className="iframe-size"
        style={{ display: loading ? 'none' : 'block' }}
        title="Privacy Policy"
        src="/privacy-policy.html"
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}

export default PrivacyPolicy;
