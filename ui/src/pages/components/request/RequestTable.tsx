import React, { useEffect } from 'react'
import TablePager, { HeadCell } from '../../../common/TablePager';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../redux/store';
import { getRequests, handleRequest } from '../../../api/requests';
import { getCookie } from '../dashboard/AttendanceCard';
import ToolTip from '../../../common/ToolTip';
import { FaCheckCircle, FaEye } from "react-icons/fa";
import { DotFlashing, SearchBar } from '../../../common';
import { minusSevenHours } from '../../../utils';
import { setDialog } from '../../../redux/dialog.reducer';
import { FaCircleXmark } from 'react-icons/fa6';

interface RequestTableData {
  id?: string;
  action?: JSX.Element;
  studentName?: string;
  studentCode?: string;
  lessonName?: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
  teacherName?: string;
  status?: JSX.Element
}

const headCells: readonly HeadCell<RequestTableData>[] = [
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
    minWidth: 120,
  },
  {
    id: "lessonName",
    numeric: false,
    disablePadding: true,
    label: "Lớp học",
    minWidth: 200,
  },
  {
    id: "startTime",
    numeric: false,
    disablePadding: true,
    label: "Thời gian bắt đầu",
    minWidth: 180,
  },
  {
    id: "endTime",
    numeric: false,
    disablePadding: true,
    label: "Thời gian kết thúc",
    minWidth: 180,

  },
  {
    id: "reason",
    numeric: false,
    disablePadding: true,
    label: "Lý do",
    minWidth: 120
  },
  {
    id: "status",
    numeric: false,
    disablePadding: true,
    label: "Trạng thái",
    minWidth: 120
  },
  {
    id: "action",
    numeric: false,
    disablePadding: true,
    label: "Hành động",
    minWidth: 150
  },
];

function RequestTable() {
  const dispatch = useDispatch()
  const token = getCookie("token");
  const user = useSelector((appState: AppState) => appState.user.user);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [requestList, setRequestList] = React.useState<any[]>([])
  const [searchText, setSearchText] = React.useState<string>("");
  const [display, setDisplay] = React.useState<any[]>(requestList);

  useEffect(() => {
    if (!user)
      return;
    setLoading(true);
    getRequests(token)
      .then((res) => {
        setRequestList(res);
      }
      )
      .finally(() => setLoading(false))

  }, [user?._id, token, user])


  React.useEffect(() => {
    setDisplay(
      requestList?.filter((item: any) => {
        const codeNumber = item.student?.codeNumber || ""
        return codeNumber.toString()
          .toLocaleLowerCase()
          .includes(searchText.toLocaleLowerCase());
      })
    );
  }, [searchText, JSON.stringify(requestList)]);



  const getStatusElement = (status: any) => {
    switch (status) {
      case "pending":
        return <div className="font-medium text-neutral-600">Chờ phê duyệt</div>
      case "approved":
        return <div className="font-medium text-green-600">Được chấp nhận</div>
      case "denied":
        return <div className="font-medium text-red-600">Bị từ chối</div>
    }
  }

  function handleDenyOrAccept(request: any, accept: boolean) {
    dispatch(
      setDialog({
        customWidth: 400,
        customHeight: 180,
        title: "Xác nhận" + (accept ? " phê duyệt" : " từ chối"),
        open: true,
        type: "warning",
        onClickOk: async () => {
          const promise = handleRequest;
          const res = await promise(token, request._id, accept)
          console.log(res)
          if (res.status === "success") {
            const processedRequestList = requestList.map(item => {
              if (item.id === request._id) return { ...item, status: accept ? "approved" : "denied" }
              else return { ...item }
            })
            dispatch(setDialog({
              open: false,
            }))
            //DONE: show succcessmsg
            dispatch(setDialog({
              title: (accept ? "Chấp nhận" : "Từ chối") + " yêu cầu thành công",
              open: true,
              type: "info",
              isMessagebar: true
            }))
            setRequestList(processedRequestList)
          }
          else {
            //DONE: show failed message
            dispatch(setDialog({
              title: (accept ? "Chấp nhận" : "Từ chối") + " yêu cầu thất bại, vui lòng thử lại sau",
              open: true,
              type: "warning",
              isMessagebar: true
            }))
          }
        },
        content: (
          <div className='pl-6 font-montserrat font-semibold'>
            {accept ? "Bạn có chắc chắn chấp nhận yêu cầu?" : "Bạn có chắc chắn muốn từ chối yêu cầu?"}
          </div>
        ),
      }))
  }

  const createRowElements = (request: any): RequestTableData => {
    return {
      id: request._id,
      studentCode: request.student.codeNumber,
      studentName: request.student.name,
      lessonName: request.lesson.class.classId + ": " + request.lesson.class.subject.title,
      startTime: new Date(minusSevenHours(request.lesson.startDateTime)).toLocaleString('en-US', { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      endTime: new Date(minusSevenHours(request.lesson.endDateTime)).toLocaleString('en-US', { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      reason: request.reason,
      status: getStatusElement(request.status),
      action: (
        <div className='flex gap-2 items-center justify-center'>

          <ToolTip textContent='Xem ảnh minh chứng' limit={1}>
            <FaEye className='text-lg text-green-600'
              onClick={() => {
                //DONE: show popup with image
                dispatch(setDialog({
                  customWidth: 400,
                  customHeight: 500,
                  title: "Xem ảnh minh chứng",
                  open: true,
                  content: (
                    <div className='max-h-[400px] overflow-auto'>
                      <img src={request.photo} alt="ảnh minh chứng" />
                    </div>
                  ),
                }))
              }
              } />
          </ToolTip>
          {user?.role === "teacher" &&
            <><ToolTip textContent='Từ chối' limit={1}>
              {/* //TODO: set button disable  */}
              <FaCircleXmark className={request.status !== "pending" ? "opacity-30 hover:cursor-default text-lg" : 'text-lg text-lightRed'}
                onClick={request.status === "pending" ? () => { handleDenyOrAccept(request, false) } : undefined} />
            </ToolTip>
              <ToolTip textContent='Chấp nhận' limit={1}>
                <FaCheckCircle className={request.status !== "pending" ? "opacity-30 hover:cursor-default text-lg" : 'text-lg text-green-600'}
                  onClick={request.status === "pending" ? () => { handleDenyOrAccept(request, true) } : undefined} />
              </ToolTip>
            </>}
        </div>
      ),
    }
  }

  const mapRequestToRowElement = (data: any[],): RequestTableData[] => data.map((item: any) => {
    return createRowElements(item);
  });

  const toolbarItems =
    <div className="flex justify-end w-full -mt-10">
      <div className="w-[40%] my-2 justify-end">
        <SearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          placeholder={"Tìm kiếm theo MSSV"}
        ></SearchBar>
      </div>
    </div>
  return (
    <>{loading ? <DotFlashing></DotFlashing>
      :
      <div className="pt-4 w-full">
        <TablePager
          tableTitle={"Danh sách yêu cầu"}
          total={display?.length}
          data={display || []}
          mapDataToRowData={mapRequestToRowElement}
          headCells={headCells}
          hideCheckbox
          orderBy='startTime'
          showSearchBar
          toolbarItems={user?.role !== "student" ? toolbarItems : <></>}
        ></TablePager>
      </div>}
    </>
  )
}

export default RequestTable