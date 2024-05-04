import axios from 'axios'
import { BASE_URL } from '.'

export const getMyClasses = async (token: string) => {

    try {
        const res = await axios.get(
            `${BASE_URL}/classes/my`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data.data
    }
    catch (err) {
        console.log(err)
    }
}
