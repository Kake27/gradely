import { useState, useContext } from "react";
import { UserContext } from "../context/ContextProvider";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { auth, provider, db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { Mail, Lock, ArrowRight } from 'lucide-react';
import toast, { Toaster } from "react-hot-toast";

import axios from "axios";

export default function Login() {
    const { user, login, logout } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            logout()
            const userDoc = await getDoc(doc(db, "users", email.toLowerCase().trim()));
            if(!userDoc.exists()) {
                toast.error("You are not registered. Please sign up first.");
                navigate("/signup");
                return;
            }
            
            // Sign in with Firebase Auth
            await signInWithEmailAndPassword(auth, email.toLowerCase().trim(), password);

            // Get user id from mongo
            var id;
            try {
                 if(userDoc.data().role == "faculty") {
                    const res = await axios.get("http://localhost:5000/faculty/getFacultyID", {
                        params: {email: email.toLowerCase().trim()}
                    })

                    id = res.data.id

                 }
                 else if(userDoc.data().role == "ta") {
                    const res = await axios.get("http://localhost:5000/ta/getTAID", {
                        params: {email: email.toLowerCase().trim()}
                    })

                    id = res.data.id

                 }
                 else if(userDoc.data().role == "student") {
                    const res = await axios.get("http://localhost:5000/student/getStudentID", {
                        params: {email: email.toLowerCase().trim()}
                    })

                    id = res.data.id
                 }
            }
            catch (err) {
                console.log("Error retrieving user ID from MongoDB:", err);
            }

            console.log("User logged in successfully")

            login({
                name: userDoc.data().name,
                email: userDoc.data().email,
                role: userDoc.data().role,
                id: id
            })

            toast.success("Logged in successfully!");

            if(userDoc.data().role=="faculty") navigate("/faculty");
            else if(userDoc.data().role=="ta") navigate("/ta")
            else if(userDoc.data().role=="student") navigate("/student")
        }
        catch(err) {
            if (err.code === "auth/invalid-credential") {
                toast.error("You have entered either an invalid email or password. Please try again or sign up.");
            } else{
                alert("Something went wrong: " + err.message);
            }
            return ;
        }
    }

    const logInWithGoogle = async () => {
        try {
            logout()
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const email = user.email;

            const userDoc = await getDoc(doc(db, "users", email.toLowerCase().trim()));
            if(!userDoc.exists()) {
                await auth.signOut();
                toast.error("You are not registered. Please sign up first.");
                navigate("/signup");
                return;
            }

            // Get user id from mongo
            var id;
            try {
                 if(userDoc.data().role == "faculty") {
                    const res = await axios.get("http://localhost:5000/faculty/getFacultyID", {
                        params: {email: email.toLowerCase().trim()}
                    })

                    id = res.data.id

                 }
                 else if(userDoc.data().role == "ta") {
                    const res = await axios.get("http://localhost:5000/ta/getTAID", {
                        params: {email: email.toLowerCase().trim()}
                    })

                    id = res.data.id

                 }
                 else if(userDoc.data().role == "student") {
                    const res = await axios.get("http://localhost:5000/student/getStudentID", {
                        params: {email: email.toLowerCase().trim()}
                    })

                    id = res.data.id
                 }
            }
            catch (err) {
                console.log("Error retrieving user ID from MongoDB:", err);
            }

            login({
                name: userDoc.data().name,
                email: userDoc.data().email,
                role: userDoc.data().role, 
                id: id
            })

            toast.success("Logged in successfully with Google!");

            if(userDoc.data().role=="faculty") navigate("/faculty");
            else if(userDoc.data().role=="ta") navigate("/ta")
            else if(userDoc.data().role=="student") navigate("/student")


        } catch(err) {
            console.log("Error logging in with Google:", err)
        }
    }

    
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
            <Toaster />
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-600">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        />
                    </div>
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        />
                    </div>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="remember"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-gray-700">
                        Remember me
                    </label>
                    </div>
                    <a href="/forgot-password" className="text-blue-600 hover:text-blue-500">
                    Forgot password?
                    </a>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 flex items-center justify-center gap-2 transition-colors"
                >
                    Sign In <ArrowRight className="h-5 w-5" />
                </button>
                </form>

                <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <button
                    onClick={logInWithGoogle}
                    className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-100"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    Sign in with Google
                </button>
                </div>

                <p className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                    Sign up
                </a>
                </p>
            </div>
        </div>
    );
}