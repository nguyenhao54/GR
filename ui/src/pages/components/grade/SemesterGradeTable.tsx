import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getMyGrade } from '../../../api/grade';
import { AppState } from '../../../redux/store';
import { getCookie } from '../dashboard/AttendanceCard';
import TablePager, { HeadCell } from '../../../common/TablePager';

interface ClassGradeTableData {
    id?: string;
    classId?: string;
    subjectId?: string;
    subjectName?: string;
    gradeCoefficient?: number;
    midGrade?: number
    processGrade?: number
    finalGrade?: number
}

const headCells: readonly HeadCell<ClassGradeTableData>[] = [
    {
        id: "classId",
        numeric: false,
        disablePadding: true,
        label: "Mã lớp",
    },
    {
        id: "subjectId",
        numeric: false,
        disablePadding: true,
        label: "Mã học phần",
        minWidth: 60,
    },
    {
        id: "subjectName",
        numeric: false,
        disablePadding: true,
        label: "Tên học phần",
        minWidth: 200,
    },
    {
        id: "gradeCoefficient",
        numeric: false,
        disablePadding: true,
        label: "Hệ số điểm",
        minWidth: 40,
    },
    {
        id: "midGrade",
        numeric: false,
        disablePadding: true,
        label: "Điểm giữa kì",
        minWidth: 40
    },
    {
        id: "processGrade",
        numeric: false,
        disablePadding: true,
        label: "Điểm quá trình",
        minWidth: 40
    },
    {
        id: "finalGrade",
        numeric: false,
        disablePadding: true,
        label: "Điểm cuối kỳ",
        minWidth: 40
    },
]

function SemesterGradeTable({ semester }: { semester: number }) {
    const dispatch = useDispatch()
    const token = getCookie("token");
    const user = useSelector((appState: AppState) => appState.user.user);

    const [classList, setClassList] = useState<any[]>([])
    useEffect(() => {
        getMyGrade(token, semester).then((res: any) => {
            // console.log(res)
            setClassList(res.grades)
        })
    }, [semester])

    const createRowElements = (item: any): ClassGradeTableData => {
        return {
            id: item._id,
            classId: item.class.classId,
            subjectId: item.class.subject.subjectId,
            subjectName: item.class.subject.title,
            gradeCoefficient: item.class.subject.gradeCoefficient,
            midGrade: item.midGrade,
            processGrade: item.processGrade,
            finalGrade: item.finalGrade
        }
    }

    const mapRequestToRowElement = (data: any[],): ClassGradeTableData[] => data.map((item: any) => {
        return createRowElements(item);
    });

    return (
        <div className='pt-4'>
            <TablePager
                id={`${semester}_grade_table`}
                tableTitle={`Bảng điểm học kỳ ${semester}`}
                total={classList?.length || 0}
                data={classList || []}
                mapDataToRowData={mapRequestToRowElement}
                headCells={headCells}
                hideCheckbox
                showSearchBar
            // toolbarItems={user?.role !== "student" ? toolbarItems : <></>}
            ></TablePager>
        </div>
    )
}

export default SemesterGradeTable