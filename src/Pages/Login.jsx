import { useEffect, useState } from "react";
import { useGlobalContext } from "../GlobalStates/GlobalState";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { isLoggedIn, setIsLoggedIn } = useGlobalContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email === "sami@gmail.com" && password === "12345") {
      setIsLoggedIn(true);
      alert("Login successful!");
      navigate("/main-dashboard");
    } else {
      setError("Incorrect email or password.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [email, password]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#c3dafe] to-[#ebf4ff] animate-fadeIn">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[90%] max-w-md transition-all duration-300 ease-in-out hover:shadow-blue-200">
        <h1 className="text-5xl font-extrabold text-center text-blue-600 mb-1 tracking-wide">
          EV Charger
        </h1>
        <p className="text-center font-bold text-xl mb-6">
          Admin Login
        </p>

        {error && (
          <p className="bg-red-100 text-red-600 py-2 px-3 mb-4 rounded text-sm text-center">
            ⚠ {error}
          </p>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-blue-600 transition-all"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-all duration-200"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
