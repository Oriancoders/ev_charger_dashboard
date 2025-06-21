import { useEffect, useState } from "react";
import { useGlobalContext } from "../GlobalStates/GlobalState";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import ApiService from "../ApiServices/ApiService";



const Login = () => {
  const { authType, setAuthType, isAuthenticated, setIsAuthenticated } = useGlobalContext();
  const [isPass, setIsPass] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuthentication = async (e) => {
    e.preventDefault();

    const form = e.target;
    if (authType === "Login") {
      const email = form.emailLogin.value.trim();
      const password = form.passwordLogin.value;

      if (!email || !password) {
        setError("Please fill in all fields");
        setTimeout(() => {
          setError(null)
        }, 5000)
        return;
      }

      try {
        console.log(email,password);
            const response = await ApiService.loginUser({ email, password });
            console.log(response);
            if (response.statusCode == 200) {
                alert("Login Successful!");
                localStorage.setItem('token', response.token);
                localStorage.setItem('role', response.role);
                localStorage.setItem('email',response.email);
                localStorage.setItem('username',response.username);
                localStorage.setItem('id',response.id);
                // navigate(from, { replace: true });
                console.log(response);
            }
        } catch (error) {
          console.log("asds111");
            if(error.response && error.response.status === 401){
            alert("Invalid email and password!");
            }
            else{
                alert("Network Error");
            }
            setTimeout(() => setError(''), 5000);
        }
      

      // if (user) {
      //   alert("Login successful!");
      //   // localStorage.setItem('currUser' , JSON.stringify(user))
      //   localStorage.setItem('isAuthenticated', true)
      //   setIsAuthenticated(localStorage.getItem("isAuthenticated"))
      //   navigate("/main-dashboard")
      // } else {
      //   setError("Invalid email or Password");
      //   setTimeout(() => {
      //     setError(null)
      //   }, 5000)
      // }

    } else {
      const email = form.emailSignup.value.trim();
      // const email = form.emailSignup.value.trim();
      const password = form.passwordSignup.value;

      if (!email || !email || !password) {
        setError("Please fill all input fields")
        setTimeout(() => {
          setError(null)
        }, 5000)
        return;
      }

      // const alreadyExists = users.find(u => u.email === email);

      // if (alreadyExists) {
      //     setError("email already exisits .. usedifferent one");
      //     setTimeout(() => {
      //         setError(null)
      //     }, 5000)
      // } else
      {
        setError("Signup successful! ... Please Login to continue");
        setTimeout(() => {
          setError(null)
        }, 5000)
        const newUser = {
          userId: "u" + (users.length + 1),
          email: email.trim(),
          email: email.trim(),
          password: password.trim(),
          files: [],
        };

        users.push(newUser);  // ⬅️ Adds to your array
        console.log("Updated users list:", users);
      }
    }
  };

  

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#c3dafe] to-[#ebf4ff] animate-fadeIn">
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-linear-150 from-white via-5% to-blue-100   p-8 rounded-2xl space-y-4 shadow-2xl w-[90%] max-w-md transition-all duration-300 ease-in-out hover:shadow-blue-200">
        <h1 className="text-5xl font-extrabold text-center text-blue-600  tracking-wide">
          EV Charger
        </h1>




        <div className="flex justify-center mb-4">
          <div className="flex p-1 bg-[#e0e0e0] rounded-full shadow-inner w-[220px]">
            {["Login", "Signup"].map((type) => (
              <motion.button
                key={type}
                onClick={() => setAuthType(type)}
                className={`flex-1 py-1.5 rounded-full text-sm font-semibold transition-colors duration-300 ${authType === type ? "text-white" : "text-[#0A86F0] cursor-pointer"
                  }`}
                animate={{
                  backgroundImage: authType === type ? "linear-gradient(#0A86F0, #0A86F0, #3870AB)" : "linear-gradient(#e0e0e0, #e0e0e0)"
                }}
                transition={{ duration: 0.2 }}
              >
                {type}
              </motion.button>
            ))}
          </div>
        </div>

        {/* AnimatePresence for smooth transition */}
        <AnimatePresence mode="wait">
          {authType === "Login" ? (
            <motion.form
              key="login"
              layout
              initial={{ opacity: 0, scale: 0.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 text-center"
              onSubmit={handleAuthentication}
            >
              <input
                type='text'
                name="emailLogin"
                className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200'
                placeholder='User Name'
                maxLength={20}
              />

              <div className='relative'>
                <input
                  type={isPass ? 'text' : 'password'}
                  name="passwordLogin"
                  className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200'
                  placeholder='Enter your password'
                  maxLength={20}
                />
                <span onClick={() => setIsPass(!isPass)} className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-blue-600 transition-all'>
                  {isPass ? <IoIosEye size='1.2em' /> : <IoIosEyeOff size='1.2em' />}
                </span>
              </div>


              {error && <p className='text-red-600 my-3'>{error}ss</p>}
              <button type='submit' className='w-48 cursor-pointer bg-linear-to-b from-[#0A86F0] via-[#0A86F0] to-[#3870AB] text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200'>
                Login
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="signup"
              layout
              initial={{ opacity: 0, scale: 0.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 text-center"
              onSubmit={handleAuthentication}
            >
              <input
                type='text'
                className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200'
                placeholder='User Name'
                maxLength={20}
                name="emailSignup"
              />
              <input
                type='email'
                className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200'
                placeholder='Email Address'
                maxLength={40}
                name="emailSignup"
              />
              <div className='relative'>
                <input
                  type={isPass ? 'text' : 'password'}
                  name="passwordSignup"
                  className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200'
                  placeholder='Enter your password'
                  maxLength={20}
                />
                <span onClick={() => setIsPass(!isPass)} className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-blue-600 transition-all'>
                  {isPass ? <IoIosEye size='1.2em' /> : <IoIosEyeOff size='1.2em' />}
                </span>
              </div>
              {error && <p className='text-red-600 my-3'>{error}</p>}

              <button className='w-48 cursor-pointer bg-linear-to-b from-[#0A86F0] via-[#0A86F0] to-[#3870AB] text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200'>
                Signup
              </button>
            </motion.form>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};

export default Login;
