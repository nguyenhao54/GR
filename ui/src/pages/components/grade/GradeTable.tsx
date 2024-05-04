import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import TablePager, { HeadCell } from '../../../common/TablePager';
import { getCookie } from '../dashboard/AttendanceCard';
import { SearchBar } from '../../../common';
import { AppState } from '../../../redux/store';
import { Button, TextField } from '@mui/material';
import { createGrade, getGrade, updateGrade } from '../../../api/grade';
import { closeTopLoading, showTopLoading } from '../../../redux/toploading.reducer';


interface GradeTableData {
    id?: string;
    studentName?: string;
    studentCode?: string;
    midGrade?: JSX.Element
    processGrade?: JSX.Element
    finalGrade?: JSX.Element
}

const headCells: readonly HeadCell<GradeTableData>[] = [
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
        minWidth: 180,
    },
    {
        id: "midGrade",
        numeric: false,
        disablePadding: true,
        label: "Điểm giữa kì",
        minWidth: 100
    },
    {
        id: "processGrade",
        numeric: false,
        disablePadding: true,
        label: "Điểm quá trình",
        minWidth: 100
    },
    {
        id: "finalGrade",
        numeric: false,
        disablePadding: true,
        label: "Điểm cuối kỳ",
        minWidth: 100
    },
]

function GradeTable({ selectedClass }: { selectedClass: any }) {
    const dispatch = useDispatch()
    const token = getCookie("token");
    const user = useSelector((appState: AppState) => appState.user.user);

    // const [loading, setLoading] = React.useState<boolean>(true);
    const [gradeList, setGradeList] = React.useState<any[]>([])
    const [searchText, setSearchText] = React.useState<string>("");
    const [display, setDisplay] = React.useState<any[]>();

    useEffect(() => setDisplay(gradeList || []), gradeList)
    const mapRequestToRowElement = (data: any[],): GradeTableData[] => data.map((item: any) => {
        return createRowElements(item);
    });

    useEffect(() => {
        dispatch(showTopLoading())

        Promise.all([...(selectedClass?.students || []).map(async (student: any) => {
            const grade = await getGrade(token, selectedClass._id, student._id)
            if (grade) {
                return {
                    ...student,
                    midGrade: grade.midGrade,
                    processGrade: grade.processGrade,
                    finalGrade: grade.finalGrade,
                    isFromDb: true,
                    gradeObjId: grade._id
                }
            }
            else return { ...student }
        })]).then((tempGradeList) => {
            setGradeList(tempGradeList || [])
            dispatch(closeTopLoading())

        })

    }, [selectedClass?._id])

    useEffect(() => {
        setDisplay(
            gradeList.filter((item: any) => {
                const codeNumber = item.codeNumber || ""
                return codeNumber.toString()
                    .toLocaleLowerCase()
                    .includes(searchText.toLocaleLowerCase());
            })
        );
    }, [searchText, JSON.stringify(gradeList)]);

    const handleSave = async () => {
        dispatch(showTopLoading())
        await Promise.all(gradeList.map(async (grade: any) => {
            const { midGrade, finalGrade, processGrade } = grade
            if (!grade.isFromDb)
                await createGrade(token, grade._id, selectedClass._id, { midGrade, finalGrade, processGrade })
            else
                //update
                await updateGrade(token, grade.gradeObjId, grade._id, selectedClass._id, { midGrade, finalGrade, processGrade })
        })).then(res => {
            console.log(res)
        })
        dispatch(closeTopLoading())
    }

    const setGrade = (id: string, type: string, grade: string) => {
        setGradeList(gradeList.map(item => {
            if (item._id === id) {
                return ({
                    ...item,
                    [`${type}`]: grade
                })
            }
            else return item
        }))
    }

    const createRowElements = (student: any): GradeTableData => {
        return {
            id: student._id,
            studentCode: student.codeNumber,
            studentName: student.name,
            midGrade: <div className='w-full'>
                <TextField
                    id={`${selectedClass?._id}mid`}
                    key={`${selectedClass?._id}mid`}
                    type="number"
                    inputProps={{ min: 0, max: 10 }}
                    value={student.midGrade || ""}
                    onChange={(e) => {
                        console.log(e.target.value)
                        setGrade(student._id, "midGrade", e.target.value)
                    }}
                    style={{ width: "100%" }}
                    variant="outlined"
                />
                {(student.midGrade > 10 || student.midGrade < 0) && <div className="text-[10px] text-lightRed mt-1 -mb-5 pb-3 italic w-32">{"Điểm phải >=0 hoặc <=10"}</div>}
            </div>,
            processGrade:
                <div>
                    <TextField
                        id={`${selectedClass?._id}process`}
                        key={`${selectedClass?._id}process`}
                        type="number"
                        inputProps={{ min: 0, max: 10 }}
                        value={student.processGrade || ""}
                        onChange={(e) => setGrade(student._id, "processGrade", e.target.value)}
                        style={{ width: "100%" }}
                        variant="outlined"
                    />
                    {(student.processGrade > 10 || student.processGrade < 0) && <div className="text-[10px] text-lightRed mt-1 -mb-5 pb-3 italic w-32">{"Điểm phải >=0 hoặc <=10"}</div>}

                </div>,
            finalGrade: <div>
                <TextField
                    id={`${selectedClass?._id}final`}
                    key={`${selectedClass?._id}final`}
                    type='number'

                    inputProps={{ min: 0, max: 10 }}
                    value={student.finalGrade || ""}
                    onChange={(e) => setGrade(student._id, "finalGrade", e.target.value)}
                    style={{ width: "100%" }}
                    variant="outlined"
                />
                {(student.finalGrade > 10 || student.finalGrade < 0) && <div className="text-[10px] text-lightRed mt-1 -mb-5 pb-3 italic w-32">{"Điểm phải >=0 hoặc <=10"}</div>}
            </div>
        }
    }

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
        // <>{loading ? <DotFlashing></DotFlashing>
        //     :
        <div className="pt-4 w-full">
            <TablePager
                id={`${selectedClass?._id}`}
                tableTitle={"Danh sách sinh viên"}
                total={display?.length || 0}
                data={display || []}
                mapDataToRowData={mapRequestToRowElement}
                headCells={headCells}
                hideCheckbox
                orderBy='startTime'
                showSearchBar
                toolbarItems={user?.role !== "student" ? toolbarItems : <></>}
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
        //     }
        // </>
    )
}

export default GradeTable


