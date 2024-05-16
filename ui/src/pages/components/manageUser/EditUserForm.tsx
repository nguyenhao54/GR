import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { MenuProps } from '../../Grade'
import { getStyles } from '../../Result'

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
    const [role, setRole] = useState(user?.role || "student")
    const theme = useTheme();

    React.useImperativeHandle(ref, () => {
        return {
            changedUser: { ...user },
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

    return (
        <div className="w-full flex flex-col font-montserrat gap-4">
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
                            console.log(e.target.value)
                        }}
                        style={{ width: "100%" }}
                        variant="outlined"
                    />
                    {nameError && <div className="text-[10px] text-lightRed mt-1 -mb-5 pb-3 italic w-full">{nameError}</div>}

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
                            console.log(e.target.value)
                        }}
                        style={{ width: "100%" }}

                        variant="outlined"
                    />
                    {emailError && <div className="text-[10px] text-lightRed mt-1 -mb-5 pb-3 italic w-full">{emailError}</div>}
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
                            console.log(e.target.value)
                        }}
                        style={{ width: "100%" }}
                        variant="outlined"
                    />
                    {phoneError && <div className="text-[10px] text-lightRed mt-1 -mb-5 pb-3 italic w-full">{phoneError}</div>}

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
                            console.log(e.target.value)
                        }}
                        style={{ width: "100%" }}

                        variant="outlined"
                    />
                    {codeError && <div className="text-[10px] text-lightRed mt-1 -mb-5 pb-3 italic w-full">{codeError}</div>}
                </div>
            </div>
            <div className="flex gap-2">
                <div className="w-1/2">
                    <TextField
                        id="password"
                        label="Mật khẩu"
                        required
                        defaultValue={phone}
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
                <div className="w-1/2">
                    <TextField
                        id="passwordConfirm"
                        label="Xác nhận mật khẩu"
                        required
                        defaultValue={codeNumber}
                        onChange={(e) => {
                            setCodeError("")
                            setPassword(e.target.value)
                            console.log(e.target.value)
                        }}
                        style={{ width: "100%" }}

                        variant="outlined"
                    />
                    {passwordConfirmError && <div className="text-[10px] text-lightRed mt-1 -mb-5 pb-3 italic w-full">{passwordConfirmError}</div>}
                </div>

            </div>
            <div className="flex gap-2">
                <div className="w-1/2">
                    <FormControl fullWidth >
                        <InputLabel id="demo-simple-select-label">Học kỳ</InputLabel>
                        <Select
                            className='w-full text-black'
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // multiple
                            value={role || ""}
                            onChange={
                                (e) => {
                                    setRole(e.target.value)
                                    console.log(e.target.value)
                                }
                            }
                            input={<OutlinedInput label="Học kỳ" className='w-64 text-black' />}
                            MenuProps={MenuProps}
                        >
                            {["teacher", "student", "admin"].map((item: string) => (
                                <MenuItem
                                    key={item}
                                    value={item}
                                    style={getStyles(item, role, theme)}
                                >
                                    {item}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="w-1/2">
                    <TextField
                        id="name"
                        label="Họ và tên"
                        required
                        defaultValue={name}
                        onChange={(e) => {
                            setNameError("")
                            setName(e.target.value)
                            console.log(e.target.value)
                        }}
                        style={{ width: "100%" }}
                        variant="outlined"
                    />
                    {nameError && <div className="text-[10px] text-lightRed mt-1 -mb-5 pb-3 italic w-full">{nameError}</div>}
                </div>
            </div>
        </div>
    )
})

export default EditUserForm