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

const renderColorfulLegendText = (value: string, entry: any) => {
    return (
        <span style={{ color: "#596579", fontWeight: 500, padding: "10px" }}>
            {value}
        </span>
    );
};

export default function StackedAtendanceChart() {
    const token = getCookie('token')
    const [barData, setBarData] = useState<any[]>();
    const [pieData, setPieData] = useState<any[]>();

    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        setLoading(true)
        getMyAttendanceStats(token).then(res => {
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
    }, [])
    return (
        <div className="bg-white flex-1 rounded-md p-4 w-[69%] md:w-[62%] flex flex-col gap-2 min-h-[calc(100vh-80px)]">
            {
                loading
                    ? <div className='bg-white flex-1 rounded-md p-4 flex lg:flex-col items-center h-stretch justify-center'>
                        <DotFlashing></DotFlashing>
                    </div>
                    : <div>
                        <div className="text-neutral-800 font-semibold text-lg mt-1 mb-4 text-center">
                            Thống kê điểm danh
                        </div>
                        {!pieData || !barData ? <div>Không có dữ liệu</div> :
                            <>
                                <div className="flex justify-center">
                                    <BarChart
                                        width={600}
                                        height={300}
                                        data={barData}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 20,
                                            bottom: 5
                                        }}
                                    >
                                        <XAxis dataKey="name" fontSize={11} />
                                        <YAxis fontSize={11} />
                                        <Tooltip cursor={{ fill: 'none' }} contentStyle={{ color: "black" }} />
                                        <Legend
                                            fontSize={11}
                                            height={5}
                                        />
                                        <Bar dataKey="Có mặt" stackId="a" fill="#C1121F" barSize={40} />
                                        <Bar dataKey="Vắng mặt" stackId="a" fill="#E0E1E3" barSize={40} radius={[5, 5, 0, 0]} />
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
