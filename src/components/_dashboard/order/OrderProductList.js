import PropTypes from 'prop-types';
import {
  memo,
  // useLayoutEffect,
  // useState
} from 'react';
import {Stack, Typography, Avatar} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';
import {OrderProductListAction} from '.';
import {fVNCurrency} from 'src/utils/formatNumber';

const ProducTable = memo(({pList, deleteProduct, setProductCount}) => {
  const tbColumn = [
    {
      disableColumnMenu: true,
      id: 'code',
      field: 'code',
      headerName: 'Code Sản phẩm',
      headerAlign: 'center',
      align: 'center',
      hideSortIcons: true,
      flex: 0.7,
      renderCell: (params) => {
        const {code, avatar_img, name} = params?.row;
        return (
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <Avatar src={avatar_img ? avatar_img : params.row?.product_image} alt={name ? name : params.row?.product_name} />
            <Typography variant="body1">{code}</Typography>
          </Stack>
        );
      },
    },
    {
      disableColumnMenu: true,
      id: 'product',
      field: 'product',
      headerName: 'Tên sản phẩm',
      headerAlign: 'center',
      align: 'center',
      hideSortIcons: true,
      flex: 1,
      renderCell: (params) => {
        const {name} = params?.row;
        return (
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <Typography variant="body1">{name ? name : params.row?.product_name}</Typography>
          </Stack>
        );
      },
    },
    {
      disableColumnMenu: true,
      hideSortIcons: true,
      align: 'center',
      headerAlign: 'center',
      id: 'count',
      field: 'count',
      headerName: 'Số lượng',
      flex: 0.5,
    },
    {
      disableColumnMenu: true,
      hideSortIcons: true,
      align: 'center',
      headerAlign: 'center',
      id: 'weight',
      field: 'weight',
      headerName: 'Khối lượng',
      flex: 0.6,
      renderCell: (params) => {
        const {weight, unit} = params?.row;
        return (
          <Typography variant="body1">
            {weight} {unit}
          </Typography>
        );
      },
    },

    {
      disableColumnMenu: true,
      id: 'original_price',
      field: 'original_price',
      headerName: 'Giá gốc',
      headerAlign: 'center',
      align: 'center',
      hideSortIcons: true,
      flex: 1,
      renderCell: (params) => {
        const value = params?.row?.price || params?.row?.original_price;
        return fVNCurrency.format(value);
      },
    },
    {
      disableColumnMenu: true,
      id: 'sale_price',
      field: 'sale_price',
      headerName: 'Giá bán',
      headerAlign: 'center',
      align: 'center',
      hideSortIcons: true,
      flex: 1,
      renderCell: (params) => {
        const value = params?.row?.price_sale || params?.row?.sale_price;
        return fVNCurrency.format(value);
      },
    },
    {
      disableColumnMenu: true,
      id: 'menu',
      field: 'menu',
      headerName: 'menu',
      renderHeader: (params) => <></>,
      align: 'center',
      hideSortIcons: true,
      flex: 0.4,
      renderCell: (params) => {
        return (
          <OrderProductListAction
            data={params?.row}
            pListLength={pList.length}
            deleteProduct={deleteProduct}
            setProductCount={setProductCount}
          />
        );
      },
    },
  ];

  return (
    <div style={{width: '100%', height: 200}}>
      <DataGrid
        disableSelectionOnClick
        hideFooter
        rows={pList}
        columns={tbColumn}
        rowHeight={50}
        autoHeight
        // loading={loading}
      />
    </div>
  );
});

ProducTable.propTypes = {
  pList: PropTypes.array,
};

ProducTable.defaultProps = {
  pList: [],
};

const ProductList = ({productList, deleteProduct, setProductCount}) => {
  return (
    <Stack sx={{flex: 1, gap: 2}}>
      <ProducTable
        pList={productList}
        deleteProduct={deleteProduct}
        setProductCount={setProductCount}
      />
    </Stack>
  );
};

ProductList.propsType = {
  productList: PropTypes.array,
};

ProductList.defaultProps = {
  productList: [],
};

export default memo(ProductList);
