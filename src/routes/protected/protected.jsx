// React Router
import { Navigate } from 'react-router-dom';

// This is used when you only want to show a page to someone that is logged in.
export const ProtectedUserRoute = ({ user, redirectPath = '/', children }) => {
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

// This is used when you only want to show a page to someone that is not logged
// in.
export const ProtectedNoUserRoute = ({
  user,
  redirectPath = '/',
  children
}) => {
  if (user) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};
