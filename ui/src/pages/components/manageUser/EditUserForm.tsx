import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { MenuProps } from '../../Grade'
import { getStyles } from '../../Result'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'

const EditUserForm = React.forwardRef(({ user }: { user: any }, ref) => {

    const [name, setName] = useState(user?.name || "")
    const [nameError, setNameError] = useState("")
    const [email, setEmail] = useState(user?.email || "")
    const [emailError, setEmailError] = useState("")
    const [phone, setPhone] = useState(user?.phone || "")
    const [phoneError, setPhoneError] = useState("")
    const [codeNumber, setCodeNumber] = useState(user?.codeNumber || "")
    const [codeError, setCodeError] = useState("")
    const [password, setPassword] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [passwordConfirmError, setPasswordConfirmError] = useState("")
    const [photo, setPhoto] = useState(user?.photo || "")
    const [photoError, setPhotoError] = useState("")
    const [role, setRole] = useState(user?.role || "student")
    const [gender, setGender] = useState(user?.gender || "male")
    const [major, setMajor] = useState(user?.major || "")
    const [faculty, setFaculty] = useState(user?.faculty || "")
    const [dob, setDob] = React.useState<Dayjs | null>(user?.DOB ? dayjs(new Date(user?.DOB))
        : user?.email
            ? null : dayjs(new Date()));
    const theme = useTheme();

    React.useImperativeHandle(ref, () => {
        return {
            changedUser: !user.email ? { phone, codeNumber, role, email, name, password, passwordConfirm }
                : { ...user, phone, codeNumber, role, email, name },
            validateForm: validate
        }
    })

    const validate = async () => {
        let validate = true;
        if (!name) {
            setNameError("Trường này là bắt buộc")
            validate = false;
        }
        if (!email) {
            setEmailError("Trường này là bắt buộc")
            validate = false;
        }
        if (!phone) {
            setPhoneError("Trường này là bắt buộc")
            validate = false;
        }
        if (!codeNumber) {
            setCodeError("Trường này là bắt buộc")
            validate = false;
        }
        if (!photo) {
            setPhotoError("Trường này là bắt buộc")
            validate = false;
        }
        if (!user.email) {
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
        }
        return validate
    }

    return (
        <div className="w-full flex flex-col font-montserrat font-[13px] gap-4">
            <div className="flex gap-2">
                <div className="w-1/2">
                    <TextField
                        id="name"
                        label="Họ và tên"
                        required
                        defaultValue={name}
                        onChange={(e) => {
                            setNameError("")
                            setName(e.target.value)
                        }}
                        style={{ width: "100%" }}
                        variant="outlined"
                    />
                    {nameError && <div className="text-[10px] text-lightRed mt-1 pb-1 italic w-full">{nameError}</div>}

                </div>
                <div className="w-1/2">
                    <TextField
                        id="email"
                        label="Email"
                        required
                        defaultValue={email}
                        onChange={(e) => {
                            setEmailError("")
                            setEmail(e.target.value)
                        }}
                        style={{ width: "100%" }}

                        variant="outlined"
                    />
                    {emailError && <div className="text-[10px] text-lightRed mt-1 pb-1 italic w-full">{emailError}</div>}
                </div>
            </div>
            <div className="flex gap-2">
                <div className="w-1/2">
                    <TextField
                        id="phone"
                        label="Sdt"
                        required
                        defaultValue={phone}
                        onChange={(e) => {
                            setPhoneError("")
                            setPhone(e.target.value)
                        }}
                        style={{ width: "100%" }}
                        variant="outlined"
                    />
                    {phoneError && <div className="text-[10px] text-lightRed mt-1 pb-1 italic w-full">{phoneError}</div>}

                </div>
                <div className="w-1/2">
                    <TextField
                        id="code"
                        label="Mã số"
                        required
                        defaultValue={codeNumber}
                        onChange={(e) => {
                            setCodeError("")
                            setCodeNumber(e.target.value)
                        }}
                        style={{ width: "100%" }}

                        variant="outlined"
                    />
                    {codeError && <div className="text-[10px] text-lightRed mt-1 pb-1 italic w-full">{codeError}</div>}
                </div>
            </div>
            {!user.email && <div className="flex gap-2">
                <div className="w-1/2">
                    <TextField
                        id="password"
                        label="Mật khẩu"
                        required
                        defaultValue={""}
                        onChange={(e) => {
                            setPasswordError("")
                            setPassword(e.target.value)
                        }}
                        style={{ width: "100%" }}
                        variant="outlined"
                    />
                    {passwordError && <div className="text-[10px] text-lightRed mt-1 pb-1 italic w-full">{passwordError}</div>}
                </div>
                <div className="w-1/2">
                    <TextField
                        id="passwordConfirm"
                        label="Xác nhận mật khẩu"
                        required
                        defaultValue={""}
                        onChange={(e) => {
                            setPasswordConfirmError("")
                            setPasswordConfirm(e.target.value)
                        }}
                        style={{ width: "100%" }}
                        variant="outlined"
                    />
                    {passwordConfirmError && <div className="text-[10px] text-lightRed mt-1 pb-1 italic w-full">{passwordConfirmError}</div>}
                </div>
            </div>}
            <div className="flex gap-2">
                <div className="w-1/2">
                    <FormControl fullWidth >
                        <InputLabel id="demo-simple-select-label">Giới tính</InputLabel>
                        <Select
                            className='w-full text-black'
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // multiple
                            value={gender || ""}
                            onChange={
                                (e) => {
                                    setGender(e.target.value)

                                }
                            }
                            input={<OutlinedInput label="Giới tính" className='w-64 text-black' />}
                            MenuProps={MenuProps}
                        >
                            {[

                                { value: "male", text: "Nam" },
                                { value: "female", text: "Nữ" },

                            ].map((item: any) => (
                                <MenuItem
                                    key={item.value}
                                    value={item.value}
                                    style={getStyles(item.value, gender, theme)}
                                >
                                    {item.text}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="w-1/2">
                    <TextField
                        id="photo"
                        label="Ảnh"
                        required
                        defaultValue={photo}
                        onChange={(e) => {
                            setPhotoError("")
                            setPhoto(e.target.value)
                        }}
                        style={{ width: "100%" }}
                        variant="outlined"
                    />
                    {photoError && <div className="text-[10px] text-lightRed mt-1 pb-1 italic w-full">{photoError}</div>}
                </div>
            </div>
            <div className="flex gap-2">
                <div className="w-1/2">
                    <FormControl fullWidth >
                        <InputLabel id="demo-simple-select-label">Vai trò</InputLabel>
                        <Select
                            className='w-full text-black'
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // multiple
                            value={role || ""}
                            onChange={
                                (e) => {
                                    setRole(e.target.value)

                                }
                            }
                            input={<OutlinedInput label="Vai trò" className='w-64 text-black' />}
                            MenuProps={MenuProps}
                        >
                            {[
                                { value: "teacher", text: "Giáo viên" },
                                { value: "student", text: "Sinh viên" },
                                { value: "admin", text: "Quản trị" }
                            ].map((item: any) => (
                                <MenuItem
                                    key={item.value}
                                    value={item.value}
                                    style={getStyles(item.value, role, theme)}
                                >
                                    {item.text}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="w-1/2">
                    <TextField
                        id="faculty"
                        label="Khoa/Viện"
                        defaultValue={faculty}
                        onChange={(e) => {
                            setFaculty(e.target.value)
                        }}
                        style={{ width: "100%" }}
                        variant="outlined"
                    />
                    {nameError && <div className="text-[10px] text-lightRed mt-1 pb-1 italic w-full">{nameError}</div>}
                </div>
            </div>
            <div className="flex gap-2">
                <div className="w-1/2">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="Ngày sinh"
                            value={dob}
                            format="DD/MM/YYYY"
                            onChange={(newValue) => setDob(newValue)}
                            sx={{ width: "100%" }} />
                    </LocalizationProvider>
                </div>
                <div className="w-1/2">
                    <TextField
                        id="major"
                        label="Chuyên ngành"
                        defaultValue={major}
                        onChange={(e) => {
                            setMajor(e.target.value)
                        }}
                        style={{ width: "100%" }}
                        variant="outlined"
                    />
                    {codeError && <div className="text-[10px] text-lightRed mt-1 pb-1 italic w-full">{codeError}</div>}
                </div>
            </div>
        </div>
    )
})

export default EditUserForm