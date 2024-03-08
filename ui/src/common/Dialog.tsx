import React from 'react'
import { Dialog } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setDialog } from '../redux/dialog.reducer'
import { AppState } from '../redux/store'

export default function DialogView() {

    const dispatch = useDispatch()
    const dialogState = useSelector((appState: AppState) => appState.dialog)

    return (
        <Dialog
            open={dialogState.open || false}
            onClose={() => dispatch(setDialog({ close: true }))}
            fullWidth={true}
            PaperProps={{
                style: { borderRadius: 8, width: 560 },
            }}
        >
<div> diiadskj</div>

        </Dialog>
    )
}
