import { Button, ClickAwayListener, Tooltip } from '@mui/material';
import TextField from '@mui/material/TextField';
import React from 'react'
import { BiImageAdd } from 'react-icons/bi';
import { FaInfoCircle } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { formatDate } from '../../../utils';

const EditRequestForm = React.forwardRef(({ request }: { request: any }, ref) => {

    const [image, setImage] = React.useState<any>({ img: request.photo });
    const [reason, setReason] = React.useState<any>(request.reason);
    const [open, setOpen] = React.useState(false);


    React.useImperativeHandle(ref, () => {
        return {
            changedRequest: { ...request, reason, image  }
        }
    })

    const handleTooltipClose = () => {
        setOpen(false);
    };


    const handleImageUpload = (e: any) => {
        if (!e.target.files) {
            return;
        }
        let items = e.target.files;
        items = [...items].map((item: any) => ({
            ...item,
            img: URL.createObjectURL(item),
            title: item.name,
        }));
        setImage(items[0]);
    };


    return (
        <div className='overflow-auto font-nunitoSans w-full h-[430px]'>
            <div className="flex flex-col ">
                <div className="flex-col flex gap-4">
                    <div className="font-semibold flex flex-row gap-1 items-center">
                        <p>Lớp học: {request.lesson.class.subject.title}</p>
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
                                    title="Không thể thay đổi buổi học cho yêu cầu này, trong trường hợp muốn thay đổi lớp học, hãy xóa yêu cầu này và tạo yêu cầu mới"
                                >
                                    <div className="cursor-pointer"
                                        onClick={() => { setOpen(true) }}
                                    ><FaInfoCircle />
                                    </div>
                                </Tooltip>
                            </div>
                        </ClickAwayListener>
                    </div>
                    <p>Thời gian: {formatDate(request.lesson.startDateTime) + " - " + formatDate(request.lesson.endDateTime)}</p>
                    <div className="">
                        <TextField
                            id="code"
                            label="Lý do"
                            required
                            multiline
                            rows='4.7'
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value)
                            }}
                            style={{ width: "100%" }}
                            variant="outlined"
                        />
                    </div>
                </div>
                <div>{
                    image && <div className="relative mt-4">
                        <img
                            className="rounded-md"
                            src={image.img}
                            alt={"Ảnh minh chứng"}
                        // loading="lazy"
                        />
                        <div className="absolute top-0 bottom-0 right-0 left-0 height-[100%] opacity-0 rounded-md hover:cursor-pointer transition-all hover:opacity-60 hover:bg-neutral-500 ">
                            <div
                                className="absolute text-white text-xl right-1 top-1 rounded-full bg-black p-1"
                                onClick={(_e: any) => {
                                    setImage(undefined)
                                }}
                            >
                                <FaXmark />
                            </div>
                        </div>
                    </div>
                }
                </div>

                <div className="pt-4">
                    {!image &&
                        <div
                            className={`flex items-center w-48 justify-center p-1 px-4 hover:bg-neutral-200 rounded-md text-md hover:cursor-pointer`}
                        >
                            <Button
                                component="label"
                                fullWidth
                                disableRipple
                                startIcon={
                                    <BiImageAdd style={{ color: "#C1121F", fontSize: "20px" }} />
                                }
                                sx={{
                                    margin: 0,
                                    padding: 0,
                                    height: "100%",
                                    "&:hover": {
                                        backgroundColor: "transparent",
                                    },
                                    textTransform: "none",
                                }}
                            >
                                <div className="text-md text-[#C1121F] font-semibold">Thêm ảnh minh chứng*</div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    hidden
                                    onChange={handleImageUpload}
                                />
                            </Button>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
)

export default EditRequestForm