import React from 'react'
import DotFlashing from './DotFlashing'
import { useSelector } from 'react-redux';
import { AppState } from '../redux/store';

export default function TopLoading() {
    const topLoading = useSelector((appState: AppState) => appState.topLoading.topLoading);
    if (topLoading?.show)
        return (
            <div className='w-screen h-screen z-[1000000] absolute top-0 left-0 bg-[rgba(255,255,255,0.5)]'>
                <div className='flex justify-center items-center w-full h-full'>
                    <DotFlashing />
                </div>
            </div>
        )
    else return <></>
}
