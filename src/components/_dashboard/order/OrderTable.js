import {DataGrid} from '@mui/x-data-grid';
import OrderTableRowMenu from './OrderTableRowMenu';
import Scrollbar from 'src/components/Scrollbar';
import {ORDER_STATUS} from 'src/constants/orderStatus';
import Label from 'src/components/Label';

const StatusLabel = ({value}) => (
  <Label color={ORDER_STATUS[value].type}>{ORDER_STATUS[value].title}</Label>
);

const OrderTable = ({data}) => {
  const TableColumns = [
    {
      disableColumnMenu: true,
      id: 'order_id',
      field: 'order_id',
      headerName: 'ID',
      headerAlign: 'center',
      align: 'center',
      hideSortIcons: true,
      flex: 0.3,
    },
    {
      disableColumnMenu: true,
      id: 'fullname',
      field: 'fullname',
      headerName: 'Tên khách hàng',
      headerAlign: 'center',
      align: 'center',
      hideSortIcons: true,
      flex: 1.2,
    },
    {
      disableColumnMenu: true,
      id: 'phone',
      field: 'phone',
      headerName: 'Điện thoại',
      headerAlign: 'center',
      align: 'center',
      hideSortIcons: true,
      flex: 0.7,
    },
    {
      disableColumnMenu: true,
      id: 'address_delivery',
      field: 'address_delivery',
      headerName: 'Địa chỉ nhận hàng',
      headerAlign: 'center',
      align: 'center',
      hideSortIcons: true,
      flex: 1.2,
    },
    {
      disableColumnMenu: true,
      id: 'shipper',
      field: 'shipper',
      headerName: 'Shipper',
      headerAlign: 'center',
      align: 'center',
      hideSortIcons: true,
      flex: 1,
    },
    {
      disableColumnMenu: true,
      id: 'status',
      field: 'status',
      headerName: 'Trạng thái',
      headerAlign: 'center',
      align: 'center',
      hideSortIcons: true,
      flex: 0.7,
      renderCell: (params) => <StatusLabel value={params.value} />,
    },
    {
      disableColumnMenu: true,
      id: 'total_money',
      field: 'total_money',
      headerName: 'Thành tiền',
      headerAlign: 'center',
      align: 'center',
      hideSortIcons: true,
      flex: 1,
    },
    {
      disableColumnMenu: true,
      id: 'info',
      field: 'info',
      align: 'center',
      hideSortIcons: true,
      flex: 0.3,
      renderHeader: (params) => <> </>,
      renderCell: (params) => <OrderTableRowMenu data={params.row} />,
    },
  ];
  return (
    <Scrollbar sx={{maxHeight: '60vh'}}>
      <DataGrid
        columns={TableColumns}
        rows={data}
        autoHeight
        disableSelectionOnClick
        disableVirtualization
        hideFooter

        // pagination
        // rowsPerPageOptions={[5, 10, 20, 50, 100]}
        // pageSize={pageSize}
        // onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        // page={page}
        // onPageChange={(newPage) => setPage(newPage)}
      />
    </Scrollbar>
  );
};

export default OrderTable;
