import { FormControl, InputLabel, MenuItem, OutlinedInput, PaperProps, Theme, useTheme } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select'
import React, { useEffect } from 'react'
import { getMyClasses } from '../api/class';
import { getCookie } from './components/dashboard/AttendanceCard';
import GradeTable from './components/grade/GradeTable';
import Result from './Result';
import { AppState } from '../redux/store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name: string, personName: string[], theme: Theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

function Grade() {
    const user = useSelector((appState: AppState) => appState.user.user)
    const navigate = useNavigate()
    if (!user) {
        navigate("/login")
        return <></>
    }
    else {
        return <>{
            user!.role === "student"
                ? <Result></Result>
                : <GradeView></GradeView>
        }</>
    }
}

function GradeView() {

    const theme = useTheme();
    const [classList, setClassList] = React.useState<any[]>([]);
    const [selectedClass, setSelectedClass] = React.useState<any>();
    const token = getCookie("token")

    useEffect(() => {
        getMyClasses(token).then(res => { setClassList(res?.classes) })
    }, [])

    useEffect(() => {
        setSelectedClass(classList?.[0])
    }, [JSON.stringify(classList)])

    const handleChange = (event: SelectChangeEvent<typeof selectedClass>) => {
        const { target: { value } } = event;
        setSelectedClass(classList.find((item) => item._id === value));
    };

    return (
        <div className="bg-white rounded-md p-8 pt-4 w-[100%] h-max flex flex-col items-center">
            <div className='h-[calc(100vh-120px)] w-full'>
                <div className="w-full">
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Mã lớp</InputLabel>
                        <Select
                            className='w-64 text-black'
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // multiple
                            value={selectedClass?._id || ""}
                            onChange={handleChange}
                            input={<OutlinedInput label="Mã lớp" className='w-64 text-black' />}
                            MenuProps={MenuProps}
                        >
                            {classList.map((item: any) => (
                                <MenuItem
                                    key={item._id}
                                    value={item._id}
                                    style={getStyles(item._id, selectedClass?._id || '', theme)}
                                >
                                    {item.classId}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <GradeTable selectedClass={selectedClass}></GradeTable>
                </div>
            </div>
        </div>
    )
}

export default Grade