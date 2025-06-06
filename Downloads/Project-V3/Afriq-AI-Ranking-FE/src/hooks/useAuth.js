import { useAuth as useAuthContext } from '../context/AuthContext.jsx';

/**
 * Custom hook for accessing authentication context
 * 
 * This is a convenience re-export of the useAuth hook from AuthContext.
 * It provides access to authentication state and methods throughout the application.
**/
export const useAuth = useAuthContext;

export default useAuth;