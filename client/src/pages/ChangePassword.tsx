import { Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import { updatePassword } from '../api/user'
import { getCookie } from './components/dashboard/AttendanceCard'
import { setDialog } from '../redux/dialog.reducer'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa6'

function ChangePassword() {
    const navigate = useNavigate()
    const [oldPassword, setOldPassword] = useState("")
    const [oldPasswordError, setOldPasswordError] = useState("")
    const [password, setPassword] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [passwordConfirmError, setPasswordConfirmError] = useState("")
    const token = getCookie("token");

    const validate = () => {
        let validate = true;
        if (!oldPassword) {
            setOldPasswordError("Trường này là bắt buộc")
            validate = false;
        }
        if (!password) {
            setPasswordError("Trường này là bắt buộc")
            validate = false;
        }
        if (!passwordConfirm) {
            setPasswordConfirmError("Trường này là bắt buộc")
            validate = false;
        }
        else if (passwordConfirm !== password) {
            setPasswordConfirmError("Xác nhận mật khẩu không trùng với mật khẩu")
            validate = false;
        }
        return validate
    }

    const handleChangePassword = async () => {

        if (validate()) {
            const res = await updatePassword(token, oldPassword, password, passwordConfirm)
            console.log(res)
            if (res.status !== "success") {
                setOldPasswordError("Mật khẩu cũ không chính xác")
            }
            else {
                dispatch(setDialog({
                    title: "Đổi mật khẩu thành công",
                    open: true,
                    type: "info",
                    isMessagebar: true
                }))
            }

        }
    }

    return (
        <div className="bg-white rounded-md p-4 sm:p-8 pt-4 w-[100%] h-max flex flex-col items-center">
            <div className="w-full">
            <button className="text-lightRed rounded-full p-2 hover:bg-neutral-200  cursor-pointer"
              onClick={() => {
                navigate('/profile')
              }}
            ><FaArrowLeft /></button>
                <p className='text-lg font-semibold my-1 pb-3'>Đổi mật khẩu</p>
                <div className="flex flex-col gap-2">
                    <div className="w-3/4 sm:w-1/3">
                        <TextField
                            id="password"
                            label="Mật khẩu cũ"
                            required
                            defaultValue={""}
                            onChange={(e) => {
                                setOldPasswordError("")
                                setOldPassword(e.target.value)
                                console.log(e.target.value)
                            }}
                            style={{ width: "100%" }}
                            variant="outlined"
                        />
                        {oldPasswordError && <div className="text-[10px] text-lightRed mt-1 -mb-5 pb-3 italic w-full">{oldPasswordError}</div>}
                    </div>
                    <div className="w-3/4 sm:w-1/3">
                        <TextField
                            id="password"
                            label="Mật khẩu mới"
                            required
                            defaultValue={""}
                            onChange={(e) => {
                                setPasswordError("")
                                setPassword(e.target.value)
                                console.log(e.target.value)
                            }}
                            style={{ width: "100%" }}
                            variant="outlined"
                        />
                        {passwordError && <div className="text-[10px] text-lightRed mt-1 -mb-5 pb-3 italic w-full">{passwordError}</div>}
                    </div>
                    <div className="w-3/4 sm:w-1/3">
                        <TextField
                            id="passwordConfirm"
                            label="Xác nhận mật khẩu mới"
                            required
                            defaultValue={""}
                            onChange={(e) => {
                                setPasswordConfirmError("")
                                setPasswordConfirm(e.target.value)
                                console.log(e.target.value)
                            }}
                            style={{ width: "100%" }}
                            variant="outlined"
                        />
                        {passwordConfirmError && <div className="text-[10px] text-lightRed mt-1 -mb-5 pb-3 italic w-full">{passwordConfirmError}</div>}
                    </div>
                </div>
                <div className="flex justify-start w-full mr-12 mt-4">
                    <Button
                        variant="contained"
                        sx={{
                            textTransform: "none",
                            backgroundColor: "#C1121F",
                            "&:hover": {
                                backgroundColor: "#C1121F"
                            }
                        }}
                        disabled={!oldPassword || !password || !passwordConfirm}
                        onClick={() => handleChangePassword()}
                    >Lưu thay đổi
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword

function dispatch(arg0: any) {
    throw new Error('Function not implemented.')
}
