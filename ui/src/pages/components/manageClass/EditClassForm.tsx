import { ClickAwayListener, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Tooltip, useTheme } from '@mui/material';
import TextField from '@mui/material/TextField';
import React from 'react'
import { FaInfoCircle } from 'react-icons/fa';
import { MenuProps } from '../../Grade';
import { getStyles } from '../../Result';
import { getUsers } from '../../../api/user';
import { getCookie } from '../dashboard/AttendanceCard';

const EditClassForm = React.forwardRef(({ classObj }: { classObj: any }, ref) => {

    const theme = useTheme();
    const token = getCookie("token");
    const [open, setOpen] = React.useState(false);
    const [semester, setSemester] = React.useState<number>(classObj.semester)
    const [teacher, setTeacher] = React.useState<any>({ email: classObj.teacher?.email || "" })
    const [teacherError, setTeacherError] = React.useState<string>("");
    const semesterList = [20191, 20192, 20211, 20212, 20221, 20222, 20231, 20232, 20241, 20242, 20251, 20252]

    React.useImperativeHandle(ref, () => {
        return {
            changedClass: { ...classObj, semester },
            validateForm: validate
        }
    })

    const handleTooltipClose = () => {
        setOpen(false);
    };

    const handleChange = (event: SelectChangeEvent<typeof semester>) => {
        const { target: { value } } = event;
        setSemester(semesterList.find((item) => item === value) || semesterList[0]);
    }

    const validate = async () => {
        let validate = true;
        const res = await getUsers(token, `?email=${teacher.email}`)
        if (res.data.data[0]) {
            setTeacher({ ...teacher, id: res.data.data[0]._id })
        }
        else {
            validate = false;
            setTeacherError("Không có giáo viên với email này")
        }
        return validate;
    }

    return (
        <div className='overflow-auto font-montserrat w-full h-[430px]'>
            <div className="flex flex-col ">
                <div className="flex-col flex gap-4">
                    {classObj.classId ? <div className="font-semibold flex flex-row gap-1 items-center">
                        <p>Lớp học: {classObj.classId}</p>
                        <ClickAwayListener onClickAway={handleTooltipClose}>
                            <div>
                                <Tooltip
                                    PopperProps={{
                                        disablePortal: true,

                                    }}
                                    onClose={handleTooltipClose}
                                    open={open}
                                    disableFocusListener
                                    disableHoverListener
                                    disableTouchListener
                                    title="Không thể thay đổi mã lớp học, nếu muốn thay đổi, hãy xóa lớp học này và tạo yêu cầu mới"
                                >
                                    <div className="cursor-pointer"
                                        onClick={() => { setOpen(true) }}
                                    ><FaInfoCircle />
                                    </div>
                                </Tooltip>
                            </div>
                        </ClickAwayListener>
                    </div>
                        : <div className="w-1/2">
                            <TextField
                                id="classId"
                                label="Mã lớp"
                                required
                                value={""}
                                onChange={(e) => {
                                    console.log(e.target.value)
                                }}
                                style={{ width: "100%" }}
                                variant="outlined"
                            />
                        </div>
                    }
                    <div className="flex gap-2">

                        <div className="w-1/2">
                            <TextField
                                id="subjectId"
                                label="Mã học phần"
                                required
                                value={classObj.subject?.subjectId}
                                onChange={(e) => {
                                    console.log(e.target.value)
                                }}
                                style={{ width: "100%" }}
                                variant="outlined"
                            />
                        </div>
                        <div className="w-1/2">
                            <TextField
                                id="teacher"
                                label="Giáo viên"
                                required
                                defaultValue={teacher.email}
                                onChange={(e) => {
                                    setTeacherError("")
                                    setTeacher({ email: e.target.value })
                                    console.log(e.target.value)
                                }}
                                style={{ width: "100%" }}

                                variant="outlined"
                            />
                            {teacherError && <div className="text-[10px] text-lightRed mt-1 -mb-5 pb-3 italic w-full">{teacherError}</div>}
                        </div>
                    </div>

                    <div className="font-semibold text-xs pl-1">Vị trí lớp học</div>
                    <div className="flex gap-2">
                        <TextField
                            id="lat"
                            label="Kinh độ"
                            required
                            defaultValue={classObj.location?.coordinates[0] || ""}
                            onChange={(e) => {
                                console.log(e.target.value)
                            }}
                            style={{ width: "33%" }}
                            variant="outlined"
                        />
                        <TextField
                            id="long"
                            label="Vĩ độ"
                            required
                            defaultValue={classObj.location?.coordinates[1] || ""}
                            onChange={(e) => {
                                console.log(e.target.value)
                            }}
                            style={{ width: "33%" }}
                            variant="outlined"
                        /><TextField
                            id="desc"
                            label="Mô tả"
                            required
                            defaultValue={classObj.location?.description}
                            onChange={(e) => {
                                console.log(e.target.value)
                            }}
                            style={{ width: "33%" }}
                            variant="outlined"
                        />

                    </div>
                    <div className="flex gap-2">
                        <div className="w-1/2">
                            <FormControl fullWidth >
                                <InputLabel id="demo-simple-select-label">Học kỳ</InputLabel>
                                <Select
                                    className='w-full text-black'
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    // multiple
                                    value={semester || ""}
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Học kỳ" className='w-64 text-black' />}
                                    MenuProps={MenuProps}
                                >
                                    {semesterList.map((item: number) => (
                                        <MenuItem
                                            key={item}
                                            value={item}
                                            style={getStyles(item, semester, theme)}
                                        >
                                            {item}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <TextField
                            id="duration"
                            label="Thời lượng (phút)"
                            required
                            type="number"
                            defaultValue={classObj.duration}
                            onChange={(e) => {
                                console.log(e.target.value)
                            }}
                            style={{ width: "50%" }}
                            variant="outlined"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
})

export default EditClassForm