import Calendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import React, { useState } from 'react';
import moment from 'moment';

export interface CalendarEvent {
    id: string;
    calendarId: string;
    title: string;
    location?: string;
    dueDateClass?: string;
    start?: string;
    end: string;
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
    const calendarRef = React.useRef<any>();
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [event, setEvent] = useState<CalendarEvent>();

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


    return (
        <div className='w-full h-full pb-8'>
            <nav className="navbar -mt-4 mr-10 flex flex-row items-center justify-between">
                <div className="">
                    <button
                        type="button"
                        className="inline-block rounded bg-neutral-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-800 shadow-[0_4px_9px_-4px_#cbcbcb] transition duration-150 ease-in-out hover:bg-neutral-100 hover:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:bg-neutral-100 focus:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] focus:outline-none focus:ring-0 active:bg-neutral-200 active:shadow-[0_8px_9px_-4px_rgba(203,203,203,0.3),0_4px_18px_0_rgba(203,203,203,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(251,251,251,0.3)] dark:hover:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:focus:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)] dark:active:shadow-[0_8px_9px_-4px_rgba(251,251,251,0.1),0_4px_18px_0_rgba(251,251,251,0.05)]"
                        onClick={handleClickNowButton}
                    >
                        Hôm nay
                    </button>
                </div>
                <div className="flex flew-row">
                    <div
                        className="-rotate-90 cursor-pointer"
                        onClick={handleClickPrevButton}
                    >
                        <svg
                            width="12"
                            height="7"
                            viewBox="0 0 12 7"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M11.001 6L6.00098 1L1.00098 6"
                                stroke="black"
                                strokeOpacity="0.4"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <div className="uppercase text-sm font-semibold text-gray-600 my-8">
                        {startDate} - {endDate}
                    </div>
                    <div
                        className="rotate-90 cursor-pointer"
                        onClick={handleClickNextButton}
                    >
                        <svg
                            width="12"
                            height="7"
                            viewBox="0 0 12 7"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M11.001 6L6.00098 1L1.00098 6"
                                stroke="black"
                                stroke-opacity="0.4"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
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
                    workweek: false,
                    showNowIndicator: true,
                    showTimezoneCollapseButton: false,
                    timezonesCollapsed: false,
                    hourStart: 5,
                    hourEnd: 19,
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

            />
        </div>
    );
}