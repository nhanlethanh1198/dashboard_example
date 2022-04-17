import {
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
  Typography,
} from '@mui/material';
import {FormProvider, useForm} from 'react-hook-form';
import {useLayoutEffect, useState} from 'react';
import useDebounce from 'src/hooks/useSearchQuery';
import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {getProductByCode} from 'src/api/products';
import {OrderProductInfoPopup} from '.';

const SearchOrderSchema = Yup.object().shape({
  product_code: Yup.string()
    .trim()
    .matches(/^[0-9]+$/, 'Code sản phẩm phải là chữ số!'),
});

const OrderAddNewProductPopup = ({open, handleClose, handleAddNewProduct, setErrorPopup}) => {
  const [productInfo, setProductInfo] = useState(null);
  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(SearchOrderSchema),
    defaultValues: {
      product_code: null,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = methods;

  const debouncedValue = useDebounce(watch('product_code'), 500);

  useLayoutEffect(() => {
    if (debouncedValue) {
      getProductByCode(debouncedValue)
        .then((res) => {
          if (res.status === 200) {
            setProductInfo(res.data.data);
          }
        })
        .catch((err) => {
          setProductInfo(null);
        });
    }
    return () => setProductInfo(null);
  }, [debouncedValue]);

  const onSubmit = (data) => {
    Promise.all([getProductByCode(data.product_code)])
      .then((res) => {
        const data = res[0].data.data;
        setProductInfo(data);
      })
      .catch((err) => {
        setProductInfo(null);
      });
  };

  const onError = (data) => {
    console.table(data);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" scroll="body">
      <DialogTitle>Tìm kiếm sản phẩm</DialogTitle>
      <DialogContent dividers>
        <Stack direction="column" spacing={3}>
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              autoComplete="false"
              id="search_product_by_code"
            >
              <Stack spacing={2}>
                <Typography variant="body1">Nhập code sản phẩm:</Typography>
                <TextField
                  autoFocus
                  margin="dense"
                  id="product_code"
                  label="Code sản phẩm"
                  type="tel"
                  variant="outlined"
                  {...register('product_code')}
                  error={!!errors?.product_code?.message}
                  helperText={errors?.product_code?.message}
                />
              </Stack>
            </form>
          </FormProvider>
          <Collapse in={!!productInfo}>
            <Stack spacing={2}>
              <Typography variant="h6">Thông tin sản phẩm:</Typography>
              <OrderProductInfoPopup
                data={productInfo}
                handleAddNewProduct={handleAddNewProduct}
                handleClose={handleClose}
                setErrorPopup={setErrorPopup}
              />
            </Stack>
          </Collapse>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{width: '150px'}}
          type="button"
          variant="contained"
          color="error"
          onClick={handleClose}
        >
          Hủy
        </Button>
        <Button
          sx={{width: '150px'}}
          type="submit"
          variant="contained"
          color="primary"
          form="add_new_product_popup"
          disabled={!productInfo}
        >
          Thêm sản phẩm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderAddNewProductPopup;
