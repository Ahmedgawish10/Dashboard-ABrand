import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from 'react-hot-toast';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';

export default function Login() {
    const [email, setEmail] = useState("admin@gamil.com");
    const [password, setPassword] = useState("admin@gamil.com");
    const [loading, setLoading] = useState(true);
    const [loginSpinner, setLoginSpinner] = useState(false);
    const [userAuth, setUserAuth] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
            setUserAuth(firebaseUser);
            setLoading(false);

            if (firebaseUser && localStorage.getItem("isAuthenticated") === "true" && !auth?.currentUser?.photoURL) {
                toast.success("You are already logged in.");
                 navigate("/", { replace: true });
            } 
            if (!firebaseUser) {        
                toast.success("This account is for testing.");
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("All fields are required");
            return;
        }
        try {
            setLoginSpinner(true);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (userCredential.user.email === "admin@gamil.com") {
                localStorage.setItem("isAuthenticated", "true");
                toast.success("Welcome back, Admin.");
                navigate("/", { replace: true });
            } else {
                toast.error("You are not authorized.");
                navigate("/login", { replace: true });
            }
        } catch (err) {
            toast.error("Invalid credentials");
        } finally {
            setLoginSpinner(false);
        }
    };

    if (loading) return ;
    return (
        <section className="lg:grid lg:grid-cols-12 h-screen">
            <section className="hidden lg:flex items-end bg-gray-900 lg:col-span-5 xl:col-span-6 relative">
                <img
                    src="https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-80"
                />
                <div className="relative p-12 text-white">
                    <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">Welcome to ABrand</h2>
                </div>
            </section>

            <main className="flex h-full items-center justify-center px-8 md:px-12 lg:col-span-7 xl:col-span-6">
                <form onSubmit={handleLogin} className="w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-4">Login</h2>
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <button
                        type="submit"
                        disabled={loginSpinner}
                        className="mt-4 w-full py-2 bg-blue-600 text-white rounded"
                    >
                        {loginSpinner ? "Logging in..." : "Login"}
                    </button>
                </form>
            </main>
        </section>
    );
}
