import { BASE_URL } from "."
import axios from "axios";

export const getMyInfo = async (token: string) => {
    try {
        const res = await axios.get(
            `${BASE_URL}/users/me`,
            {headers: {Authorization: `Bearer ${token}` }}
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
            {headers: {Authorization: `Bearer ${token}` }}
        )
       return res.data
    }
    catch (err) {
        console.log(err)
    }
}

export const deleteUser = async (token: string, userId: string) => {
    try {
        const res = await axios.delete(
            `${BASE_URL}/users/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
    }
    catch (err) {
        console.log(err)
    }
}



