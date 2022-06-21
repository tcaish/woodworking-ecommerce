// React Router
import { Navigate } from 'react-router-dom';

const getStoredAuthToken = () => sessionStorage.getItem('Auth Token');

// This is used when you only want to show a page to someone that is logged in.
export const ProtectedUserRoute = ({ redirectPath = '/', children }) => {
  return !getStoredAuthToken() ? (
    <Navigate to={redirectPath} replace />
  ) : (
    children
  );
};

// This is used when you only want to show a page to someone that is not logged
// in.
export const ProtectedNoUserRoute = ({ redirectPath = '/', children }) => {
  return getStoredAuthToken() ? (
    <Navigate to={redirectPath} replace />
  ) : (
    children
  );
};
