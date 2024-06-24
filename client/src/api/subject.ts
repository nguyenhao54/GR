import { BASE_URL } from "."
import axios from "axios";

export const getSubject = async (token: string, query?: string) => {
    try {
        const res = await axios.get(
            `${BASE_URL}/subjects${query || ""}`,
            {headers: {Authorization: `Bearer ${token}` }}
        )
       return res.data
    }
    catch (err) {
        console.log(err)
    }
}