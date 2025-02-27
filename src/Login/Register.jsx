import { FaUser } from "react-icons/fa6";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";

import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-[800px] h-full max-h-[900px] grid md:grid-cols-2 grid- rounded-lg overflow-hidden">
                {/* Left Side */}
                <div className="p-8 bg-white order-1 md:order-none">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold flex justify-center items-center">Registration</h2>
                        </div>

                        <form className="space-y-4 flex flex-col items-center justify-center w-full">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="bg-gray-50 h-[45px] w-full pl-5"
                                    autoComplete="username"
                                />
                                <FaUser className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                            </div>

                            <div className="relative w-full">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="bg-gray-50 h-[45px] w-full pl-5"
                                    autoComplete="email"
                                />
                                <MdEmail className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                            </div>

                            <div className="relative w-full">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="h-[45px] w-full pl-5 bg-gray-50"
                                    autoComplete="new-password"
                                />
                                <RiLockPasswordFill className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                            </div>

                            <button type="submit" className="w-full bg-blue-500 font-semibold hover:bg-blue-600 h-[45px] text-white rounded-lg">
                                Register
                            </button>
                        </form>

                    </div>
                </div>
                {/* Right Side */}
                <div className="relative bg-blue-500 p-8 text-white flex flex-col items-center justify-center rounded-tr-full">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
                        <p className="mb-4 text-sm opaciကty-90 flex justify-center">Already have an account?</p>
                        <button onClick={() => navigate("/")} className="w-full h-[45px]  font-semibold text-white hover:border-2 border rounded-lg">Login</button>
                    </div>
                    <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-blue-400  rounded-tl-full " />
                </div>
            </div>
        </div>
    )
}

export default Register;