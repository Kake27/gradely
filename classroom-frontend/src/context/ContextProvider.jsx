import { createContext } from "react";
import { useState, useEffect } from "react";

export const UserContext = createContext();

export const ContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)
    

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if(storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, []);

    useEffect(() => {
        if(user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
        setLoading(false)
    }, [user]);

    const login = (userData) => {
        setUser(userData);
    }

    const logout = () => {
        setUser(null);
    }

    return (
        <UserContext.Provider value={{ user, login, logout, loading }}> 
            {children}
        </UserContext.Provider>
    )
}