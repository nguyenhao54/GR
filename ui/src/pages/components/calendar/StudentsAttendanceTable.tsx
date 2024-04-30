import * as React from "react";
import { useDispatch } from "react-redux";
import { FaCheckCircle, FaUserCheck } from "react-icons/fa";
import TablePager, { HeadCell } from '../../../common/TablePager';
import { IAttendance, getCookie } from '../dashboard/AttendanceCard';
import { createAttendance, getAllAttendancesForLesson, updateAttendance } from '../../../api/attendance';
import { getLessonById } from '../../../api/lesson';
import { DotFlashing, SearchBar } from '../../../common';
import { FaCircleXmark, FaXmark, FaUserXmark } from "react-icons/fa6";
import ToolTip from '../../../common/ToolTip';
import { Button } from '@mui/material';
import { closeTopLoading, showTopLoading } from '../../../redux/toploading.reducer';
import { Lesson } from '../../../models';
interface StudentTableData {
  id?: string;
  action?: JSX.Element;
  studentName?: string;
  studentCode?: string;
  checkInTime?: string | JSX.Element
  checkOutTime?: string | JSX.Element
  status?: JSX.Element
}

const headCells: readonly HeadCell<StudentTableData>[] = [
  {
    id: "studentCode",
    numeric: false,
    disablePadding: true,
    label: "MSSV",
  },
  {
    id: "studentName",
    numeric: false,
    disablePadding: true,
    label: "Họ và tên",
  },
  {
    id: "checkInTime",
    numeric: false,
    disablePadding: true,
    label: "Vào lớp",
  },
  {
    id: "checkOutTime",
    numeric: false,
    disablePadding: true,
    label: "Ra về",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: true,
    label: "Trạng thái",
  },
  {
    id: "action",
    numeric: false,
    disablePadding: true,
    label: "Hành động",
  },
];

export interface IMenuTableProps {
  lessonId: string;
}

