import React, { useEffect, useState } from 'react'
import TablePager, { HeadCell } from '../common/TablePager';
import { getCookie } from './components/dashboard/AttendanceCard';
import { useDispatch } from 'react-redux';
import { deleteClass, editClass, getClasses } from '../api/class';
import { closeTopLoading, showTopLoading } from '../redux/toploading.reducer';
import ToolTip from '../common/ToolTip';
import { FaPlus, FaTrash } from 'react-icons/fa6';
import { FaPen } from 'react-icons/fa';
import { Button } from '@mui/material';
import { SearchBar } from '../common';
import { setDialog } from '../redux/dialog.reducer';
import EditClassForm from './components/manageClass/EditClassForm';

interface ClassTableData {
    id?: string;
    action?: JSX.Element;
    classId?: string;
    subjectName?: string;
    subjectId?: string;
    teacher?: string;
    semester?: number;
    duration?: number;
    location?: string;
}

const headCells: readonly HeadCell<ClassTableData>[] = [
    {
        id: "classId",
        numeric: false,
        disablePadding: true,
        label: "Mã lớp",
    },
    {
        id: "subjectName",
        numeric: false,
        disablePadding: true,
        label: "Tên học phần",
    },
    {
        id: "subjectId",
        numeric: false,
        disablePadding: true,
        label: "Mã học phần",
    },
    {
        id: "teacher",
        numeric: false,
        disablePadding: true,
        label: "Giáo viên",
    },
    {
        id: "semester",
        numeric: false,
        disablePadding: true,
        label: "Học kỳ",
    },
    {
        id: "duration",
        numeric: false,
        disablePadding: true,
        label: "Thời lượng",
        minWidth: 60,
    },
    {
        id: "location",
        numeric: false,
        disablePadding: true,
        label: "Vị trí lớp học",
        minWidth: 60,
    },
    {
        id: "action",
        numeric: false,
        disablePadding: true,
        label: "Hành động",
        minWidth: 60,
    },
];


