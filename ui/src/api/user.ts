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



