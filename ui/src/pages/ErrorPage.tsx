import React from 'react'
import { FaExclamationTriangle } from "react-icons/fa";
function ErrorPage() {
  return (
    <div className="w-full h-screen font-montserrat flex justify-center items-center">
      <div className="flex flex-col justify-center items-center -mt-12">
        <FaExclamationTriangle size={80} className="text-neutral-200 text-3xl" />
        <div className="font-semibold text-neutral-600 text-xl pt-12">Có lỗi xảy ra, Vui lòng thử lại sau...</div>
      </div>
    </div>
  )
}

export default ErrorPage