import { useEffect, useState } from "react";
import { LiaHandPointer } from "react-icons/lia";
import { MdLocationPin } from "react-icons/md";
import MyLocation from "./MyLocationMap";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../redux/store";
import { setDialog } from "../../../redux/dialog.reducer";
import Attendify from "./Attendify";
import { getCurrentLesson } from "../../../api/lesson";
import { DotFlashing } from "../../../common";
import { ThemePic } from "./../../../assets/img";
import { getMyAttendanceForLesson } from "../../../api/attendance";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { Lesson, User } from '../../../models';
import { FaInfo } from "react-icons/fa6";
import { getHourAndMinute } from '../../../utils';
import React from 'react';
export interface IAttendance {
    id?: string;
    _id?: string;
    checkInTime?: string;
    checkOutTime?: string;
    isSuccessful?: boolean;
    lesson?: Lesson;
    student?: User;
    isFromDB?: boolean;
}

export const getToday = () => {
    const current_day = new Date().getDay();
    switch (current_day) {
        case 0:
            return "Chủ nhật";
        case 1:
            return "Thứ hai";
        case 2:
            return "Thứ ba";
        case 3:
            return "Thứ tư";
        case 4:
            return "Thứ năm";
        case 5:
            return "Thứ sau";
        case 6:
            return "Thứ bảy";
    }
};

