import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getMyGrade } from '../../../api/grade';
import { getCookie } from '../dashboard/AttendanceCard';
import TablePager, { HeadCell } from '../../../common/TablePager';
import { closeTopLoading, showTopLoading } from '../../../redux/toploading.reducer';

interface ClassGradeTableData {
    id?: string;
    classId?: string;
    subjectId?: string;
    subjectName?: string;
    gradeCoefficient?: number;
    midGrade?: number
    processGrade?: number
    finalGrade?: number
    overallGrade?: string;
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
    {
        id: "overallGrade",
        numeric: false,
        disablePadding: true,
        label: "Điểm tổng kết",
        minWidth: 40
    },
]

function SemesterGradeTable({ semester }: { semester: number }) {
    const dispatch = useDispatch()
    const token = getCookie("token");

    const [classList, setClassList] = useState<any[]>([])
    useEffect(() => {
        dispatch(showTopLoading())
        getMyGrade(token, semester).then((res: any) => {
            setClassList(res?.grades || [])
        }).finally(() => {
            dispatch(closeTopLoading())

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
            finalGrade: item.finalGrade,
            overallGrade: item.overallGrade
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