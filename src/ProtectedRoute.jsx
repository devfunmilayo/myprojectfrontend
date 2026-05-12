import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

// Wrap any page you want to protect with this component
// If user is not logged in → redirect to /login
// If user is logged in → show the page normally

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;