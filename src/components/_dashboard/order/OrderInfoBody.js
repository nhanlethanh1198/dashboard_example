import {useLayoutEffect, memo, useState, useRef, useCallback} from 'react';
import {
  Typography,
  Grid,
  Button,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material';
import moment from 'moment-timezone';
import Label from 'src/components/Label';
import {OrderProductList, OrderAddNewProductPopup} from '.';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CreateIcon from '@mui/icons-material/Create';
import CancelIcon from '@mui/icons-material/Cancel';
import {LoadingButton} from '@mui/lab';
import {useStoreState, useStoreActions} from 'easy-peasy';
import {putEditOrderProduct} from 'src/api/orders';
import {useForm, FormProvider} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {OrderInfoSchema} from 'src/schema/OrderSchema';
import {ORDER_STATUS} from 'src/constants/orderStatus';
// import OrderStore from 'src/localmodal/OrderStore';
import {useSnackbar} from 'notistack';

const col1 = [
  'order_id',
  'fullname',
  'phone',
  'address_delivery',
  'created_at',
  'updated_at',
  'shipper',
  'start_delivery',
  'end_delivery',
];
const col2 = [
  'order_type',
  'status',
  'count_product',
  'product_money',
  'voucher',
  'ship_fee',
  'total_money_sale',
  'total_money',
];

const editableFields = ['fullname', 'phone', 'address_delivery'];

const label = {
  order_id: 'ID đơn hàng:',
  fullname: 'Tên khách hàng:',
  phone: 'Số điện thoại:',
  order_type: 'Dạng đơn hàng:',
  count_product: 'Số sản phẩm:',
  product_money: 'Giá sản phẩm:',
  voucher: 'Voucher:',
  ship_fee: 'Phí ship:',
  total_money_sale: 'Tổng tiền giảm giá:',
  total_money: 'Thành tiền:',
  address_delivery: 'Địa chỉ khách hàng:',
  created_at: 'Tạo lúc:',
  updated_at: 'Cập nhật lúc:',
  shipper: 'Shipper:',
  start_delivery: 'Bắt đầu giao hàng:',
  end_delivery: 'Kết thúc đơn hàng:',
  status: 'Trạng thái:',
  product: 'Sản phẩm:',
};

const RowInfo = ({label, labelId, value, register, error}) => {
  const [disabled, setDisabled] = useState(true);
  useLayoutEffect(() => {
    return () => {};
  }, [label, labelId, value]);

  return (
    <Grid container mb={3}>
      <Grid item xs={12} sm={4}>
        <Typography variant="h6">{label}</Typography>
      </Grid>
      <Grid item xs={12} sm={8}>
        {value ? (
          labelId === 'status' ? (
            <Label color={ORDER_STATUS[value].color}>{ORDER_STATUS[value].title}</Label>
          ) : editableFields.includes(labelId) ? (
            <TextField
              variant="standard"
              size="small"
              disabled={disabled}
              {...register(labelId)}
              type={labelId === 'phone' ? 'tel' : 'text'}
              defaultValue={value}
              error={!!error}
              helperText={error || null}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Chỉnh sửa">
                      <IconButton onClick={() => setDisabled(!disabled)}>
                        {disabled ? <CreateIcon /> : <CheckIcon />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          ) : (
            <Typography>{value}</Typography>
          )
        ) : labelId === `status` ? (
          <Label color="warning">Đang tải...</Label>
        ) : (
          <Typography>Không có</Typography>
        )}
      </Grid>
    </Grid>
  );
};

const OrderInfoBody = memo(({orderInfo, orderDetail, setRender}) => {
  const tempOrderDetail = useRef([]);
  const [orderList, setOrderList] = useState([]);
  const [stateChanged, setStateChanged] = useState(false);
  const [showAddProductPopup, setShowAddProductPopup] = useState(false);
  const {setDialog, setShowDialog} = useStoreActions((actions) => actions.dialog);
  const {confirm} = useStoreState((state) => state.dialog);
  const [errorPopup, setErrorPopup] = useState(false);
  const {enqueueSnackbar} = useSnackbar();

  // Destruc Form
  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onBlur',
    resolver: yupResolver(OrderInfoSchema),
    // defaultValues: {
    //   fullname: orderInfo?.fullname,
    //   phone: orderInfo?.phone,
    //   address_delivery: orderInfo?.address_delivery,
    // },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: {isDirty, errors, isSubmitting},
    reset,
  } = methods;

  const setFieldValues = useCallback(() => {
    const {fullname, phone, address_delivery} = orderInfo;
    setValue('fullname', fullname);
    setValue('phone', phone);
    setValue('address_delivery', address_delivery);

    return () => {};
  }, [orderInfo, setValue]);

  const config = (key) => {
    const timeInstance = ['created_at', 'updated_at', 'start_delivery', 'end_delivery'];
    const currencyInstace = ['product_money', 'total_money', 'ship_fee', 'total_money_sale'];
    let value = '';
    if (timeInstance.includes(key) && !!orderInfo[key]) {
      const date = new Date(orderInfo[key]);
      value = moment(date).tz('Asia/Ho_Chi_Minh').format('HH:mm:ss DD/MM/YYYY');
    } else if (currencyInstace.includes(key) && !!orderInfo[key]) {
      const price = parseInt(orderInfo[key]);
      value = price.toLocaleString('it-IT', {
        style: 'currency',
        currency: 'VND',
      });
    } else {
      value = orderInfo[key];
    }
    return {
      labelId: key,
      label: label[key],
      value: value,
      register: register,
      error: errors[key]?.message,
    };
  };

  useLayoutEffect(() => {
    setFieldValues();

    if (orderDetail.length !== 0 && orderList.length === 0) {
      setOrderList(orderDetail);
    }
    if (confirm.accept) {
      setOrderList(tempOrderDetail.current);
      setStateChanged(true);
    }

    return () => {};
    // eslint-disable-next-line
  }, [orderDetail, confirm]);

  // Show Dialog confirm Delete
  const deleteProduct = (id) => {
    const deleteItem = orderDetail.find((item) => item.id === id);
    setDialog({
      dialogType: 'delete_order_product',
      dialogHeader: `Cảnh báo xóa sản phẩm ${deleteItem?.product_name}`,
      dialogMessage: `Bạn muốn xóa sản phẩm ${deleteItem?.product_name}`,
    });
    setShowDialog(true);
    tempOrderDetail.current = orderList.filter((i) => i.id !== id);
    // Check confirm dialog in useLayoutEffect
  };

  const setProductCount = (id, count) => {
    const tempObject = orderList.findIndex((e) => e.id === id);
    let tempArr = [...orderList];
    tempArr[tempObject] = {...tempArr[tempObject], count: count};
    setOrderList(tempArr);
    setStateChanged(true);
  };

  const handleClosePopup = () => {
    setShowAddProductPopup(false);
  };

  const handleAddNewProduct = useCallback(
    (newProduct) => {
      let tempArrProduct = [...orderList];
      tempArrProduct.push(newProduct);
      setOrderList(tempArrProduct);
      setStateChanged(true);
    },
    [orderList]
  );

  const handleSaveProduct = useCallback(
    async (changedData) => {
      const submitObject = {
        fullname: changedData?.fullname,
        phone: changedData?.phone,
        address_delivery: changedData?.address_delivery,
        products: orderList.map((item) => ({
          code: item.code,
          product_name: item?.product_name || item?.name,
          product_image: item?.product_image || item?.avatar_img,
          original_price: item?.original_price || item?.price,
          sale_price: item?.sale_price || item?.price_sale,
          weight: item.weight,
          unit: item.unit,
          count_product: item.count,
        })),
      };

      await putEditOrderProduct(orderInfo.id, submitObject)
        .then((res) => {
          if (res.status === 200) {
            enqueueSnackbar('Lưu thông tin thành công!', {
              variant: 'success',
              preventDuplicate: false,
            });
          }

          if (res.data.detail === 'failed') {
            res.data.data.forEach((item) => {
              enqueueSnackbar(`Sản phẩm "${item?.product_name}" bị khóa hoặc đã hết hàng!`, {
                variant: 'error',
                preventDuplicate: false,
              });
            });
          }
        })
        .catch((err) => {
          enqueueSnackbar('Lưu thông tin thất bại! Mời thử lại', {
            variant: 'error',
            preventDuplicate: false,
          });
          console.error(err);
        })
        .finally(() => setRender((render) => !render));

      return () => {};
    },
    [orderList, orderInfo, enqueueSnackbar, setRender]
  );

  const onErrorSubmit = (data) => {
    Object.keys(data).forEach((key) => {
      console.log(data[key]);
      enqueueSnackbar(data[key].message, {variant: 'error'});
    });
  };

  const cancelAllAction = useCallback(() => {
    setRender((render) => !render);
    reset({
      fullname: orderInfo?.fullname,
      phone: orderInfo?.phone,
      address_delivery: orderInfo?.address_delivery,
    });
    tempOrderDetail.current = [...orderDetail];
    // setOrderList(tempOrderDetail);
  }, [orderInfo, orderDetail, setRender, reset]);

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(handleSaveProduct, onErrorSubmit)}
          autoComplete="off"
          id="order_info"
        >
          <Grid container>
            <Grid item xs={12} sm={6}>
              {col1.map((item) => (
                <RowInfo key={item} {...config(item)} />
              ))}
            </Grid>

            <Grid item xs={12} sm={6}>
              {col2.map((item) => (
                <RowInfo key={item} {...config(item)} />
              ))}
            </Grid>
          </Grid>
        </form>
      </FormProvider>
      <Grid container>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" pr={3} mb={2}>
            <Typography variant="h5" color="primary.main">
              Sản phẩm:
            </Typography>
            <Stack direction="row" spacing={3}>
              <Button
                size="small"
                type="button"
                variant="contained"
                color="warning"
                onClick={() => setShowAddProductPopup(true)}
                startIcon={<AddIcon />}
              >
                Thêm sản phẩm mới
              </Button>
            </Stack>
          </Stack>
          <OrderProductList
            productList={orderList}
            deleteProduct={deleteProduct}
            setProductCount={setProductCount}
          />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="center" spacing={3} mt={3}>
            <LoadingButton
              sx={{width: '150px'}}
              size="small"
              startIcon={<CancelIcon />}
              variant="contained"
              disabled={!(isDirty || stateChanged)}
              color="error"
              onClick={cancelAllAction}
            >
              Hủy
            </LoadingButton>
            <LoadingButton
              sx={{width: '150px'}}
              variant="contained"
              color={errorPopup ? 'error' : 'primary'}
              size="small"
              startIcon={<CheckCircleOutlineOutlinedIcon />}
              disabled={!(isDirty || stateChanged)}
              loading={isSubmitting}
              type="submit"
              form="order_info"
            >
              Lưu
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>

      {/* Popup add new Product */}
      <OrderAddNewProductPopup
        open={showAddProductPopup}
        handleClose={handleClosePopup}
        handleAddNewProduct={handleAddNewProduct}
        setErrorPopup={setErrorPopup}
      />
    </>
  );
});

export default OrderInfoBody;
