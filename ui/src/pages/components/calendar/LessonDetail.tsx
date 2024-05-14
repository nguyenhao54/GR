import React, { useEffect, useState } from 'react'
import { IAttendance, getCookie } from '../dashboard/AttendanceCard'
import { getLessonById } from '../../../api/lesson'
import { DetailList, DotFlashing } from '../../../common'
import { formatDate, getHourAndMinute } from '../../../utils'
import { GoTriangleDown, GoTriangleUp } from "react-icons/go"
import { FaUserGroup } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa6";
import { Button, Tab, Tabs } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { getMyAttendanceForLesson } from '../../../api/attendance'
import { useSelector } from 'react-redux'
import { AppState } from '../../../redux/store'
import StudentsAttendanceTable from './StudentsAttendanceTable'

export enum LessonDetailTab {
  basic = 1,
  attendance = 2,
  list = 3,
}

function LessonDetail() {
  const lessonId = useParams().id || "";
  const token = getCookie('token')
  const [loading, setLoading] = useState<boolean>(true)
  const [lesson, setLesson] = useState<any>()
  const [showList, setShowList] = useState<boolean>(true);
  const user = useSelector((appState: AppState) => appState.user.user)
  const [attendance, setAttendance] = useState<IAttendance>()
  const [attendanceList, setAttendanceList] = useState<IAttendance[]>([])
  const navigate = useNavigate()
  const [tab, setTab] = React.useState<LessonDetailTab>(LessonDetailTab.basic);

  const handleChange = (event: React.SyntheticEvent, newValue: LessonDetailTab) => {
    setTab(newValue);
  };
  useEffect(() => {
    setLoading(true);
    getLessonById(token, lessonId).then(res => {
      setLesson(res)
    }).finally(() => setLoading(false))

  }, [lessonId])

  useEffect(() => {
    if (user?._id && user?.role === "student")
      getMyAttendanceForLesson(token, lessonId, user._id).then(
        (res) => setAttendance(res?.data[0])
      )
  }, [lessonId, user?._id])
  if (!lesson) return <></>

  const renderTabContent = (tab: LessonDetailTab) => {
    switch (tab) {
      case LessonDetailTab.basic:
        return <div>
          <div className="class-info">
            <div className='flex justify-between items-center py-2'>
              <div className='font-semibold'>{lesson?.class.subject.subjectId} - {lesson?.class.subject.title}</div>
              {/* <div className='bg-neutral-200 px-2 py-1 rounded-md my-2 w-max text-xs font-medium'> {getHourAndMinute(lesson?.startDateTime)} - {getHourAndMinute(lesson?.endDateTime)}</div> */}
            </div>
            <DetailList list={[
              { title: "Mã học phần", text: lesson?.class.subject.subjectId },
              { title: "Tên học phần", text: lesson?.class.subject.title },
              { title: "Mã lớp", text: lesson?.class.classId },
              { title: "GVHD", text: lesson.class.teacher.name },
              { title: "Thời gian", text: `${formatDate(lesson?.startDateTime)} - ${formatDate(lesson?.endDateTime)} ` },
              { title: "Hệ số điểm", text: lesson?.class.subject.gradeCoefficient },
            ]} ></DetailList>
          </div>
        </div>
      case LessonDetailTab.attendance:
        return <div className='attendance-info'>
          {/* <div className="font-semibold flex items-center">
            <FaCheckCircle size={18} />
            <p className='ml-2'>Thông tin điểm danh</p>
          </div> */}
          {user?.role === "student"
            ? <div className="pt-2">
              <DetailList
                list={[
                  { title: "Check in", text: attendance?.checkInTime ? getHourAndMinute(attendance?.checkInTime) : "" },
                  { title: "Check out", text: attendance?.checkOutTime ? getHourAndMinute(attendance?.checkOutTime) : "" },
                  { title: "Trạng thái", text: attendance?.isSuccessful ? "Có mặt" : "Vắng mặt" },
                ]}
              ></DetailList>
            </div>
            : <div className="pt-2">
               <StudentsAttendanceTable lessonId={lessonId}></StudentsAttendanceTable>
            </div>}
        </div>
      case LessonDetailTab.list: return <div className='student-list overflow-auto max-h-56 w-full'>
        {/* <div className="flex justify-between items-center">
          <div className='font-semibold flex justify-center items-center'> <FaUserGroup size={18} /> <p className='ml-2'>Danh sách lớp</p></div>
           <div onClick={() => setShowList(!showList)} className="rounded-full hover:bg-neutral-200 hover: cursor-pointer p-1">{showList ? <GoTriangleDown /> : <GoTriangleUp />}</div> 

        </div> */}
        {showList && <ol type="1" className="pl-4 pt-2 list-decimal">
          {lesson.class.students.map((student: any) => <li className="py-2"><span className="font-semibold">{student.codeNumber} </span>{student.name}</li>)}
        </ol>}
      </div>
      default: return <></>

    }
  }
  return (
    <div className="font-montserrat flex flex-col items-center justify-center w-full h-[calc(100vh-120px)]">
      {
        loading ? <DotFlashing></DotFlashing> :
          <div className='w-full h-full'>
            <button className="text-lightRed rounded-full p-2 hover:bg-neutral-200  cursor-pointer"
            onClick={()=>{
              navigate('/calendar')

            }}
            ><FaArrowLeft/></button>
            <Tabs
              TabIndicatorProps={{ style: { background: '#C1121F', transition: "none" }, sx: { bgcolor: "#FF5733" } }}
              value={tab}
              onChange={handleChange}
              textColor="inherit"
              aria-label="secondary tabs example"
            >
              <Tab value={LessonDetailTab.basic} label="Thông tin" />
              <Tab value={LessonDetailTab.attendance} label="Điểm danh" />
              {user?.role === "student" && <Tab value={LessonDetailTab.list} label="Danh sách lớp" />}
            </Tabs>
            <div className='pt-2'>
              {renderTabContent(tab)}
            </div>
          </div>
      }
    </div>
  )
}

export default LessonDetail