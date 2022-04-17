import {
  Box, 
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useStoreActions, useStoreState } from "easy-peasy";
import { putStaffToLockAPI } from "src/api/staff";
import { handleLockCategoryAPI } from "src/api/categories";
import { putProductStatusToLock } from "src/api/products";

export default function AlertDialog() {
  const { dialogType, dialogHeader, dialogMessage } = useStoreState(
    (state) => state.dialog.dialog
  );
  const { showDialog } = useStoreState((state) => state.dialog);
  const { setConfirm, setShowDialog } = useStoreActions(
    (actions) => actions.dialog
  );
  const { setSnackbar, setShowSnackbar } = useStoreActions(
    (actions) => actions.snackbar
  );
  const { setRender } = useStoreActions((actions) => actions.render);
  const { render } = useStoreState((state) => state.render);
  const { lockStaff } = useStoreState((actions) => actions.staff);
  const { lockCategory } = useStoreState((state) => state.categories);
  const { lockProduct } = useStoreState((state) => state.products);
  const handleClose = () => {
    setConfirm({ accept: false });
    setShowDialog(false);
  };

  const handleAgree = () => {
    setConfirm({ accept: true });
    setShowDialog(false);
    setShowSnackbar(false);
    if (dialogType === "staff") {
      Promise.all([putStaffToLockAPI(lockStaff.id, lockStaff.is_active)])
        .then((res) => {
          setSnackbar({
            snackbarType: "success",
            snackbarMessage: lockStaff.is_active
              ? "Khoá thành công!"
              : "Mở khoá thành công!",
          });
          setShowSnackbar(true);
          setRender(render === true ? false : true);
        })
        .catch((err) => {
          console.error(err);
          setSnackbar({
            snackbarType: "error",
            snackbarMessage: lockStaff.is_active
              ? "Khoá thất bại, mờI bạn thử lại!"
              : "Mở khoá thất bại, mời bạn thử lại!",
          });
          setShowSnackbar(true);
        });
    }
    if (dialogType === "category") {
      Promise.all([
        handleLockCategoryAPI(lockCategory.id, lockCategory.is_active),
      ])
        .then((res) => {
          setSnackbar({
            snackbarType: "success",
            snackbarMessage: lockCategory.is_active
              ? "Khoá thành công!"
              : "Mở khoá thành công!",
          });
          setShowSnackbar(true);
          setRender(render === true ? false : true);
        })
        .catch((err) => {
          console.error(err);
          setSnackbar({
            snackbarType: "error",
            snackbarMessage: lockCategory.is_active
              ? "Khoá thất bại, mờI bạn thử lại!"
              : "Mở khoá thất bại, mời bạn thử lại!",
          });
          setShowSnackbar(true);
        });
    }
    if (dialogType === "update_product") {
      Promise.all([putProductStatusToLock(lockProduct.code, lockProduct.value)])
        .then((res) => {
          setSnackbar({
            snackbarType: "success",
            snackbarMessage: `Thay đổi trạng thái thành công!`,
          });
          setShowSnackbar(true);
          setRender(render === true ? false : true);
        })
        .catch((err) => {
          console.error(err);
          setSnackbar({
            snackbarType: "error",
            snackbarMessage: "Thay đổi trạng thái thất bại, mờI bạn thử lại!",
          });
          setShowSnackbar(true);
        });
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
      <Box sx={{ padding: 1 }}>
        <DialogTitle id="alert-dialog-title">{dialogHeader}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            variant="contained"
            autoFocus
          >
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
