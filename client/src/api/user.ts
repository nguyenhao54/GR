import { BASE_URL } from "."
import axios from "axios";

export const getMyInfo = async (token: string) => {
    try {
        const res = await axios.get(
            `${BASE_URL}/users/me`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data
    }
    catch (err) {
        console.log(err)
    }
}


export const getUsers = async (token: string, query?: string) => {
    try {
        const res = await axios.get(
            `${BASE_URL}/users${query || ""}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data
    }
    catch (err) {
        console.log(err)
    }
}

export const deleteUser = async (token: string, userId: string) => {
    try {
        await axios.delete(
            `${BASE_URL}/users/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
    }
    catch (err) {
        console.log(err)
    }
}

export const updateMe = async (token: string, user: any) => {
    try {
        const res = await axios.patch(
            `${BASE_URL}/users/updateMe`,
            {
                phone: user.phone,
                photo: user.photo
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data
    }
    catch (err) {
        console.log(err)
    }
}

export const createUser = async (token: string, user: any) => {
    try {
        const res = await axios.post(
            `${BASE_URL}/users/signup`,
            {
                ...user
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data
    }
    catch (err) {
        console.log(err)
    }
}


export const updateUser = async (token: string, user: any) => {
    try {
        const res = await axios.patch(
            `${BASE_URL}/users/${user._id}`,
            {
                phone: user.phone,
                photo: user.photo,
                codeNumber: user.codeNumber,
                role: user.role,
                email: user.email,
                name: user.name,
                DOB: user.dob,
                gender: user.gender,
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data
    }
    catch (err) {
        console.log(err)
    }
}

export const updatePassword = async (token: string, password: string, newPassword: string, newPasswordConfirm: string) => {
    try {
        const res = await axios.patch(
            `${BASE_URL}/users/updatePassword`,
            {
                password, newPassword, newPasswordConfirm,
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data
    }
    catch (err) {
        console.log(err)
    }
}
