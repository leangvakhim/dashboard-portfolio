import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import logo from "../assets/image/logo.png";
import { API_ENDPOINTS, axiosInstance } from '../component/APIConfig';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            Swal.fire({
                title: 'Signing In...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const res = await axiosInstance.post(API_ENDPOINTS.LoginUser, {
                name,
                password
            }, {
                withCredentials: true
            });

            if (res.data?.status_code === 'success') {
                const userRole = res.data?.data?.user?.role;
                if (userRole === 'admin') {
                    localStorage.setItem('userRole', userRole);
                    navigate('/');
                    Swal.close();
                } else {
                    Swal.close();
                    Swal.fire({
                        icon: 'error',
                        title: 'Access Denied',
                        text: 'You do not have permission to access the admin dashboard.'
                    });
                }
            } else {
                console.log('Unexpected response:', res.data);
                throw new Error(res.data.message || 'Unexpected login response.');
            }

        } catch (err) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                // More robust error message for debugging
                text: 'Incorrect Username or Password' || 'Invalid credentials'
            });
        }
    };

    return (
        <div class="flex flex-col w-full  overflow-hidden relative min-h-screen radial-gradient items-center justify-center g-0 px-4">
            <div class="justify-center items-center w-full card lg:flex max-w-md ">
                <div class=" w-full card-body">
                    <a class="py-4 block cursor-default"><img src={logo} alt="" class="mx-auto w-30 "/></a>
                    {/* <!-- form --> */}
                    <form onSubmit={handleLogin}>
                        {/* <!-- name --> */}
                        <div class="mb-4">
                            <label for="forUsername"
                                class="block text-sm mb-2 text-gray-400">Username</label>
                            <input type="text" id="forUsername" value={name} onChange={(e) => setName(e.target.value)}
                            class="py-3 px-4 block w-full border-gray-200 rounded-sm text-sm focus:border-blue-600 focus:ring-0 " aria-describedby="hs-input-helper-text"/>
                        </div>
                        {/* <!-- password --> */}
                        <div class="mb-6">
                            <label for="forPassword"
                            class="block text-sm  mb-2 text-gray-400">Password</label>
                        <input type={showPassword ? "text" : "password"} id="forPassword" value={password} onChange={(e) => setPassword(e.target.value)}
                            class="py-3 px-4 block w-full border-gray-200 rounded-sm text-sm focus:border-blue-600 focus:ring-0 " aria-describedby="hs-input-helper-text"/>
                        </div>
                        {/* <!-- checkbox --> */}
                        <div class="flex justify-between">
                            <div class="flex">
                                <input
                                    type="checkbox"
                                    className="shrink-0 mt-0.5 border-gray-200 rounded-[4px] text-blue-600 focus:ring-blue-500"
                                    id="hs-default-checkbox"
                                    checked={showPassword}
                                    onChange={() => setShowPassword(!showPassword)}
                                />
                                <label for="hs-default-checkbox" class="text-sm text-gray-500 ms-3">Show Password</label>
                            </div>
                        </div>
                        {/* <!-- button --> */}
                        <div class="grid my-6">
                            <button type="submit" class="btn py-[10px] text-base text-white font-medium !bg-[#FFD36A]">Sign In</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login