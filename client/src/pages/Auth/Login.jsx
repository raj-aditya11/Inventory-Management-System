import { FaBoxOpen, FaEnvelope, FaLock } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import toast from "react-hot-toast";

import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

function Login() {
    const navigate = useNavigate();

    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {

        if (!username.trim() || !password.trim()) {

            toast.error("Username and password are required.");

            return;

        }

        try {

            setLoading(true);

            const response = await api.post("/auth/login", {
                username,
                password,
            });

            login(
                response.data.token,
                response.data.user
            );

            toast.success("Login successful.");

            const role = response.data.user.role;

            if (role === "ADMIN") {

                navigate("/admin/dashboard");

            }

            else if (role === "INVENTORY_HOLDER") {

                navigate("/inventory/dashboard");

            }

            else {

                navigate("/user/dashboard");

            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Login failed."
            );

        } finally {

            setLoading(false);

        }

    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

        <div className="w-full max-w-md">

            {/* Logo */}

            <div className="text-center mb-8">

            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-600 text-white mb-4">
                <FaBoxOpen size={36} />
            </div>

            <h1 className="text-4xl font-bold text-slate-800">
                Inventory Management
            </h1>

            <p className="text-slate-500 mt-2">
                Efficient Asset Tracking System
            </p>

            </div>

            {/* Login Card */}

            <div className="bg-white rounded-3xl shadow-xl p-8">

            <h2 className="text-3xl font-bold text-center text-slate-800">
                Welcome Back 
            </h2>

            <p className="text-center text-slate-500 mt-2 mb-8">
                Sign in to continue
            </p>

            <div className="space-y-5">

                <Input
                    label="Username"
                    placeholder="Enter your username"
                    icon={FaEnvelope}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    icon={FaLock}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <label className="flex items-center gap-2 text-sm text-slate-600">

                <input type="checkbox" />

                Remember Me

                </label>

                <Button
                    className="w-full py-3"
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </Button>

            </div>

            </div>

            <p className="text-center text-slate-500 text-sm mt-6">
            © 2026 Inventory Management System
            </p>

        </div>

        </div>
    );
}

export default Login;