import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import {FormProvider, useForm} from 'react-hook-form';
import {LoadingButton} from '@mui/lab';

OrderEditProductQuantity.propsType = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.object,
  defaultValue: PropTypes.number,
};

export default function OrderEditProductQuantity({
  data,
  open,
  handleClose,
  message,
  setProductCount,
}) {
  const methods = useForm({
    defaultValues: {
      quantity: data.count,
    },
    mode: 'onBlur',
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: {isSubmitting},
  } = methods;

  const watching = watch('quantity');

  const onSubmit = (submit) => {
    handleClose();
    setProductCount(data.id, submit.quantity);
  };

  const onError = (data) => {
    console.error(data);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <FormProvider {...methods}>
        <Box component="form" id="order_quantity_popup" onSubmit={handleSubmit(onSubmit, onError)}>
          <DialogTitle>{message.title}</DialogTitle>
          <DialogContent>
            {!!message.content && <DialogContentText>{message.content}</DialogContentText>}

            <TextField
              autoFocus
              label="Số lượng"
              margin="normal"
              id="quantity"
              variant="standard"
              type="number"
              fullWidth
              {...register('quantity')}
            />
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={handleClose} variant="contained" color="error">
              Hủy
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              disabled={data.count === watching || isSubmitting}
              from="order_quantity_popup"
            >
              Chỉnh sửa
            </LoadingButton>
          </DialogActions>
        </Box>
      </FormProvider>
    </Dialog>
  );
}
