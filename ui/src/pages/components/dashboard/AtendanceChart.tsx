import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend
} from "recharts";

import { PieChart, Pie } from "recharts";
import { getMyAttendanceStats } from "../../../api/attendance";
import { getCookie } from "./AttendanceCard";
import { DotFlashing } from "../../../common";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const renderColorfulLegendText = (value: string, entry: any) => {
    return (
        <span style={{ color: "#596579", fontWeight: 500, padding: "10px" }}>
            {value}
        </span>
    );
};

export default function StackedAtendanceChart() {

    const isPhone = window.innerWidth < 500
    console.log(window.innerWidth)
    const token = getCookie('token')
    const [barData, setBarData] = useState<any[]>();
    const [pieData, setPieData] = useState<any[]>();
    const [week, setweek] = useState<Dayjs | null>(dayjs(new Date()));

    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        setLoading(true)
        getMyAttendanceStats(token, week).then(res => {
            if (res) {
                setBarData(res.map((item: any) => ({
                    name: new Date(item.date).toLocaleString("en-GB", { day: '2-digit', month: '2-digit' }),
                    "Có mặt": item.present,
                    "Vắng mặt": item.absent,
                })))
                setPieData([
                    {
                        name: "Vắng mặt",
                        value: res.reduce((acc: any, obj: any) => acc + obj.absent, 0),
                        fill: "#E0E1E3"
                    },
                    {
                        name: "Có mặt",
                        value: res.reduce((acc: any, obj: any) => acc + obj.present, 0),
                        fill: "#C1121F"
                    }
                ])
            }
        }).finally(() => { setLoading(false) });
    }, [week])
    return (
        <div className="bg-white flex-1 rounded-md p-4 w-[99%] sm:w-[62%] flex flex-col gap-2 min-h-[calc(100vh-80px)] h-max">
            {
                loading
                    ? <div className='bg-white flex-1 rounded-md p-4 flex items-center h-stretch justify-center'>
                        <DotFlashing></DotFlashing>
                    </div>
                    : <div>
                        <div className="text-neutral-800 font-semibold text-lg mt-1 mb-4 text-center">
                            Thống kê điểm danh
                        </div>
                        {!pieData || !barData ? <div>Không có dữ liệu</div> :
                            <>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker label="Chọn tuần học"
                                        value={week}
                                        format="DD/MM/YYYY"
                                        onChange={(newValue) => setweek(newValue)}
                                        sx={{ width: "50%", marginLeft: "16px" }} />
                                </LocalizationProvider>
                                <div className="flex justify-center">
                                    <BarChart
                                        width={isPhone ? 370 : 600}
                                        height={300}
                                        data={barData}
                                        margin={{
                                            top: 20,
                                            right: isPhone ? 20 : 30,
                                            left: isPhone ? -20 : 20,
                                            bottom: 5
                                        }}
                                    >
                                        <XAxis dataKey="name" fontSize={11} />
                                        <YAxis fontSize={11} />
                                        <Tooltip cursor={{ fill: 'none' }} contentStyle={{ color: "black" }} />
                                        <Legend
                                            fontSize={11}
                                            height={20}
                                            width={isPhone ? window.innerWidth - 10 : 500}
                                        />
                                        <Bar dataKey="Có mặt" stackId="a" fill="#C1121F" barSize={isPhone ? 30 : 40} radius={[5, 5, 0, 0]} />
                                        <Bar dataKey="Vắng mặt" stackId="a" fill="#E0E1E3" barSize={isPhone ? 30 : 40} radius={[5, 5, 0, 0]} />
                                    </BarChart>
                                </div>

                                <div className="flex justify-center pb-8">
                                    <PieChart width={280} height={250} >
                                        <Pie
                                            data={pieData}
                                            cx={120}
                                            cy={120}
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={0}
                                            dataKey="value"
                                        >
                                        </Pie>
                                        <Tooltip cursor={{ fill: 'none' }} />
                                        <Legend
                                            height={5}
                                            fontSize={11}
                                            iconType="circle"
                                            layout="horizontal"
                                            verticalAlign="bottom"
                                            iconSize={10}
                                            formatter={renderColorfulLegendText}
                                        />
                                    </PieChart>
                                </div>
                            </>
                        }
                    </div>
            }
        </div>
    );
}
