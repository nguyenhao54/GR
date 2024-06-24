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


export const getClasses = async (token: string) => {

    try {
        const res = await axios.get(
            `${BASE_URL}/classes`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data.data
    }
    catch (err) {
        console.log(err)
    }
}


export const deleteClass = async (token: string, classId: string) => {
    try {
        await axios.delete(
            `${BASE_URL}/classes/${classId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
    }
    catch (err) {
        console.log(err)
    }
}

export const createClass = async (token: string, classObj: any) => {
    try {
        const res = await axios.post(
            `${BASE_URL}/classes`,
            {
                ...classObj
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data
    }
    catch (err) {
        console.log(err)
    }
}

export const editClass = async (token: string, classId: string, classObj: any) => {
    try {
        console.log(classObj.students);
        const res = await axios.patch(
            `${BASE_URL}/classes/${classId}`,
            {
                semester: classObj.semester,
                teacher: classObj.teacher._id,
                duration: classObj.duration,
                location: classObj.location,
                subject: classObj.subject._id,
                students: classObj.students.map((item: any) => item._id),
                firstStartTime: classObj.firstStartTime,
                lastStartTime: classObj.lastStartTime,
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data
    }
    catch (err) {
        console.log(err)
    }
}