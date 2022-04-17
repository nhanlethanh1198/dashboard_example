import React, {useLayoutEffect} from 'react';
import {Box, Radio, IconButton, Paper} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {filter, forEach, set} from 'lodash';
import ProductFormStore from 'src/localmodal/ProductFormStore';
import {fVNCurrency} from 'src/utils/formatNumber';

const ProductPrice = React.memo(({priceList}) => {
  const {setProductPrice, setProductPriceDefault} = ProductFormStore.useStoreActions(
    (actions) => actions
  );
  const {productPriceDefault, productPrice} = ProductFormStore.useStoreState((state) => state);

  useLayoutEffect(() => {
    if (Array.isArray(priceList)) {
      setProductPrice(priceList);
      const defaultPrice = priceList.find((price) => price.default === true);
      !!defaultPrice?.id && setProductPriceDefault(defaultPrice.id);
    }
    // eslint-disable-next-line
  }, [priceList]);

  const handleRaidoChange = (e) => {
    setProductPriceDefault(e.target.value);
  };

  const controlRadioProps = (id) => ({
    checked: productPriceDefault === id,
    onChange: handleRaidoChange,
    value: id,
    name: 'default_price',
    inputProps: {'aria-label': id},
  });

  const TableColumns = [
    {
      field: 'weight',
      headerName: 'Khối lượng',
      minWidth: 145,
      headerAlign: 'center',
      editable: true,
      disableColumnMenu: true,
      hideSortIcons: true,
      align: 'center',
      type: 'number',
    },
    {
      field: 'unit',
      headerName: 'Đơn vị',
      minWidth: 145,
      headerAlign: 'center',
      editable: true,
      disableColumnMenu: true,
      hideSortIcons: true,
      align: 'center',
      type: 'string',
    },
    {
      field: 'price',
      headerName: 'Giá (x1000)',
      minWidth: 169,
      headerAlign: 'center',
      editable: true,
      disableColumnMenu: true,
      hideSortIcons: true,
      align: 'center',
      type: 'number',
      valueFormatter: (params) => {
        return fVNCurrency.format(params.value);
      },
    },
    {
      field: 'price_sale',
      headerName: 'Giá sale (x1000)',
      minWidth: 174,
      headerAlign: 'center',
      editable: true,
      disableColumnMenu: true,
      hideSortIcons: true,
      align: 'center',
      type: 'number',
      valueFormatter: (params) => {
        return fVNCurrency.format(params.value);
      },
    },
    {
      field: 'stock',
      headerName: 'Tồn',
      minWidth: 87,
      headerAlign: 'center',
      editable: true,
      disableColumnMenu: true,
      hideSortIcons: true,
      align: 'center',
      type: 'number',
    },
    {
      field: 'default',
      headerName: 'Mặc định',
      minWidth: 123,
      headerAlign: 'center',
      editable: false,
      disableColumnMenu: true,
      hideSortIcons: true,
      align: 'center',
      renderCell: (params) => <Radio {...controlRadioProps(params.row.id)} />,
    },
    {
      field: 'add_row',
      headerName: 'Add Row',
      renderHeader: (params) => {
        return <></>;
      },
      editable: false,
      headerAlign: 'center',
      align: 'left',
      minWidth: 100,
      disableColumnMenu: true,
      hideSortIcons: true,
      hidden: false,
      resizeable: false,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}
          >
            <IconButton onClick={() => handleClickToAddRow(params, 'push')}>
              <AddIcon fontSize="medium" />
            </IconButton>
            {Boolean(productPrice.length > 1) && (
              <IconButton onClick={() => handleClickToAddRow(params, 'remove')}>
                <RemoveIcon fontSize="medium" />
              </IconButton>
            )}
          </Box>
        );
      },
    },
  ];

  // const handleCellClick = React.useCallback((params) => {
  //   const { id, field } = params;
  //   const fields = ['default', 'add_row'];
  //   if (fields.includes(field)) {
  //     params.api.setCellMode(id, field, 'view');
  //   } else {
  //     params.api.setCellMode(id, field, 'edit');
  //   }
  //   console.log(params)

  //   // eslint-disable-next-line
  // }, []);

  const handleClickToAddRow = React.useCallback(
    (params, action) => {
      let newRows = [...productPrice];
      if (action === 'push') {
        const lastIndex = Number(productPrice[productPrice.length - 1].id + 1);
        newRows.push({
          id: lastIndex,
          weight: 1,
          unit: 'kg',
          price: '0',
          price_sale: '0',
          stock: 20,
        });
        setProductPrice(newRows);
      }
      if (action === 'remove') {
        if (newRows.length > 1) {
          setProductPrice(filter(newRows, (item) => item.id !== params.id));
        }
        if (newRows.length < 2) {
          setProductPriceDefault(productPrice[0].id);
        }
      }
    },
    //eslint-disable-next-line
    [productPrice]
  );

  const setRowValue = React.useCallback(
    ({id, field, value}) => {
      try {
        const priceFields = ['price', 'price_sale'];
        let tempRows = [...productPrice];
        forEach(tempRows, (row) => {
          if (row.id === id) {
            set(row, field, priceFields.includes(field) ? Number(value) * 1000 : value);
          }
        });
        setProductPrice(tempRows);
      } catch (error) {
        console.error(error);
      }
    },
    // eslint-disable-next-line
    [productPrice]
  );

  return (
    <Paper>
      <DataGrid
        onCellEditCommit={setRowValue}
        columns={TableColumns}
        rows={productPrice}
        loading={false}
        hideFooter={true}
        autoHeight={true}
        // onCellClick={(e) => handleCellClick(e)}
        disableSelectionOnClick
        autoPageSize
      />
    </Paper>
  );
});

export default ProductPrice;
