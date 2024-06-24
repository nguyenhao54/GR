import { BASE_URL } from "."
import axios from "axios";

export const createBatchRequest = async (token: string, lessonIds: string, reason: string, student: string, photo: string) => {
    try {
        const res = await axios.post(
            `${BASE_URL}/requests/createBatch`,
            {
                lessonIds,
                reason,
                student,
                photo
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data
    }
    catch (err) {
        console.log(err)
    }
}


export const getRequests = async (token: string) => {

    try {
        const res = await axios.get(
            `${BASE_URL}/requests/my`,
            { headers: { Authorization: `Bearer ${token}` } }
        )

        const data = res.data.data.requests.sort((a: any, b: any) => {
            const dateA = new Date(a.lesson.startDateTime).getTime();
            const dateB = new Date(b.lesson.startDateTime).getTime();
            return (dateB - dateA)
          });
        return data
    }
    catch (err) {
        console.log(err)
    }
}


export const handleRequest = async (token: string, requestId: string, isApprove: boolean) => {
    try {
        const res = await axios.patch(
            `${BASE_URL}/requests/${requestId}/approve`,
            {
                status: isApprove ? "approved":"denied"
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data
    }
    catch (err) {
        console.log(err)
    }
}

export const editRequest = async (token: string, requestId: string, request: any ) => {
    try {
        const res = await axios.patch(
            `${BASE_URL}/requests/${requestId}`,
            {
                reason: request.reason,
                photo: request.photo
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data
    }
    catch (err) {
        console.log(err)
    }
}

export const deleteRequest = async (token: string, requestId: string) => {
    try {
        await axios.delete(
            `${BASE_URL}/requests/${requestId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
    }
    catch (err) {
        console.log(err)
    }
}