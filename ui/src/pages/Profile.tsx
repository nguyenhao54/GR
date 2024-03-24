import React from 'react'
import { useSelector } from 'react-redux'
import { AppState } from '../redux/store'
import { TextField } from '@mui/material'

function Profile() {
    const user = useSelector((appState: AppState) => appState.user.user)

    return (
        <div className="bg-white rounded-md p-8 pt-4 w-[100%] h-max flex flex-col items-center">
            <div className="w-full p-6 pt-4 flex items-center gap-2 md: min-w-[500px]">
                <img src={user?.photo} className="w-36 border-8 shadow-md border-neutral-200 h-36 rounded-full"></img>
                <div className="pl-2 flex gap-2 flex-col">
                    <div className="font-bold text-lg text-neutral-800">{user?.name}</div>
                    <div className="font-semibold text-[14px] text-neutral-600"> {user?.codeNumber || ""}</div>
                    <div className='font-semibold text-neutral-400'>{user?.faculty}</div>

                </div>
            </div>
            <div className="h-[1px] w-full mb-6 bg-neutral-200"></div>

            <div className="w-full px-6 py-4">
                <div className="flex gap-8">
                    <TextField
                        id="filled-read-only-input"
                        label="Họ và tên"
                        defaultValue={user?.name}
                        InputProps={{
                            readOnly: true,
                        }}
                        style={{ width: "100%" }}
                        variant="outlined"

                    />
                    <TextField
                        id="filled-read-only-input"
                        label="Mã số sinh viên"
                        defaultValue={user?.codeNumber}
                        InputProps={{
                            readOnly: true,
                        }}
                        style={{ width: "100%" }}
                        variant="outlined"
                    />
                </div>
            </div>
            <div className="w-full px-6 py-4">
                <div className="flex gap-8">
                    <TextField
                        id="filled-read-only-input"
                        label="Ngày Tháng Năm Sinh"
                        defaultValue={user?.DOB?.toLocaleString('en-US', { day: "2-digit", month: "2-digit", year: "numeric" })}
                        InputProps={{
                            readOnly: true,
                        }}
                        style={{ width: "100%" }}
                        variant="outlined"

                    />
                    <TextField
                        id="filled-read-only-input"
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
                        id="filled-read-only-input"
                        label="Email"
                        defaultValue={user?.email}
                        InputProps={{
                            readOnly: true,
                        }}
                        style={{ width: "100%" }}
                        variant="outlined"

                    />
                    <TextField
                        id="filled-read-only-input"
                        label="Tình trạng"
                        defaultValue={user?.active? "Học": "Thôi Học"}
                        InputProps={{
                            readOnly: true,
                        }}
                        style={{ width: "100%" }}
                        variant="outlined"
                    />
                </div>
            </div>
            <div className="w-full px-6 py-4">
                <div className="flex gap-8">
                    <TextField
                        id="filled-read-only-input"
                        label="Chuyên ngành"
                        defaultValue={user?.major}
                        InputProps={{
                            readOnly: true,
                        }}
                        style={{ width: "100%" }}
                        variant="outlined"

                    />
                    <TextField
                        id="filled-read-only-input"
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