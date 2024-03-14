import { BASE_URL } from "."
import axios from "axios";


export const getMyAttendanceForLesson = async (token: string, lessonId: string, userId: string) => {
    try {
        const res = await axios.get(
            `${BASE_URL}/attendances?lesson=${lessonId}&student=${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        console.log(res.data.data)
        return res.data.data
    }
    catch (err) {
        console.log(err)
    }
}

export const createAttendance = async (token: string, lessonId: string, checkInTime: string, student: string) => {
    try {
        const res = await axios.post(
            `${BASE_URL}/attendances`,
            {

                lesson: lessonId,
                checkInTime: checkInTime,
                student: student,

            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        console.log(res.data.data)
        return res.data.data
    }
    catch (err) {
        console.log(err)
    }
}

export const updateAttendance = async (token: string, attendanceId: string, checkOutTime: string) => {
    try {
        const res = await axios.patch(
            `${BASE_URL}/attendances/${attendanceId}`,
            {
                checkOutTime: checkOutTime,

            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        // console.log(res.data.data)
        return res.data.data
    }
    catch (err) {
        console.log(err)
    }
}