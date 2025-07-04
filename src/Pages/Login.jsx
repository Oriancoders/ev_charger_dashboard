import { useEffect, useState } from "react";
import { useGlobalContext } from "../GlobalStates/GlobalState";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import ApiService from "../ApiServices/ApiService";



const Login = () => {
  const { authType, setAuthType, isAuthenticated, setIsAuthenticated, authData, setAuthData } = useGlobalContext();
  const [isPass, setIsPass] = useState(false);
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(false)
  const [fetchMessage , setFetchMessage] = useState("")
  const navigate = useNavigate();
  const inputClassName = "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 text-sm"

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
        setFetchMessage("Fetching user information......")
        setIsFetching(true)

        const response = await ApiService.loginUser({ email, password });
        if (response.statusCodeValue === 200) {
          setFetchMessage("User fetched ...... redirecting to home")
          setIsAuthenticated(true);

          // Update authData state
          setAuthData({
            id: response.body.id,
            username: response.body.username,
            email: response.body.email,
            role: response.body.role,
            accessToken: response.body.accessToken
          });

          navigate("/main-dashboard");
          setIsFetching(false)
        }
      } catch (error) {
        setIsFetching(false)
        if (error.response && error.response.status === 401) {
          setError("Wrong email or password")
        }
        else {
          setError("Our Server is currently not responing")
        }
        setTimeout(() => setError(''), 5000);
      }

    } 
    //if switch is for sugnup 
    else {
      console.log("authtype .......... " , authType)
      const username = form.usernameSignup.value.trim();
      const email = form.emailSignup.value.trim();
      const password = form.passwordSignup.value;
      const confirmPassword = form.confirmPasswordSignup.value;
      const phoneNumber = form.phoneNumberSignup.value.trim();
      const cnic = form.cnicSignup.value.trim();

      if (!username || !email || !password || !confirmPassword || !phoneNumber || !cnic) {
        setError("Please fill all input fields")
        setTimeout(() => {
          setError(null)
        }, 5000)
        return;
      }
      
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setTimeout(() => {
          setError(null)
        }, 5000);
        return;

      }

      
      try {
        console.log("user details ..." , username , email , password , confirmPassword , phoneNumber , cnic)
        setFetchMessage("Registoring the user.....")
        setIsFetching(true)
        const response = await ApiService.signupUser({ username, email, password, phoneNumber, cnic });
        console.log(response);
        if (response.statusCode === 200) {
          setFetchMessage("Registored the user ...... Now Login")
          setTimeout(() => {
            setAuthType("Login")
          } , 2000)
        }
        setIsFetching(false)
      } catch (error) {
        setIsFetching(false)
        console.log("asds111");
        if (error.response && error.response.status === 400) {
          setError("cant sugnup ");
        }
        else {
          setError("Network Error");
        }
        setTimeout(() => setError(''), 5000);
      }
    }
  };





  return (
    <div className="min-h-screen flex items-center justify-center  gap-y-6 bg-gradient-to-br from-[#c3dafe] to-[#ebf4ff] animate-fadeIn py-8">
      
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-linear-150 from-white via-5% to-blue-100   p-4 rounded-2xl space-y-4 shadow-2xl w-[90%] max-w-md transition-all duration-100 ease-in-out hover:shadow-blue-200 ">
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
        <AnimatePresence >
          {authType === "Login" ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, scale: 0.1, }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.1 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 text-center"
              onSubmit={handleAuthentication}
            >
              {error && <p className='text-red-600 my-4 text-sm'>{error}</p>}

              {isFetching ? (

                <div className="w-full flex justify-center items-center text-xl min-h-32">
                  {fetchMessage}
                </div>
              ) : ( 
                <>
                  <input
                    type='text'
                    name="emailLogin"
                    className={inputClassName}
                    placeholder='User Name'
                    maxLength={20}
                  />

                  <div className='relative'>
                    <input
                      type={isPass ? 'text' : 'password'}
                      name="passwordLogin"
                      className={inputClassName}
                      placeholder='Enter your password'
                      maxLength={20}
                    />
                    <span onClick={() => setIsPass(!isPass)} className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-blue-600 transition-all'>
                      {isPass ? <IoIosEye size='1.2em' /> : <IoIosEyeOff size='1.2em' />}
                    </span>
                  </div>


                  <button type='submit' className='w-48 cursor-pointer bg-linear-to-b from-[#0A86F0] via-[#0A86F0] to-[#3870AB] text-white py-2 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 text-sm'>
                    Login
                  </button>
                </>
              )}
            </motion.form>
          ) : (
            <motion.form
              key="signup"
              initial={{ opacity: 0, scale: 0.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.1 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 text-center"
              onSubmit={handleAuthentication}
            >
              {error && <p className='text-red-600 my-3 text-sm'>{error}</p>}

              {isFetching ? (
                <div className="w-full flex justify-center items-center text-xl min-h-32">
                  {fetchMessage}
                </div>
              ) : (
                <>
                  <input
                    type='text'
                    className={inputClassName}
                    placeholder='User Name'
                    maxLength={20}
                    name="usernameSignup"
                  />
                  <input
                    type='email'
                    className={inputClassName}
                    placeholder='Email Address'
                    maxLength={40}
                    name="emailSignup"
                  />

                  <input
                    type='number'
                    className={inputClassName}
                    placeholder='Phone Number'
                    maxLength={11}
                    name="phoneNumberSignup"
                  />
                  <input
                    type='text'
                    className={inputClassName}
                    placeholder='CNIC Number'
                    maxLength={13}
                    name="cnicSignup"
                  />
                  <div className='relative'>
                    <input
                      type={isPass ? 'text' : 'password'}
                      name="passwordSignup"
                      className={inputClassName}
                      placeholder='Enter your password'
                      maxLength={20}
                    />
                    <span onClick={() => setIsPass(!isPass)} className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-blue-600 transition-all'>
                      {isPass ? <IoIosEye size='1.2em' /> : <IoIosEyeOff size='1.2em' />}
                    </span>
                  </div>
                  {/* confirm password input */}
                  <div className='relative'>
                    <input
                      type={isPass ? 'text' : 'password'}
                      name="confirmPasswordSignup"
                      className={inputClassName}
                      placeholder='Enter your Confirm password'
                      maxLength={20}
                    />
                    <span onClick={() => setIsPass(!isPass)} className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-blue-600 transition-all'>
                      {isPass ? <IoIosEye size='1.2em' /> : <IoIosEyeOff size='1.2em' />}
                    </span>
                  </div>

                  <button disabled={isFetching ? true : false} className='w-48 cursor-pointer bg-linear-to-b from-[#0A86F0] via-[#0A86F0] to-[#3870AB] text-white py-2 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200'>
                    Signup
                  </button>
                </>
              )}
            </motion.form>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};

export default Login;
