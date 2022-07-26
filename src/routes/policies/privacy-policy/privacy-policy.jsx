// Styles
import './privacy-policy.scss';

function PrivacyPolicy() {
  // To update this privacy policy, go to the URL below:
  // https://app.termly.io/dashboard/website/d69d9dc5-98e5-4f2a-a64c-9a4aa2246f66
  return (
    <div className="main-container">
      <iframe
        className="privacy-iframe"
        title="Privacy Policy"
        src="/privacy-policy.html"
      />
    </div>
  );
}

export default PrivacyPolicy;
