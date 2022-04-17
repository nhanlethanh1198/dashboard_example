import {Box, Typography, Avatar} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';
import Label from 'src/components/Label';
import moment from 'moment';
import UserMoreMenu from 'src/components/_dashboard/user/UserMoreMenu';
import {experimentalStyled as styled} from '@mui/material/styles';

const AvatarCustom = styled(Avatar)(({theme}) => ({
  margin: 'auto',
  marginLeft: theme.spacing(1),
}));

const TableHead = [
  {
    disableColumnMenu: false,
    id: 'fullname',
    field: 'fullname',
    headerName: 'Họ và tên',
    flex: 1,
    editable: false,
    headerAlign: 'center',
    align: 'left',
    renderCell: (params) => {
      return (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'noWrap',
            justifyContent: 'center',
            alignContent: 'center',
            gap: 1,
          }}
        >
          <AvatarCustom
            src={params.row.avatar_img}
            alt={params.row.fullname}
            imgProps={{loading: 'eager'}}
          />
          <strong>{params.row.fullname}</strong>
        </Box>
      );
    },
  },
  {
    disableColumnMenu: true,
    id: 'phone',
    field: 'phone',
    headerName: 'Số điện thoại',
    flex: 1,
    editable: false,
    headerAlign: 'center',
    align: 'center',
  },
  {
    disableColumnMenu: true,
    id: 'role',
    field: 'role',
    headerName: 'Chức vụ',
    flex: 1,
    editable: false,
    headerAlign: 'center',
    align: 'center',
  },
  {
    disableColumnMenu: true,
    id: 'role',
    field: 'role',
    headerName: 'Chức vụ',
    flex: 1,
    editable: false,
    headerAlign: 'center',
    align: 'center',
  },

  {
    disableColumnMenu: true,
    id: 'join_from_date',
    field: 'join_from_date',
    headerName: 'Ngày tham gia',
    flex: 1,
    editable: false,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => {
      return (
        <Typography variant='string'>
          {' '}
          {moment(params.value).format('h:mm:ss, DD/MM/YYYY')}
        </Typography>
      );
    },
  },
  {
    disableColumnMenu: true,
    id: 'is_active',
    field: 'is_active',
    headerName: 'Trạng thái',
    minWidth: 200,
    renderCell: (params) => {
      return (
        <Label variant='ghost' color={params.value ? 'success' : 'error'}>
          {params.value ? 'Đang hoạt động' : 'Đã bị khoá'}
        </Label>
      );
    },
    headerAlign: 'center',
    align: 'center',
  },
  {
    disableColumnMenu: true,
    id: 'lock_staff',
    field: 'lock_staff',
    headerName: '',
    flex: 0.2,
    sortable: false,
    renderHeader: (params) => {
      return <></>;
    },
    renderCell: (params) => {
      const row = params.row;
      return (
        <Box
          sx={{width: '100%', display: 'flex', justifyContent: 'center'}}
        >
          <UserMoreMenu
            id={row.id}
            fullname={row.fullname}
            is_active={row.is_active}
            type='staff'
          />
        </Box>
      );
    },
  },
];

const StaffListBody = (props) => {
  const staffList = props.staffList;
  const sortStaffList = staffList.slice().sort((a, b) => {
    if (a.join_from_date > b.join_from_date) return -1;
    if (a.join_from_date < b.join_from_date) return 1;
    return 0;
  });

  return (
    <div sx={{height: '60vh'}}>
      <DataGrid
        columns={TableHead}
        autoHeight={true}
        rows={sortStaffList}
        disableSelectionOnClick
        headerHeight={70}
        rowHeight={70}
        // rowsPerPageOptions={[5, 10, 20, 50, 100]}
        // pageSize={pageSize}
        // onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        // pagination
        // page={page}
        // onPageChange={(newPage) => setPage(newPage)}
        hideFooter
      />
    </div>
  );
};

export default StaffListBody;
