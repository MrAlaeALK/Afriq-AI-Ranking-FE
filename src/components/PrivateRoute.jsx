import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {

    const LoadingComponent = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Checking authentication...</p>
    </div>
  </div>
    );
  const { isAuthenticated, isLoading} = useAuth();
  if(isLoading){
    return <LoadingComponent />
  }
  console.log(isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" />;
}