import TextField from '@mui/material/TextField'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/login';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../redux/user.reducer';
import { FaChessPawn } from 'react-icons/fa6';

function LoginByField({ setCookie }: { setCookie: (name: string, value: any) => void }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string>("")

    const handleLogin = async () => {
        const data = await login({ email, password })
        if (data?.data.user) {
            dispatch(setCurrentUser(data.data.user))
            setCookie("token", data.token)
            data.data.user.role === "student" ? navigate('/dashboard') : data.data.user.role === "teacher" ? navigate("/calendar") : navigate("/admin/manage-user")
        }
        else {
            setError("Tài khoản hoặc mật khẩu không chính xác")
        }
    }

    return (
        <div>
            <form className="mt-4 mb-2 font-montserrat">
                <div className="my-4">
                    <TextField sx={{ fontWeight: 600 }} onChange={(e) => {
                        setError("");
                        setEmail(e.target.value)
                    }
                    } fullWidth required id="email" label="Email" variant="standard" />
                </div>
                <div className="mt-4">
                    <TextField onChange={(e) => {
                        setError("");
                        setPassword(e.target.value)
                    }} fullWidth required id="password" label="Password" type='password' variant="standard" />
                </div>
                {error && <div className="text-[10px] text-lightRed mt-1 -mb-5 pb-3 italic w-full">{error}</div>}
                <Link
                    className="inline-block mt-4 align-baseline text-xs font-semibold text-neutral-800 hover:text-venetianRed"
                    to="#"
                >
                    Quên mật khẩu?
                </Link>
                <div className="flex items-center justify-center">
                    <button
                        className="bg-venetianRed hover:bg-barnRed text-white font-semibold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={() => handleLogin()}
                    >
                        Đăng nhập
                    </button>
                </div>
            </form>
        </div>
    );
}

function SignIn({ setCookie }: any) {
    return (
        <div className="absolute inset-0 flex font-montserrat items-center justify-center p-4">
            <div
                className="w-full sm:w-4/12 p-4 bg-lightOverlay rounded-md border-neutral-200 border
    flex flex-col items-center justify-center"
            >
                <div className='w-full text-3xl text-neutral-800 flex font-bold justify-center'>
                    TEND<span><FaChessPawn color="#C1121F" /></span>FY
                </div>

                <div className="w-full">
                    <hr className="divide-white mt-3"></hr>
                    <LoginByField setCookie={setCookie}></LoginByField>
                </div>

                {/* <div className="w-full">
                    <hr className="divide-white my-1"></hr>
                </div>
                <p className=" text-l font-bold mt-2">
                    Chưa có tài khoản?
                </p>
                <div
                    className="flex items-center justify-center gap-2 mb-2 py-2 px-4 rounded-md bg-cardOverlay 
      cursor-pointer hover:underline duration-100 ease-in-out transition-all"
                >
                    <p className="text-l font-semibold">
                        Đăng ký
                    </p>
                </div> */}
            </div>
        </div>
    )
}

export default SignIn