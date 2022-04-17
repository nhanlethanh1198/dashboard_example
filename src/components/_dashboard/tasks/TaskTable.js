import PropTypes from 'prop-types';
import numeral from 'numeral';
// import moment from 'moment-timezone';
import {DataGrid} from '@mui/x-data-grid';
import {styled} from '@mui/system';
import Label from 'src/components/Label';

const TaskTableBody = styled(DataGrid)(({theme}) => ({
  root: {
    '& .MuiDataGrid-row:nth-of-type(odd)': {
      backgroundColor: theme.palette.mode === 'light' ? theme.palette.secondary[300] : theme.palette.secondary[900],
    },
  },
}));

const timeWorking = (params) => {
  return `${params.row?.start_time} - ${params.row?.end_time}`
}


const TaskTable = ({taskList, pagination, setPagination}) => {
  const TableHead = [
    {
      field: 'id',
      headerAlign: 'center',
      align: 'center',
      headerName: 'ID',
      flex: 0.4,
    },
    {
      field: 'type_task',
      headerAlign: 'center',
      align: 'center',
      headerName: 'Loại',
      flex: 0.8,
      renderCell: (params) => {
        if (params.value === 'odd_shift') {
          return <Label color='primary'>Ca lẻ</Label>;
        } else if (params.value === 'fixed_shift') {
          return <Label color='secondary'>Ca cố định</Label>;
        }
      },
    },
    {
      field: 'fullname',
      headerAlign: 'center',
      align: 'center',
      headerName: 'Tên khách hàng',
      flex: 1,
    },
    {
      field: 'phone',
      headerAlign: 'center',
      align: 'center',
      headerName: 'Số điện thoại',
      flex: 1,
      renderCell: ({value}) => {
        return <a href={`tel:${value}`}>{value}</a>;
      },
    },
    {
      field: 'address',
      headerAlign: 'center',
      align: 'left',
      headerName: 'Địa chỉ',
      flex: 5,
    },
    {
      field: 'total_price',
      headerAlign: 'center',
      align: 'center',
      headerName: 'Phí dịch vụ',
      flex: 2,
      valueFormatter: (params) => {
        return numeral(params.value).format('0,0') + ' VNĐ';
      },
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      headerAlign: 'center',
      align: 'center',
      flex: 1.5,
      renderCell: ({value}) => {
        if (value === 1) {
          return <Label color='warning'>Chờ xử lý</Label>;
        } else if (value === 2) {
          return <Label color='success'>Đã có nhân viên</Label>;
        } else if (value === 3) {
          return <Label color='warning'>Nhân viên đang làm việc</Label>;
        } else if (value === 4) {
          return <Label color='success'>Đã hoàn thành</Label>;
        } else if (value === 5) {
          return <Label color='danger'>Đã hủy</Label>;
        }
      },
    },
    {
      field: 'time',
      headerAlign: 'center',
      align: 'left',
      headerName: 'Thời gian làm việc',
      valueGetter: timeWorking,
      flex: 2
    },
    {
      field: 'menu_action',
      renderHeader: () => (<></>),
      align: 'center',
      flex: 0.2,
      renderCell:(params) => {
        return (
          <div>
            :
          </div>
        )
      }
    }
  ];

  return (
    <div style={{height: '65vh'}}>
      <TaskTableBody
        initialState={{
          pagination: {
            page: 1,
            limit: 50,
          },
        }}
        disableSelectionOnClick
        columns={TableHead}
        rows={taskList}
        page={pagination.page}
        onPageChange={(newPage) => setPagination({...pagination, page: newPage+1})}
        pageSize={pagination.limit}
        onPageSizeChange={(newPageSize) => setPagination({...pagination, limit: newPageSize})}

      />
    </div>
  );
};

TaskTable.propTypes = {
  taskList: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  setPagination: PropTypes.func.isRequired,
};

TaskTable.defaultProps = {
  taskList: [],
};

export default TaskTable;
