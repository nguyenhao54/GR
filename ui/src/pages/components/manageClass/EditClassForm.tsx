import { ClickAwayListener, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Tooltip, useTheme } from '@mui/material';
import TextField from '@mui/material/TextField';
import React from 'react'
import { FaInfoCircle } from 'react-icons/fa';
import { MenuProps } from '../../Grade';
import { getStyles } from '../../Result';
import { getUsers } from '../../../api/user';
import { getCookie } from '../dashboard/AttendanceCard';
import { getSubject } from '../../../api/subject';
import { formatDate, minusSevenHours } from '../../../utils';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PeoplePicker from '../../../common/PeoplePicker';

const EditClassForm = React.forwardRef(({ classObj }: { classObj: any }, ref) => {

    const theme = useTheme();
    const token = getCookie("token");
    const [open, setOpen] = React.useState(false);
    const [semester, setSemester] = React.useState<number>(classObj.semester)
    const [teacher, setTeacher] = React.useState<any>({ email: classObj.teacher?.email || "" })
    const [subject, setSubject] = React.useState<any>({ subjectId: classObj.subject?.subjectId || "" })
    const [duration, setDuration] = React.useState<any>(classObj.duration || 90)
    const [durationError, setDurationError] = React.useState<any>("")
    const [teacherError, setTeacherError] = React.useState<string>("");
    const [subjectError, setSubjectError] = React.useState<string>("");
    const semesterList = [20191, 20192, 20211, 20212, 20221, 20222, 20231, 20232, 20241, 20242, 20251, 20252]
    const [classId, setClassId] = React.useState<string>(classObj.classId || "");
    const [userList, setUserList] = React.useState<string>(classObj.students?.map((i: any) => i.codeNumber).join(', '))
    const [userError, setUserError] = React.useState<string>("");
    const [userIds, setUserIds] = React.useState<any[]>([]);
    const [classError, setClassError] = React.useState<string>("");
    const [startTime, setStartTime] = React.useState<Dayjs | null>(dayjs(classObj.firstStartTime ? new Date(minusSevenHours(classObj.firstStartTime)) : new Date()));
    const [endTime, setEndTime] = React.useState<Dayjs | null>(dayjs(classObj.lastStartTime ? new Date(minusSevenHours(classObj.lastStartTime)) : new Date()));
    const [lat, setLat] = React.useState<any>(classObj.location?.coordinates[0]);
    const [lon, setLon] = React.useState<any>(classObj.location?.coordinates[1]);
    const [desc, setDesc] = React.useState<any>(classObj.location?.description)

    React.useImperativeHandle(ref, () => {
        return {
            //TODO : change other properties as well 
            changedClass: { ...classObj, classId: classId, semester, teacher: teacher, subject: subject, students: userIds, firstStartTime: startTime?.toDate(), lastStartTime: endTime?.toDate(), duration, location: { coordinates: [lat, lon], description: desc } },
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

    const isExistedStudent = async (item: number) => {
        const res = await getUsers(token, `?codeNumber=${item}`)

        if (res.data.data[0]) {
            return res.data.data[0]
        }
        else {
            setUserError("Không có sinh viên với mã " + item)
            return false;
        }
    }

    const validate = async () => {
        let validate = true;

        if (!classId) {
            setClassError("Trường này là bắt buộc")
            validate = false;
        }
        if (!subject.subjectId) {
            setSubjectError("Trường này là bắt buộc")
            validate = false;
        }
        else {
            const sub = await getSubject(token, `?subjectId=${subject.subjectId}`)
            if (sub?.data?.data[0]) {
                setSubject({ ...subject, ...sub.data.data[0] })
            }
            else {
                validate = false;
                setSubjectError("Không có môn học với mã học phần này")
            }
        }

        if (!teacher.email) {
            setTeacherError("Trường này là bắt buộc")
            validate = false;
        }
        else {
            const res = await getUsers(token, `?email=${teacher.email}`)
            if (res.data.data[0]) {
                setTeacher({ ...teacher, ...res.data.data[0] })
            }
            else {
                validate = false;
                setTeacherError("Không có giáo viên với email này")
            }
        }

        if (!duration) {
            setDurationError("Trường này là bắt buộc")
            validate = false
        }
        if (!userList) {
            setUserError("Trường này là bắt buộc")
            validate = false
        }
        else {
            const validationPromises = userList.split(',').map(user => isExistedStudent(Number(user)));
            const validationRes = await Promise.all(validationPromises);
            console.log(validationRes)
            setUserIds(validationRes)
            validate = validate && validationRes.every(result => result);
        }
        return validate;
    }

    return (
        <div className='overflow-auto font-nunitoSans w-full h-[430px]'>
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
                        : <div className="w-full">
                            <TextField
                                id="classId"
                                label="Mã lớp"
                                required
                                value={classId}
                                onChange={(e) => {
                                    setClassError("");
                                    setClassId(e.target.value)
                                }}
                                style={{ width: "100%" }}
                                variant="outlined"
                            />
                            {classError && <div className="text-[10px] text-lightRed mt-1 -mb-5 pb-3 italic w-full">{classError}</div>}
                        </div>
                    }
                    <div className="flex gap-2">

                        <div className="w-1/2">
                            <TextField
                                id="subjectId"
                                label="Mã học phần"
                                required
                                defaultValue={subject?.subjectId}
                                onChange={(e) => {
                                    setSubject({ subjectId: e.target.value })
                                }}
                                style={{ width: "100%" }}
                                variant="outlined"
                            />
                            {subjectError && <div className="text-[10px] text-lightRed mt-1 -mb-5 pb-3 italic w-full">{subjectError}</div>}

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
                            // required
                            defaultValue={lat || ""}
                            onChange={(e) => {
                                setLat(e.target.value)
                            }}
                            style={{ width: "33%" }}
                            variant="outlined"
                        />
                        <TextField
                            id="long"
                            label="Vĩ độ"
                            // required
                            defaultValue={lon || ""}
                            onChange={(e) => {
                                setLon(e.target.value)
                            }}
                            style={{ width: "33%" }}
                            variant="outlined"
                        /><TextField
                            id="desc"
                            label="Mô tả"
                            // required
                            defaultValue={desc || ""}
                            onChange={(e) => {
                                setDesc(e.target.value)
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

                        <div className="w-1/2">
                            <TextField
                                id="duration"
                                label="Thời lượng (phút)"
                                required
                                type="number"
                                defaultValue={duration}
                                onChange={(e) => {
                                    setDuration(e.target.value)
                                }}
                                style={{ width: "100%" }}
                                variant="outlined"
                            />
                            {durationError && <div className="text-[10px] text-lightRed mt-1 -mb-5 pb-3 italic w-full">{durationError}</div>}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div className="flex justify-between flex-row gap-2 w-full">
                                <DateTimePicker
                                    label="Buổi học đầu"
                                    value={startTime}
                                    className='w-full'
                                    onChange={(newValue) => setStartTime(newValue)}
                                />
                                <DateTimePicker
                                    label="Buổi học cuối"
                                    value={endTime}
                                    className='w-full'
                                    onChange={(newValue) => setEndTime(newValue)}
                                />
                            </div>
                        </LocalizationProvider>
                    </div>
                    <div>
                        <TextField
                            id="duration"
                            label={`Nhập mã số sinh viên cách nhau bởi dấu ", " `}
                            required
                            // type="number"
                            defaultValue={userList}
                            onChange={(e) => {
                                setUserList(e.target.value)
                            }}
                            style={{ width: "100%" }}
                            variant="outlined"
                        />
                        {userError && <div className="text-[10px] text-lightRed mt-1 -mb-5 pb-3 italic w-full">{userError}</div>}
                    </div>
                </div>
            </div>
        </div>
    )
})

export default EditClassForm