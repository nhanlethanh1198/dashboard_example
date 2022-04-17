import {useStoreActions, useStoreState} from 'easy-peasy';
import {putStaffToLockAPI} from 'src/api/staff';
import {handleLockCategoryAPI} from 'src/api/categories';
import {putProductStatusToLock} from 'src/api/products';
import {lockStoreById} from 'src/api/stores';
import {putLockUser} from 'src/api/user';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {useSnackbar} from 'notistack';

export default function AlertDialog() {
  const {dialogType, dialogHeader, dialogMessage} = useStoreState((state) => state.dialog.dialog);
  const {showDialog} = useStoreState((state) => state.dialog);
  const {setConfirm, setShowDialog} = useStoreActions((actions) => actions.dialog);
  const {enqueueSnackbar} = useSnackbar();
  const {setRender} = useStoreActions((actions) => actions.render);
  const {render} = useStoreState((state) => state.render);
  const {lockStaff} = useStoreState((actions) => actions.staff);
  const {lockCategory} = useStoreState((state) => state.categories);
  const {lockProduct} = useStoreState((state) => state.products);
  const {lockStore} = useStoreState((state) => state.stores);
  const {lockUser} = useStoreState((state) => state.user);

  const handleClose = () => {
    setConfirm({accept: false});
    setShowDialog(false);
  };

  const showMessage = (state, errors) => {
    if (errors) {
      enqueueSnackbar(state ? 'Khóa thất bại' : 'Mở khóa thất bại', {
        variant: 'error',
        preventDuplicate: false,
      });
    } else {
      enqueueSnackbar(state ? 'Khóa thành công' : 'Mở khóa thành công!', {
        variant: 'success',
        preventDuplicate: false,
      });
    }
  };

  const handleAgree = () => {
    setConfirm({accept: true});
    setShowDialog(false);
    if (dialogType === 'staff') {
      Promise.all([putStaffToLockAPI(lockStaff.id, lockStaff.is_active)])
        .then((res) => {
          showMessage(lockStaff.is_active, false);
          setRender(!render);
        })
        .catch((err) => {
          console.error(err);
          showMessage(lockStaff.is_active, true);
        });
    }
    if (dialogType === 'category') {
      Promise.all([handleLockCategoryAPI(lockCategory.id, lockCategory.is_active)])
        .then((res) => {
          showMessage(lockCategory.is_active, false);
          setRender(!render);
        })
        .catch((err) => {
          console.error(err);
          showMessage(lockCategory.is_active, true);
        });
    }
    if (dialogType === 'update_product') {
      Promise.all([putProductStatusToLock(lockProduct.code, lockProduct.value)])
        .then((res) => {
          enqueueSnackbar('Thay đổi trạng thái thành công!', {
            variant: 'success',
            preventDuplicate: false,
          });
          setRender(!render);
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar('Thay đổi trạng thái thất bại, hãy thử lại!', {
            variant: 'error',
            preventDuplicate: false,
          });
        });
    }
    if (dialogType === 'user') {
      Promise.all([putLockUser(lockUser.id, lockUser.is_active)])
        .then((res) => {
          showMessage(lockUser.is_active, false);
          setRender(!render);
        })
        .catch((err) => {
          console.error(err);
          showMessage(lockUser.is_active, true);
        });
    }
    if (dialogType === 'delete_order_product') {
      enqueueSnackbar('Xóa sản phẩm thành công', {variant: 'success', preventDuplicate: false});
      setRender(!render);
    }
    if (dialogType === 'lock-store') {
      lockStoreById(lockStore?.id, lockStore?.is_active)
        .then((res) => {
          if (res.status === 200) {
            enqueueSnackbar('Cập nhật thành công', {variant: 'success', preventDuplicate: false});
          }
        })
        .catch((err) => {
          enqueueSnackbar('Cập nhật thất bại', {variant: 'error', preventDuplicate: false});
          console.error(err);
        });

      setRender(!render);
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={showDialog}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box sx={{padding: 1}}>
        <DialogTitle id="alert-dialog-title">{dialogHeader}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained" autoFocus>
            Huỷ
          </Button>
          <Button onClick={handleAgree} color="primary" variant="outlined">
            Đồng ý
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
