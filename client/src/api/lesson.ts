import { BASE_URL } from "."
import axios from "axios";


export const getCurrentLesson = async (token: string) => {
    try {
        const res = await axios.get(
            `${BASE_URL}/lessons/my/now`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data.data
    }
    catch (err) {
        console.log(err)
    }
}

export const getMyLessons = async (token: string, queryString?: string) => {
    
    try {
        const res = await axios.get(
            `${BASE_URL}/lessons/my${queryString ? `?${queryString}` : ""}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data.data
    }
    catch (err) {
        console.log(err)
    }
}

export const getLessonById = async (token: string, id: string) => {
    try {
        const res = await axios.get(
            `${BASE_URL}/lessons/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data.data.data
    }
    catch (err) {
        console.log(err)
    }
}