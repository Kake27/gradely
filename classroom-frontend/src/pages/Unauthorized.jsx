import { useContext, useEffect } from "react";
import { UserContext } from "../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
import { auth } from "../firebase/firebaseConfig";

export default function Unauthorized() {
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            logout();
            navigate("/login");
        } catch (err) {
            console.error("Error logging out:", err);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-red-100 p-4 rounded-full">
                            <ShieldAlert className="h-16 w-16 text-red-600" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600">
                        You don't have permission to view this page.
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={handleGoBack}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 flex items-center justify-center gap-2 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Go Back
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 flex items-center justify-center gap-2 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Logout
                    </button>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 text-center">
                        If you believe this is an error, please contact your administrator.
                    </p>
                </div>
            </div>
        </div>
    );
}