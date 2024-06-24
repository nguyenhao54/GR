import React from 'react'
import { FormControl, InputLabel, MenuItem, OutlinedInput, Theme, useTheme } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select'
import SemesterGradeTable from './components/grade/SemesterGradeTable';

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

export function getStyles(name: number | string, personName: number | string, theme: Theme) {
    return {
        fontWeight:
            personName === name
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

function Result() {
    const theme = useTheme();
    const semesterList = [20191, 20192, 20211, 20212, 20221, 20222, 20231, 20232, 20241, 20242, 20251, 20252]
    const [selectedSemester, setSelectedSemester] = React.useState<number>(20232);

    const handleChange = (event: SelectChangeEvent<typeof selectedSemester>) => {
        const { target: { value } } = event;
        setSelectedSemester(semesterList.find((item) => item === value) || semesterList[0] );
    }
    return (
        <div className="bg-white rounded-md p-4 sm:p-8 pt-4 w-[100%] h-max flex flex-col items-center">
            <div className='h-[calc(100vh-120px)] w-full'>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Học kỳ</InputLabel>
                    <Select
                        className='w-64 text-black'
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        // multiple
                        value={selectedSemester || ""}
                        onChange={handleChange}
                        input={<OutlinedInput label="Học kỳ" className='w-64 text-black' />}
                        MenuProps={MenuProps}
                    >
                        {semesterList.map((item: number) => (
                            <MenuItem
                                key={item}
                                value={item}
                                style={getStyles(item, selectedSemester, theme)}
                            >
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <SemesterGradeTable semester={selectedSemester}></SemesterGradeTable>
            </div>
        </div>
    )
}

export default Result