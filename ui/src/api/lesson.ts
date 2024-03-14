import { BASE_URL } from "."
import axios from "axios";


export const getCurrentLessons = async (token: string) => {
    try {
        const res = await axios.get(
            `${BASE_URL}/lessons/my/now`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        console.log(res.data.data)
        return res.data.data
    }
    catch (err) {
        console.log(err)
    }
}