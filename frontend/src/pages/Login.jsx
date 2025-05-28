import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import { LogIn } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/signin`, {
        email,
        password,
      });

      const token = response.data.token;
      const userEmail = response.data.email;
      const role = response.data.role;

      Cookies.set("access_token", token, { expires: 0.5, path: "/" });
      Cookies.set("email", userEmail, { expires: 0.5, path: "/" });
      Cookies.set("role", role, { expires: 0.5, path: "/" });

      const { message } = response.data;
      const status = response.status;

      if (status >= 200 && status < 300) {
        navigate("/");
      } else {
        toast.error(message || "Login failed!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <form
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-5"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-center gap-2 text-blue-600 text-2xl font-bold mb-4">
          <LogIn size={28} />
          <span>Sign In</span>
        </div>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          className="bg-blue-600 text-white py-3 rounded-lg w-full hover:bg-blue-700 transition duration-300 flex justify-center items-center gap-2 disabled:opacity-60"
          disabled={loading}
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register here
          </a>
        </p>
      </form>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Login;
