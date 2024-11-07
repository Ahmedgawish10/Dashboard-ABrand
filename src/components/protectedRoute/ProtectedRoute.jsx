// PrivateRoute.js
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../../firebase";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firbaseUser) => {
      setUser(firbaseUser);
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up the subscription on unmount
  }, [auth.currentUser]);

  if (loading) {
    return <>...</>;
  }
  if (user) {  
      
     return children;
  } else {
    return <Navigate to="/login" state={{ from: location }} replace />
    
  }
};

export default ProtectedRoute;
