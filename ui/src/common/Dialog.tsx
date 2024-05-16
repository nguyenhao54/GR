import React from 'react'
import { Button, Dialog, DialogTitle, IconButton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setDialog } from '../redux/dialog.reducer'
import { AppState } from '../redux/store'
import { FaXmark } from "react-icons/fa6";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import Snackbar from '@mui/material/Snackbar';

export default function DialogView() {

    const dispatch = useDispatch()
    const dialogState = useSelector((appState: AppState) => appState.dialog.dialog)
    if (!dialogState) return <></>;
    const { customWidth, customHeight } = dialogState;
    return (
        <>{!dialogState?.isMessagebar ? <Dialog
            sx={{ root: { zIndex: "10 !important" } }}
            open={dialogState?.open || false}
            title={dialogState?.title}
            onClose={() => dispatch(setDialog({ open: false }))}
            fullWidth={true}
            PaperProps={{
                style: { borderRadius: 8, width: customWidth || 560, height: customHeight || 300, zIndex: 10 },
            }}
        >
            <DialogTitle >{dialogState?.title}</DialogTitle>
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

            <div className="h-[2px] mx-5 bg-neutral-200"></div>
            <div className="flex items-start justify-start w-full h-full p-4">
                {dialogState.type && <div> {dialogState.type === "warning" ? <FaRegQuestionCircle size={40} color={"#C1121F"} /> : dialogState.type === "info" ? <FaInfoCircle color={"#669BBC"} size={40} /> : <></>}
                </div>}
                {dialogState?.content}</div>
            {dialogState.type && <div>  {dialogState.type === "warning" || dialogState.type === "normal"
                ? <div className="p-4 pt-0 flex gap-4 justify-end">
                    <Button variant="outlined" color="error"
                        onClick={
                            () => dispatch(setDialog({ open: false, content: <></> }))
                        }
                    >Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={dialogState.onClickOk}>OK</Button>
                </div>
                : <div className="p-4 pt-0 flex gap-4 justify-end">
                    <Button variant="contained" color="error"
                        onClick={() => dispatch(setDialog({ open: false, content: <></> }))}>OK
                    </Button>
                </div>}
            </div>}
        </Dialog> :
            <Snackbar
                open={dialogState?.open || false}
                autoHideDuration={6000}
                key={"top right"}
                ContentProps={{
                    sx: {
                        backgroundColor: "white",
                        color: "black",
                        borderLeft: dialogState?.type === "warning" ? "2px solid red" : "4px solid #0072D0"
                    }
                }}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                onClose={() => dispatch(setDialog({ open: false, content: <></> }))}
                message={dialogState?.title}
                action={<IconButton
                    aria-label="close"
                    onClick={() => dispatch(setDialog({ open: false }))}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <FaXmark />
                </IconButton>}
            />
        }
        </>
    )
}
