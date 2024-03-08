import { BASE_URL } from "."
import axios from "axios";

export const login = async ({ email, password }: { email: string, password: string }) => {
    try {
        const res = await axios.post(
            `${BASE_URL}/users/login`,
            {
                email,
                password
            },
        )
       return res.data
    }
    catch (err) {
        console.log(err)
    }
}



