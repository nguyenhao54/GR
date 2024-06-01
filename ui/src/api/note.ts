import { BASE_URL } from "."
import axios from "axios";

export const getNote = async (token: string, query?: string) => {
    try {
        const res = await axios.get(
            `${BASE_URL}/notes${query || ""}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data.data
    }
    catch (err) {
        console.log(err)
    }
}


export const createNote = async (token: string, lessonId: string, userId: string, content: string) => {

    console.log(content.toString())

    try {
        const res = await axios.post(
            `${BASE_URL}/notes`,
            {
                lesson: lessonId,
                user: userId,
                content
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data
    }
    catch (err) {
        console.log(err)
    }
}


export const updateNote = async (token: string, noteId: string, content: string) => {

    console.log(content.toString())

    try {
        const res = await axios.patch(
            `${BASE_URL}/notes/${noteId}`,
            {
                content
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data
    }
    catch (err) {
        console.log(err)
    }
}