function ManageClass() {

    const [classList, setClassList] = useState<any[]>([]);
    const [display, setDisplay] = React.useState<any[]>([]);
    const [searchText, setSearchText] = React.useState<string>("");

    const dispatch = useDispatch();
    const token = getCookie("token");
    useEffect(() => {
        dispatch(showTopLoading())
        getClasses(token).then(res => {
            console.log(res.data)
            setClassList(res.data);
            setDisplay(res.data)
        }).finally(() => {
            dispatch(closeTopLoading())
        })
    }, [])

    let editClassRef: any;
    const handleEditClass = (classObj: any) => {
        dispatch(setDialog({
            title: "Chỉnh sửa thông tin lớp học",
            customHeight: 680,
            customWidth: 700,
            open: true,
            type: "normal",
            onClickOk: async () => {
                console.log(editClassRef.validateForm());
                if (await editClassRef.validateForm()) {
                    dispatch(showTopLoading())
                    const newClass = editClassRef.changedClass
                    const res = await editClass(token, classObj._id, newClass)
                    if (res?.status === "success") {
                        const processedClassList = classList.map(item => {
                            if (item.id === classObj._id) return { ...item, ...newClass }
                            else return { ...item }
                        })
                        //display success dialog
                        setClassList(processedClassList)
                        dispatch(setDialog({
                            title: "Chỉnh sửa lớp học thành công",
                            open: true,
                            type: "info",
                            isMessagebar: true
                        }))

                    } else {
                        dispatch(setDialog({
                            title: "Chỉnh sửa lớp học thất bại, vui lòng thử lại sau",
                            open: true,
                            type: "warning",
                            isMessagebar: true
                        }))
                    }
                    dispatch(closeTopLoading())
                }

            },
            content: (
                <EditClassForm classObj={classObj} ref={(ref) => {
                    editClassRef = ref
                }} />
            )
        }))

    }

    const handleAddNew = () => {

        dispatch(setDialog({
            title: "Thêm mới lớp học",
            customHeight: 680,
            customWidth: 700,
            open: true,
            type: "normal",
            onClickOk: async () => {
                console.log(editClassRef.validateForm());
                if (await editClassRef.validateForm()) {
                    dispatch(showTopLoading())
                    const newClass = editClassRef.changedClass
                    console.log(newClass)
                    // const res = await createClass(token, newClass)
                    // if (res?.status === "success") {
                    //     const processedClassList = classList.map(item => {
                    //         if (item.id === classObj._id) return { ...item, ...newClass }
                    //         else return { ...item }
                    //     })
                    //     //display success dialog
                    //     setClassList(processedClassList)
                    //     dispatch(setDialog({
                    //         title: "Chỉnh sửa lớp học thành công",
                    //         open: true,
                    //         type: "info",
                    //         isMessagebar: true
                    //     }))

                    // } else {
                    //     dispatch(setDialog({
                    //         title: "Chỉnh sửa lớp học thất bại, vui lòng thử lại sau",
                    //         open: true,
                    //         type: "warning",
                    //         isMessagebar: true
                    //     }))
                    // }
                    dispatch(closeTopLoading())
                }

            },
            content: (
                <EditClassForm classObj={{}} ref={(ref) => {
                    editClassRef = ref
                }} />
            )
        }))


    }

    const handleDeleteClass = (classObj: any) => {
        dispatch(
            setDialog({
                customWidth: 400,
                customHeight: 200,
                title: "Xác nhận xóa lớp học",
                open: true,
                type: "warning",
                onClickOk: async () => {
                    const promise = deleteClass;
                    const res = await promise(token, classObj._id)
                    const processedClassList = classList.filter((item) => item._id !== classObj._id)
                    dispatch(setDialog({
                        open: false,
                    }))
                    //DONE: show succcessmsg
                    dispatch(setDialog({
                        title: `Xóa lớp học ${classObj.classId} thành công`,
                        open: true,
                        type: "info",
                        isMessagebar: true
                    }))
                    setClassList(processedClassList)

                },
                content: (
                    <div className='pl-6 font-montserrat text-xs font-medium'>
                        {`Những dữ liệu liên quan sẽ không thể khôi phục, bạn có chắc chắn muốn xóa lớp ${classObj.classId}?`}
                    </div>
                ),
            }))
    }

    React.useEffect(() => {
        setDisplay(
            classList?.filter((item: any) => {
                const classId = item.classId || ""
                return classId.toString()
                    .toLocaleLowerCase()
                    .includes(searchText.toLocaleLowerCase());
            })
        );
    }, [searchText, JSON.stringify(classList)]);


    const createRowElements = (classObj: any): ClassTableData => {
        return {
            id: classObj._id || "0",
            classId: classObj.classId,
            subjectName: classObj.subject.title,
            subjectId: classObj.subject.subjectId,
            teacher: classObj.teacher.name,
            semester: classObj.semester,
            duration: classObj.duration,
            location: classObj.location.description,
            action: (
                <div className='flex gap-2 items-center justify-center'>
                    <ToolTip textContent='Chỉnh sửa' limit={1}>
                        <FaPen size={14} className='text-lg text-[#0072D0] cursor-pointer'
                            onClick={() => { handleEditClass(classObj) }} />
                    </ToolTip>
                    <ToolTip textContent='Xóa' limit={1}>
                        <FaTrash size={14} className='text-lg text-lightRed cursor-pointer'
                            onClick={() => { handleDeleteClass(classObj) }} />
                    </ToolTip>
                </div>
            ),
        };
    }
    const toolbarItems = (
        <div className="flex my-1 justify-between">
            <div className="w-[30%] my-2 flex gap-2">
                <Button
                    variant="outlined"
                    startIcon={<FaPlus className='text-lg' />}
                    //   disabled={!(selected.length > 0)}
                    // textTransform={"none"}
                    sx={{
                        color: "#0072D0",
                        textTransform: "none",
                        borderColor: "#0072D0",
                        "&:hover": {
                            borderColor: "#0072D0"
                        }
                    }}

                    onClick={() => handleAddNew()}
                >Thêm mới
                </Button>
            </div>
            <div className="w-[40%] my-2 ">
                <SearchBar
                    searchText={searchText}
                    setSearchText={setSearchText}
                    placeholder={"Tìm kiếm theo mã lớp"}
                ></SearchBar>
            </div>
        </div>
    );

    const mapAttendanceDataToRowElement = (classList: any[]): ClassTableData[] => classList.map((item: any) => {
        return createRowElements(item);
    });

    return (
        <div className="bg-white rounded-md p-8 pt-4 w-[100%] h-max flex flex-col items-center">
            <TablePager<any>
                tableTitle={"Danh sách lớp học"}
                // selected={selected}
                // setSelected={setSelected}
                // orderBy={orderBy}
                // onSelectAllClick={handleSelectAllClick}
                total={display?.length}
                data={display || []}
                mapDataToRowData={mapAttendanceDataToRowElement}
                headCells={headCells}
                hideCheckbox
                showSearchBar={true}
                toolbarItems={toolbarItems}
            ></TablePager>
        </div>
    )
}

export default ManageClass