import axios from 'axios'
import { BASE_URL } from '.'

export const getMyGrade = async (token: string, semester?: number) => {

    try {
        const res = await axios.get(
            `${BASE_URL}/grades/my?semester=${semester}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data.data
    }
    catch (err) {
        console.log(err)
    }
}


export const createGrade = async (token: string, studentObjId: string, classObjectId: string, grade: any) => {

    try {
        const res = await axios.post(
            `${BASE_URL}/grades`,
            {
                class: classObjectId,
                student: studentObjId,
                ...grade
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        console.log(res)
        return res.data.data
    }
    catch (err) {
        console.log(err)
    }
}

export const updateGrade = async (token: string, gradeId: string, studentObjId: string, classObjectId: string, grade: any) => {

    try {
        const res = await axios.patch(
            `${BASE_URL}/grades/${gradeId}`,
            {
                class: classObjectId,
                student: studentObjId,
                ...grade
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data.data
    }
    catch (err) {
        console.log(err)
    }
}

export const getGrade = async (token: string, classId: string, studentId: string) => {

    try {
        const res = await axios.get(
            `${BASE_URL}/grades?class=${classId}&student=${studentId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data.data.data?.[0]
    }
    catch (err) {
        console.log(err)
    }
}
