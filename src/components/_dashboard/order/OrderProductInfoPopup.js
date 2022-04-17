import {
  Card,
  CardHeader,
  Stack,
  CardMedia,
  CardContent,
  InputAdornment,
  FormControl,
  TextField,
} from '@mui/material';
import {memo, useCallback, useLayoutEffect} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Scrollbar from 'src/components/Scrollbar';
import {isEmpty} from 'lodash';
import ProductStatus from 'src/components/_dashboard/products/views/ProductStatus';
import {useSnackbar} from 'notistack';
// import OrderStore from 'src/localmodal/OrderStore';

const ProductCountSchema = Yup.object().shape({
  count: Yup.string()
    .trim()
    .matches(/^[0-9]+$/, 'Số sản phẩm phải là chữ số!')
    .required('Bạn không được bỏ trống trường này!'),
});

const ProductInfo = ({data, handleAddNewProduct, handleClose, setErrorPopup}) => {
  const {enqueueSnackbar} = useSnackbar();
  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(ProductCountSchema),
    defaultValue: {
      choose_product_type: 1,
      count: 1,
    },
  });

  const {
    register,
    formState: {errors},
    handleSubmit,
    setValue,
  } = methods;

  const setFieldValue = useCallback(
    (data) => {
      const fields = ['weight', 'price', 'price_sale', 'stock', 'unit'];
      if (!isEmpty(data)) {
        setValue('count', 1);
        Object.keys(data).forEach((key) => {
          if (fields.includes(key)) {
            setValue(key, data[key]);
          }
        });
      }
    },
    [setValue]
  );

  useLayoutEffect(() => {
    setFieldValue(data);
    return () => setFieldValue({});
  }, [data, setFieldValue]);

  const onSubmit = (submited) => {
    const tempData = {
      id: data.id,
      product_id: data.id,
      code: data.code,
      name: data.name,
      avatar_img: data.avatar_img,
      price: submited.price,
      price_sale: submited.price_sale,
      weight: submited.weight,
      unit: submited.unit,
      count: Number(submited.count),
    };
    handleAddNewProduct(tempData);
    handleClose();
  };

  const onError = (data) => {
    console.log(data);
    setErrorPopup(true);
    enqueueSnackbar('Thêm sản phẩm thất bại!', {variant: 'error'});
  };

  return (
    <Card sx={{width: '100%', p: 3}}>
      <FormProvider {...methods}>
        <CardHeader
          sx={{pl: 0}}
          title={`Tên sản phẩm: ${data?.name || ''}`}
          subheader={`Mô tả: ${data?.description || 'Không có'}`}
        />
        <Stack direction="row">
          <Stack spacing={3}>
            <CardMedia
              component="img"
              image={data?.avatar_img || ''}
              alt={data?.name || ''}
              sx={{
                width: '150px',
                height: '150px',
                borderRadius: '10px',
              }}
            />
            <ProductStatus status={data?.status} />
          </Stack>
          <Scrollbar sx={{maxHeight: '35vh'}}>
            <CardContent
              component="form"
              onSubmit={handleSubmit(onSubmit, onError)}
              autoComplete="off"
              id="add_new_product_popup"
            >
              <Stack direction="column" spacing={2}>
                <Stack direction="row" spacing={2}>
                  <TextField
                    {...register('weight')}
                    label="Giá"
                    type="string"
                    disabled
                    variant="outlined"
                    size="small"
                    InputLabelProps={{shrink: true}}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">{data?.unit || 'kg'}</InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    {...register('price')}
                    label="Giá"
                    type="string"
                    disabled
                    variant="outlined"
                    size="small"
                    InputLabelProps={{shrink: true}}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">đ</InputAdornment>,
                    }}
                  />
                  <TextField
                    {...register('price_sale')}
                    label="Giá bán"
                    type="string"
                    disabled
                    variant="outlined"
                    size="small"
                    InputLabelProps={{shrink: true}}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">đ</InputAdornment>,
                    }}
                  />
                  <TextField
                    {...register('stock')}
                    label="Tồn kho"
                    type="number"
                    disabled
                    variant="outlined"
                    size="small"
                    InputLabelProps={{shrink: true}}
                  />
                </Stack>
                <FormControl>
                  <TextField
                    focused
                    margin="dense"
                    id="count"
                    label="Số lượng sản phẩm"
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    fullWidth
                    InputLabelProps={{shrink: true}}
                    variant="outlined"
                    {...register('count')}
                    error={!!errors?.count?.message}
                    helperText={
                      !!errors?.count?.message
                        ? errors?.count?.message
                        : 'Nhập số lượng sản phẩm ít hơn tồn kho'
                    }
                  />
                </FormControl>
              </Stack>
            </CardContent>
          </Scrollbar>
        </Stack>
      </FormProvider>
    </Card>
  );
};

export default memo(ProductInfo);
