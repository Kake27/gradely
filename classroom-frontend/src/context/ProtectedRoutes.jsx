import { UserContext } from "./ContextProvider";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children, roles}) => {
    const {user, loading} = useContext(UserContext)

    if(loading) return <div>Loading</div>

    if(!user || !roles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />
    }

    return children;
}

export default ProtectedRoute