import PropTypes from 'prop-types';
import {memo} from 'react';
import {DataGrid, viVN} from '@mui/x-data-grid';
import {Link as RouterLink} from 'react-router-dom';
import {Tooltip, Typography} from '@mui/material';
import Label from 'src/components/Label';

import {StoreTableRowMenu} from '.';

const StoreTable = ({providerList, page, setPage, pageSize, setPageSize}) => {
  const TableHead = [
    {
      field: 'name',
      headerName: 'Tên nhà cung cấp',
      headerAlign: 'center',
      disableColumnMenu: true,
      hideSortIcons: true,
      flex: 1,
      align: 'center',
      renderCell: (params) => (
        <Tooltip title={params.row.phone} placement="right">
          <Typography
            variant="body2"
            component={RouterLink}
            color="text.primary"
            to={`update_store/${params.id}`}
            align="center"
          >
            {params?.value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'product_sale_count',
      headerName: 'Tổng số sản phẩm đã bán',
      headerAlign: 'center',
      disableColumnMenu: true,
      hideSortIcons: true,
      align: 'center',
      flex: 0.5,
    },
    {
      field: 'total_product_ordered',
      headerName: 'Tổng số sản phẩm đã lên đơn',
      headerAlign: 'center',
      disableColumnMenu: true,
      hideSortIcons: true,
      align: 'center',
      flex: 1,
    },
    {
      field: 'is_active',
      headerName: 'Trạng thái',
      headerAlign: 'center',
      disableColumnMenu: true,
      hideSortIcons: true,
      align: 'center',
      flex: 0.4,
      renderCell: (params) => (
        <Label color={params.value ? 'success' : 'error'}>
          {params.value ? 'Đang hoạt động' : 'Đã khóa'}
        </Label>
      ),
    },
    {
      field: 'action',
      headerName: 'Hành động',
      headerAlign: 'center',
      disableColumnMenu: true,
      hideSortIcons: true,
      align: 'center',
      flex: 0.2,
      renderHeader: () => <></>,
      renderCell: (params) => <StoreTableRowMenu {...params.row} />,
    },
  ];

  return (
    <div style={{height: 500, width: '100%'}}>
      <DataGrid
        localeText={viVN}
        rows={providerList}
        columns={TableHead}
        pagination
        page={page}
        onChangePage={(newPage) => setPage(newPage)}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowPerPageOptions={[5, 10, 25, 50, 100]}
      />
    </div>
  );
};

StoreTable.propTypes = {
  providerList: PropTypes.array,
  page: PropTypes.number,
  setPage: PropTypes.func,
  pageSize: PropTypes.number,
  setPageSize: PropTypes.func,
};

StoreTable.defaultProps = {
  // providerList: [],
  page: 0,
  pageSize: 25,
};

export default memo(StoreTable);