export function getCookie(cname: string) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getClock() {
    return new Date().toLocaleString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function AttendanceCard() {
    const user = useSelector((appState: AppState) => appState.user.user);
    const [attendance, setAttendance] = useState<IAttendance>();
    const [lesson, setLesson] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);
    const dispatch = useDispatch();
    const [clock, setClock] = useState<string>(getClock());
    const [captureVideo, setCaptureVideo] = React.useState(true);

    const [position, setPosition] = useState<any>({
        latitude: null,
        longitude: null,
    });

    const videoRef = React.useRef<any>();

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    setPosition({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                null,
                { enableHighAccuracy: true }
            );
        } else {
            console.log("Geolocation is not available in your browser.");
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        const token = getCookie("token");
        setInterval(() => setClock(getClock()), 60 * 1000);
        getCurrentLesson(token)
            .then((res: any) => {
                setLesson(res?.lessons[0]);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const token = getCookie("token");
        if (lesson && user) {
            getMyAttendanceForLesson(token, lesson?._id, user._id).then((res) => {
                setAttendance(res?.data[0]);
            });
        }
    }, [lesson, user]);

    if (loading) {
        return (
            <div className='bg-white flex-1 rounded-md p-4 sm:w-[37%] w-[99%] flex lg:flex-col items-center h-stretch justify-center'>
                <DotFlashing></DotFlashing>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className='bg-white flex-1 rounded-md p-4 sm:w-[37%] w-[99%] flex flex-col min-h-[calc(100vh-80px)] items-center h-stretch'>
                <div className='text-neutral-400 flex mt-4 flex-col justify-center items-center'>
                    <IoMdCheckmarkCircleOutline size={60} color={"#0072D0"} />
                    <div className='font-semibold text-md py-8 px-4'>
                        Bạn không có lớp học nào vào thời điểm này
                    </div>
                </div>
                <img src={ThemePic} alt="Theme pic" />
            </div>
        );
    }

    const { subject = "", location = " " } = lesson?.class;
    const { endDateTime = " ", startDateTime = "" } = lesson;
    // console.log(location)
    // sai so 100m cx ok

    const locationDetails = <>    <div className='text-sm font-semibold mt-2'>
        {subject.title} {subject.subjectId}
    </div>
        <div className='text-xs font-semibold mt-1 text-lightRed'>
            {getHourAndMinute(startDateTime)} - {getHourAndMinute(endDateTime)}
        </div>
        <div className='text-xs font-semibold mt-1 text-neutral-500 flex items-center gap-1'>
            <MdLocationPin size={14} />
            Vị trí: {location.description || "Không có dữ liệu"}
        </div>
        <div className='w-3/4 h-3/5 mt-2'>
            <MyLocation></MyLocation>
        </div></>

    // if (Math.abs(position.latitude - location.coordinates[0]) > 0.001 || Math.abs(position.longitude - location.coordinates[1]) > 0.001) {
    //     // console.log(position, location.coordinates)
    //     return <div className='bg-white rounded-md flex-1 p-4 sm:w-[37%] w-[99%] flex flex-col items-center min-h-[calc(100vh-280px)] sm:min-h-[calc(100vh-80px)] h-stretch'>
    //         <div className="text-neutral-400 rounded-full border-4 border-neutral-400 p-2 mt-2"><FaInfo size={30}></FaInfo>
    //         </div>
    //         <div className='text-sm font-semibold text-neutral-400 mt-2 p-0 sm:p-2'>
    //             <div>Vị trí hiện tại không trùng vị trí lớp học.</div>
    //         </div>
    //         {locationDetails}
    //     </div>
    // }


    const closeWebcam = () => {

        // navigator.mediaDevices.getUserMedia().
        let pausePromise = videoRef.current?.pause();
        if (pausePromise !== undefined) {
            pausePromise.then((res: any) => {

                // Automatic playback started!
                // Show playing UI.
            })
                .catch((e: any) => {
                    // Auto-play was prevented
                    // Show paused UI.
                });
        }
        // videoRef.current?.pause();
        videoRef.current?.srcObject?.getTracks().forEach((track: any) => track.stop())
        setCaptureVideo(false);

    };

    return (
        <div className='bg-white rounded-md flex-1 p-4 sm:w-[37%] w-[99%] flex flex-col items-center min-h-[calc(100vh-280px)] sm:min-h-[calc(100vh-80px)] h-max'>
            <div className='text-base font-semibold mt-2'>{clock}</div>
            <div className='text-xs font-semibold text-neutral-500'>
                {`${getToday()}, Ngày ${new Date().toLocaleString("en-GB", {
                    day: "2-digit",
                })} Tháng ${new Date().toLocaleString("en-GB", {
                    month: "2-digit",
                })}`}
            </div>
            {attendance?.checkInTime ? (
                <div
                    role={'none'}
                    className='border-lightRed hover:cursor-pointer border-8 rounded-full min-w-40 min-h-40 m-4 gap-2 flex shadow-2xl justify-center flex-col text-neutal-800 items-center'
                    onClick={() => {
                        setCaptureVideo(true);
                        dispatch(
                            setDialog({
                                customWidth: 360,
                                customHeight: 180,
                                title: "Xác nhận Check-out",
                                open: true,
                                type: "warning",
                                onClickOk: () => {
                                    dispatch(
                                        setDialog({
                                            customWidth: 700,
                                            customHeight: 500,
                                            title: "Xác nhận điểm danh",
                                            open: true,
                                            content: (
                                                <div className='w-full h-full flex items-center justify-center'>
                                                    <Attendify
                                                        attendance={attendance}
                                                        setAttendance={setAttendance}
                                                        lesson={lesson}
                                                        videoRef={videoRef}
                                                        // captureVideo={captureVideo}
                                                        // setCaptureVideo={setCaptureVideo}
                                                    ></Attendify>
                                                </div>
                                            ),
                                            onClickClose: () => {
                                                closeWebcam();
                                                // setCaptureVideo(true);
                                            }
                                        })
                                    );
                                },
                                content: (
                                    <div className='pl-6 font-nunitoSans text-xs font-medium'>
                                        Bạn có chắc chắn muốn check-out?
                                    </div>
                                ),
                            })
                        );
                    }}
                >
                    <LiaHandPointer className='text-6xl text-lightRed -ml-2'></LiaHandPointer>
                    <div className='text-md font-semibold justify-center text-lightRed flex items-center'>
                        CHECK-OUT
                    </div>
                    <div />
                </div>
            ) : (
                <div
                    role={"none"}
                    className='bg-[#D9D9D9] hover:cursor-pointer rounded-full min-w-40 min-h-40 m-4 gap-2 flex shadow-2xl justify-center flex-col text-neutal-800 items-center'
                    onClick={() => {
                        dispatch(
                            setDialog({
                                customWidth: 700,
                                customHeight: 500,
                                title: "Xác nhận điểm danh",
                                open: true,
                                content: (
                                    <div className='w-full h-full flex items-center justify-center'>
                                        <Attendify
                                            attendance={attendance}
                                            setAttendance={setAttendance}
                                            lesson={lesson}
                                            videoRef={videoRef}
                                            // captureVideo={captureVideo}
                                            // setCaptureVideo={setCaptureVideo}
                                        ></Attendify>
                                    </div>
                                ),
                                onClickClose: () => {
                                    closeWebcam();
                                    // setCaptureVideo(true);
                                }
                            })
                        );
                    }}
                >
                    <LiaHandPointer className='text-6xl text-neutral-800 -ml-2'></LiaHandPointer>
                    <div className='text-md font-semibold justify-center flex items-center'>
                        CHECK-IN
                    </div>
                    <div />
                </div>
            )}
            {locationDetails}
        </div>
    );
}

export default AttendanceCard;
