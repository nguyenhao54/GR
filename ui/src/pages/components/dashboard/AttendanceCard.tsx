import React from 'react'
import { LiaHandPointer } from "react-icons/lia";
import { MdLocationPin } from "react-icons/md";
import MyLocation from './MyLocationMap';
import { useSelector } from 'react-redux';
import { AppState } from '../../../redux/store';

function AttendanceCard() {
    const user = useSelector((appState: AppState) => appState.user.user)
    return (
        <div className="bg-white rounded-md p-8 md:w-[40%]  sm:w-[99%] flex lg:flex-col items-center h-max">
            <div className="text-base font-semibold mt-2">9:00 AM</div>
            <div className="text-xs font-semibold text-neutral-500">Thứ 6, 17 Tháng 1 2024</div>
            <div className="bg-[#D9D9D9] hover:cursor-pointer rounded-full w-40 h-40 m-4 gap-2 flex shadow-2xl justify-center flex-col text-neutal-800 items-center">

                <LiaHandPointer className="text-6xl text-neutral-800 -ml-2"></LiaHandPointer>
                <div className='text-md font-semibold justify-center flex items-center'>CHECK-IN</div>
                <div />

            </div>
            <div className="text-lg font-semibold mt-3">An toàn thông tin - IT4852</div>
            <div className="text-xs font-semibold mt-2 text-neutral-500 flex items-center gap-1"><MdLocationPin size={14} />Vị trí: D9-401</div>
            <div className="w-80 h-72 mt-4">
                <MyLocation></MyLocation>
            </div>
        </div>
    )
}

export default AttendanceCard