export default function MenuTable(props: IMenuTableProps) {
  const { lessonId } = props;
  const [attendances, setAttendances] = React.useState<IAttendance[]>([
  ]);
  const [lesson, setLesson] = React.useState<Lesson>()
  const [display, setDisplay] = React.useState<IAttendance[]>(attendances);
  const [orderBy, setOrderBy] = React.useState<keyof StudentTableData>("id");
  const [selected, setSelected] = React.useState<IAttendance[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [searchText, setSearchText] = React.useState<string>("");

  const dispatch = useDispatch();
  const token = getCookie("token");
  React.useEffect(() => {
    let students: any[] = []
    let attendances: IAttendance[] = [];
    setLoading(true)
    Promise.all([getLessonById(token, lessonId), getAllAttendancesForLesson(token, lessonId)]).then((res: any) => {

      setLesson(res[0])
      students = res[0]?.class?.students;
      attendances = res[1].data.concat(res[1].data);
      const attendanceListMap = students.map((student: any) => {
        let record = attendances.find((attendance) => attendance.student?._id === student._id)
        if (record) {
          return { ...record, id: record.student?._id, isFromDB: true }
        }
        else return {
          checkInTime: undefined, checkOutTime: undefined, isSuccessful: false,
          student,
          id: student._id,
          isFromDB: false
        }
      })
      setAttendances(attendanceListMap)
      setDisplay(attendanceListMap)
    }).finally(() => {
      setLoading(false)
    })
  }, [lessonId, token]);


  const createRowElements = (attendance: IAttendance): StudentTableData => {
    return {
      id: attendance.student?._id || "0",
      studentCode: attendance.student?.codeNumber,
      studentName: attendance.student?.name,
      checkInTime: attendance.checkInTime || <div> <FaXmark className='text-lightRed text-md' /></div>,
      checkOutTime: attendance.checkOutTime || <div> <FaXmark className='text-lightRed text-md' /></div>,
      status: <div>{attendance.isSuccessful
        ? <div className='flex gap-1 items-center text-green-600'><FaUserCheck className='text-lg' /> Có mặt</div>
        : <div className='flex gap-1 items-center text-lightRed'><FaUserXmark className='text-lg' /> Vắng mặt</div>}</div>,
      action: (
        <div className='flex gap-2 items-center justify-center'>

          <ToolTip textContent='Từ chối' limit={1}>
            <FaCircleXmark className='text-lg text-lightRed'
              onClick={() => { handleDenyOrAccept(attendance, false) }} />
          </ToolTip>
          <ToolTip textContent='Chấp nhận' limit={1}>
            <FaCheckCircle className='text-lg text-green-600'
              onClick={() => { handleDenyOrAccept(attendance, true) }} />
          </ToolTip>
        </div>
      ),
    };
  }

  const handleDenyOrAccept = (attendance: IAttendance, accept?: boolean) => {
    const processedAttendanceList = attendances.map((item: IAttendance) => {
      if (item.id === attendance.id) return { ...item, isSuccessful: accept }
      else return { ...item }
    })
    setAttendances(processedAttendanceList)
  }

  const mapAttendanceDataToRowElement = (attendances: IAttendance[],): StudentTableData[] => attendances.map((item: IAttendance) => {
    return createRowElements(item);
  });

  React.useEffect(() => {
    setDisplay(
      attendances?.filter((item: IAttendance) => {
        const codeNumber = item.student?.codeNumber || ""
        return codeNumber.toString()
          .toLocaleLowerCase()
          .includes(searchText.toLocaleLowerCase());
      })
    );
  }, [searchText, JSON.stringify(attendances)]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = attendances;
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleAcceptOrDenyAllSelected = (isAccept: boolean) => {
    const processedAttendanceList = attendances.map((item: IAttendance) => {
      if (selected.find((selectedItem) => selectedItem.id === item.id)) return { ...item, isSuccessful: isAccept }
      else return { ...item }
    })
    setAttendances(processedAttendanceList)
  }

  const handleSave = () => {
    dispatch(showTopLoading())
    console.log(attendances)
    attendances.forEach(async (item) => {
      if (item.isFromDB) {
        //update
        await updateAttendance(token, item._id!, item.checkOutTime || "", item.isSuccessful || false)
        dispatch(closeTopLoading())
      } else {
        //create //item.id is student id actually
        await createAttendance(token, lessonId, "", item.id!, item.isSuccessful, "")
        dispatch(closeTopLoading())
      }
    })
  }

  const toolbarItems = (
    <div className="flex my-1 justify-between">
      <div className="w-[30%] my-2 flex gap-2">
        <Button
          variant="outlined"
          startIcon={<FaUserCheck className='text-lg' />}
          disabled={!(selected.length > 0)}
          // textTransform={"none"}
          sx={{
            color: "green",
            textTransform: "none",
            borderColor: "green",
            "&:hover": {
              borderColor: "green"
            }
          }}

          onClick={() => handleAcceptOrDenyAllSelected(true)}
        >Chấp nhận
        </Button>
        <Button
          variant="outlined"
          startIcon={<FaUserXmark className='text-lg' />}
          disabled={!(selected.length > 0)}
          // textTransform={"none"}
          sx={{
            textTransform: "none",
            color: "#C1121F",
            borderColor: "#C1121F",
            "&:hover": {
              borderColor: "#C1121F"
            }
          }}
          onClick={() => handleAcceptOrDenyAllSelected(false)}
        >Từ chối
        </Button>
      </div>
      <div className="w-[40%] my-2 ">
        <SearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          placeholder={"Tìm kiếm theo MSSV"}
        ></SearchBar>
      </div>
    </div>
  );

  return (
    <>{loading ? <DotFlashing></DotFlashing>
      :
      <div>
        <TablePager<IAttendance>
          tableTitle={"Danh sách điểm danh"}
          selected={selected}
          setSelected={setSelected}
          orderBy={orderBy}
          onSelectAllClick={handleSelectAllClick}
          total={display?.length}
          data={display || []}
          mapDataToRowData={mapAttendanceDataToRowElement}
          headCells={headCells}
          showSearchBar={true}
          toolbarItems={toolbarItems}
        ></TablePager>
        <div className="flex justify-end">
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "green",
              "&:hover": {
                backgroundColor: "green"
              }
            }}
            onClick={() => handleSave()}
          >Lưu thay đổi
          </Button>
        </div>
      </div>
    }</>
  );
}