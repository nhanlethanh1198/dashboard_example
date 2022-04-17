import {DataGrid} from '@mui/x-data-grid';
import {Stack, Typography, Avatar} from '@mui/material ';

const ComboDetailTable = ({productCombo, onChange}) => {
  const TABLE_COLUMNS = [
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
        const {code, product_image, product_name} = params?.row;
        return (
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <Avatar src={product_image} alt={product_name} />
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
        const {product_name} = params?.row;
        return (
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <Typography variant="body1">{product_name}</Typography>
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
    // {
    //   disableColumnMenu: true,
    //   hideSortIcons: true,
    //   align: 'center',
    //   headerAlign: 'center',
    //   id: 'weight',
    //   field: 'weight',
    //   headerName: 'Khối lượng',
    //   flex: 0.6,
    //   renderCell: (params) => {
    //     const {weight, unit} = params?.row;
    //     return (
    //       <Typography variant="body1">
    //         {weight} {unit}
    //       </Typography>
    //     );
    //   },
    // },

    // {
    //   disableColumnMenu: true,
    //   id: 'original_price',
    //   field: 'original_price',
    //   headerName: 'Giá gốc',
    //   headerAlign: 'center',
    //   align: 'center',
    //   hideSortIcons: true,
    //   flex: 1,
    //   renderCell: (params) => {
    //     const value = params?.row?.original_price;
    //     return fVNCurrency.format(value);
    //   },
    // },
    // {
    //   disableColumnMenu: true,
    //   id: 'sale_price',
    //   field: 'sale_price',
    //   headerName: 'Giá bán',
    //   headerAlign: 'center',
    //   align: 'center',
    //   hideSortIcons: true,
    //   flex: 1,
    //   renderCell: (params) => {
    //     const value = params?.row?.sale_price;
    //     return fVNCurrency.format(value);
    //   },
    // },
    // {
    //   disableColumnMenu: true,
    //   id: 'menu',
    //   field: 'menu',
    //   headerName: 'menu',
    //   renderHeader: (params) => <></>,
    //   align: 'center',
    //   hideSortIcons: true,
    //   flex: 0.4,
    //   renderCell: (params) => {
    //     return (
    //       <OrderProductListAction
    //         data={params?.row}
    //         pListLength={pList.length}
    //         deleteProduct={deleteProduct}
    //         setProductCount={setProductCount}
    //       />
    //     );
    //   },
    // },
  ];

  return <DataGrid rows={[]} columns={TABLE_COLUMNS} />;
};

export default ComboDetailTable;
