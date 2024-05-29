import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../redux/Store';


const ProtectedRoute = ({ children }) => {
    const authStatus = useSelector((state: RootState) => state.auth.authStatus);

    if (!authStatus) {
        return <Navigate to="/login" />;
    }
    return children
}
export default ProtectedRoute;