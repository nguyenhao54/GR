import React from 'react'
import { Button, Dialog, DialogTitle, IconButton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setDialog } from '../redux/dialog.reducer'
import { AppState } from '../redux/store'
import { FaXmark } from "react-icons/fa6";
import DotFlashing from './DotFlashing'
import { FaRegQuestionCircle } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";


export default function DialogView() {

    const dispatch = useDispatch()
    const dialogState = useSelector((appState: AppState) => appState.dialog.dialog)
    if (!dialogState) return <></>;
    const { customWidth, customHeight } = dialogState;
    return (
        <Dialog
            open={dialogState?.open || false}
            title={dialogState?.title}
            onClose={() => dispatch(setDialog({ open: false }))}
            fullWidth={true}
            PaperProps={{
                style: { borderRadius: 8, width: customWidth || 560, height: customHeight || 300 },
            }}
        >
            <DialogTitle>{dialogState?.title}</DialogTitle>
            <IconButton
                aria-label="close"
                onClick={() => dispatch(setDialog({ open: false }))}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <FaXmark />

            </IconButton>
            {/* {dialogState.loading && <div className='w-full h-full flex items-center justify-center bg-["rgba(0,0,0,0.1)"]'><DotFlashing></DotFlashing></div>} */}
            <div className="flex items-center justify-center">
                {dialogState.type && <div> {dialogState.type === "warning" ? <FaRegQuestionCircle size={40} /> : <FaInfoCircle size={40} />}
                </div>}
                {dialogState?.content}</div>
            {dialogState.type && <div>  {dialogState.type === "warning" ? <div className="p-4 pt-0 flex gap-4 justify-end"> <Button variant="outlined" color="error"
                onClick={() => dispatch(setDialog({ open: false, content: <></> }))}
            >Cancel</Button>
                <Button variant="contained" color="error" onClick={dialogState.onClickOk}>OK</Button></div> :
                <Button variant="contained" color="error" onClick={() => dispatch(setDialog({ open: false, content: <></> }))}
                >OK</Button>}
            </div>}
        </Dialog>
    )
}
