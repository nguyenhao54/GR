import React, { useEffect, useState } from 'react'
import TablePager, { HeadCell } from '../common/TablePager';
import { getCookie } from './components/dashboard/AttendanceCard';
import { useDispatch } from 'react-redux';
import { getClasses } from '../api/class';
import { closeTopLoading, showTopLoading } from '../redux/toploading.reducer';
import ToolTip from '../common/ToolTip';
import { FaPlus, FaTrash } from 'react-icons/fa6';
import { FaPen } from 'react-icons/fa';
import { Button } from '@mui/material';
import { SearchBar } from '../common';
import { createUser, deleteUser, getUsers, updateUser } from '../api/user';
import { setDialog } from '../redux/dialog.reducer';
import EditUserForm from './components/manageUser/EditUserForm';

interface UserTableData {
  id?: string;
  action?: JSX.Element;
  codeNumber?: string;
  email?: string;
  gender?: string;
  dob?: string;
  role?: string;

}

const headCells: readonly HeadCell<UserTableData>[] = [
  {
    id: "codeNumber",
    numeric: false,
    disablePadding: true,
    label: "Mã số",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: true,
    label: "Email",
  },
  {
    id: "gender",
    numeric: false,
    disablePadding: true,
    label: "Giới tính",
  },
  {
    id: "dob",
    numeric: false,
    disablePadding: true,
    label: "Ngày sinh",
  },
  {
    id: "role",
    numeric: false,
    disablePadding: true,
    label: "Vai trò",
  },
  {
    id: "action",
    numeric: false,
    disablePadding: true,
    label: "Hành động",
    minWidth: 60,
  },
];


function ManageUser() {

  const [userList, setUserList] = useState<any[]>([]);
  const [display, setDisplay] = React.useState<any[]>([]);
  const [searchText, setSearchText] = React.useState<string>("");

  const dispatch = useDispatch();
  const token = getCookie("token");
  useEffect(() => {
    dispatch(showTopLoading())
    getUsers(token).then(res => {
      console.log(res.data)
      setUserList(res.data.data);
      setDisplay(res.data.data)
    }).finally(() => {
      dispatch(closeTopLoading())
    })
  }, [])

  const handleEditUser = (user: any) => {

    dispatch(setDialog({
      title: "Chỉnh sửa Người dùng",
      customHeight: 680,
      customWidth: 700,
      open: true,
      type: "normal",
      onClickOk: async () => {
        if (await editUserRef.validateForm()) {
          dispatch(showTopLoading())
          const newUser = editUserRef.changedUser
          console.log(newUser, " newUser")
          const res = await updateUser(token, newUser)
          if (res.status === "success") {
            //TODO: show success message and add to the list in UI

          }
          else {

            //TODO: show failed message
          }

          dispatch(closeTopLoading())
        }

      },
      content: (
        <EditUserForm user={user} ref={(ref) => {
          editUserRef = ref
        }} />
      )
    }))

  }
  const handleDeleteUser = (user: any) => {
    dispatch(
      setDialog({
        customWidth: 400,
        customHeight: 200,
        title: "Xác nhận xóa người dùng",
        open: true,
        type: "warning",
        onClickOk: async () => {
          const promise = deleteUser;
          const res = await promise(token, user._id)
          const processedUserList = userList.filter((item) => item._id !== user._id)
          dispatch(setDialog({
            open: false,
          }))
          //DONE: show succcessmsg
          dispatch(setDialog({
            title: " Xóa người dùng thành công",
            open: true,
            type: "info",
            isMessagebar: true
          }))
          setUserList(processedUserList)

        },
        content: (
          <div className='pl-6 font-montserrat text-xs font-medium'>
            {`Những dữ liệu liên quan sẽ không thể khôi phục, bạn có chắc chắn muốn xóa người dùng ${user.name}?`}
          </div>
        ),
      }))

  }

  React.useEffect(() => {
    setDisplay(
      userList?.filter((item: any) => {
        const codeNumber = item.codeNumber || ""
        return codeNumber.toString()
          .toLocaleLowerCase()
          .includes(searchText.toLocaleLowerCase());
      })
    );
  }, [searchText, JSON.stringify(userList)]);

  let editUserRef: any;

  const handleAddNew = () => {

    dispatch(setDialog({
      title: "Thêm mới Người dùng",
      customHeight: 680,
      customWidth: 700,
      open: true,
      type: "normal",
      onClickOk: async () => {
        if (await editUserRef.validateForm()) {
          dispatch(showTopLoading())
          const newUser = editUserRef.changedUser
          console.log(newUser, " newUser")
          const res = await createUser(token, newUser)
          console.log(res)
          if (res.status === "success") {
            //TODO: show success message and add to the list in UI

          }
          else {

            //TODO: show failed message
          }

          dispatch(closeTopLoading())
        }

      },
      content: (
        <EditUserForm user={{}} ref={(ref) => {
          editUserRef = ref
        }} />
      )
    }))
  }


  const createRowElements = (user: any): UserTableData => {
    return {
      id: user._id || "0",
      codeNumber: user.codeNumber,
      email: user.email,
      gender: user.gender ? "Nam" : "Nữ",
      dob: user.DOB ? new Date(user.DOB).toLocaleString('en-GB', { day: "2-digit", month: "2-digit", year: "numeric" }) : "",
      role: user?.role === "teacher" ? "Giáo viên" : user?.role === "student" ? "Sinh viên" : "Quản trị",
      action: (
        <div className='flex gap-2 items-center justify-center'>
          <ToolTip textContent='Chỉnh sửa' limit={1}>
            <FaPen size={14} className='text-lg text-[#0072D0] cursor-pointer'
              onClick={() => { handleEditUser(user) }} />
          </ToolTip>
          <ToolTip textContent='Xóa' limit={1}>
            <FaTrash size={14} className='text-lg text-lightRed cursor-pointer'
              onClick={() => { handleDeleteUser(user) }} />
          </ToolTip>

        </div>
      ),
    };
  }
  const toolbarItems = (
    <div className="flex my-1 justify-between">
      <div className="w-[30%] my-2 flex gap-2">
        <Button
          variant="outlined"
          startIcon={<FaPlus className='text-lg' />}
          //   disabled={!(selected.length > 0)}
          // textTransform={"none"}
          sx={{
            color: "#0072D0",
            textTransform: "none",
            borderColor: "#0072D0",
            "&:hover": {
              borderColor: "#0072D0"
            }
          }}

          onClick={() => handleAddNew()}
        //   onClick={() => handleAcceptOrDenyAllSelected(true)}
        >Thêm mới
        </Button>
      </div>
      <div className="w-[40%] my-2 ">
        <SearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          placeholder={"Tìm kiếm theo mã số"}
        ></SearchBar>
      </div>
    </div>
  );

  const mapAttendanceDataToRowElement = (classList: any[]): UserTableData[] => classList.map((item: any) => {
    return createRowElements(item);
  });

  return (
    <div className="bg-white rounded-md p-8 pt-4 w-[100%] h-max flex flex-col items-center">
      <TablePager<any>
        tableTitle={"Danh sách người dùng"}
        total={display?.length}
        data={display || []}
        mapDataToRowData={mapAttendanceDataToRowElement}
        headCells={headCells}
        hideCheckbox
        showSearchBar={true}
        toolbarItems={toolbarItems}
      ></TablePager>
    </div>
  )
}

export default ManageUser