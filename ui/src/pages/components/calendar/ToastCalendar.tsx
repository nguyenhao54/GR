import Calendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { getCookie } from '../dashboard/AttendanceCard';
import { getMyLessons } from '../../../api/lesson';
import { minusSevenHours } from '../../../utils';
import { BACKGROUND_COLOR, BORDER_COLOR } from '../../../utils/styles';
import { useNavigate } from 'react-router-dom';
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";
import { Lesson } from '../../../models';
import { Tabs, Tab } from '@mui/material';

export interface CalendarEvent {
    id: string;
    calendarId: string;
    title: string;
    location?: string;
    dueDateClass?: string;
    start?: string;
    end?: string;
    due_at?: string;
    is_done?: boolean;
    backgroundColor?: string;
    borderColor?: string;
    color?: string;
    body?: string;
    raw?: {
        class?: string;
        memo?: string;
        priority: number;
        reminders: number[];
    };
    state?: string;
}

export default function ToastCalendar() {
    const navigate = useNavigate()
    const calendarRef = React.useRef<any>();
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [events, setEvents] = useState<CalendarEvent[]>();
    const [view, setView] = useState<any>("week")
    const token = getCookie("token")

    useEffect(() => {
        getMyLessons(token).then((data: any) => {
            setEvents(data?.lessons.map((item: Lesson) => {
                const random = Number(item.startDateTime?.toString()[9]) % 5;
                return ({
                    ...item, start: minusSevenHours(item.startDateTime?.toString() || ""),
                    end: minusSevenHours(item.endDateTime?.toString() || ""),
                    backgroundColor: BACKGROUND_COLOR[random],
                    borderColor: BORDER_COLOR[random],
                    title: item.class?.classId + " - " + item.class?.subject?.title,
                    location: item.class?.location.description
                })
            }) || [])
        })
    }, [token])

    const handleClickNextButton = () => {
        const calendarInstance = calendarRef.current?.getInstance();
        // calendarInstance
        calendarInstance.next();
        const dateStart = moment(
            calendarInstance.getDateRangeStart().toDate()
        ).format("YYYY/MM/DD");
        const dateEnd = moment(calendarInstance.getDateRangeEnd().toDate()).format(
            "YYYY/MM/DD"
        );

        setStartDate(dateStart);
        setEndDate(dateEnd);
    };

    const handleClickPrevButton = () => {
        const calendarInstance = calendarRef.current?.getInstance();

        calendarInstance.prev();
        const dateStart = moment(
            calendarInstance.getDateRangeStart().toDate()
        ).format("YYYY/MM/DD");
        const dateEnd = moment(calendarInstance.getDateRangeEnd().toDate()).format(
            "YYYY/MM/DD"
        );

        setStartDate(dateStart);
        setEndDate(dateEnd);
    };

    const handleClickNowButton = () => {
        const calendarInstance = calendarRef.current?.getInstance();
        calendarInstance.today();
    };

    const onAfterRenderEvent = () => {
        const calendarInstance = calendarRef.current?.getInstance();

        const dateStart = moment(
            calendarInstance.getDateRangeStart().toDate()
        ).format("YYYY/MM/DD");
        const dateEnd = moment(calendarInstance.getDateRangeEnd().toDate()).format(
            "YYYY/MM/DD"
        );

        setStartDate(dateStart);
        setEndDate(dateEnd);
        calendarInstance.setOptions({
            template: {
                time(event: any) {
                    return (
                        `<div class="flex flex-col justify-start ${view !== "month" ? "pt-1" : ""} rounded-md">
                  ${view !== "month" ? `<div class="whitespace-normal flex flex-row gap-2">
                    <div class="rounded-md pt-0.5 px-1 font-semibold text-white" style="background-color:${event.borderColor};">
                      ${moment(event.start.toDate()).format("HH:mm")}
                    </div>
                    <div class="rounded-md pt-0.5 px-1 font-semibold text-white" style="background-color:${event.borderColor}; ">
                      ${moment(event.end.toDate()).format("HH:mm")}
                    </div>
                  </div>`: ``}
                  <div class="whitespace-normal text-neutral-700 font-semibold  ${view !== "month" ? "pt-1" : ""} pl-1">${event.title}</div>
                  <div class="whitespace-normal text-neutral-500 font-semibold pt-1 pl-1"> <FaLocationDot /> ${event.location}</div>

                </div>`
                    )
                },
                // task(event: any) {
                //     return (
                //         `<div class="flex flex-row justify-start gap-2">
                //   <div class="rounded-md py-0.5 px-1 font-semibold" style="background-color:${event.backgroundColor}; ">
                //       ${moment(event.end.toDate()).format("HH:mm")}
                //   </div>
                //   <div class="whitespace-normal font-semibold">${event.title}</div>
                // </div>`
                //     )
                // },
            },
        });
    };

    const handleClickEvent = (eventObj: any) => {
        navigate(`${eventObj.event.id}`)
        // setEvent(eventObj)
        // dispatch(setDialog({
        //     title: "Chi tiết buổi học",
        //     open: true,
        //     customHeight: 400,
        //     content: <LessonDetail lessonId={eventObj.event.id}></LessonDetail>,
        //     // type: "info"
        // }))

    }

    return (
        <div className='w-full h-full'>
            <nav className="navbar -mt-4 flex flex-row items-center justify-between">
                <div className="">
                    <button
                        type="button"
                        className="inline-block rounded-sm text-white font-medium p-2 hover:cursor-pointer shadow-sm hover:opacity-85 transition-all bg-lightRed"
                        onClick={handleClickNowButton}
                    >
                        Hôm nay
                    </button>
                </div>
                <div className="flex flew-row items-center gap-2 py-6">
                    <div
                        className="cursor-pointer"
                        onClick={handleClickPrevButton}
                    >
                        <GoTriangleLeft />
                    </div>
                    <div className="uppercase text-sm font-semibold text-gray-600 ">
                        {startDate} - {endDate}
                    </div>
                    <div
                        className="cursor-pointer"
                        onClick={handleClickNextButton}
                    >
                        <GoTriangleRight />
                    </div>
                </div>
                <div className="calendar_tab">
                    <Tabs
                        TabIndicatorProps={{ style: { background: '#C1121F', transition: "none" }, sx: { bgcolor: "#FF5733" } }}
                        value={view || "week"}
                        onChange={(_, val) => setView(val)}
                        textColor="inherit"
                        aria-label="secondary tabs example"
                    >
                        <Tab value={"day"} label="Ngày" />

                        <Tab value={"week"} label="Tuần" />
                        <Tab value={"month"} label="Tháng" />
                    </Tabs>
                </div>
            </nav>
            <Calendar
                ref={calendarRef}
                onClickEvent={(event) => handleClickEvent(event)}
                onAfterRenderEvent={onAfterRenderEvent}
                usageStatistics={false}
                height="calc(100vh - 188px)"
                view={view}
                theme={{
                    scheduleView: ["time"],
                    common: {
                        gridSelection: {
                            backgroundColor: "rgba(81, 92, 230, 0.01)",
                            border: "4px solid #515ce6",
                        },
                    },
                }}
                week={{
                    startDayOfWeek: 1,
                    dayNames: [
                        "Chủ Nhật",
                        "Thứ Hai",
                        "Thứ Ba",
                        "Thứ Tư",
                        "Thứ Năm",
                        "Thứ Sáu",
                        "Thứ Bảy",
                    ],
                    narrowWeekend: false,
                    workweek: false, /// hide weekend
                    showNowIndicator: true,
                    showTimezoneCollapseButton: true,
                    timezonesCollapsed: false,
                    hourStart: 0,
                    hourEnd: 24,
                    eventView: ["time"],
                    taskView: false,
                    collapseDuplicateEvents: false,
                }}

                month={{
                    dayNames: [
                        "Chủ Nhật",
                        "Thứ Hai",
                        "Thứ Ba",
                        "Thứ Tư",
                        "Thứ Năm",
                        "Thứ Sáu",
                        "Thứ Bảy",
                    ],
                    visibleWeeksCount: 0,
                    workweek: false,
                    narrowWeekend: false,
                    startDayOfWeek: 1,
                    isAlways6Weeks: false,
                    visibleEventCount: 6,
                }}
                events={events}
            />
        </div>
    );
}