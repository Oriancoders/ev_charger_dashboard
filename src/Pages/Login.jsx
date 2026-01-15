import { useEffect, useState } from "react";
import { useGlobalContext } from "../GlobalStates/GlobalState";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosEye, IoIosEyeOff, IoIosArrowBack } from "react-icons/io";

const Login = () => {
  const {
    authType,
    setAuthType,
    loginMock,
    setIsLoginPage, // ✅ close overlay
  } = useGlobalContext();

  const [isPass, setIsPass] = useState(false);
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [fetchMessage, setFetchMessage] = useState("");
  const navigate = useNavigate();

  // ✅ close on Escape
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsLoginPage(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setIsLoginPage]);

  const inputClassName =
    "w-full p-2 rounded-md outline-none transition-all duration-200 text-sm bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/60";

  const handleAuthentication = async (e) => {
    e.preventDefault();
    setError("");

    const form = e.target;

    if (authType === "Login") {
      const email = form.emailLogin.value.trim();
      const password = form.passwordLogin.value;

      if (!email || !password) {
        setError("Please fill in all fields");
        setTimeout(() => setError(""), 4000);
        return;
      }

      try {
        setFetchMessage("Checking credentials...");
        setIsFetching(true);

        await new Promise((r) => setTimeout(r, 700));

        const result = loginMock(email, password);

        if (!result?.success) {
          setIsFetching(false);
          setError(result?.message || "Wrong email or password");
          setTimeout(() => setError(""), 5000);
          return;
        }

        setFetchMessage("Login successful! Redirecting...");
        await new Promise((r) => setTimeout(r, 450));

        setIsFetching(false);
        setIsLoginPage(false); // ✅ close overlay nicely
        navigate("/main-dashboard");
        return;
      } catch (err) {
        console.error(err);
        setIsFetching(false);
        setError("Something went wrong");
        setTimeout(() => setError(""), 5000);
        return;
      }
    }

    // Signup disabled
    setError("Signup is disabled in demo mode. Use demo login.");
    setTimeout(() => setError(""), 5000);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-10 px-4 overflow-hidden">
      {/* ✅ dark blurred background to match landing */}
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 backdrop-blur-xl" />

      {/* subtle gradient glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-indigo-500/20 blur-3xl" />

      <motion.div
        layout
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* ✅ back arrow */}
        <button
          type="button"
          onClick={() => setIsLoginPage(false)}
          className="absolute -top-12 left-0 flex items-center gap-2 text-white/80 hover:text-white transition"
        >
          <IoIosArrowBack size={22} />
          <span className="text-sm font-semibold">Back</span>
        </button>

        {/* main card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-5 sm:p-6 backdrop-blur-2xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center tracking-wide text-white">
            EV Charger
          </h1>
          <p className="text-center text-white/60 text-sm mt-2">
            Demo access • Fast UI preview
          </p>

          {/* Tabs */}
          <div className="flex justify-center mt-5">
            <div className="flex p-1 bg-white/10 rounded-full shadow-inner w-[220px] border border-white/10">
              {["Login", "Signup"].map((type) => (
                <motion.button
                  key={type}
                  type="button"
                  onClick={() => setAuthType(type)}
                  className={`flex-1 py-1.5 rounded-full text-sm font-semibold transition-colors duration-300 ${
                    authType === type ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                  animate={{
                    background:
                      authType === type
                        ? "linear-gradient(180deg, rgba(10,134,240,0.95), rgba(56,112,171,0.95))"
                        : "rgba(255,255,255,0)",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {type}
                </motion.button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {authType === "Login" ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="space-y-3 text-center mt-5"
                onSubmit={handleAuthentication}
              >
                {error && <p className="text-red-400 text-sm">{error}</p>}

                {isFetching ? (
                  <div className="w-full flex justify-center items-center text-lg min-h-32 text-white/80">
                    {fetchMessage}
                  </div>
                ) : (
                  <>
                    <input
                      type="email"
                      name="emailLogin"
                      className={inputClassName}
                      placeholder="Email "
                      maxLength={60}
                      autoComplete="email"
                    />

                    <div className="relative">
                      <input
                        type={isPass ? "text" : "password"}
                        name="passwordLogin"
                        className={inputClassName}
                        placeholder="Password"
                        maxLength={40}
                        autoComplete="current-password"
                      />
                      <span
                        onClick={() => setIsPass(!isPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 cursor-pointer hover:text-white transition"
                      >
                        {isPass ? <IoIosEye size="1.2em" /> : <IoIosEyeOff size="1.2em" />}
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 cursor-pointer bg-gradient-to-b from-[#0A86F0] via-[#0A86F0] to-[#3870AB] text-white py-2.5 rounded-xl font-semibold hover:opacity-95 transition-all duration-200"
                    >
                      Login
                    </button>

                    
                  </>
                )}
              </motion.form>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 text-center mt-6"
              >
                {error && <p className="text-red-400 text-sm">{error}</p>}

                <div className="w-full flex justify-center items-center text-sm min-h-24 text-white/70">
                  Signup is disabled in demo mode.
                </div>

                <button
                  type="button"
                  onClick={() => setAuthType("Login")}
                  className="w-full cursor-pointer bg-white/10 hover:bg-white/15 border border-white/10 text-white py-2.5 rounded-xl font-semibold transition"
                >
                  Back to Login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
