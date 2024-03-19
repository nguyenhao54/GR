import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend
} from "recharts";

import { PieChart, Pie } from "recharts";

const dataPie = [
    { name: "Vắng mặt", value: 26, fill: "#E0E1E3" },
    { name: "Có mặt", value: 75, fill: "#C1121F" },
];

const renderColorfulLegendText = (value: string, entry: any) => {
    return (
        <span style={{ color: "#596579", fontWeight: 500, padding: "10px" }}>
            {value}
        </span>
    );
};

const dataBar = [
    {
        name: "Thứ hai",
        "Có mặt": 4,
        "Vắng mặt": 2,
    },
    {
        name: "Thứ ba",
        "Có mặt": 0,
        "Vắng mặt": 1,
    },
    {
        name: "Thứ tư",
        "Có mặt": 2,
        "Vắng mặt": 2,
    },
    {
        name: "Thứ năm",
        "Có mặt": 2,
        "Vắng mặt": 1,
    },
    {
        name: "Thứ sáu",
        "Có mặt": 1,
        "Vắng mặt": 4,
    },
    {
        name: "Thứ bảy",
        "Có mặt": 4,
        "Vắng mặt": 3,
    }
];

export default function StackedAtendanceChart() {
    return (
        <div className="bg-white rounded-md p-8 w-[69%] md:w-[62%] flex flex-col gap-2 h-max">
            <div>
                <div className="text-neutral-800 font-semibold text-lg mt-1 mb-4">
                    Thống kê tham gia lớp học
                </div>

                <div className="flex justify-center">
                    <BarChart
                        width={600}
                        height={300}
                        data={dataBar}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5
                        }}
                    >
                        <XAxis dataKey="name" fontSize={11} />
                        <YAxis fontSize={11} />
                        <Tooltip cursor={{ fill: 'none' }} />
                        <Legend
                        fontSize={11} 
                        height={5}
                        />
                        <Bar dataKey="Có mặt" stackId="a" fill="#C1121F" barSize={40} />
                        <Bar dataKey="Vắng mặt" stackId="a" fill="#E0E1E3" barSize={40} radius={[5, 5, 0, 0]} />
                    </BarChart>
                </div>
            </div>

            <div className="flex justify-center pb-8">
                <PieChart width={280} height={250} >
                    <Pie
                        data={dataPie}
                        cx={120}
                        cy={120}
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={0}
                        dataKey="value"
                    >
                    </Pie>
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
        </div>
    );
}
