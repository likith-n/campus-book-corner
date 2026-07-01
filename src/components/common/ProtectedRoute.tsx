import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const userData = localStorage.getItem('user');

  if (!userData) {
    // Redirect to signup, remembering where they wanted to go
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
