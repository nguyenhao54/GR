import { Button, TextField } from '@mui/material'
import React from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { BiImageAdd } from 'react-icons/bi';
import { FaXmark } from 'react-icons/fa6';
import { getCookie } from '../dashboard/AttendanceCard';
import { getMyLessons } from '../../../api/lesson';
import firebase from 'firebase/compat/app';
import "firebase/compat/storage";
import { createBatchRequest } from '../../../api/requests';
import { AppState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { closeTopLoading, showTopLoading } from '../../../redux/toploading.reducer';
import { setDialog } from '../../../redux/dialog.reducer';

function RequestForm() {
    const storage = firebase.storage();
    const user = useSelector((appState: AppState) => appState.user.user);
    const [startTime, setStartTime] = React.useState<Dayjs | null>(dayjs(new Date()));
    const [endTime, setEndTime] = React.useState<Dayjs | null>(dayjs(new Date()));
    const [image, setImage] = React.useState<any>(undefined);
    const [reason, setReason] = React.useState<any>();
    const [url, setURL] = React.useState<string>("");
    const dispatch = useDispatch();
    const handleSend = async () => {
        const token = getCookie("token")
        const lessons = (await getMyLessons(token, `startDateTime=${startTime?.toDate().toUTCString()}&endDateTime=${endTime?.toDate().toUTCString()}`)).lessons
        if (lessons.length > 0) {
            //if there is lesson in the selected time period
            dispatch(showTopLoading())
            const img = await fetch(image.img)
            const blob = await img.blob();
            const ref = storage.ref(`/images/${image.title}`);
            await ref.put(blob);
            const url = await ref.getDownloadURL();
            setURL(url);
            const lessonIds = lessons.map((item: any) => item._id)
            const res = await createBatchRequest(token, lessonIds, reason, user!._id, url)
            dispatch(closeTopLoading())
            if (res?.status === "success") {
                //display success dialog
                dispatch(setDialog({
                    title: "Tạo yêu cầu thành công",
                    open: true,
                    type: "info",
                    isMessagebar: true
                }))

            } else {
                dispatch(setDialog({
                    title: "Tạo yêu cầu thất bại, vui lòng thử lại sau",
                    open: true,
                    type: "warning",
                    isMessagebar: true
                }))
            }
        }
        else {
            dispatch(setDialog({
                customWidth: 400,
                customHeight: 240,
                title: "Thông tin không hợp lệ",
                open: true,
                type: "info",
                content: (
                    <div className='pl-6 font-montserrat text-xs font-medium'>
                        Khoảng thời gian bạn chọn không có lớp học hoặc không hợp lệ, vui lòng kiểm tra lại!
                    </div>
                ),
            }))
        }
    }

    const handleImageUpload = (e: any) => {
        if (!e.target.files) {
            return;
        }
        let items = e.target.files;
        items = [...items].map((item: any) => ({
            ...item,
            img: URL.createObjectURL(item),
            title: item.name,
        }));
        setImage(items[0]);
    };

    return (
        <div className="w-full">
            <div className="font-semibold text-lg my-1 pb-3 sm:my-4 text-neutral-800">Tạo yêu cầu</div>
            <div className='flex flex-col items-stretch'>
                <div className="flex-col flex gap-2 sm:gap-4">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div className="flex justify-between flex-row gap-2 sm:gap-4  w-full">
                            <DateTimePicker
                                label="Thời gian bắt đầu"
                                value={startTime}
                                className='w-full'
                                onChange={(newValue) => setStartTime(newValue)}
                            />
                            <DateTimePicker
                                label="Thời gian kết thúc"
                                value={endTime}
                                className='w-full'
                                onChange={(newValue) => setEndTime(newValue)}
                            />
                        </div>

                    </LocalizationProvider>

                    <div className="w-full">
                        <TextField
                            id="code"
                            label="Lý do"
                            required
                            multiline
                            rows='4.7'
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value)
                            }}
                            style={{ width: "100%" }}
                            variant="outlined"
                        />
                    </div>
                </div>
                <div>{
                    image && <div className="relative mt-4 w-1/2">
                        <img
                            className="rounded-md"
                            src={image.img}
                            alt={image.title}
                        // loading="lazy"
                        />
                        <div className="absolute top-0 bottom-0 right-0 left-0 height-[100%] opacity-0 rounded-md hover:cursor-pointer transition-all hover:opacity-60 hover:bg-neutral-500 ">
                            <div
                                className="absolute text-white text-xl right-1 top-1 rounded-full bg-black p-1"
                                onClick={(e: any) => {
                                    setImage(undefined)
                                }}
                            >
                                <FaXmark />
                            </div>
                        </div>
                    </div>
                }
                </div>

                <div className="pt-4">
                    {!image &&
                        <div
                            className={`flex items-center w-48 justify-center p-1 px-4 hover:bg-neutral-200 rounded-md text-md hover:cursor-pointer`}
                        >
                            <Button
                                component="label"
                                fullWidth
                                disableRipple
                                startIcon={
                                    <BiImageAdd style={{ color: "#C1121F", fontSize: "20px" }} />
                                }
                                sx={{
                                    margin: 0,
                                    padding: 0,
                                    height: "100%",
                                    "&:hover": {
                                        backgroundColor: "transparent",
                                    },
                                    textTransform: "none",
                                }}
                            >
                                <div className="text-md text-[#C1121F] font-semibold">Thêm ảnh minh chứng*</div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    hidden
                                    onChange={handleImageUpload}
                                />
                            </Button>
                        </div>
                    }
                </div>
            </div>

            <div className="flex mt-4">
                <Button
                    variant="contained"
                    disabled={!startTime || !endTime || !image || !reason}
                    sx={{
                        textTransform: "none",
                        backgroundColor: "#C1121F",
                        "&:hover": {
                            backgroundColor: "#C1121F"
                        }
                    }}
                    onClick={() => handleSend()}
                >Gửi
                </Button>
            </div>
        </div>
    )
}

export default RequestForm