import React from "react";
import { Icon } from "@iconify/react";
import { useRef, useState } from "react";
import editFill from "@iconify/icons-eva/edit-fill";
import { Link as RouterLink } from "react-router-dom";
import slashOutline from "@iconify/icons-eva/slash-outline";
import infoFill from '@iconify/icons-eva/info-fill';
import checkmarkCircleFill from "@iconify/icons-eva/checkmark-circle-fill";
import moreVerticalFill from "@iconify/icons-eva/more-vertical-fill";
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

// Easy-Peasy
import { useStoreActions } from "easy-peasy";

// ----------------------------------------------------------------------

export default function UserMoreMenu(props) {
  const { id, is_active, fullname, type } = props;
  const { setDialog, setShowDialog } = useStoreActions(
    (actions) => actions.dialog
  );
  const { setLockStaff } = useStoreActions((actions) => actions.staff);
  const { setLockCategory } = useStoreActions((actions) => actions.categories);
  const { setLockUser } = useStoreActions((actions) => actions.user);
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const clickToLock = () => {
    if (type === "staff") {
      setLockStaff({ id, is_active });
      setDialog({
        dialogType: type,
        dialogHeader: is_active
          ? `Cảnh báo khoá nhân viên!`
          : `Cảnh báo mở khoá nhân viên!`,
        dialogMessage: is_active
          ? `Bạn muốn khoá nhân viên ${fullname}?`
          : `Bạn muốn mở khoá nhân viên ${fullname}?`,
      });
    } else if (type === "category") {
      setLockCategory({ id, is_active });
      setDialog({
        dialogType: type,
        dialogHeader: is_active
          ? `Cảnh báo khoá danh mục!`
          : `Cảnh báo mở khoá danh mục!`,
        dialogMessage: is_active
          ? `Bạn muốn khoá danh mục ${fullname}?`
          : `Bạn muốn mở khoá danh mục ${fullname}?`,
      });
    } else if (type === "user") {
      setLockUser({ id, is_active });
      setDialog({
        dialogType: type,
        dialogHeader: is_active
          ? `Cảnh báo khoá người dùng!`
          : `Cảnh báo mở khoá người dùng!`,
        dialogMessage: is_active
          ? `Bạn muốn khoá người dùng ${fullname}?`
          : `Bạn muốn mở khoá người dùng ${fullname}?`,
      });
    }
    setIsOpen(false);
    setShowDialog(true);
  };

  const link = {
    staff: `update-staff-info/${id}`,
    category: `update-category/${id}`,
    user: `user-info/${id}`,
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>
      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { minWidth: 200, maxWidth: "100%" },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          sx={{ color: is_active ? "error.main" : "primary.main" }}
          onClick={clickToLock}
        >
          <ListItemIcon>
            <Icon
              icon={is_active ? slashOutline : checkmarkCircleFill}
              width={24}
              height={24}
            />
          </ListItemIcon>
          <ListItemText
            primary={is_active ? "Khoá" : "Mở khoá"}
            primaryTypographyProps={{ variant: "body2" }}
          />
        </MenuItem>

        <MenuItem
          component={RouterLink}
          to={link[type]}
          sx={{ color: "info.main" }}
        >
          <ListItemIcon>
            <Icon
              icon={type === "user" ? infoFill : editFill}
              width={24}
              height={24}
            />
          </ListItemIcon>
          <ListItemText
            primary={type === "user" ? "Thông tin người dùng" : "Chỉnh sửa"}
            primaryTypographyProps={{ variant: "body2" }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
