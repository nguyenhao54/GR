import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../redux/store'
import { Button, TextField } from '@mui/material'
import { getCookie } from './components/dashboard/AttendanceCard'
import { getMyInfo, updateMe } from '../api/user'
import { setCurrentUser } from '../redux/user.reducer'
import { useNavigate } from 'react-router-dom'
import { FaUpload } from 'react-icons/fa6'
import { closeTopLoading, showTopLoading } from '../redux/toploading.reducer'
import firebase from 'firebase/compat/app';
import { setDialog } from '../redux/dialog.reducer'

function Profile() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const token = getCookie("token");
    const user = useSelector((appState: AppState) => appState.user.user)
    const [userPhoto, setUserPhoto] = useState<any>({ img: user?.photo })
    const [userPhone, setUserPhone] = useState(user?.phone)

    useEffect(() => {
        if (!user) {
            const token = getCookie("token")
            if (token) {
                getMyInfo(token || "").then((res) => {
                    if (res) {
                        if (res?.data?.data) dispatch(setCurrentUser(res.data.data))
                        else navigate("login")
                    }
                    else navigate("login")
                })
            } else navigate("login")
        }
    }, [])

    const handleImageUpload = (e: any) => {
        if (!e.target.files) {
            return;
        }
        let items = e.target.files;
        items = [...items].map((item: any) => ({
            ...item,
            img: URL.createObjectURL(item),
            title: item.name,
        }));
        // console.log(items);
        setUserPhoto(items[0]);
    };

    const handleSave = async () => {
        dispatch(showTopLoading())
        let newUser = { ...user }
        if (userPhoto.img !== user?.photo) {
            const storage = firebase.storage();
            const img = await fetch(userPhoto.img)
            const blob = await img.blob();
            const ref = storage.ref(`/userPhots/${userPhoto.title}`)
            await ref.put(blob);
            const url = await ref.getDownloadURL();
            newUser = { ...user, photo: url, phone: userPhone }
        }
        const res = await updateMe(token, newUser);
        console.log("update me", res)
        if (res?.status === "success") {

            dispatch(setDialog({
                title: "Chỉnh sửa hồ sơ thành công",
                open: true,
                type: "info",
                isMessagebar: true
            }))

        } else {
            dispatch(setDialog({
                title: "Chỉnh sửa hồ sơ thất bại, vui lòng thử lại sau",
                open: true,
                type: "warning",
                isMessagebar: true
            }))
        }
        dispatch(closeTopLoading())
    }

    return (
        <div className="bg-white rounded-md p-8 pt-4 w-[100%] flex flex-col items-center h-[calc(100vh-80px)]">
            <div className="flex flex-row justify-between items-center w-full">
                <div className="w-full p-6 pt-4 flex items-center gap-2 md: min-w-[500px] border-b-neutral-200 border-b">
                    <Button className="relative w-44"
                        sx={{
                            margin: 0,
                            padding: 0,
                            height: "100%",
                            "&:hover": {
                                backgroundColor: "transparent",
                            },
                            textTransform: "none",
                        }}
                        disabled={user?.role === "student"}
                        disableRipple>
                        <img src={userPhoto.img} className="w-36 border-8 shadow-md border-neutral-200 h-36 rounded-full"></img>
                        <div className="absolute top-0 bottom-0 w-36 right-0 left-4 height-[100%] opacity-0 rounded-full hover:cursor-pointer transition-all hover:opacity-60 hover:bg-neutral-400 ">
                            <div
                                className="absolute text-white text-xl flex items-center justify-center w-36 h-36"
                                onClick={(e: any) => {
                                    // setImage(undefined)
                                }}
                            >
                                <input
                                    className='absolute cursor-pointer opacity-0 text-xl flex items-center justify-center w-36 h-36'
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    hidden
                                    onChange={handleImageUpload}
                                />
                                <FaUpload size={40} />
                            </div>
                        </div>
                    </Button>

                    <div className="pl-2 flex gap-2 flex-col w-1/2">
                        <div className='text-md text-neutral-400 rounded-md font-semibold'>{user?.role === "teacher" ? "Giáo viên" : user?.role === "student" ? "Sinh viên" : "Quản trị"}</div>

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
                        label="Ngày Sinh"
                        defaultValue={user?.DOB ? new Date(user.DOB).toLocaleString('en-GB', { day: "2-digit", month: "2-digit", year: "numeric" }) : ""}
                        InputProps={{
                            readOnly: true,
                        }}
                        style={{ width: "100%" }}
                        variant="outlined"
                    />
                    <TextField
                        id="phone"
                        label="Số điện thoại"
                        defaultValue={userPhone}
                        // InputProps={{
                        //     readOnly: true,
                        // }}
                        onChange={(e) => {
                            setUserPhone(e.target.value)
                        }}
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
            <div className="flex justify-end w-full mr-12 mt-2">
                <Button
                    variant="contained"
                    sx={{
                        textTransform: "none",
                        backgroundColor: "#C1121F",
                        "&:hover": {
                            backgroundColor: "#C1121F"
                        }
                    }}
                    disabled={userPhoto.img === user?.photo && userPhone === user?.phone}
                    onClick={() => handleSave()}
                >Lưu thay đổi
                </Button>
            </div>
        </div>
    )
}

export default Profile