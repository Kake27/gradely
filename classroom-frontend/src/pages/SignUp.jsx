import { useState, useContext } from "react";
import { UserContext } from "../context/ContextProvider";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "../firebase/firebaseConfig";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"
import { GraduationCap, School, Users, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import toast, { Toaster } from "react-hot-toast";

import axios from "axios"

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [name, setName] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const navigate = useNavigate();

    const delay = (ms) => new Promise((resolve)=>setTimeout(resolve, ms));

    const handleSubmit = async (e) => {
        e.preventDefault()  
        setIsLoading(true)

        try {
            await createUserWithEmailAndPassword(auth, email.toLowerCase().trim(), password);
        } catch(err) {
            if (err.code === "auth/email-already-in-use") {
                toast.error("An account with this email already exists. Try logging in!");
                await delay(1000)

                auth.signOut();
                navigate("/");
            } else {
                toast.error("Something went wrong: " + err.message);
            }

            setIsLoading(false);
            return ;
        }

        const userData = auth.currentUser;
        if(userData) {
            await setDoc(doc(db, "users", email.toLowerCase().trim()), {
                email: email.toLowerCase().trim(),
                name: name,
                role: role
            })
        }

        try {
            var res = "";
            if(role === "faculty") {
                res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/faculty/createFaculty`, {
                email:email.toLowerCase().trim(), 
                name: name, 
            })}
            else if(role === "ta") {
                res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/ta/createTA`, {
                email:email.toLowerCase().trim(), 
                name: name, 
            })}
            else if(role === "student") {
                res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/student/createStudent`, {
                email:email.toLowerCase().trim(), 
                name: name, 
            })}
           
            if(res.data.error) {
                toast.error("Error creating user in backend:", res.data.error);
                setIsLoading(false)
                return ;
            }

        } catch(err) {
            console.error("Error creating user in backend:", err);
        }

        toast.success("Succesfully signed up! Please log in.");
        await delay(1000)

        navigate("/login")
    }

    const signUpWithGoogle = async() => {
        setIsGoogleLoading(true)
        try {
            if(!role) {
                toast("Please select a role!", {
                    icon: '⚠️'
                })
                setIsGoogleLoading(false)
                return ;
            }

            const result = await signInWithPopup(auth, provider);
            const userData = result.user;

            const email = userData.email.toLowerCase().trim();
            const userDoc = await getDoc(doc(db, "users", email));
            if (userDoc.exists()) {
                await auth.signOut();
                toast.error("An account with this email already exists. Try logging in!");

                navigate("/login")

                return;
            }
            
            // Create user in firebase
            await setDoc(doc(db, "users", email),  {
                email: email.toLowerCase().trim(),
                name: userData.displayName,
                role: role
            })


            // Create user in mongo
            try {
                var res = "";
                if(role === "faculty") {
                    res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/faculty/createFaculty`, {
                    email:email.toLowerCase().trim(), 
                    name: userData.displayName, 
                })}
                else if(role === "ta") {
                    res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/ta/createTA`, {
                    email:email.toLowerCase().trim(), 
                    name: userData.displayName, 
                })}
                else if(role === "student") {
                    res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/student/createStudent`, {
                    email:email.toLowerCase().trim(), 
                    name: userData.displayName, 
                })}
            
                if(res.data.error) {
                    console.error("Error creating user in backend:", res.data.error);
                    setIsGoogleLoading(false)
                    return ;
                }
                // console.log("User created in backend:", res.data);

            } catch(err) {
                console.error("Error creating user in backend:", err);
            }

            toast.success("Successfully signed up with Google!")
            await delay(1000)
            navigate("/login")

        } catch(err) {
            toast.error("Error signing up with Google:", err)
        }
        finally {setIsGoogleLoading(false)}
    }   

    
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
            <Toaster />
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-600">Join our grading platform today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            />
                        </div>
                    </div>

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
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Register as</label>
                        <div className="relative">
                            <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            >
                            <option value="">Select your role</option>
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                            <option value="ta">Teaching Assistant</option>
                            </select>
                            {role === 'student' && <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />}
                            {role === 'faculty' && <School className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />}
                            {role === 'ta' && <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />}
                            {!role && <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />}
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || isGoogleLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 flex items-center justify-center gap-2 transition-colors"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Signing Up...
                        </>
                    ) : (
                        <>
                            Sign Up <ArrowRight className="h-5 w-5" />
                        </>
                    )}
                </button>
                </form>

                <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                </div>

                <button
                    onClick={signUpWithGoogle}
                    disabled={isLoading || isGoogleLoading}
                    className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-100"
                >
                    {isGoogleLoading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Signing up...
                        </>
                    ) : (
                        <>
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                            Sign up with Google
                        </>
                    )}
                </button>
                </div>

                <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                    Sign in
                </a>
                </p>
            </div>
        </div>
    )
}