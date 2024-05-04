import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../redux/store'
import { TextField } from '@mui/material'
import { getCookie } from './components/dashboard/AttendanceCard'
import { getMyInfo } from '../api/user'
import { setCurrentUser } from '../redux/user.reducer'
import { useNavigate } from 'react-router-dom'

function Profile() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((appState: AppState) => appState.user.user)
    useEffect(() => {
        if (!user) {
            const token = getCookie("token")
            if (token) {
                getMyInfo(token || "").then((res) => {
                    if (res) {
                        if ( res?.data?.data) dispatch(setCurrentUser(res.data.data))
                        else navigate("login")
                    }
                    else navigate("login")
                })
            } else navigate("login")
        }
    }, [])

    return (
        <div className="bg-white rounded-md p-8 pt-4 w-[100%] flex flex-col items-center h-[calc(100vh-80px)]">
            <div className="flex flex-row justify-between items-center w-full">
                <div className="w-full p-6 pt-4 flex items-center gap-2 md: min-w-[500px]">
                    <img src={user?.photo} className="w-36 border-8 shadow-md border-neutral-200 h-36 rounded-full"></img>
                    <div className="pl-2 flex gap-2 flex-col">
                        <div className='text-md text-neutral-400 rounded-md font-semibold'>{user?.role === "teacher" ? "Giáo viên" : "Sinh viên"}</div>

                        <div className="font-bold text-lg text-neutral-800">{user?.name}</div>
                        <div className="font-semibold text-[14px] text-neutral-600"> {user?.codeNumber || ""}</div>
                        <div className='font-semibold text-neutral-400'>{user?.faculty}</div>

                    </div>
                </div>
                {/* <div className='text-md p-2 text-lightRed rounded-md text-center justify-center font-semibold w-24'>{user?.role === "teacher" ? "Giáo viên" : "Sinh viên"}</div> */}
            </div>

            <div className="h-[1px] w-full mb-6 bg-neutral-200"></div>

            <div className="w-full px-6 py-4">
                <div className="flex gap-8">
                    <TextField
                        id="name"
                        label="Họ và tên"
                        defaultValue={user?.name}
                        InputProps={{
                            readOnly: true,
                        }}
                        style={{ width: "100%" }}
                        variant="outlined"

                    />
                    {user?.role === "student" ?
                        <TextField
                            id="code"
                            label="Mã số sinh viên"
                            defaultValue={user?.codeNumber}
                            InputProps={{
                                readOnly: true,
                            }}
                            style={{ width: "100%" }}
                            variant="outlined"
                        /> :
                        <></>}
                </div>
            </div>
            <div className="w-full px-6 py-4">
                <div className="flex gap-8">
                    <TextField
                        id="dob"
                        label="Ngày Tháng Năm Sinh"
                        defaultValue={ user?.DOB ? new Date(user.DOB).toLocaleString('en-US', { day: "2-digit", month: "2-digit", year: "numeric" }): ""}
                        InputProps={{
                            readOnly: true,
                        }}
                        style={{ width: "100%" }}
                        variant="outlined"

                    />
                    <TextField
                        id="phone"
                        label="Số điện thoại"
                        defaultValue={user?.phone}
                        // InputProps={{
                        //     readOnly: true,
                        // }}
                        style={{ width: "100%" }}
                        variant="outlined"
                    />

                </div>
            </div>
            <div className="w-full px-6 py-4">
                <div className="flex gap-8">
                    <TextField
                        id="email"
                        label="Email"
                        defaultValue={user?.email}
                        InputProps={{
                            readOnly: true,
                        }}
                        style={{ width: "100%" }}
                        variant="outlined"

                    />
                    {user?.role === "student" ?
                        <TextField
                            id="status"
                            label="Tình trạng"
                            defaultValue={user?.active ? "Học" : "Thôi Học"}
                            InputProps={{
                                readOnly: true,
                            }}
                            style={{ width: "100%" }}
                            variant="outlined"
                        /> : <></>}
                </div>
            </div>
            <div className="w-full px-6 py-4">
                <div className="flex gap-8">
                    <TextField
                        id="major"
                        label="Chuyên ngành"
                        defaultValue={user?.major}
                        InputProps={{
                            readOnly: true,
                        }}
                        style={{ width: "100%" }}
                        variant="outlined"
                    />
                    <TextField
                        id="faculty"
                        label="Khoa/Viện"
                        defaultValue={user?.faculty}
                        InputProps={{
                            readOnly: true,
                        }}
                        style={{ width: "100%" }}
                        variant="outlined"
                    />
                </div>
            </div>
        </div>
    )
}

export default Profile