import Calendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { getCookie } from '../dashboard/AttendanceCard';
import { getMyLessons } from '../../../api/lesson';
import { minusSevenHours, randomIntFromInterval } from '../../../utils';
import { BACKGROUND_COLOR, BORDER_COLOR } from '../../../utils/styles';
import { setDialog } from '../../../redux/dialog.reducer';
import { useDispatch } from 'react-redux';
import LessonDetail from './LessonDetail';
import { useNavigate } from 'react-router-dom';
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";

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
    const token = getCookie("token")

    const [event, setEvent]= useState<CalendarEvent>();

    const dispatch = useDispatch()

    useEffect(() => {
        getMyLessons(token).then((data: any) => {
            console.log("lesson", data)

            setEvents(data?.lessons.map((item: any) => {
                const random = randomIntFromInterval(0, 4)
                return ({
                    ...item, start: minusSevenHours(item.startDateTime),
                    end: minusSevenHours(item.endDateTime),
                    backgroundColor: BACKGROUND_COLOR[random],
                    borderColor: BORDER_COLOR[random],
                    title: item.class.subject.title
                })
            }) || [])
        })
    }, [])

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
                        `<div class="flex flex-col justify-start">
                  <div class="whitespace-normal flex flex-row gap-2">
                    <div class="rounded-md py-0.5 px-1 font-semibold" style="background-color:${event.borderColor}; ">
                      ${moment(event.start.toDate()).format("HH:MM")}
                    </div>
                    <div class="rounded-md py-0.5 px-1 font-semibold" style="background-color:${event.borderColor}; ">
                      ${moment(event.end.toDate()).format("HH:MM")}
                    </div>
                  </div>
                  <div class="whitespace-normal font-semibold">${event.title}</div>
                </div>`
                    )
                },
                task(event: any) {
                    return (
                        `<div class="flex flex-row justify-start gap-2">
                  <div class="rounded-md py-0.5 px-1 font-semibold" style="background-color:${event.borderColor}; ">
                      ${moment(event.end.toDate()).format("HH:MM")}
                  </div>
                  <div class="whitespace-normal font-semibold">${event.title}</div>
                </div>`
                    )
                },
            },
        });
    };

    const handleClickEvent = (eventObj: any)=>{
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
        <div className='w-full h-full pb-8'>
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
                {/* <div className="">
              <Radio.Group value={type} onChange={onChange}>
                <Radio.Button value="month">Tháng</Radio.Button>
                <Radio.Button value="week">Tuần</Radio.Button>
                <Radio.Button value="day">Ngày</Radio.Button>
              </Radio.Group>
            </div> */}
            </nav>
            <Calendar
                ref={calendarRef}
                onClickEvent={(event) => handleClickEvent( event)}
                onAfterRenderEvent={onAfterRenderEvent}
                usageStatistics={false}
                height="700px"
                view="week"
                theme={{
                    common: {
                        gridSelection: {
                            backgroundColor: "rgba(81, 92, 230, 0.01)",
                            border: "4px solid #515ce6",
                        },
                    },
                    // week: WeekTheme;
                    // month: MonthTheme;
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
                    showTimezoneCollapseButton: false,
                    timezonesCollapsed: false,
                    hourStart: 0,
                    hourEnd: 24,
                    eventView: true,
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