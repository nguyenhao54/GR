import React, { useEffect, useState } from 'react'
import { IAttendance, getCookie } from '../dashboard/AttendanceCard'
import { getLessonById } from '../../../api/lesson'
import { DetailList, DotFlashing } from '../../../common'
import { formatDate, getHourAndMinute } from '../../../utils'
import { FaArrowLeft } from "react-icons/fa6";
import { Button, Tab, Tabs } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { getMyAttendanceForLesson } from '../../../api/attendance'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../../redux/store'
import StudentsAttendanceTable from './StudentsAttendanceTable'
import ReactQuill from 'react-quill'
import { createNote, getNote, updateNote } from '../../../api/note'
import { setDialog } from '../../../redux/dialog.reducer'

export enum LessonDetailTab {
  basic = 1,
  attendance = 2,
  list = 3,
  note = 4
}

function LessonDetail() {
  const lessonId = useParams().id || "";
  const dispatch = useDispatch()
  const token = getCookie('token')
  const [loading, setLoading] = useState<boolean>(true)
  const [lesson, setLesson] = useState<any>()
  const user = useSelector((appState: AppState) => appState.user.user)
  const [attendance, setAttendance] = useState<IAttendance>()
  // const [attendanceList, setAttendanceList] = useState<IAttendance[]>([])
  const navigate = useNavigate()
  const [tab, setTab] = React.useState<LessonDetailTab>(LessonDetailTab.basic);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ size: [] }],
      [{ font: [] }],
      [{ align: ["right", "center", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ color: ["#0065A2", "#00A5E3", "#669BBC", "#8DD7BF", "#FFBF65", "#FF96C5", "#FC6238", "#FF5768", "white"] }],
      [{ background: ["black", "#0065A2", "#00A5E3", "#669BBC", "#8DD7BF", "#FFBF65", "#FF96C5", "#FC6238", "#FF5768"] }]
    ]
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "size",
    "font",
    'size',
    'color',
    'background',
    'script',
    'blockquote',
    'code-block',
    'indent',
    'list',
    'direction',
    'align',
    'link',
    'image',
    'video',
    'formula',
  ];

  const [code, setCode] = useState("");
  const [noteId, setNoteId] = useState<string>()
  const handleProcedureContentChange = (content: string, _delta: any, _source: any, _editor: any) => {
    setCode(content);
    //let has_attribues = delta.ops[1].attributes || "";
    //console.log(has_attribues);
    //const cursorPosition = e.quill.getSelection().index;
    // this.quill.insertText(cursorPosition, "★");
    //this.quill.setSelection(cursorPosition + 1);
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: LessonDetailTab) => {
    setTab(newValue);
  };


  useEffect(() => {
    // console.log(lessonId);
    setLoading(true);
    if (user?._id) {
      let promises = [
        getLessonById(token, lessonId),
        getNote(token, `?lesson=${lessonId}&user=${user._id}`),
      ]
      if (user?.role === "student") promises.push(
        getMyAttendanceForLesson(token, lessonId, user._id)
      )

      Promise.all(promises)
        .then(res => {
          setLesson(res[0])
          if (res[1]?.data[0]?.content) {
            setCode((res[1]?.data[0]?.content as string).replace(/&lt;/g, "<").replace(/&gt;/g, ">") || "")
            setNoteId(res[1]?.data[0]?._id)
          }
          setAttendance(res[2]?.data[0])
        }).finally(() => setLoading(false))
    }
  }, [])

  useEffect(() => {
    // console.log(lessonId);
    setLoading(true);
    if (user?._id && user?.role === "student") {
      Promise.all([
        getLessonById(token, lessonId),
        getNote(token, `?lesson=${lessonId}&user=${user._id}`),
        getMyAttendanceForLesson(token, lessonId, user._id)
      ])
        .then(res => {
          setLesson(res[0])
          if (res[1]?.data[0]?.content) {
            setCode((res[1]?.data[0]?.content as string).replace(/&lt;/g, "<").replace(/&gt;/g, ">") || "")
            setNoteId(res[1]?.data[0]?._id)
          }
          setAttendance(res[2]?.data[0])
        }).finally(() => setLoading(false))
    }

  }, [lessonId, user?._id])


  const handleRes = (res: any) => {
    if (res?.status === "success") {
      dispatch(setDialog({
        title: "Chỉnh sửa ghi chú thành công",
        open: true,
        type: "info",
        isMessagebar: true
      }))
    }
    else {
      dispatch(setDialog({
        title: "Chỉnh sửa ghi chú thất bại, vui lòng thử lại sau",
        open: true,
        type: "warning",
        isMessagebar: true
      }))
    }
  }
  const handleSaveNote = () => {
    if (code)
      if (noteId) {
        updateNote(token, noteId, code).then((res: any) => {
          // console.log(res)
          handleRes(res)
        })
      }
      else
        createNote(token, lessonId, user!._id, code).then((res: any) => {
          // console.log(res)
          handleRes(res)
        })
  }


  const renderTabContent = (tab: LessonDetailTab) => {
    switch (tab) {
      case LessonDetailTab.basic:
        return <div>
          <div className="class-info">
            <div className='flex justify-between items-center py-2'>
              <div className='font-semibold'>{lesson?.class.subject.subjectId} - {lesson?.class.subject.title}</div>
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
        {<ol type="1" className="pl-4 pt-2 list-decimal">
          {lesson.class.students.map((student: any) => <li className="py-2"><span className="font-semibold">{student.codeNumber} </span>{student.name}</li>)}
        </ol>}
      </div>
      case LessonDetailTab.note: return <>
        {/* <CustomToolbar /> */}

        <ReactQuill theme="snow"
          modules={modules}
          formats={formats}
          placeholder='Ghi chú'
          value={code}
          onChange={handleProcedureContentChange} />
        <div className="w-full flex justify-end"><Button
          variant="contained"
          sx={{
            textTransform: "none",
            backgroundColor: "#C1121F",
            "&:hover": {
              backgroundColor: "#C1121F"
            },
            marginTop: 2,
          }}
          disabled={code === ""}
          onClick={() => handleSaveNote()}
        >Lưu thay đổi
        </Button>
        </div>
      </>
      default: return <></>
    }
  }
  return (
    <div className="font-nunitoSans flex flex-col items-center justify-center w-full h-[calc(100vh-120px)]">
      {
        loading ?
          <div className='w-[calc(100vh-40px)] flex justify-center items-center'>
            <DotFlashing></DotFlashing>
          </div> :
          <div className='w-full h-full'>
            <button className="text-lightRed rounded-full p-2 hover:bg-neutral-200  cursor-pointer"
              onClick={() => {
                navigate('/calendar')
              }}
            ><FaArrowLeft /></button>
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
              <Tab value={LessonDetailTab.note} label="Ghi chú" />
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