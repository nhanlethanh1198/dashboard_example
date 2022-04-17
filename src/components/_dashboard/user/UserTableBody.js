import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import Label from "src/components/Label";
import { UserMoreMenu } from ".";
import Scrollbar from 'src/components/Scrollbar';

const UserTableBody = ({ userList, pageSize, page, setPageSize, setPage }) => {
  const TableHead = [
    {
      disableColumnMenu: true,
      id: "id",
      field: "id",
      headerName: "#ID",
      editable: false,
      headerAlign: "center",
      align: "center",
      flex: 0.3,
      hideSortIcons: true,
    },
    {
      disableColumnMenu: true,
      id: "fullname",
      field: "fullname",
      headerName: "Tên khách hàng",
      editable: false,
      headerAlign: "center",
      align: "center",
      flex: 0.6,
      hideSortIcons: true,
    },
    {
      disableColumnMenu: true,
      id: "phone",
      field: "phone",
      headerName: "Số điện thoại",
      hideSortIcons: true,
      editable: false,
      headerAlign: "center",
      align: "center",
      flex: 0.4,
    },
    {
      disableColumnMenu: true,
      id: "address",
      field: "address",
      headerName: "Địa chỉ",
      hideSortIcons: true,
      editable: false,
      headerAlign: "center",
      align: "center",
      flex: 1.6,
    },
    {
      disableColumnMenu: true,
      id: "is_active",
      field: "is_active",
      headerName: "Trạng thái",
      editable: false,
      headerAlign: "center",
      align: "center",
      hideSortIcons: true,
      flex: 0.4,
      renderCell: (params) => {
        const status = params.row.is_active;
        return (
          <Label color={status ? "success" : "error"}>
            {status ? "Đang hoạt động" : "Đã khóa"}
          </Label>
        );
      },
    },
    {
      disableColumnMenu: true,
      id: "menu",
      field: "menu",
      headerName: "menu",
      renderHeader: (params) => <></>,
      editable: false,
      headerAlign: "center",
      align: "center",
      flex: 0.3,
      hideSortIcons: true,
      renderCell: (params) => {
        const { fullname, id, is_active } = params.row;
        return (
          <UserMoreMenu
            type="user"
            fullname={fullname}
            id={id}
            is_active={is_active}
          />
        );
      },
    },
  ];

  return (
    <Scrollbar sx={{ maxHeight: "60vh", p: 1 }}>
      <DataGrid
        columns={TableHead}
        autoHeight
        rows={userList}
        // hideFooter
        disableSelectionOnClick
        rowsPerPageOptions={[5, 10, 20, 50, 100]}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        pagination
        page={page}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </Scrollbar>
  );
};

UserTableBody.propTypes = {
  userList: PropTypes.array,
  pageSize: PropTypes.number,
  page: PropTypes.number,
  setPageSize: PropTypes.func,
  setPage: PropTypes.func,
};

export default UserTableBody;
