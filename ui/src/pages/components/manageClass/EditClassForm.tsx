import { ClickAwayListener, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Tooltip, useTheme } from '@mui/material';
import TextField from '@mui/material/TextField';
import React from 'react'
import { FaInfoCircle } from 'react-icons/fa';
import { MenuProps } from '../../Grade';
import { getStyles } from '../../Result';

const EditClassForm = React.forwardRef(({ classObj }: { classObj: any }, ref) => {

    const theme = useTheme();

    const [open, setOpen] = React.useState(false);
    const [semester, setSemester] = React.useState<number>(classObj.semester)
    const semesterList = [20191, 20192, 20211, 20212, 20221, 20222, 20231, 20232, 20241, 20242, 20251, 20252]


    React.useImperativeHandle(ref, () => {
        return {
            changedClass: { ...classObj, semester }
        }
    })

    const handleTooltipClose = () => {
        setOpen(false);
    };

    const handleChange = (event: SelectChangeEvent<typeof semester>) => {
        const { target: { value } } = event;
        setSemester(semesterList.find((item) => item === value) || semesterList[0]);
    }


    return (
        <div className='overflow-auto font-montserrat w-full h-[430px]'>
            <div className="flex flex-col ">
                <div className="flex-col flex gap-4">
                    <div className="font-semibold flex flex-row gap-1 items-center">
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
                    {/* <p>Thời gian: {formatDate(request.lesson.startDateTime) + " - " + formatDate(request.lesson.endDateTime)}</p> */}
                    <div className="flex gap-2">
                        <TextField
                            id="subjectId"
                            label="Mã học phần"
                            required
                            // multiline
                            // rows='4.7'
                            value={classObj.subject.subjectId}
                            onChange={(e) => {
                                console.log(e.target.value)
                            }}
                            style={{ width: "50%" }}
                            variant="outlined"
                        />
                        <TextField
                            id="teacher"
                            label="Giáo viên"
                            required
                            // multiline
                            // rows='4.7'
                            defaultValue={classObj.teacher.email}
                            onChange={(e) => {
                                console.log(e.target.value)
                            }}
                            style={{ width: "50%" }}
                            variant="outlined"
                        />
                    </div>

                    <div className="font-semibold text-xs pl-1">Vị trí lớp học</div>
                    <div className="flex gap-2">
                        <TextField
                            id="lat"
                            label="Kinh độ"
                            required
                            // multiline
                            // rows='4.7'
                            defaultValue={classObj.location.coordinates[0] || ""}
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
                            // multiline
                            // rows='4.7'
                            defaultValue={classObj.location.coordinates[1] || ""}
                            onChange={(e) => {
                                console.log(e.target.value)
                            }}
                            style={{ width: "33%" }}
                            variant="outlined"
                        /><TextField
                            id="desc"
                            label="Mô tả"
                            required
                            // multiline
                            // rows='4.7'
                            defaultValue={classObj.location.description}
                            onChange={(e) => {
                                console.log(e.target.value)
                            }}
                            style={{ width: "33%" }}
                            variant="outlined"
                        />

                    </div>
                    <div className="flex gap-2">
                        {/* <TextField
                            id="semester"
                            label="Học kỳ"
                            required
                            // multiline
                            // rows='4.7'
                            value={semester}
                            onChange={(e) => {
                                console.log(e.target.value)
                                setSemester(e.target.value)
                            }}
                            style={{ width: "50%" }}
                            variant="outlined"
                        /> */}
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
}
)

export default EditClassForm